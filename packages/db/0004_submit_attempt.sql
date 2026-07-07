-- МышМат — миграция 0004: надёжное серверное сохранение попытки
-- Одна RPC делает всё атомарно:
--   1. находит/создаёт сегодняшнюю сессию ребёнка
--   2. сохраняет попытку (daily_task_attempts)
--   3. пересчитывает статус предмета в daily_subject_progress
--   4. пересчитывает Daily и при готовности выдаёт МышРутку
--
-- Клиент шлёт только: child_id, task_id, режим/результат, аналитику.
-- session_id вычисляется на сервере — клиенту его знать не нужно.

create or replace function submit_task_attempt(
  p_child uuid,
  p_task uuid,
  p_mode task_mode,
  p_is_correct bool,
  p_autonomy numeric default null
)
returns jsonb language plpgsql as $$
declare
  v_today date := (now() at time zone 'utc')::date;
  v_session uuid;
  v_subject subject_id;
  v_attempt uuid;
  v_status subject_status;
  v_subj_total int;
  v_subj_done int;
  v_subj_status subject_status;
  v_granted bool;
begin
  -- предмет задания
  select subject into v_subject from tasks where id = p_task;
  if v_subject is null then
    return jsonb_build_object('ok', false, 'reason', 'task-not-found');
  end if;

  -- сессия на сегодня (создаём при отсутствии)
  select id into v_session from daily_sessions
    where child_id = p_child and date = v_today;
  if v_session is null then
    insert into daily_sessions (child_id, date, status)
      values (p_child, v_today, 'inProgress')
      returning id into v_session;
  end if;

  -- статус попытки
  v_status := case
    when p_mode = 'worksheet' then 'submitted'      -- листочек → на проверку взрослому
    when p_is_correct then 'successful'             -- платформа, решено верно
    else 'submitted'                                -- платформа, отправлено (есть ошибки)
  end;

  -- сохранить попытку
  insert into daily_task_attempts
    (session_id, task_id, child_id, mode, is_correct, autonomy_score, status, submitted_at)
  values
    (v_session, p_task, p_child, p_mode, p_is_correct, p_autonomy, v_status, now())
  returning id into v_attempt;

  -- сколько заданий в предмете всего и сколько уже сдано (по последним попыткам)
  select count(*) into v_subj_total
    from daily_task_configs where subject = v_subject and active = true;

  select count(distinct dtc.task_id) into v_subj_done
    from daily_task_configs dtc
    join daily_task_attempts a
      on a.task_id = dtc.task_id
     and a.session_id = v_session
     and a.status in ('submitted','successful','perfect')
   where dtc.subject = v_subject and dtc.active = true;

  -- статус предмета: всё сдано → submitted (минимум), иначе inProgress
  v_subj_status := case when v_subj_total > 0 and v_subj_done >= v_subj_total
                        then 'submitted' else 'inProgress' end;

  -- upsert прогресса предмета
  insert into daily_subject_progress (session_id, subject, status, tasks_total, tasks_done)
  values (v_session, v_subject, v_subj_status, v_subj_total, v_subj_done)
  on conflict (session_id, subject) do update
    set status = excluded.status,
        tasks_total = excluded.tasks_total,
        tasks_done = excluded.tasks_done;

  -- пересчёт Daily + выдача МышРутки (использует уже существующую функцию)
  perform recompute_daily_and_grant_myshroutka(v_session);

  select myshroutka_granted into v_granted from daily_sessions where id = v_session;

  return jsonb_build_object(
    'ok', true,
    'attemptId', v_attempt,
    'sessionId', v_session,
    'subject', v_subject,
    'subjectDone', v_subj_done,
    'subjectTotal', v_subj_total,
    'myshroutkaGranted', coalesce(v_granted, false)
  );
end $$;
