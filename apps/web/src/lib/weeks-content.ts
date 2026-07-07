import type { TaskContent, SubjectId } from "@/types/domain";

/**
 * Контент недель 2–10 (русский + английский), перенесён из методичек вручную.
 * Структура та же, что в week1-content.ts (DayPlan).
 * Раннеры сопоставлены механикам:
 *  punctuation, order, wordfix, gapinput, sort, fields, question,
 *  worksheet, audio, listening, proofread, readaloud.
 */

export interface DayPlan {
  subject: SubjectId;
  week: number;
  day: number;
  label: string;
  tasks: TaskContent[];
}

export const WEEKS_2_10: DayPlan[] = [
  // ═══════════════════════ РУССКИЙ · НЕДЕЛЯ 2 ═══════════════════════
  {
    subject: "russian", week: 2, day: 1, label: "Русский · Н2 · День 1 (Пн) · 29.06",
    tasks: [
      {
        id: "ru-w2-d1-t1", subjectId: "russian", title: "Состав слова", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Впиши части слова в поля: приставка, корень, суффикс, окончание.",
        steps: [{
          id: "ru-w2-d1-t1-s1", kind: "fields",
          prompt: "Разбери слово по составу.",
          fieldsSubject: "подснежник",
          fields: [
            { label: "Приставка", accepted: ["под"] },
            { label: "Корень", accepted: ["снеж"] },
            { label: "Суффикс", accepted: ["ник"] },
            { label: "Окончание", accepted: ["нулевое", "-", ""] },
          ],
          hint: "Родственные слова помогают найти корень: снег, снежный.",
        }],
      },
      {
        id: "ru-w2-d1-t2", subjectId: "russian", title: "Выбор способа написания", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Выбери правильное написание.",
        steps: [
          {
            id: "ru-w2-d1-t2-s1", kind: "question",
            prompt: "(не)спешил — как пишется?",
            hint: "Определи часть речи. НЕ с глаголами пишется раздельно.",
            options: [
              { id: "a", label: "не спешил (раздельно)", isCorrect: true },
              { id: "b", label: "неспешил (слитно)", isCorrect: false },
            ],
          },
          {
            id: "ru-w2-d1-t2-s2", kind: "question",
            prompt: "под(ъ/ь)езд — какой знак?",
            hint: "После приставки перед е, ё, ю, я пишется твёрдый знак.",
            options: [
              { id: "a", label: "подъезд (ъ)", isCorrect: true },
              { id: "b", label: "подьезд (ь)", isCorrect: false },
              { id: "c", label: "подезд (без знака)", isCorrect: false },
            ],
          },
          {
            id: "ru-w2-d1-t2-s3", kind: "question",
            prompt: "умыва(тся/ться) — как пишется?",
            hint: "Задай вопрос. Что делать? — с мягким знаком.",
            options: [
              { id: "a", label: "умываться (что делать?)", isCorrect: true },
              { id: "b", label: "умывается без ь", isCorrect: false },
            ],
          },
        ],
      },
      {
        id: "ru-w2-d1-t3", subjectId: "russian", title: "Корректура текста", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Исправь ошибки, не переписывая весь текст заново. Нажми на слово с ошибкой и впиши верный вариант.",
        steps: [{
          id: "ru-w2-d1-t3-s1", kind: "proofread",
          prompt: "В коротком тексте есть ошибки. Найди и исправь их.",
          proofWords: "Вчера мы были в лису На высокой ветки сидела белка Она держала в лапках маленький гриП".split(" "),
          proofFixes: [
            { index: 4, accepted: ["лесу"] },
            { index: 7, accepted: ["ветке"] },
            { index: 15, accepted: ["гриб"] },
          ],
          hint: "Проверь безударные гласные, падежные окончания и парные согласные.",
        }],
      },
      {
        id: "ru-w2-d1-t4", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Собери слово из букв: Р О К Е Н Ь.",
        steps: [{
          id: "ru-w2-d1-t4-s1", kind: "gapinput",
          prompt: "Собери слово из букв: Р О К Е Н Ь.",
          gaps: [{ label: "Слово:", accepted: ["корень"] }],
          hint: "Общая часть родственных слов.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 2, day: 2, label: "Русский · Н2 · День 2 (Вт) · 30.06 · письмо",
    tasks: [
      {
        id: "ru-w2-d2-t1", subjectId: "russian", title: "Пунктуация и заглавные буквы", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Расставь нужные знаки и сделай заглавными первые буквы нужных слов.",
        steps: [{
          id: "ru-w2-d2-t1-s1", kind: "punctuation",
          prompt: "В тексте потерялись знаки препинания и заглавные буквы.",
          words: "вчера вечером никита возвращался из школы он заметил у ворот знакомую собаку чья она".split(" "),
          expectedMarks: ["","","","","",".","","","","","",".","","?"],
          expectedCapitals: [0, 2, 6, 12],
          hint: "Найди вопрос. Имена людей — с заглавной буквы.",
        }],
      },
      {
        id: "ru-w2-d2-t2", subjectId: "russian", title: "Языковая разминка: шифровка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Убери каждую вторую букву: лАеБсВнГиДк.",
        steps: [{
          id: "ru-w2-d2-t2-s1", kind: "gapinput",
          prompt: "Убери каждую вторую букву: лАеБсВнГиДк.",
          gaps: [{ label: "Слово:", accepted: ["лесник"] }],
          hint: "Это человек, который работает в лесу.",
        }],
      },
      {
        id: "ru-w2-d2-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nВ пятницу в нашем классе открылась небольшая выставка. Каждый ученик принёс предмет, который напоминал ему о летнем путешествии. У Веры была гладкая ракушка с морского берега. Дима показал старую фотографию горного озера. На столе Никиты лежал билет из краеведческого музея. Ребята внимательно слушали рассказы друг друга. Потом учительница попросила их подписать экспонаты аккуратным почерком. К концу урока выставка стала похожа на маленький музей.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни существительные 1-го склонения.\n3. Найди и подчеркни одно сложное словосочетание с прилагательным.",
      },
    ],
  },
  {
    subject: "russian", week: 2, day: 3, label: "Русский · Н2 · День 3 (Ср) · 01.07",
    tasks: [
      {
        id: "ru-w2-d3-t1", subjectId: "russian", title: "Грамматическая форма", mode: "platform", order: 1, total: 4, estMinutes: 4,
        prompt: "Выбери нужную форму из списка.",
        steps: [{
          id: "ru-w2-d3-t1-s1", kind: "question",
          prompt: "На перемене ребята рассказали (она) о новой выставке.",
          hint: "Спроси: рассказали кому?",
          options: [
            { id: "a", label: "ей", isCorrect: true },
            { id: "b", label: "её", isCorrect: false },
            { id: "c", label: "она", isCorrect: false },
            { id: "d", label: "ею", isCorrect: false },
          ],
        }],
      },
      {
        id: "ru-w2-d3-t2", subjectId: "russian", title: "Орфограмма с пропуском", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Впиши пропущенные буквы. Вариантов ответа нет.",
        steps: [{
          id: "ru-w2-d3-t2-s1", kind: "gapinput",
          prompt: "В словах пропущены буквы. Впиши нужную букву.",
          gaps: [
            { label: "з_лёный", accepted: ["е"] },
            { label: "к_рмушка", accepted: ["о"] },
            { label: "п_сьмо", accepted: ["и"] },
            { label: "д_ревня", accepted: ["е"] },
          ],
          hint: "Проверяй гласную ударением, если это возможно.",
        }],
      },
      {
        id: "ru-w2-d3-t3", subjectId: "russian", title: "Порядок предложений", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Поставь карточки в таком порядке, чтобы получился связный текст.",
        steps: [{
          id: "ru-w2-d3-t3-s1", kind: "order",
          prompt: "Карточки перепутались. Собери связный текст.",
          cards: [
            "Потом ребята аккуратно поставили её на подоконник.",
            "В классе появилась новая рассада.",
            "Учительница попросила детей полить землю.",
            "Через неделю на стебле раскрылись первые листочки.",
          ],
          // порядок 2→3→1→4 = индексы [1,2,0,3]
          acceptedOrders: [[1, 2, 0, 3]],
          hint: "Ищи временную последовательность.",
        }],
      },
      {
        id: "ru-w2-d3-t4", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Собери слово из букв: У Д Р А Е Н И Е.",
        steps: [{
          id: "ru-w2-d3-t4-s1", kind: "gapinput",
          prompt: "Собери слово из букв: У Д Р А Е Н И Е.",
          gaps: [{ label: "Слово:", accepted: ["ударение"] }],
          hint: "Оно помогает проверить гласную.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 2, day: 4, label: "Русский · Н2 · День 4 (Чт) · 02.07 · письмо",
    tasks: [
      {
        id: "ru-w2-d4-t1", subjectId: "russian", title: "Слово по смыслу", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "В предложении есть слово, которое не подходит по смыслу. Нажми на него, чтобы исправить.",
        steps: [{
          id: "ru-w2-d4-t1-s1", kind: "wordfix",
          prompt: "Найди неподходящее слово и выбери подходящую замену.",
          sentenceWords: "Во время экскурсии гид показал нам древний холодильник который стоял у крепостной стены".split(" "),
          wrongWordIndex: 7,
          replacements: ["колодец", "пылесос", "портфель", "самокат"],
          correctReplacement: "колодец",
          hint: "Подумай, какой предмет мог быть древним у крепостной стены.",
        }],
      },
      {
        id: "ru-w2-d4-t2", subjectId: "russian", title: "Языковая разминка: спрятанное слово", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Найди слово в строке: трамЛЕСник.",
        steps: [{
          id: "ru-w2-d4-t2-s1", kind: "gapinput",
          prompt: "Найди слово в строке: трамЛЕСник.",
          gaps: [{ label: "Слово:", accepted: ["лес"] }],
          hint: "Это слово проверяет «лесной».",
        }],
      },
      {
        id: "ru-w2-d4-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nВечером Катя села за деревянный стол и открыла тетрадь. Она решила написать бабушке письмо из летнего лагеря. За окном шумели высокие сосны, а по крыше тихо стучал дождь. Девочка рассказала о походе к озеру, о новых подругах и о весёлом конкурсе. Потом она аккуратно подписала конверт. На следующий день вожатая отнесла письма на почту. Катя долго представляла, как бабушка прочитает её строки. От этой мысли ей стало тепло и радостно.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни местоимения.\n3. Выпиши три существительных в предложном или дательном падеже.",
      },
    ],
  },
  {
    subject: "russian", week: 2, day: 5, label: "Русский · Н2 · День 5 (Пт) · 03.07 · аудио",
    tasks: [
      {
        id: "ru-w2-d5-t1", subjectId: "russian", title: "Проверочное слово", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Впиши проверочное слово так, чтобы нужный звук слышался ясно.",
        steps: [{
          id: "ru-w2-d5-t1-s1", kind: "gapinput",
          prompt: "Подбери и впиши проверочное слово.",
          gaps: [
            { label: "звёз_ный", accepted: ["звезда", "звёзды", "звезды"] },
            { label: "чу_кий", accepted: ["чуток", "чуткий"] },
            { label: "уз_кий", accepted: ["узок", "узенький"] },
            { label: "л_сной", accepted: ["лес", "лесник"] },
          ],
          hint: "Проверочное слово должно прояснять именно опасное место.",
        }],
      },
      {
        id: "ru-w2-d5-t2", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Собери слово из букв: П Р А С Т И В К А.",
        steps: [{
          id: "ru-w2-d5-t2-s1", kind: "gapinput",
          prompt: "Собери слово из букв: П Р А С Т И В К А.",
          gaps: [{ label: "Слово:", accepted: ["приставка"] }],
          hint: "Часть слова перед корнем.",
        }],
      },
      {
        id: "ru-w2-d5-t3", subjectId: "russian", title: "Аудиодиктант: утренний туман", mode: "platform", order: 3, total: 3, estMinutes: 10,
        prompt: "Нажми «Слушать». Запиши текст в тетради. Можно прослушать не больше двух раз. После записи загрузи фото.",
        steps: [{
          id: "ru-w2-d5-t3-s1", kind: "audio",
          prompt: "Аудиодиктант. Пауза и перемотка запрещены. Максимум 2 прослушивания.",
          listenLimit: 2,
          hint: "Проверь заглавные буквы в имени и отчестве.",
        }],
      },
    ],
  },

  // ═══════════════════════ РУССКИЙ · НЕДЕЛЯ 3 ═══════════════════════
  {
    subject: "russian", week: 3, day: 1, label: "Русский · Н3 · День 1 (Пн) · 06.07",
    tasks: [
      {
        id: "ru-w3-d1-t1", subjectId: "russian", title: "Сортировка слов", mode: "platform", order: 1, total: 4, estMinutes: 6,
        prompt: "Перетащи каждое слово в подходящую колонку.",
        steps: [{
          id: "ru-w3-d1-t1-s1", kind: "sort",
          prompt: "Распредели слова по группам.",
          columns: ["С ь", "С ъ", "Без разделительного знака"],
          chips: [
            { text: "семья", column: 0 }, { text: "вьюга", column: 0 }, { text: "письмо", column: 0 },
            { text: "подъезд", column: 1 }, { text: "объявление", column: 1 }, { text: "съёмка", column: 1 },
            { text: "поезд", column: 2 }, { text: "маяк", column: 2 }, { text: "юла", column: 2 },
          ],
          hint: "Твёрдый знак пишется после приставки перед е, ё, ю, я.",
        }],
      },
      {
        id: "ru-w3-d1-t2", subjectId: "russian", title: "Грамматическая форма", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Выбери нужную форму из списка.",
        steps: [{
          id: "ru-w3-d1-t2-s1", kind: "question",
          prompt: "Мы долго любовались (зимний лес) за окном автобуса.",
          hint: "Задай вопрос: любовались чем?",
          options: [
            { id: "a", label: "зимним лесом", isCorrect: true },
            { id: "b", label: "зимний лес", isCorrect: false },
            { id: "c", label: "зимнему лесу", isCorrect: false },
            { id: "d", label: "зимнего леса", isCorrect: false },
          ],
        }],
      },
      {
        id: "ru-w3-d1-t3", subjectId: "russian", title: "Словосочетание", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Выбери главное слово, зависимое слово и вопрос от главного к зависимому.",
        steps: [{
          id: "ru-w3-d1-t3-s1", kind: "fields",
          prompt: "Пара слов: вернуться домой. Разбери словосочетание.",
          fieldsSubject: "вернуться домой",
          fields: [
            { label: "Главное слово", accepted: ["вернуться"] },
            { label: "Зависимое слово", accepted: ["домой"] },
            { label: "Вопрос", accepted: ["куда", "куда?"] },
          ],
          hint: "Главное слово обозначает действие, от него задаём вопрос.",
        }],
      },
      {
        id: "ru-w3-d1-t4", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Собери слово из букв: С У Ф Ф И К С.",
        steps: [{
          id: "ru-w3-d1-t4-s1", kind: "gapinput",
          prompt: "Собери слово из букв: С У Ф Ф И К С.",
          gaps: [{ label: "Слово:", accepted: ["суффикс"] }],
          hint: "Часть слова после корня.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 3, day: 2, label: "Русский · Н3 · День 2 (Вт) · 07.07 · письмо",
    tasks: [
      {
        id: "ru-w3-d2-t1", subjectId: "russian", title: "Выбор способа написания", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Выбери правильное написание.",
        steps: [
          {
            id: "ru-w3-d2-t1-s1", kind: "question",
            prompt: "(по)дороге — как пишется?",
            hint: "Между предлогом и словом можно вставить другое слово.",
            options: [
              { id: "a", label: "по дороге (раздельно)", isCorrect: true },
              { id: "b", label: "подороге (слитно)", isCorrect: false },
            ],
          },
          {
            id: "ru-w3-d2-t1-s2", kind: "question",
            prompt: "(за)бежал — как пишется?",
            hint: "За- здесь приставка.",
            options: [
              { id: "a", label: "забежал (слитно)", isCorrect: true },
              { id: "b", label: "за бежал (раздельно)", isCorrect: false },
            ],
          },
          {
            id: "ru-w3-d2-t1-s3", kind: "question",
            prompt: "смея(тся/ться) — как пишется?",
            hint: "Что делать? — с мягким знаком.",
            options: [
              { id: "a", label: "смеяться", isCorrect: true },
              { id: "b", label: "смеятся", isCorrect: false },
            ],
          },
        ],
      },
      {
        id: "ru-w3-d2-t2", subjectId: "russian", title: "Языковая разминка: шифровка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Разгадай слово: переставь буквы О К Н О в порядке 3-1-4-2.",
        steps: [{
          id: "ru-w3-d2-t2-s1", kind: "gapinput",
          prompt: "Переставь буквы О К Н О в порядке 3-1-4-2.",
          gaps: [{ label: "Слово:", accepted: ["окно"] }],
          hint: "Получится предмет в комнате.",
        }],
      },
      {
        id: "ru-w3-d2-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nПосле дождя в городском парке пахло мокрой землёй. На дорожках блестели мелкие лужи. Около клумбы Лёша заметил маленькую коробочку. Он поднял её и увидел внутри несколько цветных бусин. Рядом стояла девочка и растерянно оглядывалась по сторонам. Лёша понял, что коробочка принадлежит ей. Он подошёл к девочке и вежливо спросил о находке. Девочка обрадовалась и поблагодарила его за помощь.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни все глаголы в прошедшем времени.\n3. Выпиши два слова с проверяемой безударной гласной и подбери проверочные слова.",
      },
    ],
  },
  {
    subject: "russian", week: 3, day: 3, label: "Русский · Н3 · День 3 (Ср) · 08.07",
    tasks: [
      {
        id: "ru-w3-d3-t1", subjectId: "russian", title: "Состав слова", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Впиши части слова в поля: приставка, корень, суффикс, окончание.",
        steps: [{
          id: "ru-w3-d3-t1-s1", kind: "fields",
          prompt: "Разбери слово по составу.",
          fieldsSubject: "перелётный",
          fields: [
            { label: "Приставка", accepted: ["пере"] },
            { label: "Корень", accepted: ["лёт", "лет"] },
            { label: "Суффикс", accepted: ["н"] },
            { label: "Окончание", accepted: ["ый"] },
          ],
          hint: "Корень связан со словами лететь, полёт.",
        }],
      },
      {
        id: "ru-w3-d3-t2", subjectId: "russian", title: "Корректура текста", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Исправь ошибки, не переписывая весь текст заново. Нажми на слово с ошибкой и впиши верный вариант.",
        steps: [{
          id: "ru-w3-d3-t2-s1", kind: "proofread",
          prompt: "В коротком тексте есть ошибки. Найди и исправь их.",
          proofWords: "Утром оля подошла к окну За акном сиял белый снеК Она позвала брата и они выбижали во двор".split(" "),
          proofFixes: [
            { index: 1, accepted: ["Оля"] },
            { index: 6, accepted: ["окном"] },
            { index: 9, accepted: ["снег"] },
            { index: 15, accepted: ["выбежали"] },
          ],
          hint: "Проверь заглавную букву, безударные гласные и парную согласную на конце.",
        }],
      },
      {
        id: "ru-w3-d3-t3", subjectId: "russian", title: "Пунктуация и заглавные буквы", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Расставь нужные знаки и сделай заглавными первые буквы нужных слов.",
        steps: [{
          id: "ru-w3-d3-t3-s1", kind: "punctuation",
          prompt: "В тексте потерялись знаки препинания и заглавные буквы.",
          words: "на уроке русского языка мы разбирали слово по составу почему в слове подснежник есть приставка под".split(" "),
          expectedMarks: ["","","","","","","","","",".","","","","","","?"],
          expectedCapitals: [0, 9],
          hint: "Вопросительное предложение заканчивается вопросительным знаком.",
        }],
      },
      {
        id: "ru-w3-d3-t4", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Собери слово из букв: П А Д Е Ж.",
        steps: [{
          id: "ru-w3-d3-t4-s1", kind: "gapinput",
          prompt: "Собери слово из букв: П А Д Е Ж.",
          gaps: [{ label: "Слово:", accepted: ["падеж"] }],
          hint: "У существительных их шесть.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 3, day: 4, label: "Русский · Н3 · День 4 (Чт) · 09.07 · письмо",
    tasks: [
      {
        id: "ru-w3-d4-t1", subjectId: "russian", title: "Грамматическая форма", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Выбери нужную форму из списка.",
        steps: [{
          id: "ru-w3-d4-t1-s1", kind: "question",
          prompt: "Мама попросила (мы) убрать книги со стола.",
          hint: "Спроси: попросила кого?",
          options: [
            { id: "a", label: "нас", isCorrect: true },
            { id: "b", label: "нам", isCorrect: false },
            { id: "c", label: "мы", isCorrect: false },
            { id: "d", label: "нами", isCorrect: false },
          ],
        }],
      },
      {
        id: "ru-w3-d4-t2", subjectId: "russian", title: "Языковая разминка: подсказка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Это слово отвечает на вопрос «какой?» и обозначает признак предмета.",
        steps: [{
          id: "ru-w3-d4-t2-s1", kind: "gapinput",
          prompt: "Это слово отвечает на вопрос «какой?» и обозначает признак предмета.",
          gaps: [{ label: "Ответ:", accepted: ["прилагательное"] }],
          hint: "Например: синий, быстрый, зимний.",
        }],
      },
      {
        id: "ru-w3-d4-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nВ среду наш класс поехал на экскурсию в исторический музей. У входа нас встретил экскурсовод и попросил говорить тихо. В первом зале стояли старинные часы, тяжёлые сундуки и медные подсвечники. Ребята рассматривали их с большим интересом. Особенно всем понравилась карта старого города. На ней были отмечены крепостные стены, башни и главная площадь. После экскурсии мы записали в тетрадь три новых слова. Дома я рассказал родителям о самом необычном экспонате.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни существительные 2-го склонения.\n3. Выпиши три прилагательных с существительными, к которым они относятся.",
      },
    ],
  },
  {
    subject: "russian", week: 3, day: 5, label: "Русский · Н3 · День 5 (Пт) · 10.07 · аудио",
    tasks: [
      {
        id: "ru-w3-d5-t1", subjectId: "russian", title: "Орфограмма с пропуском", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Впиши пропущенные буквы. Вариантов ответа нет.",
        steps: [{
          id: "ru-w3-d5-t1-s1", kind: "gapinput",
          prompt: "В словах пропущены буквы. Впиши нужную букву.",
          gaps: [
            { label: "б_рёзка", accepted: ["е"] },
            { label: "лё_кий", accepted: ["г"] },
            { label: "пиро_ки", accepted: ["ж"] },
            { label: "ч_десный", accepted: ["у"] },
          ],
          hint: "Некоторые слова проверяются, а некоторые нужно вспомнить по правилу.",
        }],
      },
      {
        id: "ru-w3-d5-t2", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Собери слово из букв: Г О Л Г Л А.",
        steps: [{
          id: "ru-w3-d5-t2-s1", kind: "gapinput",
          prompt: "Собери слово из букв: Г О Л Г Л А.",
          gaps: [{ label: "Слово:", accepted: ["глагол"] }],
          hint: "Обозначает действие.",
        }],
      },
      {
        id: "ru-w3-d5-t3", subjectId: "russian", title: "Аудиодиктант: следы на тропинке", mode: "platform", order: 3, total: 3, estMinutes: 10,
        prompt: "Нажми «Слушать». Запиши текст в тетради. Можно прослушать не больше двух раз. После записи загрузи фото.",
        steps: [{
          id: "ru-w3-d5-t3-s1", kind: "audio",
          prompt: "Аудиодиктант. Пауза и перемотка запрещены. Максимум 2 прослушивания.",
          listenLimit: 2,
          hint: "Проверь окончания прилагательных и предлоги.",
        }],
      },
    ],
  },

  // ═══════════════════════ РУССКИЙ · НЕДЕЛЯ 4 ═══════════════════════
  {
    subject: "russian", week: 4, day: 1, label: "Русский · Н4 · День 1 (Пн) · 13.07",
    tasks: [
      {
        id: "ru-w4-d1-t1", subjectId: "russian", title: "Сортировка слов", mode: "platform", order: 1, total: 4, estMinutes: 6,
        prompt: "Перетащи каждое слово в подходящую колонку.",
        steps: [{
          id: "ru-w4-d1-t1-s1", kind: "sort",
          prompt: "Распредели глаголы по спряжениям.",
          columns: ["I спряжение", "II спряжение", "Нужно проверить"],
          chips: [
            { text: "пишет", column: 0 }, { text: "читает", column: 0 }, { text: "играет", column: 0 },
            { text: "строит", column: 1 }, { text: "смотрит", column: 1 }, { text: "держит", column: 1 },
            { text: "бреет", column: 2 }, { text: "стелет", column: 2 }, { text: "терпит", column: 2 },
          ],
          hint: "Посмотри на окончание и начальную форму глагола.",
        }],
      },
      {
        id: "ru-w4-d1-t2", subjectId: "russian", title: "Слово по смыслу", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "В предложении есть слово, которое не подходит по смыслу. Нажми на него, чтобы исправить.",
        steps: [{
          id: "ru-w4-d1-t2-s1", kind: "wordfix",
          prompt: "Найди неподходящее слово и выбери подходящую замену.",
          sentenceWords: "На школьном стадионе ребята посадили быстрые кеды и побежали к финишу".split(" "),
          wrongWordIndex: 4,
          replacements: ["надели", "сварили", "нарисовали", "поймали"],
          correctReplacement: "надели",
          hint: "Подумай, что делают с кедами перед бегом.",
        }],
      },
      {
        id: "ru-w4-d1-t3", subjectId: "russian", title: "Проверочное слово", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Впиши проверочное слово так, чтобы нужный звук слышался ясно.",
        steps: [{
          id: "ru-w4-d1-t3-s1", kind: "gapinput",
          prompt: "Подбери и впиши проверочное слово.",
          gaps: [
            { label: "мя_кий", accepted: ["мягок", "мягонький"] },
            { label: "радос_ный", accepted: ["радость", "радостен"] },
            { label: "гря_ка", accepted: ["гряда", "грядочка"] },
            { label: "м_рской", accepted: ["море", "моря"] },
          ],
          hint: "Подбери родственное слово или измени форму.",
        }],
      },
      {
        id: "ru-w4-d1-t4", subjectId: "russian", title: "Языковая разминка: спрятанное слово", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Найди слово: уроКНИГАва.",
        steps: [{
          id: "ru-w4-d1-t4-s1", kind: "gapinput",
          prompt: "Найди слово: уроКНИГАва.",
          gaps: [{ label: "Слово:", accepted: ["книга"] }],
          hint: "Её читают.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 4, day: 2, label: "Русский · Н4 · День 2 (Вт) · 14.07 · письмо",
    tasks: [
      {
        id: "ru-w4-d2-t1", subjectId: "russian", title: "Выбор способа написания", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Выбери правильное написание.",
        steps: [
          {
            id: "ru-w4-d2-t1-s1", kind: "question",
            prompt: "(не)знал — как пишется?",
            hint: "НE с глаголами пишется раздельно.",
            options: [
              { id: "a", label: "не знал (раздельно)", isCorrect: true },
              { id: "b", label: "незнал (слитно)", isCorrect: false },
            ],
          },
          {
            id: "ru-w4-d2-t1-s2", kind: "question",
            prompt: "об(ъ/ь)яснил — какой знак?",
            hint: "После приставки об- перед я пишется твёрдый знак.",
            options: [
              { id: "a", label: "объяснил (ъ)", isCorrect: true },
              { id: "b", label: "обьяснил (ь)", isCorrect: false },
            ],
          },
          {
            id: "ru-w4-d2-t1-s3", kind: "question",
            prompt: "катае(тся/ться) — как пишется?",
            hint: "Что делает? — без мягкого знака.",
            options: [
              { id: "a", label: "катается (что делает?)", isCorrect: true },
              { id: "b", label: "кататься", isCorrect: false },
            ],
          },
        ],
      },
      {
        id: "ru-w4-d2-t2", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Собери слово из букв: М Е С Т О И М Е Н И Е.",
        steps: [{
          id: "ru-w4-d2-t2-s1", kind: "gapinput",
          prompt: "Собери слово из букв: М Е С Т О И М Е Н И Е.",
          gaps: [{ label: "Слово:", accepted: ["местоимение"] }],
          hint: "Оно может заменить имя существительное.",
        }],
      },
      {
        id: "ru-w4-d2-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nРано утром команда собралась у школьного автобуса. Тренер проверил список участников и раздал каждому номер. У Серёжи немного дрожали руки, но он старался не волноваться. Его друг Паша спокойно шутил и поддерживал ребят. Дорога до стадиона заняла почти час. За окном мелькали поля, деревни и редкие машины. На стадионе уже звучала музыка, а судьи готовили дорожки. Перед стартом ребята пожелали друг другу удачи.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни местоимения.\n3. Выпиши три слова с приставками.",
      },
    ],
  },
  {
    subject: "russian", week: 4, day: 3, label: "Русский · Н4 · День 3 (Ср) · 15.07",
    tasks: [
      {
        id: "ru-w4-d3-t1", subjectId: "russian", title: "Словосочетание", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Выбери главное слово, зависимое слово и вопрос от главного к зависимому.",
        steps: [{
          id: "ru-w4-d3-t1-s1", kind: "fields",
          prompt: "Пара слов: по узкой тропинке. Разбери словосочетание.",
          fieldsSubject: "по узкой тропинке",
          fields: [
            { label: "Главное слово", accepted: ["по тропинке", "тропинке"] },
            { label: "Зависимое слово", accepted: ["узкой"] },
            { label: "Вопрос", accepted: ["какой", "какой?", "как ой"] },
          ],
          hint: "Зависимое слово уточняет главное.",
        }],
      },
      {
        id: "ru-w4-d3-t2", subjectId: "russian", title: "Состав слова", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Впиши части слова в поля: приставка, корень, суффикс, окончание.",
        steps: [{
          id: "ru-w4-d3-t2-s1", kind: "fields",
          prompt: "Разбери слово по составу.",
          fieldsSubject: "дорожка",
          fields: [
            { label: "Приставка", accepted: ["нет", "-", ""] },
            { label: "Корень", accepted: ["дорож"] },
            { label: "Суффикс", accepted: ["к"] },
            { label: "Окончание", accepted: ["а"] },
          ],
          hint: "Родственные слова: дорога, дорожный.",
        }],
      },
      {
        id: "ru-w4-d3-t3", subjectId: "russian", title: "Корректура текста", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Исправь ошибки, не переписывая весь текст заново. Нажми на слово с ошибкой и впиши верный вариант.",
        steps: [{
          id: "ru-w4-d3-t3-s1", kind: "proofread",
          prompt: "В коротком тексте есть ошибки. Найди и исправь их.",
          proofWords: "В тетрадэ лежала закладка Учитель попросил её передать маше Девочка положыла закладку между страницами".split(" "),
          proofFixes: [
            { index: 1, accepted: ["тетради"] },
            { index: 8, accepted: ["Маше"] },
            { index: 10, accepted: ["положила"] },
          ],
          hint: "Проверь падежное окончание, имя собственное и жи-ши.",
        }],
      },
      {
        id: "ru-w4-d3-t4", subjectId: "russian", title: "Языковая разминка: шифровка", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Прочитай наоборот: оголг.",
        steps: [{
          id: "ru-w4-d3-t4-s1", kind: "gapinput",
          prompt: "Прочитай наоборот: оголг.",
          gaps: [{ label: "Слово:", accepted: ["глагол"] }],
          hint: "Слово написано справа налево.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 4, day: 4, label: "Русский · Н4 · День 4 (Чт) · 16.07 · письмо",
    tasks: [
      {
        id: "ru-w4-d4-t1", subjectId: "russian", title: "Пунктуация и заглавные буквы", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Расставь нужные знаки и сделай заглавными первые буквы нужных слов.",
        steps: [{
          id: "ru-w4-d4-t1-s1", kind: "punctuation",
          prompt: "В тексте потерялись знаки препинания и заглавные буквы.",
          words: "если завтра будет солнечно мы пойдём к речке возьмёшь с собой мяч и полотенце".split(" "),
          expectedMarks: ["","",",","","","","",".","","","","","","?"],
          expectedCapitals: [0, 8],
          hint: "Первая часть предложения с «если» часто отделяется запятой.",
        }],
      },
      {
        id: "ru-w4-d4-t2", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Собери слово из букв: С К Л О Н Е Н И Е.",
        steps: [{
          id: "ru-w4-d4-t2-s1", kind: "gapinput",
          prompt: "Собери слово из букв: С К Л О Н Е Н И Е.",
          gaps: [{ label: "Слово:", accepted: ["склонение"] }],
          hint: "Это изменение существительных по падежам.",
        }],
      },
      {
        id: "ru-w4-d4-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nВ нашем дворе всё лето работал маленький фонтан. Днём возле него играли малыши, а вечером собирались взрослые. У скамейки росли бархатцы и душистая мята. Их поливала соседка Анна Ивановна. Однажды сильный ветер сорвал с дерева несколько сухих веток. Ребята собрали их в большую коробку и отнесли к мусорным бакам. После уборки двор снова стал чистым и уютным. Даже старый кот Барсик вышел из подвала и лёг на тёплую плитку.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни имена собственные.\n3. Выпиши два существительных 3-го склонения; если их нет, напиши «не встретились».",
      },
    ],
  },
  {
    subject: "russian", week: 4, day: 5, label: "Русский · Н4 · День 5 (Пт) · 17.07 · аудио",
    tasks: [
      {
        id: "ru-w4-d5-t1", subjectId: "russian", title: "Грамматическая форма", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Выбери нужную форму из списка.",
        steps: [{
          id: "ru-w4-d5-t1-s1", kind: "question",
          prompt: "У старой (яблоня) появились первые зелёные листочки.",
          hint: "Спроси: у чего?",
          options: [
            { id: "a", label: "яблони", isCorrect: true },
            { id: "b", label: "яблоней", isCorrect: false },
            { id: "c", label: "яблоню", isCorrect: false },
            { id: "d", label: "яблоня", isCorrect: false },
          ],
        }],
      },
      {
        id: "ru-w4-d5-t2", subjectId: "russian", title: "Языковая разминка: подсказка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Его задают от главного слова к зависимому.",
        steps: [{
          id: "ru-w4-d5-t2-s1", kind: "gapinput",
          prompt: "Его задают от главного слова к зависимому.",
          gaps: [{ label: "Ответ:", accepted: ["вопрос"] }],
          hint: "Он помогает найти связь слов.",
        }],
      },
      {
        id: "ru-w4-d5-t3", subjectId: "russian", title: "Аудиодиктант: школьная выставка", mode: "platform", order: 3, total: 3, estMinutes: 10,
        prompt: "Нажми «Слушать». Запиши текст в тетради. Можно прослушать не больше двух раз. После записи загрузи фото.",
        steps: [{
          id: "ru-w4-d5-t3-s1", kind: "audio",
          prompt: "Аудиодиктант. Пауза и перемотка запрещены. Максимум 2 прослушивания.",
          listenLimit: 2,
          hint: "Не забудь имена людей и знак между частями предложения.",
        }],
      },
    ],
  },

  // ═══════════════════════ РУССКИЙ · НЕДЕЛЯ 5 ═══════════════════════
  {
    subject: "russian", week: 5, day: 1, label: "Русский · Н5 · День 1 (Пн) · 20.07",
    tasks: [
      {
        id: "ru-w5-d1-t1", subjectId: "russian", title: "Орфограмма с пропуском", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Впиши пропущенные буквы. Вариантов ответа нет.",
        steps: [{
          id: "ru-w5-d1-t1-s1", kind: "gapinput",
          prompt: "В словах пропущены буквы. Впиши нужную букву.",
          gaps: [
            { label: "к_ртина", accepted: ["а"] },
            { label: "х_лодный", accepted: ["о"] },
            { label: "сла_кий", accepted: ["д"] },
            { label: "чес_ный", accepted: ["т"] },
          ],
          hint: "Определи, можно ли подобрать проверочное слово.",
        }],
      },
      {
        id: "ru-w5-d1-t2", subjectId: "russian", title: "Сортировка слов", mode: "platform", order: 2, total: 4, estMinutes: 6,
        prompt: "Перетащи каждое слово в подходящую колонку.",
        steps: [{
          id: "ru-w5-d1-t2-s1", kind: "sort",
          prompt: "Распредели по группам: предлог, приставка или слитно по другому правилу.",
          columns: ["Предлог", "Приставка", "Слитно по другому правилу"],
          chips: [
            { text: "у дома", column: 0 }, { text: "по дороге", column: 0 }, { text: "к реке", column: 0 },
            { text: "удержал", column: 1 }, { text: "подписал", column: 1 }, { text: "перешёл", column: 1 },
            { text: "здесь", column: 2 }, { text: "сегодня", column: 2 }, { text: "потом", column: 2 },
          ],
          hint: "Предлог можно отделить от слова другим словом.",
        }],
      },
      {
        id: "ru-w5-d1-t3", subjectId: "russian", title: "Слово по смыслу", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "В предложении есть слово, которое не подходит по смыслу. Нажми на него, чтобы исправить.",
        steps: [{
          id: "ru-w5-d1-t3-s1", kind: "wordfix",
          prompt: "Найди неподходящее слово и выбери подходящую замену.",
          sentenceWords: "В музее экскурсовод тихо объяснил как жили древние телефоны на берегу реки".split(" "),
          wrongWordIndex: 9,
          replacements: ["племена", "тарелки", "тетради", "велосипеды"],
          correctReplacement: "племена",
          hint: "Подумай, кто мог жить на берегу реки в древности.",
        }],
      },
      {
        id: "ru-w5-d1-t4", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Собери слово из букв: О К О Н Ч А Н И Е.",
        steps: [{
          id: "ru-w5-d1-t4-s1", kind: "gapinput",
          prompt: "Собери слово из букв: О К О Н Ч А Н И Е.",
          gaps: [{ label: "Слово:", accepted: ["окончание"] }],
          hint: "Часть слова, которая изменяется.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 5, day: 2, label: "Русский · Н5 · День 2 (Вт) · 21.07 · письмо",
    tasks: [
      {
        id: "ru-w5-d2-t1", subjectId: "russian", title: "Проверочное слово", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Впиши проверочное слово так, чтобы нужный звук слышался ясно.",
        steps: [{
          id: "ru-w5-d2-t1-s1", kind: "gapinput",
          prompt: "Подбери и впиши проверочное слово.",
          gaps: [
            { label: "п_ля", accepted: ["поле", "полевой"] },
            { label: "гла_кий", accepted: ["гладок", "гладенький"] },
            { label: "со_нце", accepted: ["солнечный"] },
            { label: "с_делка", accepted: ["сидя", "сидеть"] },
          ],
          hint: "Проверочное слово должно быть связано по смыслу.",
        }],
      },
      {
        id: "ru-w5-d2-t2", subjectId: "russian", title: "Языковая разминка: спрятанное слово", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Найди слово: снежПАДЕЖинка.",
        steps: [{
          id: "ru-w5-d2-t2-s1", kind: "gapinput",
          prompt: "Найди слово: снежПАДЕЖинка.",
          gaps: [{ label: "Слово:", accepted: ["падеж"] }],
          hint: "Слово спрятано внутри.",
        }],
      },
      {
        id: "ru-w5-d2-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nПосле уроков Мила зашла в школьную библиотеку. Ей нужно было выбрать книгу для читательского дневника. На верхней полке стояли рассказы о путешествиях, а ниже лежали сказки разных народов. Девочка долго рассматривала обложки и читала короткие аннотации. Библиотекарь посоветовала ей книгу о жизни лесных животных. Мила поблагодарила её и записала название в тетрадь. Дома она прочитала первую главу и сделала аккуратную заметку. На следующий день девочка рассказала классу о своём выборе.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни местоимения.\n3. Выпиши существительные в родительном падеже.",
      },
    ],
  },
  {
    subject: "russian", week: 5, day: 3, label: "Русский · Н5 · День 3 (Ср) · 22.07",
    tasks: [
      {
        id: "ru-w5-d3-t1", subjectId: "russian", title: "Словосочетание", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Выбери главное слово, зависимое слово и вопрос от главного к зависимому.",
        steps: [{
          id: "ru-w5-d3-t1-s1", kind: "fields",
          prompt: "Пара слов: смотреть внимательно. Разбери словосочетание.",
          fieldsSubject: "смотреть внимательно",
          fields: [
            { label: "Главное слово", accepted: ["смотреть"] },
            { label: "Зависимое слово", accepted: ["внимательно"] },
            { label: "Вопрос", accepted: ["как", "как?"] },
          ],
          hint: "Вопрос задаём от действия к признаку действия.",
        }],
      },
      {
        id: "ru-w5-d3-t2", subjectId: "russian", title: "Выбор способа написания", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Выбери правильное написание.",
        steps: [
          {
            id: "ru-w5-d3-t2-s1", kind: "question",
            prompt: "(в)лесу — как пишется?",
            hint: "В- здесь предлог: в густом лесу.",
            options: [
              { id: "a", label: "в лесу (раздельно)", isCorrect: true },
              { id: "b", label: "влесу (слитно)", isCorrect: false },
            ],
          },
          {
            id: "ru-w5-d3-t2-s2", kind: "question",
            prompt: "(в)летел — как пишется?",
            hint: "В- здесь приставка.",
            options: [
              { id: "a", label: "влетел (слитно)", isCorrect: true },
              { id: "b", label: "в летел (раздельно)", isCorrect: false },
            ],
          },
          {
            id: "ru-w5-d3-t2-s3", kind: "question",
            prompt: "уча(ст/с)вовать — как пишется?",
            hint: "Это словарное слово, его нужно запомнить.",
            options: [
              { id: "a", label: "участвовать (ств)", isCorrect: true },
              { id: "b", label: "учавствовать (св)", isCorrect: false },
            ],
          },
        ],
      },
      {
        id: "ru-w5-d3-t3", subjectId: "russian", title: "Состав слова", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Впиши части слова в поля: приставка, корень, суффикс, окончание.",
        steps: [{
          id: "ru-w5-d3-t3-s1", kind: "fields",
          prompt: "Разбери слово по составу.",
          fieldsSubject: "зимний",
          fields: [
            { label: "Приставка", accepted: ["нет", "-", ""] },
            { label: "Корень", accepted: ["зим"] },
            { label: "Суффикс", accepted: ["н"] },
            { label: "Окончание", accepted: ["ий"] },
          ],
          hint: "Корень связан со словами зима, зимовать.",
        }],
      },
      {
        id: "ru-w5-d3-t4", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Собери слово из букв: П Р Е Д Л О Г.",
        steps: [{
          id: "ru-w5-d3-t4-s1", kind: "gapinput",
          prompt: "Собери слово из букв: П Р Е Д Л О Г.",
          gaps: [{ label: "Слово:", accepted: ["предлог"] }],
          hint: "Пишется отдельно со словом.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 5, day: 4, label: "Русский · Н5 · День 4 (Чт) · 23.07 · письмо",
    tasks: [
      {
        id: "ru-w5-d4-t1", subjectId: "russian", title: "Корректура текста", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Исправь ошибки, не переписывая весь текст заново. Нажми на слово с ошибкой и впиши верный вариант.",
        steps: [{
          id: "ru-w5-d4-t1-s1", kind: "proofread",
          prompt: "В коротком тексте есть ошибки. Найди и исправь их.",
          proofWords: "К вечиру мы подошли к пристани У самой вады качалась лодка Мы долго смотрели на её тёмный бок".split(" "),
          proofFixes: [
            { index: 1, accepted: ["вечеру"] },
            { index: 8, accepted: ["воды"] },
          ],
          hint: "Проверь безударные гласные и падежные формы.",
        }],
      },
      {
        id: "ru-w5-d4-t2", subjectId: "russian", title: "Языковая разминка: шифровка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Убери лишние буквы Х: ХпХрХиХсХтХаХвХкХа.",
        steps: [{
          id: "ru-w5-d4-t2-s1", kind: "gapinput",
          prompt: "Убери лишние буквы Х: ХпХрХиХсХтХаХвХкХа.",
          gaps: [{ label: "Слово:", accepted: ["приставка"] }],
          hint: "Часть слова перед корнем.",
        }],
      },
      {
        id: "ru-w5-d4-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nК вечеру над дальним лесом потемнело небо. Сначала подул резкий ветер, и трава у дороги пригнулась к земле. Потом сверкнула молния, а за ней прокатился глухой гром. Мы быстро собрали вещи и спрятались на веранде. Через несколько минут начался сильный дождь. Его крупные капли стучали по крыше и стекали по стеклу. После грозы воздух стал свежим и прохладным. На мокрой траве засверкали маленькие капли.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни прилагательные.\n3. Выпиши два слова с приставками и два слова с проверяемой безударной гласной.",
      },
    ],
  },
  {
    subject: "russian", week: 5, day: 5, label: "Русский · Н5 · День 5 (Пт) · 24.07 · аудио",
    tasks: [
      {
        id: "ru-w5-d5-t1", subjectId: "russian", title: "Пунктуация и заглавные буквы", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Расставь нужные знаки и сделай заглавными первые буквы нужных слов.",
        steps: [{
          id: "ru-w5-d5-t1-s1", kind: "punctuation",
          prompt: "В тексте потерялись знаки препинания и заглавные буквы.",
          words: "саша хотел позвонить другу но телефон разрядился как теперь предупредить его о встрече".split(" "),
          expectedMarks: ["","","",",","","",".","","","","","","?"],
          expectedCapitals: [0, 7],
          hint: "Перед «но» нужна запятая. Вопрос заканчивается вопросительным знаком.",
        }],
      },
      {
        id: "ru-w5-d5-t2", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Собери слово из букв: С П Р Я Ж Е Н И Е.",
        steps: [{
          id: "ru-w5-d5-t2-s1", kind: "gapinput",
          prompt: "Собери слово из букв: С П Р Я Ж Е Н И Е.",
          gaps: [{ label: "Слово:", accepted: ["спряжение"] }],
          hint: "Связано с глаголами.",
        }],
      },
      {
        id: "ru-w5-d5-t3", subjectId: "russian", title: "Аудиодиктант: дождь у окна", mode: "platform", order: 3, total: 3, estMinutes: 10,
        prompt: "Нажми «Слушать». Запиши текст в тетради. Можно прослушать не больше двух раз. После записи загрузи фото.",
        steps: [{
          id: "ru-w5-d5-t3-s1", kind: "audio",
          prompt: "Аудиодиктант. Пауза и перемотка запрещены. Максимум 2 прослушивания.",
          listenLimit: 2,
          hint: "Проверь, где одно предложение стало сложным.",
        }],
      },
    ],
  },

  // ═══════════════════════ РУССКИЙ · НЕДЕЛЯ 6 ═══════════════════════
  {
    subject: "russian", week: 6, day: 1, label: "Русский · Н6 · День 1 (Пн) · 27.07",
    tasks: [
      {
        id: "ru-w6-d1-t1", subjectId: "russian", title: "Грамматическая форма", mode: "platform", order: 1, total: 4, estMinutes: 4,
        prompt: "Выбери нужную форму из списка.",
        steps: [{
          id: "ru-w6-d1-t1-s1", kind: "question",
          prompt: "Мы остановились около (новая станция) метро.",
          hint: "Спроси: около чего?",
          options: [
            { id: "a", label: "новой станции", isCorrect: true },
            { id: "b", label: "новая станция", isCorrect: false },
            { id: "c", label: "новую станцию", isCorrect: false },
            { id: "d", label: "новым станцией", isCorrect: false },
          ],
        }],
      },
      {
        id: "ru-w6-d1-t2", subjectId: "russian", title: "Орфограмма с пропуском", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Впиши пропущенные буквы. Вариантов ответа нет.",
        steps: [{
          id: "ru-w6-d1-t2-s1", kind: "gapinput",
          prompt: "В словах пропущены буквы. Впиши нужную букву.",
          gaps: [
            { label: "пр_вдивый", accepted: ["а"] },
            { label: "ло_ка", accepted: ["д"] },
            { label: "поз_ний", accepted: ["д"] },
            { label: "ж_раф", accepted: ["и"] },
          ],
          hint: "Вспомни: жи-ши пишем с и.",
        }],
      },
      {
        id: "ru-w6-d1-t3", subjectId: "russian", title: "Сортировка слов", mode: "platform", order: 3, total: 4, estMinutes: 6,
        prompt: "Перетащи каждое слово в подходящую колонку.",
        steps: [{
          id: "ru-w6-d1-t3-s1", kind: "sort",
          prompt: "Распредели слова по буквосочетаниям.",
          columns: ["Жи-ши", "Ча-ща", "Чу-щу"],
          chips: [
            { text: "жираф", column: 0 }, { text: "шина", column: 0 }, { text: "жизнь", column: 0 },
            { text: "чаща", column: 1 }, { text: "чайка", column: 1 }, { text: "площадь", column: 1 },
            { text: "чудо", column: 2 }, { text: "щука", column: 2 }, { text: "чувство", column: 2 },
          ],
          hint: "Определи буквосочетание после шипящей.",
        }],
      },
      {
        id: "ru-w6-d1-t4", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Собери слово из букв: С И Н О Н И М.",
        steps: [{
          id: "ru-w6-d1-t4-s1", kind: "gapinput",
          prompt: "Собери слово из букв: С И Н О Н И М.",
          gaps: [{ label: "Слово:", accepted: ["синоним"] }],
          hint: "Это близкое по смыслу слово.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 6, day: 2, label: "Русский · Н6 · День 2 (Вт) · 28.07 · письмо",
    tasks: [
      {
        id: "ru-w6-d2-t1", subjectId: "russian", title: "Слово по смыслу", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "В предложении есть слово, которое не подходит по смыслу. Нажми на него, чтобы исправить.",
        steps: [{
          id: "ru-w6-d2-t1-s1", kind: "wordfix",
          prompt: "Найди неподходящее слово и выбери подходящую замену.",
          sentenceWords: "На кухне бабушка испекла ароматный компас с яблоками".split(" "),
          wrongWordIndex: 5,
          replacements: ["пирог", "пиджак", "фонарь", "рюкзак"],
          correctReplacement: "пирог",
          hint: "Подумай, что можно испечь.",
        }],
      },
      {
        id: "ru-w6-d2-t2", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Собери слово из букв: А Н Т О Н И М.",
        steps: [{
          id: "ru-w6-d2-t2-s1", kind: "gapinput",
          prompt: "Собери слово из букв: А Н Т О Н И М.",
          gaps: [{ label: "Слово:", accepted: ["антоним"] }],
          hint: "Это противоположное по смыслу слово.",
        }],
      },
      {
        id: "ru-w6-d2-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nНа подоконнике в классе стояли горшки с рассадой. Ребята по очереди поливали землю и рыхлили её маленькой палочкой. У Маши лучше всех росли бархатцы. Их листья были крепкими, а стебли тянулись к свету. Однажды девочка заметила, что один росток наклонился к стеклу. Она осторожно повернула горшок другой стороной. Через два дня растение снова выпрямилось. Учительница похвалила ребят за внимательность и терпение.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни местоимения.\n3. Выпиши три глагола и определи их время.",
      },
    ],
  },
  {
    subject: "russian", week: 6, day: 3, label: "Русский · Н6 · День 3 (Ср) · 29.07",
    tasks: [
      {
        id: "ru-w6-d3-t1", subjectId: "russian", title: "Проверочное слово", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Впиши проверочное слово так, чтобы нужный звук слышался ясно.",
        steps: [{
          id: "ru-w6-d3-t1-s1", kind: "gapinput",
          prompt: "Подбери и впиши проверочное слово.",
          gaps: [
            { label: "бере_ка", accepted: ["берёза", "березовый", "берёзовый"] },
            { label: "з_мля", accepted: ["земли", "земли"] },
            { label: "ужас_ный", accepted: ["ужасен"] },
            { label: "праз_ник", accepted: ["праздничный"] },
          ],
          hint: "Иногда проверка показывает, что букву писать не нужно.",
        }],
      },
      {
        id: "ru-w6-d3-t2", subjectId: "russian", title: "Выбор способа написания", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Выбери правильное написание.",
        steps: [
          {
            id: "ru-w6-d3-t2-s1", kind: "question",
            prompt: "(не)торопился — как пишется?",
            hint: "НЕ с глаголами пишется раздельно.",
            options: [
              { id: "a", label: "не торопился (раздельно)", isCorrect: true },
              { id: "b", label: "неторопился (слитно)", isCorrect: false },
            ],
          },
          {
            id: "ru-w6-d3-t2-s2", kind: "question",
            prompt: "с(ъ/ь)ёжился — какой знак?",
            hint: "После приставки с- перед ё пишется твёрдый знак.",
            options: [
              { id: "a", label: "съёжился (ъ)", isCorrect: true },
              { id: "b", label: "сьёжился (ь)", isCorrect: false },
            ],
          },
          {
            id: "ru-w6-d3-t2-s3", kind: "question",
            prompt: "улыбае(тся/ться) — как пишется?",
            hint: "Что делает? — без мягкого знака.",
            options: [
              { id: "a", label: "улыбается (что делает?)", isCorrect: true },
              { id: "b", label: "улыбаться", isCorrect: false },
            ],
          },
        ],
      },
      {
        id: "ru-w6-d3-t3", subjectId: "russian", title: "Словосочетание", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Выбери главное слово, зависимое слово и вопрос от главного к зависимому.",
        steps: [{
          id: "ru-w6-d3-t3-s1", kind: "fields",
          prompt: "Пара слов: интересная книга. Разбери словосочетание.",
          fieldsSubject: "интересная книга",
          fields: [
            { label: "Главное слово", accepted: ["книга"] },
            { label: "Зависимое слово", accepted: ["интересная"] },
            { label: "Вопрос", accepted: ["какая", "какая?"] },
          ],
          hint: "Прилагательное зависит от существительного.",
        }],
      },
      {
        id: "ru-w6-d3-t4", subjectId: "russian", title: "Языковая разминка: шифровка", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Прочитай каждую вторую букву: пКрОиРсЕтНаЬвка.",
        steps: [{
          id: "ru-w6-d3-t4-s1", kind: "gapinput",
          prompt: "Прочитай каждую вторую букву: пКрОиРсЕтНаЬвка.",
          gaps: [{ label: "Слово:", accepted: ["корень"] }],
          hint: "Он есть у родственных слов.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 6, day: 4, label: "Русский · Н6 · День 4 (Чт) · 30.07 · письмо",
    tasks: [
      {
        id: "ru-w6-d4-t1", subjectId: "russian", title: "Состав слова", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Впиши части слова в поля: приставка, корень, суффикс, окончание.",
        steps: [{
          id: "ru-w6-d4-t1-s1", kind: "fields",
          prompt: "Разбери слово по составу.",
          fieldsSubject: "лесник",
          fields: [
            { label: "Приставка", accepted: ["нет", "-", ""] },
            { label: "Корень", accepted: ["лес"] },
            { label: "Суффикс", accepted: ["ник"] },
            { label: "Окончание", accepted: ["нулевое", "-", ""] },
          ],
          hint: "Родственные слова: лес, лесной, лесок.",
        }],
      },
      {
        id: "ru-w6-d4-t2", subjectId: "russian", title: "Языковая разминка: подсказка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Эта часть слова стоит перед корнем.",
        steps: [{
          id: "ru-w6-d4-t2-s1", kind: "gapinput",
          prompt: "Эта часть слова стоит перед корнем.",
          gaps: [{ label: "Ответ:", accepted: ["приставка"] }],
          hint: "Она может изменить значение слова.",
        }],
      },
      {
        id: "ru-w6-d4-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nВ субботу мы приехали на вокзал за полчаса до отправления поезда. В большом зале ожидания было шумно и многолюдно. Пассажиры ставили чемоданы у скамеек, покупали воду и проверяли билеты. Моя младшая сестра крепко держала маму за руку. Она боялась потеряться среди незнакомых людей. Вдруг по громкой связи объявили наш поезд. Мы быстро нашли нужную платформу и подошли к вагону. Проводница улыбнулась и пригласила нас занять свои места.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни существительные в предложном падеже.\n3. Выпиши два словосочетания с прилагательными.",
      },
    ],
  },
  {
    subject: "russian", week: 6, day: 5, label: "Русский · Н6 · День 5 (Пт) · 31.07 · аудио",
    tasks: [
      {
        id: "ru-w6-d5-t1", subjectId: "russian", title: "Корректура текста", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Исправь ошибки, не переписывая весь текст заново. Нажми на слово с ошибкой и впиши верный вариант.",
        steps: [{
          id: "ru-w6-d5-t1-s1", kind: "proofread",
          prompt: "В коротком тексте есть ошибки. Найди и исправь их.",
          proofWords: "Мы подехали к станции Обявление прозвучало очень тихо Пассажиры стали готовитца к выходу".split(" "),
          proofFixes: [
            { index: 1, accepted: ["подъехали"] },
            { index: 4, accepted: ["Объявление"] },
            { index: 10, accepted: ["готовиться"] },
          ],
          hint: "Проверь ъ после приставки и ться по вопросу «что делать?».",
        }],
      },
      {
        id: "ru-w6-d5-t2", subjectId: "russian", title: "Языковая разминка: подсказка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Эта часть слова стоит после корня и перед окончанием.",
        steps: [{
          id: "ru-w6-d5-t2-s1", kind: "gapinput",
          prompt: "Эта часть слова стоит после корня и перед окончанием.",
          gaps: [{ label: "Ответ:", accepted: ["суффикс"] }],
          hint: "Например, в слове «домик» это -ик.",
        }],
      },
      {
        id: "ru-w6-d5-t3", subjectId: "russian", title: "Аудиодиктант: поездка в музей", mode: "platform", order: 3, total: 3, estMinutes: 10,
        prompt: "Нажми «Слушать». Запиши текст в тетради. Можно прослушать не больше двух раз. После записи загрузи фото.",
        steps: [{
          id: "ru-w6-d5-t3-s1", kind: "audio",
          prompt: "Аудиодиктант. Пауза и перемотка запрещены. Максимум 2 прослушивания.",
          listenLimit: 2,
          hint: "Слушай окончания слов после предлогов.",
        }],
      },
    ],
  },

  // ═══════════════════════ РУССКИЙ · НЕДЕЛЯ 7 ═══════════════════════
  {
    subject: "russian", week: 7, day: 1, label: "Русский · Н7 · День 1 (Пн) · 03.08",
    tasks: [
      {
        id: "ru-w7-d1-t1", subjectId: "russian", title: "Пунктуация и заглавные буквы", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Расставь нужные знаки и сделай заглавными первые буквы нужных слов.",
        steps: [{
          id: "ru-w7-d1-t1-s1", kind: "punctuation",
          prompt: "В тексте потерялись знаки препинания и заглавные буквы.",
          words: "после уроков вера остановилась у школьной теплицы она заметила забытый дневник чей он мог быть".split(" "),
          expectedMarks: ["","","","","","",".","","","",".","","","","?"],
          expectedCapitals: [0, 2, 7, 11],
          hint: "Где мысль закончилась, нужен знак конца. Имена пишутся с заглавной буквы.",
        }],
      },
      {
        id: "ru-w7-d1-t2", subjectId: "russian", title: "Грамматическая форма", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Выбери нужную форму из списка.",
        steps: [{
          id: "ru-w7-d1-t2-s1", kind: "question",
          prompt: "Мы долго говорили с (новый тренер) о соревнованиях.",
          hint: "Спроси: говорили с кем?",
          options: [
            { id: "a", label: "новым тренером", isCorrect: true },
            { id: "b", label: "новый тренер", isCorrect: false },
            { id: "c", label: "нового тренера", isCorrect: false },
            { id: "d", label: "новому тренеру", isCorrect: false },
          ],
        }],
      },
      {
        id: "ru-w7-d1-t3", subjectId: "russian", title: "Орфограмма с пропуском", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Впиши пропущенные буквы. Вариантов ответа нет.",
        steps: [{
          id: "ru-w7-d1-t3-s1", kind: "gapinput",
          prompt: "В словах пропущены буквы. Впиши нужную букву.",
          gaps: [
            { label: "сер_це", accepted: ["д"] },
            { label: "поз_ний", accepted: ["д"] },
            { label: "звёз_ный", accepted: ["д"] },
            { label: "чес_ный", accepted: ["т"] },
          ],
          hint: "Подбери проверочное слово или вспомни правило.",
        }],
      },
      {
        id: "ru-w7-d1-t4", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Собери слово из букв: Р О Д С Т В Е Н Н Ы Е.",
        steps: [{
          id: "ru-w7-d1-t4-s1", kind: "gapinput",
          prompt: "Собери слово из букв: Р О Д С Т В Е Н Н Ы Е.",
          gaps: [{ label: "Слово:", accepted: ["родственные"] }],
          hint: "Так называют слова с общим корнем.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 7, day: 2, label: "Русский · Н7 · День 2 (Вт) · 04.08 · письмо",
    tasks: [
      {
        id: "ru-w7-d2-t1", subjectId: "russian", title: "Проверочное слово", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Впиши проверочное слово так, чтобы нужный звук слышался ясно.",
        steps: [{
          id: "ru-w7-d2-t1-s1", kind: "gapinput",
          prompt: "Подбери и впиши проверочное слово.",
          gaps: [
            { label: "тр_ва", accepted: ["травы", "травка"] },
            { label: "зв_нок", accepted: ["звон", "звонкий"] },
            { label: "ло_ка", accepted: ["лодочка", "лодок"] },
            { label: "моро_", accepted: ["морозы", "морозный"] },
          ],
          hint: "Проверочное слово должно быть родственным и помогать услышать звук ясно.",
        }],
      },
      {
        id: "ru-w7-d2-t2", subjectId: "russian", title: "Языковая разминка: спрятанное слово", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Найди слово: граММАТИКАлист.",
        steps: [{
          id: "ru-w7-d2-t2-s1", kind: "gapinput",
          prompt: "Найди слово: граММАТИКАлист.",
          gaps: [{ label: "Слово:", accepted: ["грамматика"] }],
          hint: "Раздел русского языка.",
        }],
      },
      {
        id: "ru-w7-d2-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nВ начале августа мама купила мне новую тетрадь для русского языка. На её обложке был нарисован маяк на высоком берегу. Я аккуратно подписал первую страницу и положил тетрадь в ящик стола. Через несколько дней мы повторяли падежи и склонения. Мне захотелось записать примеры особенно красиво. Я вывел каждую букву медленно и внимательно. Потом проверил окончания существительных и подчеркнул предлоги. Мама сказала, что аккуратная запись помогает лучше думать.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни предлоги.\n3. Выпиши три существительных и определи их склонение.",
      },
    ],
  },
  {
    subject: "russian", week: 7, day: 3, label: "Русский · Н7 · День 3 (Ср) · 05.08",
    tasks: [
      {
        id: "ru-w7-d3-t1", subjectId: "russian", title: "Выбор способа написания", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Выбери правильное написание.",
        steps: [
          {
            id: "ru-w7-d3-t1-s1", kind: "question",
            prompt: "(не)сказал — как пишется?",
            hint: "НЕ с глаголами пишется раздельно.",
            options: [
              { id: "a", label: "не сказал (раздельно)", isCorrect: true },
              { id: "b", label: "несказал (слитно)", isCorrect: false },
            ],
          },
          {
            id: "ru-w7-d3-t1-s2", kind: "question",
            prompt: "об(ъ/ь)явил — какой знак?",
            hint: "После приставки об- перед я пишется твёрдый знак.",
            options: [
              { id: "a", label: "объявил (ъ)", isCorrect: true },
              { id: "b", label: "обьявил (ь)", isCorrect: false },
            ],
          },
          {
            id: "ru-w7-d3-t1-s3", kind: "question",
            prompt: "улыбае(тся/ться) — как пишется?",
            hint: "Что делает? — без мягкого знака.",
            options: [
              { id: "a", label: "улыбается (что делает?)", isCorrect: true },
              { id: "b", label: "улыбаться", isCorrect: false },
            ],
          },
        ],
      },
      {
        id: "ru-w7-d3-t2", subjectId: "russian", title: "Словосочетание", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Выбери главное слово, зависимое слово и вопрос от главного к зависимому.",
        steps: [{
          id: "ru-w7-d3-t2-s1", kind: "fields",
          prompt: "Пара слов: синий рюкзак. Разбери словосочетание.",
          fieldsSubject: "синий рюкзак",
          fields: [
            { label: "Главное слово", accepted: ["рюкзак"] },
            { label: "Зависимое слово", accepted: ["синий"] },
            { label: "Вопрос", accepted: ["какой", "какой?"] },
          ],
          hint: "Вопрос задаётся от главного слова к зависимому.",
        }],
      },
      {
        id: "ru-w7-d3-t3", subjectId: "russian", title: "Слово по смыслу", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "В предложении есть слово, которое не подходит по смыслу. Нажми на него, чтобы исправить.",
        steps: [{
          id: "ru-w7-d3-t3-s1", kind: "wordfix",
          prompt: "Найди неподходящее слово и выбери подходящую замену.",
          sentenceWords: "На стадионе тренер попросил ребят быстро завязать книги и выйти на дорожку".split(" "),
          wrongWordIndex: 7,
          replacements: ["кроссовки", "карандаши", "окна", "чайники"],
          correctReplacement: "кроссовки",
          hint: "Подумай, какое слово подходит к ситуации по смыслу.",
        }],
      },
      {
        id: "ru-w7-d3-t4", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Собери слово из букв: З А П Я Т А Я.",
        steps: [{
          id: "ru-w7-d3-t4-s1", kind: "gapinput",
          prompt: "Собери слово из букв: З А П Я Т А Я.",
          gaps: [{ label: "Слово:", accepted: ["запятая"] }],
          hint: "Этот знак ставят внутри предложения.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 7, day: 4, label: "Русский · Н7 · День 4 (Чт) · 06.08 · письмо",
    tasks: [
      {
        id: "ru-w7-d4-t1", subjectId: "russian", title: "Порядок предложений", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Поставь карточки в таком порядке, чтобы получился связный текст.",
        steps: [{
          id: "ru-w7-d4-t1-s1", kind: "order",
          prompt: "Карточки перепутались. Собери связный текст.",
          cards: [
            "Наконец лодка мягко коснулась берега.",
            "Утром мы отправились по узкой речке.",
            "Сначала вода была совсем спокойной.",
            "После поворота поднялся тёплый ветер.",
          ],
          // 2→3→4→1 = индексы [1,2,3,0]
          acceptedOrders: [[1, 2, 3, 0]],
          hint: "Ищи последовательность событий и слова-подсказки.",
        }],
      },
      {
        id: "ru-w7-d4-t2", subjectId: "russian", title: "Языковая разминка: подсказка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Он стоит в конце предложения, которое спрашивает.",
        steps: [{
          id: "ru-w7-d4-t2-s1", kind: "gapinput",
          prompt: "Он стоит в конце предложения, которое спрашивает.",
          gaps: [{ label: "Ответ:", accepted: ["вопросительный знак"] }],
          hint: "Это знак препинания.",
        }],
      },
      {
        id: "ru-w7-d4-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nС утра по стеклу ползли длинные дождевые капли. Во дворе никто не играл, и качели тихо скрипели от ветра. Я сел у окна с книгой и пледом. На кухне бабушка готовила чай с душистой мятой. Она позвала меня, когда чайник зашумел. Мы сели за круглый стол и стали говорить о летних планах. Бабушка рассказала, как в детстве ходила за грибами после дождя. Я слушал её и представлял мокрый лес с блестящими листьями.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни прилагательные.\n3. Выпиши местоимения и укажи, кого или что они заменяют.",
      },
    ],
  },
  {
    subject: "russian", week: 7, day: 5, label: "Русский · Н7 · День 5 (Пт) · 07.08 · аудио",
    tasks: [
      {
        id: "ru-w7-d5-t1", subjectId: "russian", title: "Корректура текста", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Исправь ошибки, не переписывая весь текст заново. Нажми на слово с ошибкой и впиши верный вариант.",
        steps: [{
          id: "ru-w7-d5-t1-s1", kind: "proofread",
          prompt: "В коротком тексте есть ошибки. Найди и исправь их.",
          proofWords: "На перемени Вера достала из партфеля синюю тетрадь Она хотела записать домашние задание".split(" "),
          proofFixes: [
            { index: 1, accepted: ["перемене"] },
            { index: 5, accepted: ["портфеля"] },
            { index: 11, accepted: ["домашнее"] },
          ],
          hint: "Проверь орфограммы, окончания и заглавные буквы.",
        }],
      },
      {
        id: "ru-w7-d5-t2", subjectId: "russian", title: "Языковая разминка: шифровка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Прочитай наоборот: ежадап.",
        steps: [{
          id: "ru-w7-d5-t2-s1", kind: "gapinput",
          prompt: "Прочитай наоборот: ежадап.",
          gaps: [{ label: "Слово:", accepted: ["падеж"] }],
          hint: "У существительных их шесть.",
        }],
      },
      {
        id: "ru-w7-d5-t3", subjectId: "russian", title: "Аудиодиктант: синица на берёзе", mode: "platform", order: 3, total: 3, estMinutes: 10,
        prompt: "Нажми «Слушать». Запиши текст в тетради. Можно прослушать не больше двух раз. После записи загрузи фото.",
        steps: [{
          id: "ru-w7-d5-t3-s1", kind: "audio",
          prompt: "Аудиодиктант. Пауза и перемотка запрещены. Максимум 2 прослушивания.",
          listenLimit: 2,
          hint: "Проверь имя мальчика и слова с безударными гласными.",
        }],
      },
    ],
  },

  // ═══════════════════════ РУССКИЙ · НЕДЕЛЯ 8 ═══════════════════════
  {
    subject: "russian", week: 8, day: 1, label: "Русский · Н8 · День 1 (Пн) · 10.08",
    tasks: [
      {
        id: "ru-w8-d1-t1", subjectId: "russian", title: "Состав слова", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Впиши части слова в поля: приставка, корень, суффикс, окончание.",
        steps: [{
          id: "ru-w8-d1-t1-s1", kind: "fields",
          prompt: "Разбери слово по составу.",
          fieldsSubject: "беззвучный",
          fields: [
            { label: "Приставка", accepted: ["без"] },
            { label: "Корень", accepted: ["звуч"] },
            { label: "Суффикс", accepted: ["н"] },
            { label: "Окончание", accepted: ["ый"] },
          ],
          hint: "Найди корень через родственные слова, затем отдели приставку и суффикс.",
        }],
      },
      {
        id: "ru-w8-d1-t2", subjectId: "russian", title: "Пунктуация и заглавные буквы", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Расставь нужные знаки и сделай заглавными первые буквы нужных слов.",
        steps: [{
          id: "ru-w8-d1-t2-s1", kind: "punctuation",
          prompt: "В тексте потерялись знаки препинания и заглавные буквы.",
          words: "после уроков нина остановилась на широкой аллее парка она заметила веточку рябины чей он мог быть".split(" "),
          expectedMarks: ["","","","","","","",".","","","",".","","","","?"],
          expectedCapitals: [0, 2, 8, 12],
          hint: "Где мысль закончилась, нужен знак конца. Имена пишутся с заглавной буквы.",
        }],
      },
      {
        id: "ru-w8-d1-t3", subjectId: "russian", title: "Грамматическая форма", mode: "platform", order: 3, total: 4, estMinutes: 4,
        prompt: "Выбери нужную форму из списка.",
        steps: [{
          id: "ru-w8-d1-t3-s1", kind: "question",
          prompt: "Папа рассказал (она) смешную историю из детства.",
          hint: "Спроси: рассказал кому?",
          options: [
            { id: "a", label: "ей", isCorrect: true },
            { id: "b", label: "её", isCorrect: false },
            { id: "c", label: "она", isCorrect: false },
            { id: "d", label: "ею", isCorrect: false },
          ],
        }],
      },
      {
        id: "ru-w8-d1-t4", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Собери слово из букв: Р О Д.",
        steps: [{
          id: "ru-w8-d1-t4-s1", kind: "gapinput",
          prompt: "Собери слово из букв: Р О Д.",
          gaps: [{ label: "Слово:", accepted: ["род"] }],
          hint: "Бывает мужской, женский и средний.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 8, day: 2, label: "Русский · Н8 · День 2 (Вт) · 11.08 · письмо",
    tasks: [
      {
        id: "ru-w8-d2-t1", subjectId: "russian", title: "Орфограмма с пропуском", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Впиши пропущенные буквы. Вариантов ответа нет.",
        steps: [{
          id: "ru-w8-d2-t1-s1", kind: "gapinput",
          prompt: "В словах пропущены буквы. Впиши нужную букву.",
          gaps: [
            { label: "д_лекий", accepted: ["а"] },
            { label: "с_сновый", accepted: ["о"] },
            { label: "м_рской", accepted: ["о"] },
            { label: "п_ляна", accepted: ["о"] },
          ],
          hint: "Подбери проверочное слово или вспомни правило.",
        }],
      },
      {
        id: "ru-w8-d2-t2", subjectId: "russian", title: "Языковая разминка: подсказка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Так изменяются глаголы по лицам и числам.",
        steps: [{
          id: "ru-w8-d2-t2-s1", kind: "gapinput",
          prompt: "Так изменяются глаголы по лицам и числам.",
          gaps: [{ label: "Ответ:", accepted: ["спряжение"] }],
          hint: "Это тема глагола.",
        }],
      },
      {
        id: "ru-w8-d2-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nПеред походом ребята проверили свои рюкзаки. В каждом лежали бутылка воды, тёплая кофта и небольшой фонарик. Учительница напомнила им о правилах безопасности. Нельзя отходить от группы и трогать незнакомые растения. У костра нужно сидеть спокойно и внимательно слушать взрослых. Петя положил в боковой карман компас. Лена взяла блокнот, чтобы записывать названия птиц и деревьев. Все очень ждали утренней прогулки по лесной тропе.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни глаголы в неопределённой форме.\n3. Выпиши два существительных во множественном числе.",
      },
    ],
  },
  {
    subject: "russian", week: 8, day: 3, label: "Русский · Н8 · День 3 (Ср) · 12.08",
    tasks: [
      {
        id: "ru-w8-d3-t1", subjectId: "russian", title: "Проверочное слово", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Впиши проверочное слово так, чтобы нужный звук слышался ясно.",
        steps: [{
          id: "ru-w8-d3-t1-s1", kind: "gapinput",
          prompt: "Подбери и впиши проверочное слово.",
          gaps: [
            { label: "к_рмушка", accepted: ["корм", "кормит"] },
            { label: "берё_ка", accepted: ["берёза", "березовый", "берёзовый"] },
            { label: "радос_ный", accepted: ["радость", "радостен"] },
            { label: "гла_ной", accepted: ["глаз", "глазок"] },
          ],
          hint: "Проверочное слово должно быть родственным и помогать услышать звук ясно.",
        }],
      },
      {
        id: "ru-w8-d3-t2", subjectId: "russian", title: "Выбор способа написания", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Выбери правильное написание.",
        steps: [
          {
            id: "ru-w8-d3-t2-s1", kind: "question",
            prompt: "(в)клетке — как пишется?",
            hint: "В- здесь предлог: в просторной клетке.",
            options: [
              { id: "a", label: "в клетке (раздельно)", isCorrect: true },
              { id: "b", label: "вклетке (слитно)", isCorrect: false },
            ],
          },
          {
            id: "ru-w8-d3-t2-s2", kind: "question",
            prompt: "(в)летел — как пишется?",
            hint: "В- здесь приставка.",
            options: [
              { id: "a", label: "влетел (слитно)", isCorrect: true },
              { id: "b", label: "в летел (раздельно)", isCorrect: false },
            ],
          },
          {
            id: "ru-w8-d3-t2-s3", kind: "question",
            prompt: "уча(ст/с)вовать — как пишется?",
            hint: "Это словарное слово.",
            options: [
              { id: "a", label: "участвовать (ств)", isCorrect: true },
              { id: "b", label: "учавствовать (св)", isCorrect: false },
            ],
          },
        ],
      },
      {
        id: "ru-w8-d3-t3", subjectId: "russian", title: "Словосочетание", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Выбери главное слово, зависимое слово и вопрос от главного к зависимому.",
        steps: [{
          id: "ru-w8-d3-t3-s1", kind: "fields",
          prompt: "Пара слов: дорога к школе. Разбери словосочетание.",
          fieldsSubject: "дорога к школе",
          fields: [
            { label: "Главное слово", accepted: ["дорога"] },
            { label: "Зависимое слово", accepted: ["к школе", "школе"] },
            { label: "Вопрос", accepted: ["куда", "куда?", "к чему", "к чему?"] },
          ],
          hint: "Вопрос задаётся от главного слова к зависимому.",
        }],
      },
      {
        id: "ru-w8-d3-t4", subjectId: "russian", title: "Языковая разминка: спрятанное слово", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Найди слово: снежОКОНЧАНИЕинка.",
        steps: [{
          id: "ru-w8-d3-t4-s1", kind: "gapinput",
          prompt: "Найди слово: снежОКОНЧАНИЕинка.",
          gaps: [{ label: "Слово:", accepted: ["окончание"] }],
          hint: "Изменяемая часть слова.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 8, day: 4, label: "Русский · Н8 · День 4 (Чт) · 13.08 · письмо",
    tasks: [
      {
        id: "ru-w8-d4-t1", subjectId: "russian", title: "Слово по смыслу", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "В предложении есть слово, которое не подходит по смыслу. Нажми на него, чтобы исправить.",
        steps: [{
          id: "ru-w8-d4-t1-s1", kind: "wordfix",
          prompt: "Найди неподходящее слово и выбери подходящую замену.",
          sentenceWords: "На экскурсии ребята слушали рассказ о древних чайниках которые жили у реки".split(" "),
          wrongWordIndex: 7,
          replacements: ["племенах", "тетрадях", "тарелках", "самокатах"],
          correctReplacement: "племенах",
          hint: "Подумай, какое слово подходит к ситуации по смыслу.",
        }],
      },
      {
        id: "ru-w8-d4-t2", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Собери слово из букв: С О Г Л А С Н А Я.",
        steps: [{
          id: "ru-w8-d4-t2-s1", kind: "gapinput",
          prompt: "Собери слово из букв: С О Г Л А С Н А Я.",
          gaps: [{ label: "Слово:", accepted: ["согласная"] }],
          hint: "Бывает звонкая или глухая.",
        }],
      },
      {
        id: "ru-w8-d4-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nЗа домом рос старый яблоневый сад. Весной он наполнялся белыми цветами, а летом прятал в тени прохладу. Дедушка часто ставил под яблоней деревянную скамейку. Мы садились на неё после обеда и читали вслух. Иногда к нам подбегал рыжий пёс Туман. Он ложился рядом и внимательно слушал наши голоса. К августу на ветках появлялись первые крепкие яблоки. Дедушка говорил, что сад любит заботливые руки и терпение.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни имена собственные.\n3. Выпиши три словосочетания и укажи главное слово.",
      },
    ],
  },
  {
    subject: "russian", week: 8, day: 5, label: "Русский · Н8 · День 5 (Пт) · 14.08 · аудио",
    tasks: [
      {
        id: "ru-w8-d5-t1", subjectId: "russian", title: "Порядок предложений", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Поставь карточки в таком порядке, чтобы получился связный текст.",
        steps: [{
          id: "ru-w8-d5-t1-s1", kind: "order",
          prompt: "Карточки перепутались. Собери связный текст.",
          cards: [
            "Через минуту из травы выпрыгнул кузнечик.",
            "Алина присела у клумбы.",
            "Девочка хотела рассмотреть жёлтый цветок.",
            "Она улыбнулась и позвала брата.",
          ],
          // 2→3→1→4 = индексы [1,2,0,3]
          acceptedOrders: [[1, 2, 0, 3]],
          hint: "Ищи последовательность событий и слова-подсказки.",
        }],
      },
      {
        id: "ru-w8-d5-t2", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Собери слово из букв: Г Л А С Н А Я.",
        steps: [{
          id: "ru-w8-d5-t2-s1", kind: "gapinput",
          prompt: "Собери слово из букв: Г Л А С Н А Я.",
          gaps: [{ label: "Слово:", accepted: ["гласная"] }],
          hint: "Может быть ударной или безударной.",
        }],
      },
      {
        id: "ru-w8-d5-t3", subjectId: "russian", title: "Аудиодиктант: утро в лагере", mode: "platform", order: 3, total: 3, estMinutes: 10,
        prompt: "Нажми «Слушать». Запиши текст в тетради. Можно прослушать не больше двух раз. После записи загрузи фото.",
        steps: [{
          id: "ru-w8-d5-t3-s1", kind: "audio",
          prompt: "Аудиодиктант. Пауза и перемотка запрещены. Максимум 2 прослушивания.",
          listenLimit: 2,
          hint: "Проверь запятую перед но и окончания прилагательных.",
        }],
      },
    ],
  },

  // ═══════════════════════ РУССКИЙ · НЕДЕЛЯ 9 ═══════════════════════
  {
    subject: "russian", week: 9, day: 1, label: "Русский · Н9 · День 1 (Пн) · 17.08",
    tasks: [
      {
        id: "ru-w9-d1-t1", subjectId: "russian", title: "Корректура текста", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Исправь ошибки, не переписывая весь текст заново. Нажми на слово с ошибкой и впиши верный вариант.",
        steps: [{
          id: "ru-w9-d1-t1-s1", kind: "proofread",
          prompt: "В коротком тексте есть ошибки. Найди и исправь их.",
          proofWords: "У подъезда стоял знакомый мальчик Он держал в руках маленкий пакет и кому-то улыбатся".split(" "),
          proofFixes: [
            { index: 9, accepted: ["маленький"] },
            { index: 13, accepted: ["улыбался"] },
          ],
          hint: "Проверь орфограммы, окончания и заглавные буквы.",
        }],
      },
      {
        id: "ru-w9-d1-t2", subjectId: "russian", title: "Состав слова", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Впиши части слова в поля: приставка, корень, суффикс, окончание.",
        steps: [{
          id: "ru-w9-d1-t2-s1", kind: "fields",
          prompt: "Разбери слово по составу.",
          fieldsSubject: "переходный",
          fields: [
            { label: "Приставка", accepted: ["пере"] },
            { label: "Корень", accepted: ["ход"] },
            { label: "Суффикс", accepted: ["н"] },
            { label: "Окончание", accepted: ["ый"] },
          ],
          hint: "Найди корень через родственные слова, затем отдели приставку и суффикс.",
        }],
      },
      {
        id: "ru-w9-d1-t3", subjectId: "russian", title: "Пунктуация и заглавные буквы", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Расставь нужные знаки и сделай заглавными первые буквы нужных слов.",
        steps: [{
          id: "ru-w9-d1-t3-s1", kind: "punctuation",
          prompt: "В тексте потерялись знаки препинания и заглавные буквы.",
          words: "после уроков соня остановилась у входа в музей она заметила старую открытку чей он мог быть".split(" "),
          expectedMarks: ["","","","","","","",".","","","",".","","","","?"],
          expectedCapitals: [0, 2, 8, 12],
          hint: "Где мысль закончилась, нужен знак конца. Имена пишутся с заглавной буквы.",
        }],
      },
      {
        id: "ru-w9-d1-t4", subjectId: "russian", title: "Языковая разминка: шифровка", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Убери букву Х: ХмХеХсХтХоХиХмХеХнХиХе.",
        steps: [{
          id: "ru-w9-d1-t4-s1", kind: "gapinput",
          prompt: "Убери букву Х: ХмХеХсХтХоХиХмХеХнХиХе.",
          gaps: [{ label: "Слово:", accepted: ["местоимение"] }],
          hint: "Может заменить существительное.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 9, day: 2, label: "Русский · Н9 · День 2 (Вт) · 18.08 · письмо",
    tasks: [
      {
        id: "ru-w9-d2-t1", subjectId: "russian", title: "Грамматическая форма", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Выбери нужную форму из списка.",
        steps: [{
          id: "ru-w9-d2-t1-s1", kind: "question",
          prompt: "На полке не оказалось (интересная книга).",
          hint: "Спроси: не оказалось чего?",
          options: [
            { id: "a", label: "интересной книги", isCorrect: true },
            { id: "b", label: "интересная книга", isCorrect: false },
            { id: "c", label: "интересную книгу", isCorrect: false },
            { id: "d", label: "интересной книгой", isCorrect: false },
          ],
        }],
      },
      {
        id: "ru-w9-d2-t2", subjectId: "russian", title: "Языковая разминка: подсказка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Это группа слов, связанных главным и зависимым словом.",
        steps: [{
          id: "ru-w9-d2-t2-s1", kind: "gapinput",
          prompt: "Это группа слов, связанных главным и зависимым словом.",
          gaps: [{ label: "Ответ:", accepted: ["словосочетание"] }],
          hint: "От главного слова задаём вопрос.",
        }],
      },
      {
        id: "ru-w9-d2-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nИлья написал другу короткое письмо о своей поездке в Казань. Он рассказал, как гулял по набережной и рассматривал башни кремля. Особенно ему понравилась широкая река, по которой медленно шли теплоходы. Вечером город зажёг огни, и вода стала похожа на тёмное зеркало. Илья купил открытку с видом старой улицы. На обратной стороне он аккуратно написал адрес. Потом мальчик опустил открытку в почтовый ящик. Через несколько дней друг получил письмо и сразу ответил.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни географическое название.\n3. Выпиши существительные 2-го склонения.",
      },
    ],
  },
  {
    subject: "russian", week: 9, day: 3, label: "Русский · Н9 · День 3 (Ср) · 19.08",
    tasks: [
      {
        id: "ru-w9-d3-t1", subjectId: "russian", title: "Орфограмма с пропуском", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Впиши пропущенные буквы. Вариантов ответа нет.",
        steps: [{
          id: "ru-w9-d3-t1-s1", kind: "gapinput",
          prompt: "В словах пропущены буквы. Впиши нужную букву.",
          gaps: [
            { label: "сер_це", accepted: ["д"] },
            { label: "поз_ний", accepted: ["д"] },
            { label: "звёз_ный", accepted: ["д"] },
            { label: "чес_ный", accepted: ["т"] },
          ],
          hint: "Подбери проверочное слово или вспомни правило.",
        }],
      },
      {
        id: "ru-w9-d3-t2", subjectId: "russian", title: "Проверочное слово", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Впиши проверочное слово так, чтобы нужный звук слышался ясно.",
        steps: [{
          id: "ru-w9-d3-t2-s1", kind: "gapinput",
          prompt: "Подбери и впиши проверочное слово.",
          gaps: [
            { label: "п_тно", accepted: ["пятна", "пятнышко"] },
            { label: "ска_ка", accepted: ["сказочка", "сказать"] },
            { label: "со_нце", accepted: ["солнечный"] },
            { label: "м_стерить", accepted: ["мастер", "мастерская"] },
          ],
          hint: "Проверочное слово должно быть родственным и помогать услышать звук ясно.",
        }],
      },
      {
        id: "ru-w9-d3-t3", subjectId: "russian", title: "Выбор способа написания", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Выбери правильное написание.",
        steps: [
          {
            id: "ru-w9-d3-t3-s1", kind: "question",
            prompt: "(по)дорожке — как пишется?",
            hint: "По- здесь предлог: по узкой дорожке.",
            options: [
              { id: "a", label: "по дорожке (раздельно)", isCorrect: true },
              { id: "b", label: "подорожке (слитно)", isCorrect: false },
            ],
          },
          {
            id: "ru-w9-d3-t3-s2", kind: "question",
            prompt: "(под)бежал — как пишется?",
            hint: "Под- здесь приставка.",
            options: [
              { id: "a", label: "подбежал (слитно)", isCorrect: true },
              { id: "b", label: "под бежал (раздельно)", isCorrect: false },
            ],
          },
          {
            id: "ru-w9-d3-t3-s3", kind: "question",
            prompt: "готови(тся/ться) — как пишется?",
            hint: "Что делать? — с мягким знаком.",
            options: [
              { id: "a", label: "готовиться (что делать?)", isCorrect: true },
              { id: "b", label: "готовится", isCorrect: false },
            ],
          },
        ],
      },
      {
        id: "ru-w9-d3-t4", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Собери слово из букв: П У Н К Т У А Ц И Я.",
        steps: [{
          id: "ru-w9-d3-t4-s1", kind: "gapinput",
          prompt: "Собери слово из букв: П У Н К Т У А Ц И Я.",
          gaps: [{ label: "Слово:", accepted: ["пунктуация"] }],
          hint: "Это правила знаков препинания.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 9, day: 4, label: "Русский · Н9 · День 4 (Чт) · 20.08 · письмо",
    tasks: [
      {
        id: "ru-w9-d4-t1", subjectId: "russian", title: "Словосочетание", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Выбери главное слово, зависимое слово и вопрос от главного к зависимому.",
        steps: [{
          id: "ru-w9-d4-t1-s1", kind: "fields",
          prompt: "Пара слов: писать аккуратно. Разбери словосочетание.",
          fieldsSubject: "писать аккуратно",
          fields: [
            { label: "Главное слово", accepted: ["писать"] },
            { label: "Зависимое слово", accepted: ["аккуратно"] },
            { label: "Вопрос", accepted: ["как", "как?"] },
          ],
          hint: "Вопрос задаётся от главного слова к зависимому.",
        }],
      },
      {
        id: "ru-w9-d4-t2", subjectId: "russian", title: "Языковая разминка: подсказка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Это слово обозначает действие предмета.",
        steps: [{
          id: "ru-w9-d4-t2-s1", kind: "gapinput",
          prompt: "Это слово обозначает действие предмета.",
          gaps: [{ label: "Ответ:", accepted: ["глагол"] }],
          hint: "Отвечает на вопросы что делать? что сделать?",
        }],
      },
      {
        id: "ru-w9-d4-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nВ воскресенье мы приехали на дачу к тёте Оле. У калитки нас встретил её большой серый кот. Он важно прошёл по дорожке и сел возле крыльца. В саду уже поспела смородина, а под кустами прятались спелые ягоды крыжовника. Тётя дала мне маленькую корзинку. Я осторожно собирал ягоды, чтобы не уколоться о колючие ветки. После обеда мы пили чай на веранде. Кот лежал под столом и лениво щурился на солнце.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни местоимения.\n3. Выпиши два слова с проверяемой безударной гласной и проверочные слова.",
      },
    ],
  },
  {
    subject: "russian", week: 9, day: 5, label: "Русский · Н9 · День 5 (Пт) · 21.08 · аудио",
    tasks: [
      {
        id: "ru-w9-d5-t1", subjectId: "russian", title: "Слово по смыслу", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "В предложении есть слово, которое не подходит по смыслу. Нажми на него, чтобы исправить.",
        steps: [{
          id: "ru-w9-d5-t1-s1", kind: "wordfix",
          prompt: "Найди неподходящее слово и выбери подходящую замену.",
          sentenceWords: "На стадионе тренер попросил ребят быстро завязать книги и выйти на дорожку".split(" "),
          wrongWordIndex: 7,
          replacements: ["кроссовки", "карандаши", "окна", "чайники"],
          correctReplacement: "кроссовки",
          hint: "Подумай, какое слово подходит к ситуации по смыслу.",
        }],
      },
      {
        id: "ru-w9-d5-t2", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Собери словосочетание из букв: Ч А С Т Ь Р Е Ч И.",
        steps: [{
          id: "ru-w9-d5-t2-s1", kind: "gapinput",
          prompt: "Собери словосочетание из букв: Ч А С Т Ь Р Е Ч И.",
          gaps: [{ label: "Ответ:", accepted: ["часть речи"] }],
          hint: "Существительное, глагол, прилагательное — это...",
        }],
      },
      {
        id: "ru-w9-d5-t3", subjectId: "russian", title: "Аудиодиктант: книга о море", mode: "platform", order: 3, total: 3, estMinutes: 10,
        prompt: "Нажми «Слушать». Запиши текст в тетради. Можно прослушать не больше двух раз. После записи загрузи фото.",
        steps: [{
          id: "ru-w9-d5-t3-s1", kind: "audio",
          prompt: "Аудиодиктант. Пауза и перемотка запрещены. Максимум 2 прослушивания.",
          listenLimit: 2,
          hint: "Проверь, кому понравился рассказ: ей.",
        }],
      },
    ],
  },

  // ═══════════════════════ РУССКИЙ · НЕДЕЛЯ 10 ═══════════════════════
  {
    subject: "russian", week: 10, day: 1, label: "Русский · Н10 · День 1 (Пн) · 24.08",
    tasks: [
      {
        id: "ru-w10-d1-t1", subjectId: "russian", title: "Порядок предложений", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Поставь карточки в таком порядке, чтобы получился связный текст.",
        steps: [{
          id: "ru-w10-d1-t1-s1", kind: "order",
          prompt: "Карточки перепутались. Собери связный текст.",
          cards: [
            "Потом он аккуратно наклеил её в альбом.",
            "Матвей нашёл на столе старую марку.",
            "Сначала мальчик рассмотрел рисунок через лупу.",
            "Вечером он показал альбом дедушке.",
          ],
          // 2→3→1→4 = индексы [1,2,0,3]
          acceptedOrders: [[1, 2, 0, 3]],
          hint: "Ищи последовательность событий и слова-подсказки.",
        }],
      },
      {
        id: "ru-w10-d1-t2", subjectId: "russian", title: "Корректура текста", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Исправь ошибки, не переписывая весь текст заново. Нажми на слово с ошибкой и впиши верный вариант.",
        steps: [{
          id: "ru-w10-d1-t2-s1", kind: "proofread",
          prompt: "В коротком тексте есть ошибки. Найди и исправь их.",
          proofWords: "На перемени Вера достала из партфеля синюю тетрадь Она хотела записать домашние задание".split(" "),
          proofFixes: [
            { index: 1, accepted: ["перемене"] },
            { index: 5, accepted: ["портфеля"] },
            { index: 11, accepted: ["домашнее"] },
          ],
          hint: "Проверь орфограммы, окончания и заглавные буквы.",
        }],
      },
      {
        id: "ru-w10-d1-t3", subjectId: "russian", title: "Состав слова", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Впиши части слова в поля: приставка, корень, суффикс, окончание.",
        steps: [{
          id: "ru-w10-d1-t3-s1", kind: "fields",
          prompt: "Разбери слово по составу.",
          fieldsSubject: "беззвучный",
          fields: [
            { label: "Приставка", accepted: ["без"] },
            { label: "Корень", accepted: ["звуч"] },
            { label: "Суффикс", accepted: ["н"] },
            { label: "Окончание", accepted: ["ый"] },
          ],
          hint: "Найди корень через родственные слова, затем отдели приставку и суффикс.",
        }],
      },
      {
        id: "ru-w10-d1-t4", subjectId: "russian", title: "Языковая разминка: спрятанное слово", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Найди слово: переПРИСТАВКАход.",
        steps: [{
          id: "ru-w10-d1-t4-s1", kind: "gapinput",
          prompt: "Найди слово: переПРИСТАВКАход.",
          gaps: [{ label: "Слово:", accepted: ["приставка"] }],
          hint: "Стоит перед корнем.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 10, day: 2, label: "Русский · Н10 · День 2 (Вт) · 25.08 · письмо",
    tasks: [
      {
        id: "ru-w10-d2-t1", subjectId: "russian", title: "Пунктуация и заглавные буквы", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Расставь нужные знаки и сделай заглавными первые буквы нужных слов.",
        steps: [{
          id: "ru-w10-d2-t1-s1", kind: "punctuation",
          prompt: "В тексте потерялись знаки препинания и заглавные буквы.",
          words: "после уроков лиза остановилась рядом с автобусной остановкой она заметила синий блокнот чей он мог быть".split(" "),
          expectedMarks: ["","","","","","","",".","","","",".","","","","?"],
          expectedCapitals: [0, 2, 8, 12],
          hint: "Где мысль закончилась, нужен знак конца. Имена пишутся с заглавной буквы.",
        }],
      },
      {
        id: "ru-w10-d2-t2", subjectId: "russian", title: "Языковая разминка: шифровка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Прочитай слоги: сло-во-со-че-та-ни-е.",
        steps: [{
          id: "ru-w10-d2-t2-s1", kind: "gapinput",
          prompt: "Прочитай слоги: сло-во-со-че-та-ни-е.",
          gaps: [{ label: "Слово:", accepted: ["словосочетание"] }],
          hint: "Главное и зависимое слово.",
        }],
      },
      {
        id: "ru-w10-d2-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nВ июле на нашей грядке выросли крепкие огурцы. Каждое утро бабушка поливала растения тёплой водой. Я помогал ей рыхлить землю маленькой лопаткой. Однажды под широким листом я заметил первый жёлтый цветок. Через несколько дней на его месте появился крошечный огурчик. Мы решили не срывать его сразу. Бабушка сказала, что растению нужно время. В конце недели огурчик стал длинным и хрустящим.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни прилагательные.\n3. Выпиши три существительных и определи их падеж в предложении.",
      },
    ],
  },
  {
    subject: "russian", week: 10, day: 3, label: "Русский · Н10 · День 3 (Ср) · 26.08",
    tasks: [
      {
        id: "ru-w10-d3-t1", subjectId: "russian", title: "Грамматическая форма", mode: "platform", order: 1, total: 4, estMinutes: 4,
        prompt: "Выбери нужную форму из списка.",
        steps: [{
          id: "ru-w10-d3-t1-s1", kind: "question",
          prompt: "Мы долго говорили с (новый тренер) о соревнованиях.",
          hint: "Спроси: говорили с кем?",
          options: [
            { id: "a", label: "новым тренером", isCorrect: true },
            { id: "b", label: "новый тренер", isCorrect: false },
            { id: "c", label: "нового тренера", isCorrect: false },
            { id: "d", label: "новому тренеру", isCorrect: false },
          ],
        }],
      },
      {
        id: "ru-w10-d3-t2", subjectId: "russian", title: "Орфограмма с пропуском", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Впиши пропущенные буквы. Вариантов ответа нет.",
        steps: [{
          id: "ru-w10-d3-t2-s1", kind: "gapinput",
          prompt: "В словах пропущены буквы. Впиши нужную букву.",
          gaps: [
            { label: "д_лекий", accepted: ["а"] },
            { label: "с_сновый", accepted: ["о"] },
            { label: "м_рской", accepted: ["о"] },
            { label: "п_ляна", accepted: ["о"] },
          ],
          hint: "Подбери проверочное слово или вспомни правило.",
        }],
      },
      {
        id: "ru-w10-d3-t3", subjectId: "russian", title: "Проверочное слово", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Впиши проверочное слово так, чтобы нужный звук слышался ясно.",
        steps: [{
          id: "ru-w10-d3-t3-s1", kind: "gapinput",
          prompt: "Подбери и впиши проверочное слово.",
          gaps: [
            { label: "тр_ва", accepted: ["травы", "травка"] },
            { label: "зв_нок", accepted: ["звон", "звонкий"] },
            { label: "ло_ка", accepted: ["лодочка", "лодок"] },
            { label: "моро_", accepted: ["морозы", "морозный"] },
          ],
          hint: "Проверочное слово должно быть родственным и помогать услышать звук ясно.",
        }],
      },
      {
        id: "ru-w10-d3-t4", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Собери слово из букв: О Р Ф О Г Р А М М А.",
        steps: [{
          id: "ru-w10-d3-t4-s1", kind: "gapinput",
          prompt: "Собери слово из букв: О Р Ф О Г Р А М М А.",
          gaps: [{ label: "Слово:", accepted: ["орфограмма"] }],
          hint: "Опасное место в слове.",
        }],
      },
    ],
  },
  {
    subject: "russian", week: 10, day: 4, label: "Русский · Н10 · День 4 (Чт) · 27.08 · письмо",
    tasks: [
      {
        id: "ru-w10-d4-t1", subjectId: "russian", title: "Выбор способа написания", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Выбери правильное написание.",
        steps: [
          {
            id: "ru-w10-d4-t1-s1", kind: "question",
            prompt: "(не)сказал — как пишется?",
            hint: "НЕ с глаголами пишется раздельно.",
            options: [
              { id: "a", label: "не сказал (раздельно)", isCorrect: true },
              { id: "b", label: "несказал (слитно)", isCorrect: false },
            ],
          },
          {
            id: "ru-w10-d4-t1-s2", kind: "question",
            prompt: "об(ъ/ь)явил — какой знак?",
            hint: "После приставки об- перед я пишется твёрдый знак.",
            options: [
              { id: "a", label: "объявил (ъ)", isCorrect: true },
              { id: "b", label: "обьявил (ь)", isCorrect: false },
            ],
          },
          {
            id: "ru-w10-d4-t1-s3", kind: "question",
            prompt: "улыбае(тся/ться) — как пишется?",
            hint: "Что делает? — без мягкого знака.",
            options: [
              { id: "a", label: "улыбается (что делает?)", isCorrect: true },
              { id: "b", label: "улыбаться", isCorrect: false },
            ],
          },
        ],
      },
      {
        id: "ru-w10-d4-t2", subjectId: "russian", title: "Языковая разминка: подсказка", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Так называют слово, которое проверяет опасную букву.",
        steps: [{
          id: "ru-w10-d4-t2-s1", kind: "gapinput",
          prompt: "Так называют слово, которое проверяет опасную букву.",
          gaps: [{ label: "Ответ:", accepted: ["проверочное"] }],
          hint: "Оно помогает услышать звук ясно.",
        }],
      },
      {
        id: "ru-w10-d4-t3", subjectId: "russian", title: "Списывание и задания", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nК вечеру детская площадка снова ожила. Малыши катали машинки по песку, а старшие ребята строили высокий замок. У качелей стояла девочка в жёлтой куртке. Она ждала брата, который задержался у турника. Вдруг с неба упали первые крупные капли. Ребята быстро собрали игрушки и побежали к подъезду. Через минуту дождь усилился, и площадка опустела. Только песочный замок остался стоять под серым небом.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни сложное предложение с придаточной частью.\n3. Выпиши два существительных среднего рода.",
      },
    ],
  },
  {
    subject: "russian", week: 10, day: 5, label: "Русский · Н10 · День 5 (Пт) · 28.08 · аудио",
    tasks: [
      {
        id: "ru-w10-d5-t1", subjectId: "russian", title: "Словосочетание", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Выбери главное слово, зависимое слово и вопрос от главного к зависимому.",
        steps: [{
          id: "ru-w10-d5-t1-s1", kind: "fields",
          prompt: "Пара слов: синий рюкзак. Разбери словосочетание.",
          fieldsSubject: "синий рюкзак",
          fields: [
            { label: "Главное слово", accepted: ["рюкзак"] },
            { label: "Зависимое слово", accepted: ["синий"] },
            { label: "Вопрос", accepted: ["какой", "какой?"] },
          ],
          hint: "Вопрос задаётся от главного слова к зависимому.",
        }],
      },
      {
        id: "ru-w10-d5-t2", subjectId: "russian", title: "Языковая разминка: анаграмма", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Собери слово из букв: Д И К Т А Н Т.",
        steps: [{
          id: "ru-w10-d5-t2-s1", kind: "gapinput",
          prompt: "Собери слово из букв: Д И К Т А Н Т.",
          gaps: [{ label: "Слово:", accepted: ["диктант"] }],
          hint: "Текст, который пишут на слух.",
        }],
      },
      {
        id: "ru-w10-d5-t3", subjectId: "russian", title: "Аудиодиктант: последний Daily", mode: "platform", order: 3, total: 3, estMinutes: 10,
        prompt: "Нажми «Слушать». Запиши текст в тетради. Можно прослушать не больше двух раз. После записи загрузи фото.",
        steps: [{
          id: "ru-w10-d5-t3-s1", kind: "audio",
          prompt: "Аудиодиктант. Пауза и перемотка запрещены. Максимум 2 прослушивания.",
          listenLimit: 2,
          hint: "Проверь заглавные буквы и окончания слов в словосочетаниях.",
        }],
      },
    ],
  },

  // ═══════════════════════ ENGLISH · WEEK 2 ═══════════════════════
  {
    subject: "english", week: 2, day: 1, label: "English · W2 · Day 1 (Mon) · 29.06",
    tasks: [
      {
        id: "en-w2-d1-t1", subjectId: "english", title: "Vocabulary: family", mode: "platform", order: 1, total: 4, estMinutes: 4,
        prompt: "Type the English word or phrase.",
        steps: [{
          id: "en-w2-d1-t1-s1", kind: "gapinput",
          prompt: "You see a Russian word. Type the English word.",
          gaps: [{ label: "бабушка →", accepted: ["grandma", "grandmother"] }],
          hint: "Think of the topic of the week and the first sound.",
        }],
      },
      {
        id: "en-w2-d1-t2", subjectId: "english", title: "have got / has got", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w2-d1-t2-s1", kind: "question",
          prompt: "My brother ___ got a new bike.",
          hint: "Look at the subject: he / she → has.",
          options: [
            { id: "a", label: "have", isCorrect: false },
            { id: "b", label: "has", isCorrect: true },
          ],
        }],
      },
      {
        id: "en-w2-d1-t3", subjectId: "english", title: "Phonics: /ɑː/", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Type the missing letters.",
        steps: [{
          id: "en-w2-d1-t3-s1", kind: "gapinput",
          prompt: "Complete the words with the missing letters.",
          gaps: [
            { label: "c__r", accepted: ["car", "a"] },
            { label: "f__m", accepted: ["farm", "ar"] },
            { label: "st__t", accepted: ["start", "ar"] },
            { label: "d__k", accepted: ["dark", "ar"] },
          ],
          hint: "Say the word quietly. Which letters make this sound?",
        }],
      },
      {
        id: "en-w2-d1-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w2-d1-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: Y M L I F A.",
          gaps: [{ label: "Word:", accepted: ["family"] }],
          hint: "Mum, dad, sister and brother. Six letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 2, day: 2, label: "English · W2 · Day 2 (Tue) · 30.06 · writing",
    tasks: [
      {
        id: "en-w2-d2-t1", subjectId: "english", title: "Reference words", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "The text repeats a noun too many times. Tap the repeated phrase and replace it.",
        steps: [{
          id: "en-w2-d2-t1-s1", kind: "wordfix",
          prompt: "Choose a reference word to replace the repeated phrase.",
          sentenceWords: ["Ida's", "house", "is", "big.", "Ida's house", "has", "got", "seven", "bedrooms."],
          wrongWordIndex: 4,
          replacements: ["It", "They", "He", "She"],
          correctReplacement: "It",
          hint: "Use it for one thing, they for many things, he/she for people.",
        }],
      },
      {
        id: "en-w2-d2-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w2-d2-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: T S S R I E.",
          gaps: [{ label: "Word:", accepted: ["sister"] }],
          hint: "A girl in your family. Six letters.",
        }],
      },
      {
        id: "en-w2-d2-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nThis is my family. My mum is a doctor, and my dad is a driver. I have got a little brother and a big sister. My brother is funny, but he is sometimes very noisy. My sister is clever and helpful. She likes Science and reads many books. At the weekend, we visit our grandma and grandpa. They live in a small house near the park.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline 4 family words.\n3. Circle 3 reference words: he, she, they, it.",
      },
    ],
  },
  {
    subject: "english", week: 2, day: 3, label: "English · W2 · Day 3 (Wed) · 01.07",
    tasks: [
      {
        id: "en-w2-d3-t1", subjectId: "english", title: "Possessive adjectives", mode: "platform", order: 1, total: 4, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w2-d3-t1-s1", kind: "question",
          prompt: "Tom has got a ball. It is ___ ball.",
          hint: "Tom is a boy → his.",
          options: [
            { id: "a", label: "his", isCorrect: true },
            { id: "b", label: "her", isCorrect: false },
            { id: "c", label: "their", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w2-d3-t2", subjectId: "english", title: "Question builder", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Put the cards in the correct order to build a question.",
        steps: [{
          id: "en-w2-d3-t2-s1", kind: "order",
          prompt: "Build the question from the cards.",
          cards: ["Have", "you", "got", "a", "little", "brother", "?"],
          acceptedOrders: [[0, 1, 2, 3, 4, 5, 6]],
          hint: "Questions often begin with Do, Does, Is, Are, Have or Has.",
        }],
      },
      {
        id: "en-w2-d3-t3", subjectId: "english", title: "Pronouns and possessives", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w2-d3-t3-s1", kind: "sort",
          prompt: "Sort the words.",
          columns: ["People", "Possessives", "Family words"],
          chips: [
            { text: "we", column: 0 },
            { text: "his", column: 1 }, { text: "their", column: 1 },
            { text: "grandpa", column: 2 }, { text: "mother", column: 2 }, { text: "sister", column: 2 },
          ],
          hint: "Possessives answer the question whose?",
        }],
      },
      {
        id: "en-w2-d3-t4", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w2-d3-t4-s1", kind: "gapinput",
          prompt: "Find the hidden word in: FATHERMOTHERSON.",
          gaps: [{ label: "Word:", accepted: ["mother"] }],
          hint: "A woman parent. Look for the beginning and ending.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 2, day: 4, label: "English · W2 · Day 4 (Thu) · 02.07 · writing",
    tasks: [
      {
        id: "en-w2-d4-t1", subjectId: "english", title: "Word order", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Put the cards in the correct order.",
        steps: [{
          id: "en-w2-d4-t1-s1", kind: "order",
          prompt: "The words are mixed. Build the sentence.",
          cards: ["My", "grandpa", "is", "kind", "and", "clever", "."],
          acceptedOrders: [[0, 1, 2, 3, 4, 5, 6]],
          hint: "Find the subject first. Then put the verb after it.",
        }],
      },
      {
        id: "en-w2-d4-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w2-d4-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: V R L E E C.",
          gaps: [{ label: "Word:", accepted: ["clever"] }],
          hint: "Smart. Six letters.",
        }],
      },
      {
        id: "en-w2-d4-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nMy cousin Alex is eleven. He has got short dark hair and bright green eyes. Alex is very active, and he plays basketball after school. He is not lazy, but he sometimes forgets his books at home. His favourite subject is Maths. In the evening, he helps his little sister with homework. I like visiting Alex because we always have fun together.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline 5 adjectives.\n3. Write 2 sentences about your cousin or friend using has got.",
      },
    ],
  },
  {
    subject: "english", week: 2, day: 5, label: "English · W2 · Day 5 (Fri) · 03.07 · read aloud",
    tasks: [
      {
        id: "en-w2-d5-t1", subjectId: "english", title: "Reading comprehension", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Read the short text and choose the correct answer.",
        steps: [{
          id: "en-w2-d5-t1-s1", kind: "question",
          prompt: "Mrs Green has got three children. Their names are Ben, Mary and Lucy. Ben is ten, Mary is eight, and Lucy is five. They like playing in the garden.\n\nHow many children has Mrs Green got?",
          hint: "Look for the sentence with has got.",
          options: [
            { id: "a", label: "two", isCorrect: false },
            { id: "b", label: "three", isCorrect: true },
            { id: "c", label: "five", isCorrect: false },
            { id: "d", label: "ten", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w2-d5-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w2-d5-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: R N G E D A.",
          gaps: [{ label: "Word:", accepted: ["garden"] }],
          hint: "A place with flowers near a house. Six letters.",
        }],
      },
      {
        id: "en-w2-d5-t3", subjectId: "english", title: "Read aloud", mode: "platform", order: 3, total: 3, estMinutes: 8,
        prompt: "Read the words and sentences aloud. Press «Записать чтение», read the text, then send the recording.",
        steps: [{
          id: "en-w2-d5-t3-s1", kind: "readaloud",
          prompt: "Read aloud and record your reading.",
          readText: "grandma, grandpa, brother, sister, mother, father.\n\nThis is my family. My sister is clever and my brother is funny. We visit our grandparents at the weekend.",
          hint: "Read slowly. Look at punctuation and pronounce the final sounds clearly.",
        }],
      },
    ],
  },

  // ═══════════════════════ ENGLISH · WEEK 3 ═══════════════════════
  {
    subject: "english", week: 3, day: 1, label: "English · W3 · Day 1 (Mon) · 06.07",
    tasks: [
      {
        id: "en-w3-d1-t1", subjectId: "english", title: "Vocabulary: food", mode: "platform", order: 1, total: 4, estMinutes: 4,
        prompt: "Type the English word or phrase.",
        steps: [{
          id: "en-w3-d1-t1-s1", kind: "gapinput",
          prompt: "You see a Russian word. Type the English word.",
          gaps: [{ label: "овощи →", accepted: ["vegetables"] }],
          hint: "Think of the topic of the week and the first sound.",
        }],
      },
      {
        id: "en-w3-d1-t2", subjectId: "english", title: "Present Simple questions", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w3-d1-t2-s1", kind: "question",
          prompt: "___ she like milk?",
          hint: "Subject she → Does.",
          options: [
            { id: "a", label: "Do", isCorrect: false },
            { id: "b", label: "Does", isCorrect: true },
          ],
        }],
      },
      {
        id: "en-w3-d1-t3", subjectId: "english", title: "Food groups", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w3-d1-t3-s1", kind: "sort",
          prompt: "Sort the words by food group.",
          columns: ["Food", "Drink", "Sweet food"],
          chips: [
            { text: "pizza", column: 0 }, { text: "sandwiches", column: 0 },
            { text: "water", column: 1 }, { text: "milk", column: 1 },
            { text: "cake", column: 2 }, { text: "chocolate", column: 2 },
          ],
          hint: "Think what you eat, drink, or eat as a sweet.",
        }],
      },
      {
        id: "en-w3-d1-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w3-d1-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: T R R O C A.",
          gaps: [{ label: "Word:", accepted: ["carrot"] }],
          hint: "An orange vegetable. Six letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 3, day: 2, label: "English · W3 · Day 2 (Tue) · 07.07 · writing",
    tasks: [
      {
        id: "en-w3-d2-t1", subjectId: "english", title: "Connectors and/but", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w3-d2-t1-s1", kind: "question",
          prompt: "I like pizza ___ I don't like Coke.",
          hint: "Opposite ideas → but.",
          options: [
            { id: "a", label: "and", isCorrect: false },
            { id: "b", label: "but", isCorrect: true },
          ],
        }],
      },
      {
        id: "en-w3-d2-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w3-d2-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: R O N G E A.",
          gaps: [{ label: "Word:", accepted: ["orange"] }],
          hint: "A fruit and a colour. Six letters.",
        }],
      },
      {
        id: "en-w3-d2-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nOn Saturday, we make lunch together. Mum cooks chicken and potatoes, and I wash the carrots. My little brother likes pizza, but he does not like vegetables. Dad drinks orange juice, but Mum drinks tea. We have got apples and biscuits for dessert. After lunch, I help to clean the kitchen. It is a simple meal, but everyone is happy.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline and in blue and but in green.\n3. Write two food sentences: one with and, one with but.",
      },
    ],
  },
  {
    subject: "english", week: 3, day: 3, label: "English · W3 · Day 3 (Wed) · 08.07",
    tasks: [
      {
        id: "en-w3-d3-t1", subjectId: "english", title: "Short answers", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Type the missing word.",
        steps: [{
          id: "en-w3-d3-t1-s1", kind: "gapinput",
          prompt: "Complete the short answers.",
          gaps: [
            { label: "Do you like chocolate? — Yes, I ___.", accepted: ["do"] },
            { label: "Does she like milk? — No, she ___.", accepted: ["doesn't", "does not", "doesnt"] },
          ],
          hint: "Look at the subject and the question word (Do/Does).",
        }],
      },
      {
        id: "en-w3-d3-t2", subjectId: "english", title: "Question builder", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Put the cards in the correct order to build a question.",
        steps: [{
          id: "en-w3-d3-t2-s1", kind: "order",
          prompt: "Build the question from the cards.",
          cards: ["Does", "your", "brother", "like", "ice", "cream", "?"],
          acceptedOrders: [[0, 1, 2, 3, 4, 5, 6]],
          hint: "Questions often begin with Do, Does, Is, Are, Have or Has.",
        }],
      },
      {
        id: "en-w3-d3-t3", subjectId: "english", title: "True or False", mode: "platform", order: 3, total: 4, estMinutes: 4,
        prompt: "Read the text and choose True or False.",
        steps: [{
          id: "en-w3-d3-t3-s1", kind: "question",
          prompt: "Maria likes burgers, but she doesn't like fish. She drinks water every day.\n\nStatement: Maria likes fish.",
          hint: "Find the sentence in the text that gives the answer.",
          options: [
            { id: "a", label: "True", isCorrect: false },
            { id: "b", label: "False", isCorrect: true },
          ],
        }],
      },
      {
        id: "en-w3-d3-t4", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w3-d3-t4-s1", kind: "gapinput",
          prompt: "Find the hidden word in: MILKBANANACAKE.",
          gaps: [{ label: "Word:", accepted: ["banana"] }],
          hint: "A long yellow fruit.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 3, day: 4, label: "English · W3 · Day 4 (Thu) · 09.07 · writing",
    tasks: [
      {
        id: "en-w3-d4-t1", subjectId: "english", title: "Shopping list", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w3-d4-t1-s1", kind: "sort",
          prompt: "Sort the shopping list.",
          columns: ["We have got", "We need"],
          chips: [
            { text: "eggs", column: 0 }, { text: "milk", column: 0 }, { text: "juice", column: 0 },
            { text: "rice", column: 1 }, { text: "bananas", column: 1 }, { text: "oranges", column: 1 },
          ],
          hint: "A tick means we have it. A cross means we need it.",
        }],
      },
      {
        id: "en-w3-d4-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w3-d4-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: T T P O O A.",
          gaps: [{ label: "Word:", accepted: ["potato"] }],
          hint: "A vegetable used for chips. Six letters.",
        }],
      },
      {
        id: "en-w3-d4-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nDear Milla, We have got some potatoes and carrots, but we have not got any rice. We have got eggs, milk and juice. We need some oranges and bananas for breakfast. We also need bread for sandwiches. Please buy a small cake if you see one. Thank you! Alexander\n\n" +
          "Mini-tasks:\n1. Underline all food words.\n2. Circle and and but.\n3. Write 3 items we have got and 3 items we need.",
      },
    ],
  },
  {
    subject: "english", week: 3, day: 5, label: "English · W3 · Day 5 (Fri) · 10.07 · listening",
    tasks: [
      {
        id: "en-w3-d5-t1", subjectId: "english", title: "Connectors: and / but", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Fill the gaps with and or but.",
        steps: [{
          id: "en-w3-d5-t1-s1", kind: "gapinput",
          prompt: "Type and or but in each gap.",
          gaps: [
            { label: "I like chicken ___ rice.", accepted: ["and"] },
            { label: "She likes juice ___ she doesn't like milk.", accepted: ["but"] },
            { label: "We have got apples ___ bananas.", accepted: ["and"] },
          ],
          hint: "Use and for similar ideas. Use but for opposite ideas.",
        }],
      },
      {
        id: "en-w3-d5-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w3-d5-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: U T S I I C B.",
          gaps: [{ label: "Word:", accepted: ["biscuit"] }],
          hint: "A small sweet thing you eat. Seven letters.",
        }],
      },
      {
        id: "en-w3-d5-t3", subjectId: "english", title: "Listening", mode: "platform", order: 3, total: 3, estMinutes: 8,
        prompt: "Listen to the text (max 2 times), then answer the questions.",
        steps: [{
          id: "en-w3-d5-t3-s1", kind: "listening",
          prompt: "Press «Listen». You can listen up to 2 times. Then answer the questions.",
          listenLimit: 2,
          listenQuestions: [
            { q: "What does the speaker like to drink?", options: ["milk", "orange juice", "tea"], correct: "orange juice" },
            { q: "What does the sister like?", options: ["pizza", "carrots", "fish"], correct: "pizza" },
            { q: "Does the sister like carrots?", options: ["Yes", "No"], correct: "No" },
            { q: "What two things do they have for lunch? (type your answer)", accepted: ["apples and milk", "milk and apples", "apples, milk"] },
          ],
          hint: "Listen for the words after «like» and «have got».",
        }],
      },
    ],
  },

  // ═══════════════════════ ENGLISH · WEEK 4 ═══════════════════════
  {
    subject: "english", week: 4, day: 1, label: "English · W4 · Day 1 (Mon) · 13.07",
    tasks: [
      {
        id: "en-w4-d1-t1", subjectId: "english", title: "Vocabulary: toys", mode: "platform", order: 1, total: 4, estMinutes: 4,
        prompt: "Type the English word or phrase.",
        steps: [{
          id: "en-w4-d1-t1-s1", kind: "gapinput",
          prompt: "You see a Russian word. Type the English phrase.",
          gaps: [{ label: "музыкальная шкатулка →", accepted: ["musical box", "a musical box"] }],
          hint: "Think of the topic of the week and the first sound.",
        }],
      },
      {
        id: "en-w4-d1-t2", subjectId: "english", title: "this / that / these / those", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w4-d1-t2-s1", kind: "question",
          prompt: "___ are my pens.",
          hint: "More than one + near → These.",
          options: [
            { id: "a", label: "This", isCorrect: false },
            { id: "b", label: "These", isCorrect: true },
            { id: "c", label: "That", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w4-d1-t3", subjectId: "english", title: "Singular / plural", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w4-d1-t3-s1", kind: "sort",
          prompt: "Sort the words by number.",
          columns: ["Singular", "Plural"],
          chips: [
            { text: "ball", column: 0 }, { text: "train", column: 0 }, { text: "elephant", column: 0 },
            { text: "dolls", column: 1 }, { text: "toys", column: 1 }, { text: "pens", column: 1 },
          ],
          hint: "Singular means one. Plural means more than one.",
        }],
      },
      {
        id: "en-w4-d1-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w4-d1-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: T R N I A.",
          gaps: [{ label: "Word:", accepted: ["train"] }],
          hint: "A toy and transport. Five letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 4, day: 2, label: "English · W4 · Day 2 (Tue) · 14.07 · writing",
    tasks: [
      {
        id: "en-w4-d2-t1", subjectId: "english", title: "Possessive case", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w4-d2-t1-s1", kind: "question",
          prompt: "Whose is this ball? — It's ___.",
          hint: "Use 's to show who owns it.",
          options: [
            { id: "a", label: "Tom's", isCorrect: true },
            { id: "b", label: "Toms", isCorrect: false },
            { id: "c", label: "Tom", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w4-d2-t2", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w4-d2-t2-s1", kind: "gapinput",
          prompt: "Find the hidden word in: BALLDOLLTRAIN.",
          gaps: [{ label: "Word:", accepted: ["doll"] }],
          hint: "A toy like a little person.",
        }],
      },
      {
        id: "en-w4-d2-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nYesterday I found a small toy train under my desk. It was red and yellow, and it had six little wheels. My friend Max said it was his brother's train. We put the train in a box and wrote a note for him. Later, Max's brother came to our classroom. He was very happy to get his toy back. I think it is important to return things to their owners.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline 4 toy words or object words.\n3. Circle two possessive forms with 's.",
      },
    ],
  },
  {
    subject: "english", week: 4, day: 3, label: "English · W4 · Day 3 (Wed) · 15.07",
    tasks: [
      {
        id: "en-w4-d3-t1", subjectId: "english", title: "Plural nouns", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w4-d3-t1-s1", kind: "sort",
          prompt: "Sort the plural forms.",
          columns: ["Regular plural", "Irregular plural", "Same form"],
          chips: [
            { text: "cats", column: 0 }, { text: "boxes", column: 0 },
            { text: "children", column: 1 }, { text: "mice", column: 1 },
            { text: "sheep", column: 2 }, { text: "fish", column: 2 },
          ],
          hint: "Some plurals do not end in -s.",
        }],
      },
      {
        id: "en-w4-d3-t2", subjectId: "english", title: "Irregular plurals", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Type the missing word.",
        steps: [{
          id: "en-w4-d3-t2-s1", kind: "gapinput",
          prompt: "Complete the plurals.",
          gaps: [
            { label: "One child — two ___.", accepted: ["children"] },
            { label: "One mouse — two ___.", accepted: ["mice"] },
          ],
          hint: "These plurals do not end in -s.",
        }],
      },
      {
        id: "en-w4-d3-t3", subjectId: "english", title: "Reading comprehension", mode: "platform", order: 3, total: 4, estMinutes: 4,
        prompt: "Read and choose the correct answer.",
        steps: [{
          id: "en-w4-d3-t3-s1", kind: "question",
          prompt: "Billy, Becky and Bobby are little mice. They play in a field. A black cat comes, and the mice run away.\n\nWho comes to the field?",
          hint: "Find the sentence with comes.",
          options: [
            { id: "a", label: "Mrs Mouse", isCorrect: false },
            { id: "b", label: "a black cat", isCorrect: true },
            { id: "c", label: "a farmer", isCorrect: false },
            { id: "d", label: "a dog", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w4-d3-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w4-d3-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: U S O M E.",
          gaps: [{ label: "Word:", accepted: ["mouse"] }],
          hint: "A small animal. Five letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 4, day: 4, label: "English · W4 · Day 4 (Thu) · 16.07 · writing",
    tasks: [
      {
        id: "en-w4-d4-t1", subjectId: "english", title: "Adjective before noun", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Put the cards in the correct order.",
        steps: [{
          id: "en-w4-d4-t1-s1", kind: "order",
          prompt: "The words are mixed. Build the sentence.",
          cards: ["Maria", "has", "got", "a", "beautiful", "doll", "."],
          acceptedOrders: [[0, 1, 2, 3, 4, 5, 6]],
          hint: "The adjective goes before the noun.",
        }],
      },
      {
        id: "en-w4-d4-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w4-d4-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: U U T L I F E B A.",
          gaps: [{ label: "Word:", accepted: ["beautiful"] }],
          hint: "Very nice to look at. Nine letters.",
        }],
      },
      {
        id: "en-w4-d4-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nI have got a funny toy elephant. Its ears are very big, and its tail is short. The elephant is grey, but its hat is bright blue. My little cousin likes this toy because it can make a funny sound. We sometimes put it on the sofa and make a little show. My cousin laughs every time. The toy is old, but it is still my favourite.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline 6 adjectives.\n3. Write 3 noun phrases: adjective + noun.",
      },
    ],
  },
  {
    subject: "english", week: 4, day: 5, label: "English · W4 · Day 5 (Fri) · 17.07 · read aloud",
    tasks: [
      {
        id: "en-w4-d5-t1", subjectId: "english", title: "Question builder", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Put the cards in the correct order to build a question.",
        steps: [{
          id: "en-w4-d5-t1-s1", kind: "order",
          prompt: "Build the question from the cards.",
          cards: ["Whose", "is", "this", "rocking", "horse", "?"],
          acceptedOrders: [[0, 1, 2, 3, 4, 5]],
          hint: "Question words: Whose, What, Where...",
        }],
      },
      {
        id: "en-w4-d5-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w4-d5-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: T P N L H E E A.",
          gaps: [{ label: "Word:", accepted: ["elephant"] }],
          hint: "A big grey animal. Eight letters.",
        }],
      },
      {
        id: "en-w4-d5-t3", subjectId: "english", title: "Read aloud", mode: "platform", order: 3, total: 3, estMinutes: 8,
        prompt: "Read the words and sentences aloud. Press «Записать чтение», read the text, then send the recording.",
        steps: [{
          id: "en-w4-d5-t3-s1", kind: "readaloud",
          prompt: "Read aloud and record your reading.",
          readText: "toy, train, ball, doll, elephant, rocking horse.\n\nThis is my toy train. That is Tom's ball. These are my pencils and those are his books.",
          hint: "Read slowly. Look at punctuation and pronounce the final sounds clearly.",
        }],
      },
    ],
  },

  // ═══════════════════════ ENGLISH · WEEK 5 ═══════════════════════
  {
    subject: "english", week: 5, day: 1, label: "English · W5 · Day 1 (Mon) · 20.07",
    tasks: [
      {
        id: "en-w5-d1-t1", subjectId: "english", title: "Vocabulary: house", mode: "platform", order: 1, total: 4, estMinutes: 4,
        prompt: "Type the English word or phrase.",
        steps: [{
          id: "en-w5-d1-t1-s1", kind: "gapinput",
          prompt: "You see a Russian word. Type the English phrase.",
          gaps: [{ label: "гостиная →", accepted: ["living room", "the living room"] }],
          hint: "Think of the topic of the week and the first sound.",
        }],
      },
      {
        id: "en-w5-d1-t2", subjectId: "english", title: "Prepositions of place", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w5-d1-t2-s1", kind: "question",
          prompt: "The lamp is ___ the desk.",
          hint: "On top of a surface → on.",
          options: [
            { id: "a", label: "in", isCorrect: false },
            { id: "b", label: "on", isCorrect: true },
            { id: "c", label: "under", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w5-d1-t3", subjectId: "english", title: "Prepositions", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w5-d1-t3-s1", kind: "sort",
          prompt: "Sort by place preposition.",
          columns: ["in", "on", "under"],
          chips: [
            { text: "the box", column: 0 }, { text: "the room", column: 0 }, { text: "the bag", column: 0 },
            { text: "the table", column: 1 }, { text: "the chair", column: 1 },
            { text: "the bed", column: 2 },
          ],
          hint: "Think where the object is.",
        }],
      },
      {
        id: "en-w5-d1-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w5-d1-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: W W O N I D.",
          gaps: [{ label: "Word:", accepted: ["window"] }],
          hint: "You look through it. Six letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 5, day: 2, label: "English · W5 · Day 2 (Tue) · 21.07 · writing",
    tasks: [
      {
        id: "en-w5-d2-t1", subjectId: "english", title: "there is / there are", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Type the missing word.",
        steps: [{
          id: "en-w5-d2-t1-s1", kind: "gapinput",
          prompt: "Complete with is or are.",
          gaps: [
            { label: "There ___ a mirror in the hall.", accepted: ["is"] },
            { label: "There ___ two armchairs in the living room.", accepted: ["are"] },
          ],
          hint: "One thing → is. More than one → are.",
        }],
      },
      {
        id: "en-w5-d2-t2", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w5-d2-t2-s1", kind: "gapinput",
          prompt: "Find the hidden word in: SOFAMIRRORBED.",
          gaps: [{ label: "Word:", accepted: ["mirror"] }],
          hint: "You can see your face in it.",
        }],
      },
      {
        id: "en-w5-d2-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nThis is my room. There is a desk near the window, and there are two shelves above it. My books are on the shelves, but my schoolbag is under the chair. There is a small lamp on the desk. I have got a blue bed and a green carpet. My room is not very big, but it is comfortable. I like reading there in the evening.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline there is / there are.\n3. Draw a small plan of the room and label 4 objects in English.",
      },
    ],
  },
  {
    subject: "english", week: 5, day: 3, label: "English · W5 · Day 3 (Wed) · 22.07",
    tasks: [
      {
        id: "en-w5-d3-t1", subjectId: "english", title: "Question builder", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Put the cards in the correct order to build a question.",
        steps: [{
          id: "en-w5-d3-t1-s1", kind: "order",
          prompt: "Build the question from the cards.",
          cards: ["Where", "is", "your", "lamp", "?"],
          acceptedOrders: [[0, 1, 2, 3, 4]],
          hint: "Question words: Where, What, Whose...",
        }],
      },
      {
        id: "en-w5-d3-t2", subjectId: "english", title: "Short answers", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w5-d3-t2-s1", kind: "question",
          prompt: "Are there any boxes? — Yes, there ___.",
          hint: "Plural (boxes) → are.",
          options: [
            { id: "a", label: "is", isCorrect: false },
            { id: "b", label: "are", isCorrect: true },
            { id: "c", label: "aren't", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w5-d3-t3", subjectId: "english", title: "Reading comprehension", mode: "platform", order: 3, total: 4, estMinutes: 4,
        prompt: "Read and choose the correct answer.",
        steps: [{
          id: "en-w5-d3-t3-s1", kind: "question",
          prompt: "There is a sofa in the living room. The cat is under the sofa. The TV is next to the window.\n\nWhere is the cat?",
          hint: "Find the sentence with the cat.",
          options: [
            { id: "a", label: "on the sofa", isCorrect: false },
            { id: "b", label: "under the sofa", isCorrect: true },
            { id: "c", label: "next to the window", isCorrect: false },
            { id: "d", label: "in the kitchen", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w5-d3-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w5-d3-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: T N K I H E C.",
          gaps: [{ label: "Word:", accepted: ["kitchen"] }],
          hint: "A room where people cook. Seven letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 5, day: 4, label: "English · W5 · Day 4 (Thu) · 23.07 · writing",
    tasks: [
      {
        id: "en-w5-d4-t1", subjectId: "english", title: "Reference words", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "The text repeats a noun too many times. Tap the repeated phrase and replace it.",
        steps: [{
          id: "en-w5-d4-t1-s1", kind: "wordfix",
          prompt: "Choose a reference word to replace the repeated phrase.",
          sentenceWords: ["Our", "living", "room", "is", "big.", "Our living room", "is", "blue", "and", "green."],
          wrongWordIndex: 5,
          replacements: ["It", "They", "He", "She"],
          correctReplacement: "It",
          hint: "Use it for one room or one thing.",
        }],
      },
      {
        id: "en-w5-d4-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w5-d4-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: R O O M E D B.",
          gaps: [{ label: "Word:", accepted: ["bedroom"] }],
          hint: "A room where you sleep. Seven letters.",
        }],
      },
      {
        id: "en-w5-d4-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nOur house is near a quiet street. It has got a small garden and a bright kitchen. In the living room, there is a green sofa and two old armchairs. My sister's bedroom is pink, and her posters are on the wall. My bedroom is blue and white. I keep my books on a shelf above the desk. In the evening, our family often sits in the living room and talks.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline 5 room/furniture words.\n3. Circle 3 reference words: it, they, our, her.",
      },
    ],
  },
  {
    subject: "english", week: 5, day: 5, label: "English · W5 · Day 5 (Fri) · 24.07 · listening",
    tasks: [
      {
        id: "en-w5-d5-t1", subjectId: "english", title: "Room vocabulary", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w5-d5-t1-s1", kind: "sort",
          prompt: "Sort the words by room.",
          columns: ["Kitchen", "Bedroom", "Living room"],
          chips: [
            { text: "fridge", column: 0 }, { text: "cooker", column: 0 },
            { text: "bed", column: 1 }, { text: "lamp", column: 1 },
            { text: "sofa", column: 2 }, { text: "armchair", column: 2 },
          ],
          hint: "Think where you usually see this object.",
        }],
      },
      {
        id: "en-w5-d5-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w5-d5-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: T R P E C A.",
          gaps: [{ label: "Word:", accepted: ["carpet"] }],
          hint: "It lies on the floor. Six letters.",
        }],
      },
      {
        id: "en-w5-d5-t3", subjectId: "english", title: "Listening", mode: "platform", order: 3, total: 3, estMinutes: 8,
        prompt: "Listen to the text (max 2 times), then answer the questions.",
        steps: [{
          id: "en-w5-d5-t3-s1", kind: "listening",
          prompt: "Press «Listen». You can listen up to 2 times. Then answer the questions.",
          listenLimit: 2,
          listenQuestions: [
            { q: "Where is the lamp?", options: ["on the desk", "under the bed", "on the shelf"], correct: "on the desk" },
            { q: "Where are the books?", options: ["on the shelf", "in the bag", "on the desk"], correct: "on the shelf" },
            { q: "Where is the schoolbag?", options: ["on the chair", "under the chair", "on the desk"], correct: "under the chair" },
            { q: "Why does the speaker like the room? (type one word)", accepted: ["quiet", "it is quiet", "because it is quiet"] },
          ],
          hint: "Listen for the prepositions: on, under, in.",
        }],
      },
    ],
  },

  // ═══════════════════════ ENGLISH · WEEK 6 ═══════════════════════
  {
    subject: "english", week: 6, day: 1, label: "English · W6 · Day 1 (Mon) · 27.07",
    tasks: [
      {
        id: "en-w6-d1-t1", subjectId: "english", title: "Vocabulary: animals", mode: "platform", order: 1, total: 4, estMinutes: 4,
        prompt: "Type the English word.",
        steps: [{
          id: "en-w6-d1-t1-s1", kind: "gapinput",
          prompt: "You see a Russian word. Type the English word.",
          gaps: [{ label: "попугай →", accepted: ["parrot"] }],
          hint: "Think of the topic of the week and the first sound.",
        }],
      },
      {
        id: "en-w6-d1-t2", subjectId: "english", title: "can / can't", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w6-d1-t2-s1", kind: "question",
          prompt: "Can parrots talk? — Yes, they ___.",
          hint: "Short answer to a 'can' question.",
          options: [
            { id: "a", label: "can", isCorrect: true },
            { id: "b", label: "can't", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w6-d1-t3", subjectId: "english", title: "Animals and abilities", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w6-d1-t3-s1", kind: "sort",
          prompt: "Sort by ability.",
          columns: ["Can fly", "Can swim", "Can crawl"],
          chips: [
            { text: "bird", column: 0 }, { text: "parrot", column: 0 },
            { text: "fish", column: 1 }, { text: "seahorse", column: 1 },
            { text: "spider", column: 2 },
          ],
          hint: "Think what each animal can do.",
        }],
      },
      {
        id: "en-w6-d1-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w6-d1-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: T R I B B A.",
          gaps: [{ label: "Word:", accepted: ["rabbit"] }],
          hint: "A small animal with long ears. Six letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 6, day: 2, label: "English · W6 · Day 2 (Tue) · 28.07 · writing",
    tasks: [
      {
        id: "en-w6-d2-t1", subjectId: "english", title: "Adjectives in descriptions", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Type the missing word.",
        steps: [{
          id: "en-w6-d2-t1-s1", kind: "gapinput",
          prompt: "Complete the sentences.",
          gaps: [
            { label: "A spider has got ___ legs.", accepted: ["thin", "eight", "long"] },
            { label: "Elephants have got ___ noses.", accepted: ["long"] },
          ],
          hint: "Describe the body part.",
        }],
      },
      {
        id: "en-w6-d2-t2", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w6-d2-t2-s1", kind: "gapinput",
          prompt: "Find the hidden word in: BIRDSPIDERCAT.",
          gaps: [{ label: "Word:", accepted: ["spider"] }],
          hint: "An animal with eight legs.",
        }],
      },
      {
        id: "en-w6-d2-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nA tortoise is a slow animal, but it is very strong. It has got a hard shell and short legs. A tortoise can walk, but it cannot fly or jump high. It likes warm days and green leaves. Some tortoises live for many years. They are quiet animals, and they move carefully. I think a tortoise is interesting because it carries its house on its back.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline all animal words.\n3. Write 3 sentences with can or can't about another animal.",
      },
    ],
  },
  {
    subject: "english", week: 6, day: 3, label: "English · W6 · Day 3 (Wed) · 29.07",
    tasks: [
      {
        id: "en-w6-d3-t1", subjectId: "english", title: "Phonics: /ɜː/", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Type the missing letters.",
        steps: [{
          id: "en-w6-d3-t1-s1", kind: "gapinput",
          prompt: "Complete the words with the missing letters.",
          gaps: [
            { label: "b__rd", accepted: ["bird", "i"] },
            { label: "g__rl", accepted: ["girl", "i"] },
            { label: "sh__rt", accepted: ["shirt", "i"] },
            { label: "sk__rt", accepted: ["skirt", "i"] },
          ],
          hint: "Say the word quietly. Which letters make this sound?",
        }],
      },
      {
        id: "en-w6-d3-t2", subjectId: "english", title: "Odd sound out", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Choose the word that sounds different.",
        steps: [{
          id: "en-w6-d3-t2-s1", kind: "question",
          prompt: "Which word has a different vowel sound?",
          hint: "Read all words aloud and listen to the vowel.",
          options: [
            { id: "a", label: "bird", isCorrect: false },
            { id: "b", label: "girl", isCorrect: false },
            { id: "c", label: "fish", isCorrect: true },
            { id: "d", label: "shirt", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w6-d3-t3", subjectId: "english", title: "Reading comprehension", mode: "platform", order: 3, total: 4, estMinutes: 4,
        prompt: "Read and choose the correct answer.",
        steps: [{
          id: "en-w6-d3-t3-s1", kind: "question",
          prompt: "Troy is an elf boy. He likes to dance. Roy hides Troy when his mum comes into the room.\n\nWho likes to dance?",
          hint: "Find the name near 'likes to dance'.",
          options: [
            { id: "a", label: "Roy", isCorrect: false },
            { id: "b", label: "Troy", isCorrect: true },
            { id: "c", label: "Roy's mum", isCorrect: false },
            { id: "d", label: "the toy", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w6-d3-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w6-d3-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: U T T R L E.",
          gaps: [{ label: "Word:", accepted: ["turtle"] }],
          hint: "An animal like a tortoise. Six letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 6, day: 4, label: "English · W6 · Day 4 (Thu) · 30.07 · writing",
    tasks: [
      {
        id: "en-w6-d4-t1", subjectId: "english", title: "Plural nouns", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w6-d4-t1-s1", kind: "sort",
          prompt: "Sort the plural nouns.",
          columns: ["Regular", "Irregular", "Same form"],
          chips: [
            { text: "birds", column: 0 }, { text: "rabbits", column: 0 },
            { text: "mice", column: 1 }, { text: "children", column: 1 },
            { text: "fish", column: 2 }, { text: "sheep", column: 2 },
          ],
          hint: "Some animal words do not change in plural.",
        }],
      },
      {
        id: "en-w6-d4-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w6-d4-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: T R R P O A.",
          gaps: [{ label: "Word:", accepted: ["parrot"] }],
          hint: "A bird that can talk. Six letters.",
        }],
      },
      {
        id: "en-w6-d4-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nAt the nature club, we watched a short film about animals. We saw birds, fish, rabbits and two funny mice. The teacher explained that some animals can run fast, and some can hide very well. A parrot can talk, but it cannot write words. A fish can swim, but it cannot walk. After the film, we made a small poster about our favourite animal.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline all animal words.\n3. Write the plural forms: mouse, child, fish, sheep.",
      },
    ],
  },
  {
    subject: "english", week: 6, day: 5, label: "English · W6 · Day 5 (Fri) · 31.07 · read aloud",
    tasks: [
      {
        id: "en-w6-d5-t1", subjectId: "english", title: "can / can't", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w6-d5-t1-s1", kind: "question",
          prompt: "A rabbit ___ jump.",
          hint: "Rabbits are able to jump.",
          options: [
            { id: "a", label: "can", isCorrect: true },
            { id: "b", label: "can't", isCorrect: false },
            { id: "c", label: "is", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w6-d5-t2", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w6-d5-t2-s1", kind: "gapinput",
          prompt: "Find the hidden word in: RABBITPARROTFISH.",
          gaps: [{ label: "Word:", accepted: ["parrot"] }],
          hint: "A colourful bird.",
        }],
      },
      {
        id: "en-w6-d5-t3", subjectId: "english", title: "Read aloud", mode: "platform", order: 3, total: 3, estMinutes: 8,
        prompt: "Read the words and sentences aloud. Press «Записать чтение», read the text, then send the recording.",
        steps: [{
          id: "en-w6-d5-t3-s1", kind: "readaloud",
          prompt: "Read aloud and record your reading.",
          readText: "spider, bird, rabbit, seahorse, tortoise, parrot.\n\nCan parrots talk? Yes, they can. They can't crawl. Fish can swim, but they can't fly.",
          hint: "Read slowly. Look at punctuation and pronounce the final sounds clearly.",
        }],
      },
    ],
  },

  // ═══════════════════════ ENGLISH · WEEK 7 ═══════════════════════
  {
    subject: "english", week: 7, day: 1, label: "English · W7 · Day 1 (Mon) · 03.08",
    tasks: [
      {
        id: "en-w7-d1-t1", subjectId: "english", title: "Vocabulary: actions", mode: "platform", order: 1, total: 4, estMinutes: 4,
        prompt: "Type the English phrase.",
        steps: [{
          id: "en-w7-d1-t1-s1", kind: "gapinput",
          prompt: "You see a Russian phrase. Type the English phrase.",
          gaps: [{ label: "кататься на велосипеде →", accepted: ["ride a bike", "ride a bicycle"] }],
          hint: "Think of the topic of the week.",
        }],
      },
      {
        id: "en-w7-d1-t2", subjectId: "english", title: "Present Continuous", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w7-d1-t2-s1", kind: "question",
          prompt: "Look! The children ___ playing.",
          hint: "Subject: children (they) → are.",
          options: [
            { id: "a", label: "am", isCorrect: false },
            { id: "b", label: "is", isCorrect: false },
            { id: "c", label: "are", isCorrect: true },
          ],
        }],
      },
      {
        id: "en-w7-d1-t3", subjectId: "english", title: "-ing spelling", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w7-d1-t3-s1", kind: "sort",
          prompt: "Sort by -ing spelling rule.",
          columns: ["+ ing", "drop -e + ing", "double consonant + ing"],
          chips: [
            { text: "play", column: 0 }, { text: "watch", column: 0 },
            { text: "make", column: 1 }, { text: "dance", column: 1 },
            { text: "run", column: 2 }, { text: "sit", column: 2 },
          ],
          hint: "Look at the last letter before adding -ing.",
        }],
      },
      {
        id: "en-w7-d1-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w7-d1-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: U R N N N I G.",
          gaps: [{ label: "Word:", accepted: ["running"] }],
          hint: "Moving fast on your feet. Seven letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 7, day: 2, label: "English · W7 · Day 2 (Tue) · 04.08 · writing",
    tasks: [
      {
        id: "en-w7-d2-t1", subjectId: "english", title: "Present Continuous statement", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Put the cards in the correct order.",
        steps: [{
          id: "en-w7-d2-t1-s1", kind: "order",
          prompt: "The words are mixed. Build the sentence.",
          cards: ["My", "mother", "is", "cooking", "now", "."],
          acceptedOrders: [[0, 1, 2, 3, 4, 5]],
          hint: "Find the subject first. Then put the verb after it.",
        }],
      },
      {
        id: "en-w7-d2-t2", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w7-d2-t2-s1", kind: "gapinput",
          prompt: "Find the hidden word in: RUNSKIPPINGJUMP.",
          gaps: [{ label: "Word:", accepted: ["skipping"] }],
          hint: "Jumping with a rope.",
        }],
      },
      {
        id: "en-w7-d2-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nLook at the playground now. Two boys are playing basketball near the school gate. A little girl is skipping under a tree. My friend Max is riding his bike slowly. Some children are eating sandwiches on a bench. The teacher is watching everyone carefully. I am sitting with my notebook and drawing this busy picture.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline 6 verbs in -ing.\n3. Write 3 questions about the picture using Is/Are.",
      },
    ],
  },
  {
    subject: "english", week: 7, day: 3, label: "English · W7 · Day 3 (Wed) · 05.08",
    tasks: [
      {
        id: "en-w7-d3-t1", subjectId: "english", title: "Question builder", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Put the cards in the correct order to build a question.",
        steps: [{
          id: "en-w7-d3-t1-s1", kind: "order",
          prompt: "Build the question from the cards.",
          cards: ["Are", "the", "boys", "playing", "now", "?"],
          acceptedOrders: [[0, 1, 2, 3, 4, 5]],
          hint: "Questions often begin with Is or Are.",
        }],
      },
      {
        id: "en-w7-d3-t2", subjectId: "english", title: "Present Continuous negative", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Put the cards in the correct order.",
        steps: [{
          id: "en-w7-d3-t2-s1", kind: "order",
          prompt: "The words are mixed. Build the sentence.",
          cards: ["Sam", "is", "not", "sitting", "on", "the", "sofa", "."],
          acceptedOrders: [[0, 1, 2, 3, 4, 5, 6, 7]],
          hint: "Negative: subject + is/are + not + V-ing.",
        }],
      },
      {
        id: "en-w7-d3-t3", subjectId: "english", title: "am / is / are", mode: "platform", order: 3, total: 4, estMinutes: 4,
        prompt: "Type the missing word.",
        steps: [{
          id: "en-w7-d3-t3-s1", kind: "gapinput",
          prompt: "Complete with am, is or are.",
          gaps: [
            { label: "I ___ swimming.", accepted: ["am"] },
            { label: "Dave ___ reading.", accepted: ["is"] },
            { label: "My friends ___ not dancing.", accepted: ["are"] },
          ],
          hint: "Look at the subject: I / he / they.",
        }],
      },
      {
        id: "en-w7-d3-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w7-d3-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: W T N I H G C A.",
          gaps: [{ label: "Word:", accepted: ["watching"] }],
          hint: "Looking at something for some time. Eight letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 7, day: 4, label: "English · W7 · Day 4 (Thu) · 06.08 · writing",
    tasks: [
      {
        id: "en-w7-d4-t1", subjectId: "english", title: "Action vocabulary", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w7-d4-t1-s1", kind: "sort",
          prompt: "Sort the actions.",
          columns: ["Sports", "Home actions", "Creative actions"],
          chips: [
            { text: "ride a bike", column: 0 }, { text: "play basketball", column: 0 },
            { text: "watch TV", column: 1 }, { text: "cook dinner", column: 1 },
            { text: "paint a picture", column: 2 }, { text: "sing songs", column: 2 },
          ],
          hint: "Think where and how people do the action.",
        }],
      },
      {
        id: "en-w7-d4-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w7-d4-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: U T R P I E C.",
          gaps: [{ label: "Word:", accepted: ["picture"] }],
          hint: "You can paint it. Seven letters.",
        }],
      },
      {
        id: "en-w7-d4-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nIt is Saturday afternoon, and our family is busy. Dad is washing the car near the garage. Mum is cooking soup in the kitchen. My sister is painting a picture of our garden. My little brother is playing with a toy train on the carpet. I am helping Grandpa in the yard. We are not watching TV today because the weather is wonderful.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline all forms of am/is/are + -ing.\n3. Write 2 negative sentences about the text.",
      },
    ],
  },
  {
    subject: "english", week: 7, day: 5, label: "English · W7 · Day 5 (Fri) · 07.08 · listening",
    tasks: [
      {
        id: "en-w7-d5-t1", subjectId: "english", title: "Short answers", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w7-d5-t1-s1", kind: "question",
          prompt: "Is the girl skipping now? — Yes, she ___.",
          hint: "Subject she → is.",
          options: [
            { id: "a", label: "is", isCorrect: true },
            { id: "b", label: "isn't", isCorrect: false },
            { id: "c", label: "are", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w7-d5-t2", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w7-d5-t2-s1", kind: "gapinput",
          prompt: "Find the hidden word in: SINGDANCINGREAD.",
          gaps: [{ label: "Word:", accepted: ["dancing"] }],
          hint: "Moving to music.",
        }],
      },
      {
        id: "en-w7-d5-t3", subjectId: "english", title: "Listening", mode: "platform", order: 3, total: 3, estMinutes: 8,
        prompt: "Listen to the text (max 2 times), then answer the questions.",
        steps: [{
          id: "en-w7-d5-t3-s1", kind: "listening",
          prompt: "Press «Listen». You can listen up to 2 times. Then answer the questions.",
          listenLimit: 2,
          listenQuestions: [
            { q: "What are the boys playing?", options: ["soccer", "basketball", "tennis"], correct: "soccer" },
            { q: "What is the sister doing?", options: ["reading", "riding a bike", "cooking"], correct: "riding a bike" },
            { q: "Where are they?", options: ["at school", "in the park", "at home"], correct: "in the park" },
            { q: "What is the speaker doing? (type your answer)", accepted: ["watching them", "watching", "watching them play"] },
          ],
          hint: "Listen for the -ing verbs.",
        }],
      },
    ],
  },

  // ═══════════════════════ ENGLISH · WEEK 8 ═══════════════════════
  {
    subject: "english", week: 8, day: 1, label: "English · W8 · Day 1 (Mon) · 10.08",
    tasks: [
      {
        id: "en-w8-d1-t1", subjectId: "english", title: "Vocabulary: daily routine", mode: "platform", order: 1, total: 4, estMinutes: 4,
        prompt: "Type the English phrase.",
        steps: [{
          id: "en-w8-d1-t1-s1", kind: "gapinput",
          prompt: "You see a Russian word. Type the English phrase.",
          gaps: [{ label: "завтракать →", accepted: ["have breakfast"] }],
          hint: "Think of the topic of the week.",
        }],
      },
      {
        id: "en-w8-d1-t2", subjectId: "english", title: "Present Simple 3rd person", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Type the missing word.",
        steps: [{
          id: "en-w8-d1-t2-s1", kind: "gapinput",
          prompt: "Complete the sentences.",
          gaps: [
            { label: "Nick ___ up at 7. (get)", accepted: ["gets"] },
            { label: "He ___ his English lesson every day. (have)", accepted: ["has"] },
          ],
          hint: "He/she + verb + s.",
        }],
      },
      {
        id: "en-w8-d1-t3", subjectId: "english", title: "Prepositions of time", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w8-d1-t3-s1", kind: "sort",
          prompt: "Sort the time expressions.",
          columns: ["in", "on", "at"],
          chips: [
            { text: "the morning", column: 0 }, { text: "the afternoon", column: 0 },
            { text: "Tuesday", column: 1 }, { text: "Sundays", column: 1 },
            { text: "night", column: 2 }, { text: "7 o'clock", column: 2 },
          ],
          hint: "in for parts of the day, on for days, at for exact time/night.",
        }],
      },
      {
        id: "en-w8-d1-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w8-d1-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: T S R K F E B A A.",
          gaps: [{ label: "Word:", accepted: ["breakfast"] }],
          hint: "Morning meal. Nine letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 8, day: 2, label: "English · W8 · Day 2 (Tue) · 11.08 · writing",
    tasks: [
      {
        id: "en-w8-d2-t1", subjectId: "english", title: "Present Simple 3rd person", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w8-d2-t1-s1", kind: "question",
          prompt: "She ___ to school every day.",
          hint: "He/she → verb + es.",
          options: [
            { id: "a", label: "go", isCorrect: false },
            { id: "b", label: "goes", isCorrect: true },
            { id: "c", label: "going", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w8-d2-t2", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w8-d2-t2-s1", kind: "gapinput",
          prompt: "Find the hidden word in: NIGHTMORNINGDAY.",
          gaps: [{ label: "Word:", accepted: ["morning"] }],
          hint: "The first part of the day.",
        }],
      },
      {
        id: "en-w8-d2-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nOn weekdays, I get up at seven o'clock. First, I have a shower and get dressed. Then I have breakfast with my family. I usually go to school at eight o'clock. In the afternoon, I do my homework and listen to music. Sometimes I visit my friend after school. In the evening, I read a book and go to bed at nine o'clock.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline 6 routine verbs.\n3. Write 3 sentences about what you do on Mondays.",
      },
    ],
  },
  {
    subject: "english", week: 8, day: 3, label: "English · W8 · Day 3 (Wed) · 12.08",
    tasks: [
      {
        id: "en-w8-d3-t1", subjectId: "english", title: "Question builder", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Put the cards in the correct order to build a question.",
        steps: [{
          id: "en-w8-d3-t1-s1", kind: "order",
          prompt: "Build the question from the cards.",
          cards: ["What", "time", "do", "you", "get", "up", "?"],
          acceptedOrders: [[0, 1, 2, 3, 4, 5, 6]],
          hint: "Wh- question + do + subject + verb.",
        }],
      },
      {
        id: "en-w8-d3-t2", subjectId: "english", title: "Present Simple questions", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w8-d3-t2-s1", kind: "question",
          prompt: "___ he watch TV on Sundays?",
          hint: "Subject he → Does.",
          options: [
            { id: "a", label: "Do", isCorrect: false },
            { id: "b", label: "Does", isCorrect: true },
            { id: "c", label: "Is", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w8-d3-t3", subjectId: "english", title: "True or False", mode: "platform", order: 3, total: 4, estMinutes: 4,
        prompt: "Read the text and choose True or False.",
        steps: [{
          id: "en-w8-d3-t3-s1", kind: "question",
          prompt: "Anna gets up at eight o'clock. In the morning, she goes to school. In the afternoon, she listens to music.\n\nStatement: Anna listens to music in the morning.",
          hint: "Find the sentence in the text that gives the answer.",
          options: [
            { id: "a", label: "True", isCorrect: false },
            { id: "b", label: "False", isCorrect: true },
          ],
        }],
      },
      {
        id: "en-w8-d3-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w8-d3-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: Y U T S E D A.",
          gaps: [{ label: "Word:", accepted: ["tuesday"] }],
          hint: "A day of the week. Seven letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 8, day: 4, label: "English · W8 · Day 4 (Thu) · 13.08 · writing",
    tasks: [
      {
        id: "en-w8-d4-t1", subjectId: "english", title: "Present Simple vs Continuous", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Drag each sentence to the correct column.",
        steps: [{
          id: "en-w8-d4-t1-s1", kind: "sort",
          prompt: "Sort the sentences by tense.",
          columns: ["Present Simple", "Present Continuous"],
          chips: [
            { text: "She goes to school every day.", column: 0 },
            { text: "They play games on Fridays.", column: 0 },
            { text: "Look! She is running.", column: 1 },
            { text: "We are watching TV now.", column: 1 },
          ],
          hint: "Every day/usually = Simple. Now/look = Continuous.",
        }],
      },
      {
        id: "en-w8-d4-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w8-d4-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: Y U U S L L A.",
          gaps: [{ label: "Word:", accepted: ["usually"] }],
          hint: "Often, as a habit. Seven letters.",
        }],
      },
      {
        id: "en-w8-d4-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nMy favourite day is Friday. In the morning, I go to school and have English, Music and PE. At lunch, I sit with my friends and we talk about our weekend plans. In the afternoon, I sometimes play basketball after school. Today is Friday, and I am wearing my new trainers. My friends are waiting for me near the gym. In the evening, I usually watch a film with my family.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline Present Simple verbs in one colour and Present Continuous forms in another.\n3. Write one question about the text.",
      },
    ],
  },
  {
    subject: "english", week: 8, day: 5, label: "English · W8 · Day 5 (Fri) · 14.08 · listening",
    tasks: [
      {
        id: "en-w8-d5-t1", subjectId: "english", title: "Present Simple 3rd person", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Type the missing word.",
        steps: [{
          id: "en-w8-d5-t1-s1", kind: "gapinput",
          prompt: "Complete the sentences.",
          gaps: [
            { label: "He often ___ hiking. (go)", accepted: ["goes"] },
            { label: "He sometimes ___ by the camp fire. (sit)", accepted: ["sits"] },
          ],
          hint: "He/she + verb + s.",
        }],
      },
      {
        id: "en-w8-d5-t2", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w8-d5-t2-s1", kind: "gapinput",
          prompt: "Find the hidden word in: MONDAYWEEKENDNIGHT.",
          gaps: [{ label: "Word:", accepted: ["weekend"] }],
          hint: "Saturday and Sunday.",
        }],
      },
      {
        id: "en-w8-d5-t3", subjectId: "english", title: "Listening", mode: "platform", order: 3, total: 3, estMinutes: 8,
        prompt: "Listen to the text (max 2 times), then answer the questions.",
        steps: [{
          id: "en-w8-d5-t3-s1", kind: "listening",
          prompt: "Press «Listen». You can listen up to 2 times. Then answer the questions.",
          listenLimit: 2,
          listenQuestions: [
            { q: "When does Tom get up late?", options: ["on Sundays", "on Mondays", "every day"], correct: "on Sundays" },
            { q: "Who does Tom have breakfast with?", options: ["his friend", "his family", "his teacher"], correct: "his family" },
            { q: "What does Tom watch in the evening?", options: ["cartoons", "the news", "a film"], correct: "cartoons" },
            { q: "Who does Tom visit? (type your answer)", accepted: ["his friend", "friend", "a friend"] },
          ],
          hint: "Listen for the time words and the verbs.",
        }],
      },
    ],
  },

  // ═══════════════════════ ENGLISH · WEEK 9 ═══════════════════════
  {
    subject: "english", week: 9, day: 1, label: "English · W9 · Day 1 (Mon) · 17.08",
    tasks: [
      {
        id: "en-w9-d1-t1", subjectId: "english", title: "Past Simple: -ed forms", mode: "platform", order: 1, total: 4, estMinutes: 6,
        prompt: "Type the correct Past Simple form.",
        steps: [{
          id: "en-w9-d1-t1-s1", kind: "gapinput",
          prompt: "Make the Past Simple form of each verb.",
          gaps: [
            { label: "clean →", accepted: ["cleaned"] },
            { label: "dance →", accepted: ["danced"] },
            { label: "stop →", accepted: ["stopped"] },
            { label: "study →", accepted: ["studied"] },
            { label: "visit →", accepted: ["visited"] },
          ],
          hint: "-e → +d; consonant+y → ied; short vowel+consonant → double it.",
        }],
      },
      {
        id: "en-w9-d1-t2", subjectId: "english", title: "-ed spelling rules", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Drag each verb to the correct column.",
        steps: [{
          id: "en-w9-d1-t2-s1", kind: "sort",
          prompt: "Sort the verbs by Past Simple spelling rule.",
          columns: ["+ed", "+d", "double + ed", "y → ied"],
          chips: [
            { text: "play", column: 0 }, { text: "open", column: 0 },
            { text: "like", column: 1 }, { text: "dance", column: 1 },
            { text: "stop", column: 2 }, { text: "plan", column: 2 },
            { text: "study", column: 3 }, { text: "try", column: 3 },
          ],
          hint: "Look at the final letter of the base verb.",
        }],
      },
      {
        id: "en-w9-d1-t3", subjectId: "english", title: "Past Simple regular", mode: "platform", order: 3, total: 4, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w9-d1-t3-s1", kind: "question",
          prompt: "Yesterday, Kate ___ her room.",
          hint: "Yesterday → Past Simple.",
          options: [
            { id: "a", label: "clean", isCorrect: false },
            { id: "b", label: "cleaned", isCorrect: true },
            { id: "c", label: "cleans", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w9-d1-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w9-d1-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: Y P L E D A.",
          gaps: [{ label: "Word:", accepted: ["played"] }],
          hint: "Past Simple of play. Six letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 9, day: 2, label: "English · W9 · Day 2 (Tue) · 18.08 · writing",
    tasks: [
      {
        id: "en-w9-d2-t1", subjectId: "english", title: "-ed pronunciation", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Drag each verb to the correct column.",
        steps: [{
          id: "en-w9-d2-t1-s1", kind: "sort",
          prompt: "Sort Past Simple verbs by the sound of -ed.",
          columns: ["/t/", "/d/", "/ɪd/"],
          chips: [
            { text: "washed", column: 0 }, { text: "helped", column: 0 },
            { text: "opened", column: 1 }, { text: "cleaned", column: 1 },
            { text: "visited", column: 2 }, { text: "painted", column: 2 },
          ],
          hint: "After /t/ or /d/, -ed sounds like /ɪd/.",
        }],
      },
      {
        id: "en-w9-d2-t2", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w9-d2-t2-s1", kind: "gapinput",
          prompt: "Find the hidden word in: PLAYEDVISITEDOPENED.",
          gaps: [{ label: "Word:", accepted: ["visited"] }],
          hint: "Went to see someone or some place.",
        }],
      },
      {
        id: "en-w9-d2-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nYesterday I visited my grandma after school. We talked in the kitchen and cooked a small cake together. I helped her wash the apples and clean the table. Then I played with her old cat in the garden. The cat jumped on a chair and looked at me proudly. In the evening, I thanked Grandma and walked home with Mum. I liked that quiet evening very much.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline 6 Past Simple verbs with -ed.\n3. Sort 4 verbs into /t/, /d/ or /ɪd/ pronunciation groups.",
      },
    ],
  },
  {
    subject: "english", week: 9, day: 3, label: "English · W9 · Day 3 (Wed) · 19.08",
    tasks: [
      {
        id: "en-w9-d3-t1", subjectId: "english", title: "Question builder", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Put the cards in the correct order to build a question.",
        steps: [{
          id: "en-w9-d3-t1-s1", kind: "order",
          prompt: "Build the question from the cards.",
          cards: ["Did", "you", "visit", "your", "friend", "yesterday", "?"],
          acceptedOrders: [[0, 1, 2, 3, 4, 5, 6]],
          hint: "Past questions begin with Did.",
        }],
      },
      {
        id: "en-w9-d3-t2", subjectId: "english", title: "Past Simple negative", mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Put the cards in the correct order.",
        steps: [{
          id: "en-w9-d3-t2-s1", kind: "order",
          prompt: "The words are mixed. Build the sentence.",
          cards: ["I", "did", "not", "watch", "TV", "yesterday", "."],
          acceptedOrders: [[0, 1, 2, 3, 4, 5, 6]],
          hint: "Negative: subject + did not + verb.",
        }],
      },
      {
        id: "en-w9-d3-t3", subjectId: "english", title: "Past Simple short answers", mode: "platform", order: 3, total: 4, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w9-d3-t3-s1", kind: "question",
          prompt: "Did she clean her room? — No, she ___.",
          hint: "Negative short answer in the past.",
          options: [
            { id: "a", label: "did", isCorrect: false },
            { id: "b", label: "didn't", isCorrect: true },
            { id: "c", label: "doesn't", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w9-d3-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w9-d3-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: W T N E D A.",
          gaps: [{ label: "Word:", accepted: ["wanted"] }],
          hint: "Past Simple of want. Six letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 9, day: 4, label: "English · W9 · Day 4 (Thu) · 20.08 · writing",
    tasks: [
      {
        id: "en-w9-d4-t1", subjectId: "english", title: "Reading comprehension", mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Read and choose the correct answer.",
        steps: [{
          id: "en-w9-d4-t1-s1", kind: "question",
          prompt: "On Monday, Jake waited for the train. A funny crocodile jumped onto the train. Jake was surprised, but the crocodile only wanted to ride with him.\n\nWhat did the crocodile want?",
          hint: "Find the sentence with wanted.",
          options: [
            { id: "a", label: "to eat Jake", isCorrect: false },
            { id: "b", label: "to ride the train", isCorrect: true },
            { id: "c", label: "to swim", isCorrect: false },
            { id: "d", label: "to sleep", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w9-d4-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w9-d4-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: W T I E D A.",
          gaps: [{ label: "Word:", accepted: ["waited"] }],
          hint: "Stood and did not go yet. Six letters.",
        }],
      },
      {
        id: "en-w9-d4-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nLast weekend, our class visited a small museum. First, we looked at old maps and photos. Then our teacher asked us to find three objects from the past. I noticed a wooden toy, a silver spoon and a yellow postcard. My friend painted a quick picture of the toy in her notebook. After the museum, we walked to the park and talked about history. I enjoyed the trip because it was short but interesting.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline Past Simple verbs.\n3. Write 3 questions beginning with Did.",
      },
    ],
  },
  {
    subject: "english", week: 9, day: 5, label: "English · W9 · Day 5 (Fri) · 21.08 · listening",
    tasks: [
      {
        id: "en-w9-d5-t1", subjectId: "english", title: "Past Simple: -ed forms", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Type the correct Past Simple form.",
        steps: [{
          id: "en-w9-d5-t1-s1", kind: "gapinput",
          prompt: "Make the Past Simple form of each verb.",
          gaps: [
            { label: "paint →", accepted: ["painted"] },
            { label: "like →", accepted: ["liked"] },
            { label: "plan →", accepted: ["planned"] },
            { label: "cry →", accepted: ["cried"] },
          ],
          hint: "-e → +d; consonant+y → ied; short vowel+consonant → double it.",
        }],
      },
      {
        id: "en-w9-d5-t2", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w9-d5-t2-s1", kind: "gapinput",
          prompt: "Find the hidden word in: VISITEDCLEANEDPLAYED.",
          gaps: [{ label: "Word:", accepted: ["cleaned"] }],
          hint: "Made something not dirty.",
        }],
      },
      {
        id: "en-w9-d5-t3", subjectId: "english", title: "Listening", mode: "platform", order: 3, total: 3, estMinutes: 8,
        prompt: "Listen to the text (max 2 times), then answer the questions.",
        steps: [{
          id: "en-w9-d5-t3-s1", kind: "listening",
          prompt: "Press «Listen». You can listen up to 2 times. Then answer the questions.",
          listenLimit: 2,
          listenQuestions: [
            { q: "Where did the speaker help dad?", options: ["in the garden", "in the kitchen", "at school"], correct: "in the garden" },
            { q: "What did they plant?", options: ["trees", "flowers", "vegetables"], correct: "flowers" },
            { q: "What did they clean?", options: ["the car", "the path", "the windows"], correct: "the path" },
            { q: "Who did the speaker play with? (type your answer)", accepted: ["my dog", "dog", "the dog", "his dog"] },
          ],
          hint: "Listen for the -ed verbs.",
        }],
      },
    ],
  },

  // ═══════════════════════ ENGLISH · WEEK 10 ═══════════════════════
  {
    subject: "english", week: 10, day: 1, label: "English · W10 · Day 1 (Mon) · 24.08",
    tasks: [
      {
        id: "en-w10-d1-t1", subjectId: "english", title: "Mixed grammar", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Drag each sentence to the correct column.",
        steps: [{
          id: "en-w10-d1-t1-s1", kind: "sort",
          prompt: "Sort sentences by grammar focus.",
          columns: ["to be", "have got", "Present Simple", "Present Continuous"],
          chips: [
            { text: "She is happy.", column: 0 },
            { text: "They have got a dog.", column: 1 },
            { text: "He plays tennis on Fridays.", column: 2 },
            { text: "Look! We are running.", column: 3 },
          ],
          hint: "Look for be, have got, habit words, and now/look.",
        }],
      },
      {
        id: "en-w10-d1-t2", subjectId: "english", title: "have got", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w10-d1-t2-s1", kind: "question",
          prompt: "They ___ got two bikes.",
          hint: "Subject they → have.",
          options: [
            { id: "a", label: "has", isCorrect: false },
            { id: "b", label: "have", isCorrect: true },
            { id: "c", label: "are", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w10-d1-t3", subjectId: "english", title: "Reading comprehension", mode: "platform", order: 3, total: 4, estMinutes: 4,
        prompt: "Read and choose the correct answer.",
        steps: [{
          id: "en-w10-d1-t3-s1", kind: "question",
          prompt: "Sally has got a new bike. She rides it on Sundays, but today she is walking to school because it is raining.\n\nWhy is Sally walking today?",
          hint: "Find the sentence with because.",
          options: [
            { id: "a", label: "She has no bike", isCorrect: false },
            { id: "b", label: "It is raining", isCorrect: true },
            { id: "c", label: "It is Sunday", isCorrect: false },
            { id: "d", label: "She is tired", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w10-d1-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w10-d1-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: U S E E C B A.",
          gaps: [{ label: "Word:", accepted: ["because"] }],
          hint: "A word that gives a reason. Seven letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 10, day: 2, label: "English · W10 · Day 2 (Tue) · 25.08 · writing",
    tasks: [
      {
        id: "en-w10-d2-t1", subjectId: "english", title: "Capital letters and punctuation", mode: "platform", order: 1, total: 3, estMinutes: 6,
        prompt: "Add the missing marks and capital letters.",
        steps: [{
          id: "en-w10-d2-t1-s1", kind: "punctuation",
          prompt: "Fix capital letters and punctuation in the message.",
          words: "hi tom i am in london now i like english and history what is your favourite subject".split(" "),
          expectedMarks: ["","!","","","","",".","","","","",".","","","","","?"],
          expectedCapitals: [0, 1, 2, 5, 7, 9, 11, 12],
          hint: "Remember names, I, cities and school subjects.",
        }],
      },
      {
        id: "en-w10-d2-t2", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w10-d2-t2-s1", kind: "gapinput",
          prompt: "Find the hidden word in: MUSICARTHEHISTORYPE.",
          gaps: [{ label: "Word:", accepted: ["history"] }],
          hint: "A school subject about the past.",
        }],
      },
      {
        id: "en-w10-d2-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nHi Alex, I am at my cousin's house this week. The house is big, and my room is next to the garden. In the morning, we usually have breakfast at eight o'clock. Today we are visiting a museum because my cousin likes History. Yesterday we walked in the park and played basketball. I took some photos and painted a small picture in my notebook. What are you doing this week? Best wishes, Nick\n\n" +
          "Mini-tasks:\n1. Underline 3 Present Simple forms.\n2. Circle 3 Present Continuous forms or time words.\n3. Write a short answer to Nick in 3-4 sentences.",
      },
    ],
  },
  {
    subject: "english", week: 10, day: 3, label: "English · W10 · Day 3 (Wed) · 26.08",
    tasks: [
      {
        id: "en-w10-d3-t1", subjectId: "english", title: "Mixed vocabulary", mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w10-d3-t1-s1", kind: "sort",
          prompt: "Sort the words by topic.",
          columns: ["School", "Food", "House", "Animals"],
          chips: [
            { text: "pencil", column: 0 }, { text: "Maths", column: 0 },
            { text: "carrot", column: 1 }, { text: "milk", column: 1 },
            { text: "bedroom", column: 2 }, { text: "sofa", column: 2 },
            { text: "parrot", column: 3 }, { text: "rabbit", column: 3 },
          ],
          hint: "Think about where or when you use each word.",
        }],
      },
      {
        id: "en-w10-d3-t2", subjectId: "english", title: "True or False", mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Read the text and choose True or False.",
        steps: [{
          id: "en-w10-d3-t2-s1", kind: "question",
          prompt: "Mark gets up at nine on Saturdays. In the morning, he goes to the park. In the evening, he watches TV and goes to bed at ten.\n\nStatement: Mark goes to the park in the evening.",
          hint: "Find the sentence in the text that gives the answer.",
          options: [
            { id: "a", label: "True", isCorrect: false },
            { id: "b", label: "False", isCorrect: true },
          ],
        }],
      },
      {
        id: "en-w10-d3-t3", subjectId: "english", title: "Word order with but", mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Put the cards in the correct order.",
        steps: [{
          id: "en-w10-d3-t3-s1", kind: "order",
          prompt: "The words are mixed. Build the sentence.",
          cards: ["She", "does", "not", "like", "fish", "but", "she", "likes", "chicken", "."],
          acceptedOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
          hint: "Two ideas joined with but.",
        }],
      },
      {
        id: "en-w10-d3-t4", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w10-d3-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: U U S M M E.",
          gaps: [{ label: "Word:", accepted: ["museum"] }],
          hint: "A place with old or interesting things. Six letters.",
        }],
      },
    ],
  },
  {
    subject: "english", week: 10, day: 4, label: "English · W10 · Day 4 (Thu) · 27.08 · writing",
    tasks: [
      {
        id: "en-w10-d4-t1", subjectId: "english", title: "Find and correct mistakes", mode: "platform", order: 1, total: 3, estMinutes: 6,
        prompt: "There are mistakes in the text. Tap a wrong word and type the correct one.",
        steps: [{
          id: "en-w10-d4-t1-s1", kind: "proofread",
          prompt: "Find and correct the mistakes (capitals and verb forms).",
          proofWords: "my friend kate live in london she like music but she doesn't likes maths yesterday we played tennis and watched a film".split(" "),
          proofFixes: [
            { index: 0, accepted: ["My"] },
            { index: 2, accepted: ["Kate"] },
            { index: 3, accepted: ["lives"] },
            { index: 5, accepted: ["London"] },
            { index: 7, accepted: ["likes"] },
            { index: 12, accepted: ["like"] },
            { index: 13, accepted: ["Maths"] },
            { index: 14, accepted: ["Yesterday"] },
          ],
          hint: "Check capital letters, -s in Present Simple, and doesn't + verb.",
        }],
      },
      {
        id: "en-w10-d4-t2", subjectId: "english", title: "Warm-up: anagram", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w10-d4-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: R R M M G A A.",
          gaps: [{ label: "Word:", accepted: ["grammar"] }],
          hint: "Rules of a language. Seven letters.",
        }],
      },
      {
        id: "en-w10-d4-t3", subjectId: "english", title: "Письменная работа", mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nMy English notebook is full of small stories now. I wrote about my family, my room, animals, food and school. Some tasks were easy, but some tasks made me think carefully. I learned to check capital letters, full stops and question marks. I also practised verbs in Present Simple, Present Continuous and Past Simple. Yesterday I looked through my old pages and noticed fewer mistakes. I am proud of my work because I can write more confidently in English.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline one example of Present Simple, Present Continuous and Past Simple.\n3. Write 4 sentences about what you can do better now.",
      },
    ],
  },
  {
    subject: "english", week: 10, day: 5, label: "English · W10 · Day 5 (Fri) · 28.08 · listening",
    tasks: [
      {
        id: "en-w10-d5-t1", subjectId: "english", title: "Reading comprehension", mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Read and choose the correct answer.",
        steps: [{
          id: "en-w10-d5-t1-s1", kind: "question",
          prompt: "Lena is writing a letter to her English friend. She tells her about school, her family and her favourite day. She also writes that yesterday she visited a museum and painted a picture there.\n\nWhat did Lena do yesterday?",
          hint: "Look for the word yesterday.",
          options: [
            { id: "a", label: "visited a museum", isCorrect: true },
            { id: "b", label: "played soccer", isCorrect: false },
            { id: "c", label: "cooked dinner", isCorrect: false },
            { id: "d", label: "rode a bike", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w10-d5-t2", subjectId: "english", title: "Warm-up: hidden word", mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Find the hidden word and type it.",
        steps: [{
          id: "en-w10-d5-t2-s1", kind: "gapinput",
          prompt: "Find the hidden word in: EMAILLETTERCARD.",
          gaps: [{ label: "Word:", accepted: ["letter"] }],
          hint: "You write it to a friend.",
        }],
      },
      {
        id: "en-w10-d5-t3", subjectId: "english", title: "Listening (final)", mode: "platform", order: 3, total: 3, estMinutes: 8,
        prompt: "Listen to the text (max 2 times), then answer the questions.",
        steps: [{
          id: "en-w10-d5-t3-s1", kind: "listening",
          prompt: "Press «Listen». You can listen up to 2 times. Then answer the questions.",
          listenLimit: 2,
          listenQuestions: [
            { q: "How often did the speaker practise English?", options: ["every weekday", "on Sundays", "once a week"], correct: "every weekday" },
            { q: "What did the speaker read?", options: ["long books", "short texts", "letters"], correct: "short texts" },
            { q: "What can the speaker do now?", options: ["check work carefully", "speak French", "draw maps"], correct: "check work carefully" },
            { q: "What did the speaker learn? (type your answer)", accepted: ["new words", "words", "learned new words"] },
          ],
          hint: "Listen for what the speaker practised and learned.",
        }],
      },
    ],
  },
];


















/** Все задания недель 2–10 (плоский список). */
export function weeks2to10AllTasks(): TaskContent[] {
  return WEEKS_2_10.flatMap((d) => d.tasks);
}

/** Найти задание недель 2–10 по id. */
export function weeks2to10TaskById(id: string): TaskContent | null {
  return weeks2to10AllTasks().find((t) => t.id === id) ?? null;
}
