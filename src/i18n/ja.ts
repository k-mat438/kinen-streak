import { Translations } from './en';

export const ja: Translations = {
  // Home Screen
  home: {
    welcomeTitle: '禁煙を始めますか？',
    welcomeSubtitle: 'どれだけタバコなしで過ごせるか、チャレンジしよう。',
    startChallenge: 'スタート',
    days: '日',
    timerHours: '時間',
    timerMinutes: '分',
    timerSeconds: '秒',
    bestStreak: '最長',
    totalCleanDays: '累計',
    relapses: '再発',
    iSmoked: '吸ってしまった',
    motivationText: '1秒1秒が積み重なる',
    goalProgress: '目標',
    daysLeft: '日 残り',
    goalReached: '目標達成！',
  },

  // Start Challenge Modal
  start: {
    reasonTitle: '禁煙したい理由は？',
    reasonSubtitle: 'モチベーションを選ぼう',
    health: '健康のため',
    money: '節約したい',
    family: '家族のため',
    smell: 'ニオイが嫌',
    freedom: '自由になりたい',
    fitness: '体力向上',
    other: 'その他',
    goalTitle: '目標を設定',
    goalSubtitle: '何日間チャレンジする？',
    days: '日',
    letsGo: 'スタート！',
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

  // Recovery Action Modal
  recovery: {
    title: '次に何をする？',
    subtitle: '気持ちを切り替えよう',
    water: '水を飲む',
    walk: '散歩する',
    breathe: '深呼吸',
    call: '誰かに電話',
    chew: 'ガムを噛む',
    other: '別のこと',
    skip: 'スキップ',
    restart: '再スタート',
  },

  // History Screen
  history: {
    title: '履歴',
    noRelapses: 'まだ再発していません',
    keepGoing: 'この調子！',
    relapse: '再発',
    streakWas: '継続日数',
    days: '日',
  },

  // Settings Screen
  settings: {
    title: '設定',
    data: 'データ',
    exportData: 'データをエクスポート (JSON)',
    resetAllData: 'すべてのデータを削除',
    resetTitle: 'すべてのデータを削除しますか？',
    resetMessage:
      'すべての記録が削除され、最初からやり直しになります。この操作は取り消せません。',
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
