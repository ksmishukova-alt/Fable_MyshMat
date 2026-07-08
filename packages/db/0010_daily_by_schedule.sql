-- МышМат — миграция 0010: Daily-контент привязан к учебному дню расписания.
-- daily_task_configs.day_index = N-й учебный день (0-based) по расписанию ребёнка.
-- День ребёнка = число прошедших назначенных дат (включая сегодня) − 1.
-- Фикс: раньше конфиги не заполнялись вовсе — прогресс не сохранялся.

alter table daily_task_configs add column if not exists day_index int not null default 0;
create index if not exists daily_task_configs_day
  on daily_task_configs (subject, day_index, ord);

-- Текущий учебный день ребёнка (0, если расписание пусто)
create or replace function child_day_index(p_child uuid)
returns int language sql stable as $$
  select greatest(coalesce(count(*), 0)::int - 1, 0)
  from daily_schedule
  where child_id = p_child
    and date <= (now() at time zone 'utc')::date;
$$;

-- submit_task_attempt v2: итоги предмета считаются по задачам ТЕКУЩЕГО дня
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
  v_day int := child_day_index(p_child);
  v_session uuid;
  v_subject subject_id;
  v_attempt uuid;
  v_status subject_status;
  v_subj_total int;
  v_subj_done int;
  v_subj_status subject_status;
  v_granted bool;
begin
  select subject into v_subject from tasks where id = p_task;
  if v_subject is null then
    return jsonb_build_object('ok', false, 'reason', 'task-not-found');
  end if;

  select id into v_session from daily_sessions
    where child_id = p_child and date = v_today;
  if v_session is null then
    insert into daily_sessions (child_id, date, status)
      values (p_child, v_today, 'inProgress')
      returning id into v_session;
  end if;

  v_status := case
    when p_mode = 'worksheet' then 'submitted'
    when p_is_correct then 'successful'
    else 'submitted'
  end;

  insert into daily_task_attempts
    (session_id, task_id, child_id, mode, is_correct, autonomy_score, status, submitted_at)
  values
    (v_session, p_task, p_child, p_mode, p_is_correct, p_autonomy, v_status, now())
  returning id into v_attempt;

  -- итоги предмета по задачам текущего учебного дня
  select count(*) into v_subj_total
    from daily_task_configs
   where subject = v_subject and active = true and day_index = v_day;

  select count(distinct dtc.task_id) into v_subj_done
    from daily_task_configs dtc
    join daily_task_attempts a
      on a.task_id = dtc.task_id
     and a.session_id = v_session
     and a.status in ('submitted','successful','perfect')
   where dtc.subject = v_subject and dtc.active = true and dtc.day_index = v_day;

  v_subj_status := case when v_subj_total > 0 and v_subj_done >= v_subj_total
                        then 'submitted' else 'inProgress' end;

  insert into daily_subject_progress (session_id, subject, status, tasks_total, tasks_done)
  values (v_session, v_subject, v_subj_status, v_subj_total, v_subj_done)
  on conflict (session_id, subject) do update
    set status = excluded.status,
        tasks_total = excluded.tasks_total,
        tasks_done = excluded.tasks_done;

  perform recompute_daily_and_grant_myshroutka(v_session);

  select myshroutka_granted into v_granted from daily_sessions where id = v_session;

  return jsonb_build_object(
    'ok', true,
    'attemptId', v_attempt,
    'subjectStatus', v_subj_status,
    'myshroutkaGranted', v_granted
  );
end $$;
