import { Translations } from './en';

export const ja: Translations = {
  // Home Screen
  home: {
    daysSmokeFree: '日間 禁煙継続',
    newStartToday: '今日から再スタート',
    notRecordedToday: '今日はまだ記録していません',
    smokeFreeToday: '今日吸っていない',
    relapseToday: '今日吸った',
    recordedSmokeFree: '記録済み：今日は禁煙成功',
    recordedRelapse: '記録済み：今日は再発',
    recorded: '記録済み',
    changeToSmokeFree: '禁煙成功に変更',
    changeToRelapse: '再発に変更',
    bestStreak: '最長記録',
    totalSmokeFree: '累計禁煙日数',
    relapses: '再発回数',
    dayResetsAt: '日付の切り替え',
    motivationText: '1日1日の積み重ねが記録になる',
    changeRecordTitle: '記録を変更しますか？',
    changeRecordMessage:
      '今日は再発と記録されています。本当に変更しますか？',
  },

  // Relapse Trigger Modal
  trigger: {
    title: 'きっかけは？',
    optional: '（任意）',
    stress: 'ストレス',
    social: '飲み会・付き合い',
    habit: '習慣',
    urge: '衝動',
    work: '仕事',
    boredom: '暇',
    other: 'その他',
    skip: 'スキップ',
    whatHappened: '何があった？',
    back: '戻る',
    done: '完了',
  },

  // History Screen
  history: {
    title: '履歴',
    noRecords: '記録がありません',
    startTracking: 'ホーム画面から記録を始めましょう',
    smokeFree: '禁煙成功',
    relapse: '再発',
  },

  // Settings Screen
  settings: {
    title: '設定',
    dayBoundary: '1日の区切り',
    dayResetsAt: '日付の切り替え時刻',
    dayBoundaryHint:
      '「1日」の開始時刻を設定します。深夜まで起きていることが多い方に便利です。',
    changeBoundaryTitle: '区切り時刻を変更しますか？',
    changeBoundaryMessage: '今日の計算に影響する場合があります。',
    data: 'データ',
    exportData: 'データをエクスポート (JSON)',
    resetAllData: 'すべてのデータを削除',
    resetTitle: 'すべてのデータを削除しますか？',
    resetMessage:
      'すべての記録と設定が削除されます。この操作は取り消せません。',
    resetConfirm: '削除',
    dataReset: 'データ削除完了',
    dataCleared: 'すべてのデータが削除されました。',
    exportFailed: 'エクスポート失敗',
    exportFailedMessage: 'データをエクスポートできませんでした',
    about: 'アプリについて',
    language: '言語',
    languageSelect: '言語を選択',
  },

  // Common
  common: {
    cancel: 'キャンセル',
    change: '変更',
    done: '完了',
  },

  // Navigation
  nav: {
    home: 'ホーム',
    history: '履歴',
    settings: '設定',
  },
};
