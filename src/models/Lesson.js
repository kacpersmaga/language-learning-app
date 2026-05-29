export const STAGE_TYPES = {
  INTRODUCTION: 'introduction',
  VOCABULARY: 'vocabulary',
  EXAMPLES: 'examples',
  QUIZ: 'quiz',
  SUMMARY: 'summary',
};

export const LESSONS = [
  {
    id: 'lesson_1',
    title: 'Basic Greetings',
    description: 'Learn how to greet people in English',
    icon: '👋',
    difficulty: 'Beginner',
    duration: '10 min',
    stages: [
      {
        id: 'stage_1',
        type: STAGE_TYPES.INTRODUCTION,
        title: 'Introduction',
        content: {
          text: 'Greetings are the first step in any conversation. In English, the way you greet someone depends on the time of day and how formal the situation is.',
          tips: [
            'Use "Hello" or "Hi" in most situations',
            '"Good morning" is used before noon',
            '"Good evening" is used after 6 PM',
          ],
        },
      },
      {
        id: 'stage_2',
        type: STAGE_TYPES.VOCABULARY,
        title: 'Vocabulary',
        content: {
          words: [
            { word: 'hello', translation: 'cześć / dzień dobry', phonetic: '/həˈloʊ/' },
            { word: 'goodbye', translation: 'do widzenia', phonetic: '/ˌɡʊdˈbaɪ/' },
            { word: 'please', translation: 'proszę', phonetic: '/pliːz/' },
            { word: 'thanks', translation: 'dzięki', phonetic: '/θæŋks/' },
          ],
        },
      },
      {
        id: 'stage_3',
        type: STAGE_TYPES.EXAMPLES,
        title: 'Examples',
        content: {
          dialogues: [
            {
              id: 1,
              lines: [
                { speaker: 'A', text: 'Good morning! How are you?' },
                { speaker: 'B', text: 'I am fine, thank you! And you?' },
                { speaker: 'A', text: 'Very well, thanks!' },
              ],
            },
            {
              id: 2,
              lines: [
                { speaker: 'A', text: 'Hi! Nice to meet you.' },
                { speaker: 'B', text: 'Nice to meet you too!' },
              ],
            },
          ],
        },
      },
      {
        id: 'stage_4',
        type: STAGE_TYPES.QUIZ,
        title: 'Quiz',
        content: {
          questions: [
            {
              id: 'q1',
              question: 'What do you say when meeting someone for the first time?',
              options: ['Goodbye', 'Nice to meet you', 'See you later', 'Good night'],
              correctIndex: 1,
            },
            {
              id: 'q2',
              question: 'Which greeting is used in the morning?',
              options: ['Good evening', 'Good night', 'Good morning', 'Goodnight'],
              correctIndex: 2,
            },
            {
              id: 'q3',
              question: 'How do you say "do widzenia" in English?',
              options: ['Hello', 'Please', 'Goodbye', 'Thanks'],
              correctIndex: 2,
            },
            {
              id: 'q4',
              question: 'What is the correct response to "How are you?"',
              options: ['My name is John', 'I am fine, thank you', 'Nice to meet you', 'Good morning'],
              correctIndex: 1,
            },
          ],
        },
      },
      {
        id: 'stage_5',
        type: STAGE_TYPES.SUMMARY,
        title: 'Summary',
        content: {
          points: [
            'You learned 4 key greeting words',
            'You practiced 2 real dialogues',
            'You completed a 4-question quiz',
          ],
          encouragement: "Great job! You're on your way to speaking English!",
        },
      },
    ],
  },
  {
    id: 'lesson_2',
    title: 'Numbers 1-10',
    description: 'Count in English from one to ten',
    icon: '🔢',
    difficulty: 'Beginner',
    duration: '8 min',
    comingSoon: true,
  },
  {
    id: 'lesson_3',
    title: 'Colors',
    description: 'Learn basic color names in English',
    icon: '🎨',
    difficulty: 'Beginner',
    duration: '8 min',
    comingSoon: true,
  },
  {
    id: 'lesson_4',
    title: 'Days of the Week',
    description: 'Learn the days of the week',
    icon: '📅',
    difficulty: 'Beginner',
    duration: '10 min',
    comingSoon: true,
  },
];
