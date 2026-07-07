import type { TaskContent, DailyTask, SubjectId } from "@/types/domain";

/**
 * Контент недели 1 (русский + английский), перенесён из методичек.
 * Организован по дням. Каждый день — массив заданий (TaskContent).
 * Используется и для моков, и для страницы-каталога /preview.
 *
 * day: 1..5 (Пн..Пт). Соответствие раннеров механикам:
 *  punctuation, order, wordfix, gapinput, sort, fields, question, worksheet, audio.
 */

export interface DayPlan {
  subject: SubjectId;
  day: number;
  label: string; // напр. "Русский · День 1 (Пн)"
  tasks: TaskContent[];
}

// helper to make a DailyTask summary from a TaskContent
export function toDailyTask(t: TaskContent): DailyTask {
  return {
    id: t.id,
    subjectId: t.subjectId,
    title: t.title,
    mode: t.mode,
    order: t.order,
    estMinutes: t.estMinutes,
    status: "notStarted",
  };
}

const HINT_STATUS = "До 3 попыток. Ответ не раскрывается; после 3-й неудачи — в «Мои доработки».";

export const WEEK1: DayPlan[] = [
  // ─────────────────────────── РУССКИЙ ───────────────────────────
  {
    subject: "russian", day: 1, label: "Русский · День 1 (Пн) · 22.06",
    tasks: [
      {
        id: "ru-w1-d1-t1", subjectId: "russian", title: "Пунктуация и заглавные буквы",
        mode: "platform", order: 1, total: 4, estMinutes: 6,
        prompt: "Расставь нужные знаки и сделай заглавными первые буквы нужных слов.",
        steps: [{
          id: "ru-w1-d1-t1-s1", kind: "punctuation",
          prompt: "В тексте потерялись знаки препинания и заглавные буквы.",
          words: "после тренировки артём долго искал свой синий рюкзак он оставил его у двери спортивного зала где же он мог быть".split(" "),
          expectedMarks: ["","","","","","","",".","","","","","","",".","","","","","?"],
          expectedCapitals: [0,2,8,15],
          hint: "Найди вопросительное предложение. Имена людей пишутся с заглавной буквы.",
        }],
      },
      {
        id: "ru-w1-d1-t2", subjectId: "russian", title: "Порядок предложений",
        mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Поставь карточки в таком порядке, чтобы получился связный текст.",
        steps: [{
          id: "ru-w1-d1-t2-s1", kind: "order",
          prompt: "Карточки перепутались. Собери связный текст.",
          cards: [
            "Вскоре она заметила под лавкой мокрого щенка.",
            "После дождя Лера вышла во двор.",
            "Девочка принесла ему тёплую салфетку.",
            "Сначала щенок боялся подходить к ней.",
          ],
          // верный порядок исходных индексов: 2→1→4→3 = [1,0,3,2]
          acceptedOrders: [[1, 0, 3, 2]],
          hint: "Ищи, с чего началось событие, а что произошло потом.",
        }],
      },
      {
        id: "ru-w1-d1-t3", subjectId: "russian", title: "Грамматическая форма",
        mode: "platform", order: 3, total: 4, estMinutes: 4,
        prompt: "Выбери нужную форму из списка.",
        steps: [{
          id: "ru-w1-d1-t3-s1", kind: "question",
          prompt: "Я подошёл к (старая берёза) и увидел на её ветке синицу.",
          hint: "Задай вопрос: подошёл к чему?",
          options: [
            { id: "a", label: "старой берёзе", isCorrect: true },
            { id: "b", label: "старая берёза", isCorrect: false },
            { id: "c", label: "старую берёзу", isCorrect: false },
            { id: "d", label: "старым берёзом", isCorrect: false },
          ],
        }],
      },
      {
        id: "ru-w1-d1-t4", subjectId: "russian", title: "Языковая разминка: анаграмма",
        mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Собери слово из букв: К А Т Ч О.",
        steps: [{
          id: "ru-w1-d1-t4-s1", kind: "gapinput",
          prompt: "Собери слово из букв: К А Т Ч О.",
          gaps: [{ label: "Слово:", accepted: ["точка"] }],
          hint: "Этот знак ставят в конце спокойного предложения.",
        }],
      },
    ],
  },
  {
    subject: "russian", day: 2, label: "Русский · День 2 (Вт) · 23.06 · письмо",
    tasks: [
      {
        id: "ru-w1-d2-t1", subjectId: "russian", title: "Слово по смыслу",
        mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Найди неподходящее слово и выбери подходящую замену.",
        steps: [{
          id: "ru-w1-d2-t1-s1", kind: "wordfix",
          prompt: "В предложении есть слово, которое не подходит по смыслу. Нажми на него, чтобы исправить.",
          sentenceWords: "В библиотеке ребята тихо открыли зонтики и начали читать рассказ".split(" "),
          wrongWordIndex: 4, // "зонтики"
          replacements: ["книги", "сапоги", "чашки", "самолёты"],
          correctReplacement: "книги",
          hint: "Подумай, что открывают, когда читают.",
        }],
      },
      {
        id: "ru-w1-d2-t2", subjectId: "russian", title: "Языковая разминка: анаграмма",
        mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Собери слово из букв: В О Л С О.",
        steps: [{
          id: "ru-w1-d2-t2-s1", kind: "gapinput",
          prompt: "Собери слово из букв: В О Л С О.",
          gaps: [{ label: "Слово:", accepted: ["слово"] }],
          hint: "Предложение состоит из них.",
        }],
      },
      {
        id: "ru-w1-d2-t3", subjectId: "russian", title: "Списывание и задания",
        mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nПосле тренировки Артём долго искал свой синий рюкзак. Он оставил его у двери спортивного зала, а потом забыл об этом. В раздевалке уже погасили свет, и коридор стал почти пустым. Мальчик заглянул под скамейку, проверил шкафчик и тихо вздохнул. К счастью, рюкзак нашла учительница Марина Сергеевна. Она заметила его возле окна и передала дежурному. На следующий день Артём поблагодарил учительницу и пообещал быть внимательнее. С тех пор он всегда проверяет свои вещи перед уходом.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни все местоимения.\n3. Выпиши два прилагательных и определи их род, число и падеж.",
      },
    ],
  },
  {
    subject: "russian", day: 3, label: "Русский · День 3 (Ср) · 24.06",
    tasks: [
      {
        id: "ru-w1-d3-t1", subjectId: "russian", title: "Орфограмма с пропуском",
        mode: "platform", order: 1, total: 4, estMinutes: 5,
        prompt: "Впиши пропущенные буквы. Вариантов ответа нет.",
        steps: [{
          id: "ru-w1-d3-t1-s1", kind: "gapinput",
          prompt: "В словах пропущены буквы. Впиши нужную букву.",
          gaps: [
            { label: "л_сной", accepted: ["е"] },
            { label: "тр_пинка", accepted: ["о"] },
            { label: "гр_зовой", accepted: ["о"] },
            { label: "зв_рёк", accepted: ["е"] },
          ],
          hint: "Подбери слово, где пропущенная гласная под ударением.",
        }],
      },
      {
        id: "ru-w1-d3-t2", subjectId: "russian", title: "Пунктуация и заглавные буквы",
        mode: "platform", order: 2, total: 4, estMinutes: 5,
        prompt: "Расставь нужные знаки и сделай заглавными первые буквы нужных слов.",
        steps: [{
          id: "ru-w1-d3-t2-s1", kind: "punctuation",
          prompt: "В тексте потерялись знаки препинания и заглавные буквы.",
          words: "когда начался сильный дождь мы спрятались под высоким клёном а маша раскрыла зелёный зонт".split(" "),
          expectedMarks: ["","","",",","","","","",",","","","","","."],
          expectedCapitals: [0,10],
          hint: "В начале предложения нужна заглавная буква. Перед «а» часто нужна запятая.",
        }],
      },
      {
        id: "ru-w1-d3-t3", subjectId: "russian", title: "Проверочное слово",
        mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Впиши проверочное слово так, чтобы нужный звук слышался ясно.",
        steps: [{
          id: "ru-w1-d3-t3-s1", kind: "gapinput",
          prompt: "Подбери и впиши проверочное слово (родственное, где звук слышится ясно).",
          gaps: [
            { label: "с_ды", accepted: ["сад", "садик"] },
            { label: "з_нты", accepted: ["зонт", "зонтик"] },
            { label: "моро_", accepted: ["морозный", "морозы"] },
            { label: "зв_нок", accepted: ["звонкий", "звон"] },
          ],
          hint: "Проверочное слово должно быть родственным и помогать услышать нужный звук.",
        }],
      },
      {
        id: "ru-w1-d3-t4", subjectId: "russian", title: "Языковая разминка: загадка",
        mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Отгадай слово: знак в конце вопроса.",
        steps: [{
          id: "ru-w1-d3-t4-s1", kind: "gapinput",
          prompt: "Отгадай слово: знак в конце вопроса.",
          gaps: [{ label: "Ответ:", accepted: ["вопросительный знак"] }],
          hint: "Он похож на крючок с точкой.",
        }],
      },
    ],
  },
  {
    subject: "russian", day: 4, label: "Русский · День 4 (Чт) · 25.06 · письмо",
    tasks: [
      {
        id: "ru-w1-d4-t1", subjectId: "russian", title: "Сортировка слов",
        mode: "platform", order: 1, total: 3, estMinutes: 6,
        prompt: "Перетащи каждое слово в подходящую колонку.",
        steps: [{
          id: "ru-w1-d4-t1-s1", kind: "sort",
          prompt: "Распредели слова по группам.",
          columns: ["Проверяемая гласная", "Парная согласная", "Непроизносимая согласная"],
          chips: [
            { text: "вода", column: 0 }, { text: "поля", column: 0 }, { text: "гнездо", column: 0 },
            { text: "гриб", column: 1 }, { text: "дуб", column: 1 }, { text: "мороз", column: 1 },
            { text: "сердце", column: 2 }, { text: "поздний", column: 2 }, { text: "местный", column: 2 },
          ],
          hint: "Сначала определи, что именно нужно проверять: гласную, парную или непроизносимую согласную.",
        }],
      },
      {
        id: "ru-w1-d4-t2", subjectId: "russian", title: "Языковая разминка: анаграмма",
        mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Собери слово из букв: Т К С Т Е.",
        steps: [{
          id: "ru-w1-d4-t2-s1", kind: "gapinput",
          prompt: "Собери слово из букв: Т К С Т Е.",
          gaps: [{ label: "Слово:", accepted: ["текст"] }],
          hint: "Это несколько предложений, связанных по смыслу.",
        }],
      },
      {
        id: "ru-w1-d4-t3", subjectId: "russian", title: "Списывание и задания",
        mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Спиши текст аккуратно. Затем выполни мини-задания. После выполнения загрузи фото страницы.\n\n" +
          "Текст для списывания:\nВ тёплый вечер мы спустились к узкой реке. Над водой кружились быстрые ласточки. Их тени мелькали на гладкой поверхности, будто маленькие стрелы. У старого моста росла высокая ива. Её длинные ветви почти касались воды. Дедушка рассказал нам, что весной река выходит из берегов. Тогда тропинка у моста исчезает под мутной водой. Мы долго слушали его рассказ и смотрели на тихое течение.\n\n" +
          "Мини-задания:\n1. Озаглавь текст.\n2. Подчеркни существительные женского рода.\n3. Выпиши два словосочетания «прилагательное + существительное».",
      },
    ],
  },
  {
    subject: "russian", day: 5, label: "Русский · День 5 (Пт) · 26.06 · аудио",
    tasks: [
      {
        id: "ru-w1-d5-t1", subjectId: "russian", title: "Словосочетание",
        mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Выбери главное слово, зависимое слово и вопрос от главного к зависимому.",
        steps: [{
          id: "ru-w1-d5-t1-s1", kind: "fields",
          prompt: "Пара слов: тихая улица. Разбери словосочетание.",
          fieldsSubject: "тихая улица",
          fields: [
            { label: "Главное слово", accepted: ["улица"] },
            { label: "Зависимое слово", accepted: ["тихая"] },
            { label: "Вопрос", accepted: ["какая", "какая?"] },
          ],
          hint: "Вопрос задаём от главного слова к зависимому.",
        }],
      },
      {
        id: "ru-w1-d5-t2", subjectId: "russian", title: "Языковая разминка: загадка",
        mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Она бывает маленькой, заглавной, печатной и письменной.",
        steps: [{
          id: "ru-w1-d5-t2-s1", kind: "gapinput",
          prompt: "Она бывает маленькой, заглавной, печатной и письменной.",
          gaps: [{ label: "Ответ:", accepted: ["буква"] }],
          hint: "Из них состоят слова.",
        }],
      },
      {
        id: "ru-w1-d5-t3", subjectId: "russian", title: "Аудиодиктант: перо во дворе",
        mode: "platform", order: 3, total: 3, estMinutes: 10,
        prompt: "Нажми «Слушать». Запиши текст в тетради. Можно прослушать не больше двух раз. После записи загрузи фото.",
        steps: [{
          id: "ru-w1-d5-t3-s1", kind: "audio",
          prompt: "Аудиодиктант. Пауза и перемотка запрещены. Максимум 2 прослушивания.",
          listenLimit: 2,
          // audioUrl добавим, когда будет озвучка
          hint: "После записи проверь вопросительное предложение и имена собственные.",
        }],
      },
    ],
  },

  // ─────────────────────────── АНГЛИЙСКИЙ ───────────────────────────
  {
    subject: "english", day: 1, label: "English · Day 1 (Mon) · 22.06",
    tasks: [
      {
        id: "en-w1-d1-t1", subjectId: "english", title: "Vocabulary: school things",
        mode: "platform", order: 1, total: 4, estMinutes: 4,
        prompt: "Type the English word or phrase.",
        steps: [{
          id: "en-w1-d1-t1-s1", kind: "gapinput",
          prompt: "You see a Russian word. Type the English word.",
          gaps: [{ label: "портфель →", accepted: ["schoolbag"] }],
          hint: "Remember the topic of the week. Think of the first sound.",
        }],
      },
      {
        id: "en-w1-d1-t2", subjectId: "english", title: "to be: am/is/are",
        mode: "platform", order: 2, total: 4, estMinutes: 4,
        prompt: "Tap the correct answer.",
        steps: [{
          id: "en-w1-d1-t2-s1", kind: "question",
          prompt: "Eva ___ from Russia.",
          hint: "Look at the subject: I / he / she / they. Then choose the form.",
          options: [
            { id: "a", label: "am", isCorrect: false },
            { id: "b", label: "is", isCorrect: true },
            { id: "c", label: "are", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w1-d1-t3", subjectId: "english", title: "Vocabulary categories",
        mode: "platform", order: 3, total: 4, estMinutes: 5,
        prompt: "Drag each word to the correct column.",
        steps: [{
          id: "en-w1-d1-t3-s1", kind: "sort",
          prompt: "Sort the words by topic.",
          columns: ["School things", "School subjects", "People"],
          chips: [
            { text: "pencil", column: 0 }, { text: "ruler", column: 0 },
            { text: "Music", column: 1 }, { text: "Art", column: 1 },
            { text: "teacher", column: 2 }, { text: "pupil", column: 2 },
          ],
          hint: "Look at the meaning: object, subject or person.",
        }],
      },
      {
        id: "en-w1-d1-t4", subjectId: "english", title: "Warm-up: anagram",
        mode: "platform", order: 4, total: 4, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w1-d1-t4-s1", kind: "gapinput",
          prompt: "Make a word from the letters: S O O L H C.",
          gaps: [{ label: "Word:", accepted: ["school"] }],
          hint: "A place where children learn. Six letters.",
        }],
      },
    ],
  },
  {
    subject: "english", day: 2, label: "English · Day 2 (Tue) · 23.06 · writing",
    tasks: [
      {
        id: "en-w1-d2-t1", subjectId: "english", title: "Capital letters and punctuation",
        mode: "platform", order: 1, total: 3, estMinutes: 6,
        prompt: "Fix capital letters and punctuation.",
        steps: [{
          id: "en-w1-d2-t1-s1", kind: "punctuation",
          prompt: "Some capital letters and punctuation marks are missing.",
          words: "hello i am eva i am in year 4 at school i like english art and pe what about you".split(" "),
          expectedMarks: [",","","",".","","","","","",".","","","",",","","",".","","","?"],
          expectedCapitals: [0,1,3,4,7,11,13,14,16,17],
          hint: "Remember: I, names, countries and school subjects start with capital letters.",
        }],
      },
      {
        id: "en-w1-d2-t2", subjectId: "english", title: "Warm-up: anagram",
        mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in the correct order and type the word.",
        steps: [{
          id: "en-w1-d2-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: P N L I E C.",
          gaps: [{ label: "Word:", accepted: ["pencil"] }],
          hint: "You write or draw with it. Six letters.",
        }],
      },
      {
        id: "en-w1-d2-t3", subjectId: "english", title: "Письменная работа",
        mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly. Then do the mini-tasks under the text. Upload a photo of the whole page.\n\n" +
          "Text to copy:\nHello! My name is Tim. I am ten years old. I am in Year 4 at school. My favourite subjects are English and Art. I have got a blue schoolbag and a green pencil case. In my pencil case, I have got two pens, a pencil and a rubber. After school I often read books and play board games. I like my classroom because it is bright and friendly.\n\n" +
          "Mini-tasks:\n1. Give the text a title.\n2. Underline three school things.\n3. Circle all capital letters that begin names or school subjects.",
      },
    ],
  },
  {
    subject: "english", day: 3, label: "English · Day 3 (Wed) · 24.06",
    tasks: [
      {
        id: "en-w1-d3-t1", subjectId: "english", title: "Phonics: /ai/",
        mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Type the missing letters.",
        steps: [{
          id: "en-w1-d3-t1-s1", kind: "gapinput",
          prompt: "Complete the words with the missing letters.",
          gaps: [
            { label: "l__ght", accepted: ["light", "ig"] },
            { label: "r__ght", accepted: ["right", "ig"] },
            { label: "f__ght", accepted: ["fight", "ig"] },
            { label: "h__gh", accepted: ["high", "i"] },
          ],
          hint: "Say the word quietly. Which letters make this sound?",
        }],
      },
      {
        id: "en-w1-d3-t2", subjectId: "english", title: "Word order",
        mode: "platform", order: 2, total: 3, estMinutes: 4,
        prompt: "Put the cards in the correct order.",
        steps: [{
          id: "en-w1-d3-t2-s1", kind: "order",
          prompt: "The words are mixed. Build the sentence.",
          cards: ["My", "favourite", "subject", "is", "Music", "."],
          acceptedOrders: [[0, 1, 2, 3, 4, 5]],
          hint: "Find the subject first. Then put the verb after it.",
        }],
      },
      {
        id: "en-w1-d3-t3", subjectId: "english", title: "Reading comprehension",
        mode: "platform", order: 3, total: 3, estMinutes: 5,
        prompt: "Read and answer.",
        steps: [{
          id: "en-w1-d3-t3-s1", kind: "question",
          prompt: "Tom is in Year 4. He likes Art and English. His favourite subject is Art.\n\nWhat is Tom's favourite subject?",
          hint: "Find the sentence with the word «favourite».",
          options: [
            { id: "a", label: "English", isCorrect: false },
            { id: "b", label: "Art", isCorrect: true },
            { id: "c", label: "Music", isCorrect: false },
          ],
        }],
      },
    ],
  },
  {
    subject: "english", day: 4, label: "English · Day 4 (Thu) · 25.06 · writing",
    tasks: [
      {
        id: "en-w1-d4-t1", subjectId: "english", title: "Pronouns and possessives",
        mode: "platform", order: 1, total: 3, estMinutes: 5,
        prompt: "Choose the correct word.",
        steps: [{
          id: "en-w1-d4-t1-s1", kind: "question",
          prompt: "This is my sister. ___ name is Kate.",
          hint: "Whose name? It belongs to a girl → she.",
          options: [
            { id: "a", label: "His", isCorrect: false },
            { id: "b", label: "Her", isCorrect: true },
            { id: "c", label: "Their", isCorrect: false },
          ],
        }],
      },
      {
        id: "en-w1-d4-t2", subjectId: "english", title: "Warm-up: hidden word",
        mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Find the hidden word.",
        steps: [{
          id: "en-w1-d4-t2-s1", kind: "gapinput",
          prompt: "Find the hidden school word in: t-r-u-l-e-r-s.",
          gaps: [{ label: "Word:", accepted: ["ruler"] }],
          hint: "You measure with it. It is a long object with numbers.",
        }],
      },
      {
        id: "en-w1-d4-t3", subjectId: "english", title: "Письменная работа",
        mode: "worksheet", order: 3, total: 3, estMinutes: 15,
        prompt:
          "Copy the text neatly and do the mini-tasks. Upload a photo.\n\n" +
          "Text to copy:\nThis is my family. I have got a mother, a father and a little brother. My mother is kind and clever. My father is tall and funny. My brother is six years old. We have got a small dog. Its name is Rex.\n\n" +
          "Mini-tasks:\n1. Underline the adjectives.\n2. Circle the possessive words (my, his, her, its).",
      },
    ],
  },
  {
    subject: "english", day: 5, label: "English · Day 5 (Fri) · 26.06 · audio",
    tasks: [
      {
        id: "en-w1-d5-t1", subjectId: "english", title: "to be: questions",
        mode: "platform", order: 1, total: 3, estMinutes: 4,
        prompt: "Choose the correct answer.",
        steps: [{
          id: "en-w1-d5-t1-s1", kind: "question",
          prompt: "___ you from London?",
          hint: "Question with «you» → use Are.",
          options: [
            { id: "a", label: "Am", isCorrect: false },
            { id: "b", label: "Is", isCorrect: false },
            { id: "c", label: "Are", isCorrect: true },
          ],
        }],
      },
      {
        id: "en-w1-d5-t2", subjectId: "english", title: "Warm-up: anagram",
        mode: "platform", order: 2, total: 3, estMinutes: 3,
        prompt: "Put the letters in order.",
        steps: [{
          id: "en-w1-d5-t2-s1", kind: "gapinput",
          prompt: "Make a word from the letters: A C H E T R E.",
          gaps: [{ label: "Word:", accepted: ["teacher"] }],
          hint: "A person who teaches. Seven letters.",
        }],
      },
      {
        id: "en-w1-d5-t3", subjectId: "english", title: "Listening: dialogue",
        mode: "platform", order: 3, total: 3, estMinutes: 10,
        prompt: "Listen to the dialogue (max 2 times), then answer the questions.",
        steps: [{
          id: "en-w1-d5-t3-s1", kind: "listening",
          prompt: "Press «Listen». You can listen up to 2 times. Then answer 5 questions.",
          listenLimit: 2,
          // audioUrl добавим, когда будет озвучка диалога
          listenQuestions: [
            { q: "What is the girl's name?", options: ["Lucy", "Kate", "Emma"], correct: "Lucy" },
            { q: "What year are they in?", options: ["Year 3", "Year 4", "Year 5"], correct: "Year 4" },
            { q: "What is Lucy's favourite subject?", options: ["Maths", "Art", "PE"], correct: "Art" },
            { q: "What two subjects does Tom like?", accepted: ["maths and pe", "pe and maths", "maths, pe", "maths pe"] },
            { q: "What colour is Lucy's pencil case?", accepted: ["purple"] },
          ],
          hint: "Listen for the names and the words «favourite» and «pencil case».",
        }],
      },
    ],
  },
  {
    subject: "russian", day: 6, label: "Русский · Демо новых раннеров (для проверки)",
    tasks: [
      {
        id: "ru-demo-proofread", subjectId: "russian", title: "Корректура текста",
        mode: "platform", order: 1, total: 2, estMinutes: 5,
        prompt: "Исправь ошибки, не переписывая весь текст заново. Нажми на слово с ошибкой и впиши верный вариант.",
        steps: [{
          id: "ru-demo-proofread-s1", kind: "proofread",
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
        id: "ru-demo-readaloud", subjectId: "russian", title: "Чтение вслух",
        mode: "platform", order: 2, total: 2, estMinutes: 5,
        prompt: "Прочитай текст вслух чётко и не спеша. Нажми «Записать чтение», прочитай, затем отправь запись.",
        steps: [{
          id: "ru-demo-readaloud-s1", kind: "readaloud",
          prompt: "Прочитай вслух и запиши своё чтение.",
          readText: "Тихий вечер опустился на маленький двор. Возле старой скамейки играл рыжий котёнок. Он гонялся за жёлтым листком и весело подпрыгивал.",
          hint: "Читай выразительно, делай паузы на точках.",
        }],
      },
    ],
  },
];

/** Все задания недели 1 одним списком. */
export function week1AllTasks(): TaskContent[] {
  return WEEK1.flatMap((d) => d.tasks);
}

/** Найти задание по id. */
export function week1TaskById(id: string): TaskContent | null {
  return week1AllTasks().find((t) => t.id === id) ?? null;
}
