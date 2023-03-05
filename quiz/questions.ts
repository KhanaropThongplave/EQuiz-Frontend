export const quiz = {
  topic: 'Javascript',
  level: 'Beginner',
  totalQuestions: 4,
  perQuestionScore: 5,
  questions: [
    {
      question:
        'What frontend framework did I use to create this project?',
      choices: ['Node.js', 'Nest.js', 'Next.js', 'Laravel'],
      type: 'MCQs',
      correctAnswer: 'Next.js',
    },
    {
      question:
        'What backend framework did I use to create this project?',
      choices: ['Django', 'Next.js', 'Loopback', 'Nest.js'],
      type: 'MCQs',
      correctAnswer: 'Nest.js',
    },
    {
      question:
        'What database did I use in this project?',
      choices: [
        'MySQL',
        'PostgreSQL',
        'MongoDB',
        'Firebase Firestore',
      ],
      type: 'MCQs',
      correctAnswer: 'PostgreSQL',
    },
    {
      question: 'What framework did I use to create a smart contract?',
      choices: ['Hardhat', 'Ganache', 'Truffle', 'Foundry'],
      type: 'MCQs',
      correctAnswer: 'Hardhat',
    },
    {
      question: 'What is the main programming language for this project?',
      choices: ['JavaScript', 'Python', 'PHP', 'TypeScript'],
      type: 'MCQs',
      correctAnswer: 'TypeScript',
    },
  ],
}