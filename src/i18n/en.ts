export const en = {
  // Home Screen
  home: {
    welcomeTitle: 'Ready to quit smoking?',
    welcomeSubtitle: 'Start your journey. Track how long you can go without a cigarette.',
    startChallenge: 'Start Now',
    days: 'days',
    timerHours: 'hrs',
    timerMinutes: 'min',
    timerSeconds: 'sec',
    bestStreak: 'Best',
    totalCleanDays: 'Total',
    relapses: 'Relapses',
    iSmoked: 'I smoked',
    motivationText: 'Every second counts',
    goalProgress: 'Goal',
    daysLeft: 'days left',
    goalReached: 'Goal reached!',
  },

  // Start Challenge Modal
  start: {
    reasonTitle: 'Why do you want to quit?',
    reasonSubtitle: 'Choose your motivation',
    health: 'Health',
    money: 'Save money',
    family: 'Family',
    smell: 'Smell better',
    freedom: 'Freedom',
    fitness: 'Fitness',
    other: 'Other',
    goalTitle: 'Set your goal',
    goalSubtitle: 'How many days?',
    days: 'days',
    letsGo: "Let's go!",
  },

  // Relapse Trigger Modal
  trigger: {
    title: 'What triggered it?',
    optional: '(optional)',
    stress: 'Stress',
    social: 'Social / Drinking',
    habit: 'Habit',
    urge: 'Urge',
    work: 'Work',
    boredom: 'Boredom',
    other: 'Other',
    skip: 'Skip',
    whatHappened: 'What happened?',
    back: 'Back',
    done: 'Done',
  },

  // Recovery Action Modal
  recovery: {
    title: "What will you do now?",
    subtitle: 'Pick one to reset stronger',
    water: 'Drink water',
    walk: 'Take a walk',
    breathe: 'Deep breaths',
    call: 'Call someone',
    chew: 'Chew gum',
    other: 'Something else',
    skip: 'Skip',
    restart: 'Restart',
  },

  // History Screen
  history: {
    title: 'History',
    noRelapses: 'No relapses yet',
    keepGoing: 'Keep going!',
    relapse: 'Relapse',
    streakWas: 'streak was',
    days: 'days',
  },

  // Settings Screen
  settings: {
    title: 'Settings',
    data: 'Data',
    exportData: 'Export data (JSON)',
    resetAllData: 'Reset all data',
    resetTitle: 'Reset all data?',
    resetMessage:
      'This will delete all your records and start fresh. This cannot be undone.',
    resetConfirm: 'Reset',
    dataReset: 'Data reset',
    dataCleared: 'All data has been cleared.',
    exportFailed: 'Export failed',
    exportFailedMessage: 'Could not export data',
    about: 'About',
    language: 'Language',
    languageSelect: 'Select language',
  },

  // Common
  common: {
    cancel: 'Cancel',
    change: 'Change',
    done: 'Done',
  },

  // Navigation
  nav: {
    home: 'Home',
    history: 'History',
    settings: 'Settings',
  },
};

export type Translations = typeof en;
