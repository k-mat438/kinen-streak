import { DonationCategory, SelfPenaltyTask } from '../types';

export interface DonationLink {
  category: DonationCategory;
  name: string;
  nameJa: string;
  url: string;
  description: string;
  descriptionJa: string;
}

export const DONATION_LINKS: DonationLink[] = [
  {
    category: 'animal',
    name: 'WWF Japan',
    nameJa: 'WWFジャパン',
    url: 'https://www.wwf.or.jp/donate/',
    description: 'Wildlife conservation',
    descriptionJa: '野生動物の保護',
  },
  {
    category: 'education',
    name: 'Room to Read',
    nameJa: 'ルーム・トゥ・リード',
    url: 'https://japan.roomtoread.org/donate/',
    description: 'Education for children',
    descriptionJa: '子どもたちへの教育支援',
  },
  {
    category: 'environment',
    name: 'Greenpeace Japan',
    nameJa: 'グリーンピース・ジャパン',
    url: 'https://www.greenpeace.org/japan/donate/',
    description: 'Environmental protection',
    descriptionJa: '環境保護活動',
  },
  {
    category: 'health',
    name: 'Doctors Without Borders',
    nameJa: '国境なき医師団',
    url: 'https://www.msf.or.jp/donate/',
    description: 'Medical aid worldwide',
    descriptionJa: '世界中の医療支援',
  },
  {
    category: 'disaster',
    name: 'Japanese Red Cross',
    nameJa: '日本赤十字社',
    url: 'https://www.jrc.or.jp/donate/',
    description: 'Disaster relief',
    descriptionJa: '災害救援活動',
  },
];

export interface SelfPenaltyInfo {
  task: SelfPenaltyTask;
  name: string;
  nameJa: string;
  defaultAmount: string;
  defaultAmountJa: string;
}

export const SELF_PENALTY_INFO: SelfPenaltyInfo[] = [
  {
    task: 'exercise',
    name: 'Go for a run',
    nameJa: 'ランニングする',
    defaultAmount: '10 minutes',
    defaultAmountJa: '10分間',
  },
  {
    task: 'cleaning',
    name: 'Clean a room',
    nameJa: '部屋を掃除する',
    defaultAmount: '15 minutes',
    defaultAmountJa: '15分間',
  },
  {
    task: 'diary',
    name: 'Write in journal',
    nameJa: '日記を書く',
    defaultAmount: '1 page',
    defaultAmountJa: '1ページ',
  },
  {
    task: 'meditation',
    name: 'Meditate',
    nameJa: '瞑想する',
    defaultAmount: '10 minutes',
    defaultAmountJa: '10分間',
  },
  {
    task: 'pushups',
    name: 'Do push-ups',
    nameJa: '腕立て伏せ',
    defaultAmount: '20 reps',
    defaultAmountJa: '20回',
  },
  {
    task: 'custom',
    name: 'Custom task',
    nameJa: 'カスタムタスク',
    defaultAmount: '',
    defaultAmountJa: '',
  },
];

export function getDonationLink(category: DonationCategory): DonationLink | undefined {
  return DONATION_LINKS.find((link) => link.category === category);
}

export function getSelfPenaltyInfo(task: SelfPenaltyTask): SelfPenaltyInfo | undefined {
  return SELF_PENALTY_INFO.find((info) => info.task === task);
}

// Coping strategies to show in urge intervention modal
export interface CopingStrategy {
  key: string;
  name: string;
  nameJa: string;
}

export const COPING_STRATEGIES: CopingStrategy[] = [
  { key: 'breathe', name: 'Take deep breaths', nameJa: '深呼吸をする' },
  { key: 'water', name: 'Drink water', nameJa: '水を飲む' },
  { key: 'walk', name: 'Take a short walk', nameJa: '少し散歩する' },
  { key: 'wait', name: 'Wait 5 minutes', nameJa: '5分待つ' },
  { key: 'distract', name: 'Do something else', nameJa: '別のことをする' },
];
