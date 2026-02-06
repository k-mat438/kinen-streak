export const en = {
  // Home Screen
  home: {
    daysSmokeFree: 'days smoke-free',
    newStartToday: 'New start today',
    notRecordedToday: "You haven't recorded today",
    smokeFreeToday: 'Smoke-free today',
    relapseToday: 'Relapse today',
    recordedSmokeFree: 'Recorded: Smoke-free today',
    recordedRelapse: 'Recorded: Relapse today',
    recorded: 'Recorded',
    changeToSmokeFree: 'Change to smoke-free',
    changeToRelapse: 'Change to relapse',
    bestStreak: 'Best streak',
    totalSmokeFree: 'Total smoke-free',
    relapses: 'Relapses',
    dayResetsAt: 'Day resets at',
    motivationText: 'Current streak is built one day at a time',
    changeRecordTitle: 'Change record?',
    changeRecordMessage:
      'You recorded a relapse today. Are you sure you want to change this?',
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

  // History Screen
  history: {
    title: 'History',
    noRecords: 'No records yet',
    startTracking: 'Start tracking from the home screen',
    smokeFree: 'Smoke-free',
    relapse: 'Relapse',
  },

  // Settings Screen
  settings: {
    title: 'Settings',
    dayBoundary: 'Day Boundary',
    dayResetsAt: 'Day resets at',
    dayBoundaryHint:
      "Set when your \"day\" starts. Useful if you're often awake past midnight.",
    changeBoundaryTitle: 'Change day boundary?',
    changeBoundaryMessage: 'This may affect how your current day is calculated.',
    data: 'Data',
    exportData: 'Export data (JSON)',
    resetAllData: 'Reset all data',
    resetTitle: 'Reset all data?',
    resetMessage:
      'This will delete all your records and settings. This cannot be undone.',
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
