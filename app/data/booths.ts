export type BoothGenre =
  | 'food'
  | 'drink'
  | 'goods'
  | 'rest'
  | 'info'

export type BoothGenreOption = {
  key: BoothGenre | 'all'
  label: string
  icon: string
}

export type Booth = {
  id: string
  name: string
  genre: BoothGenre
  area: string
  description: string
  tags: string[]
  note?: string
  isPlaceholder: boolean
}

export const boothGenreOptions: BoothGenreOption[] = [
  {
    key: 'all',
    label: 'すべて',
    icon: '✨',
  },
  {
    key: 'food',
    label: 'フード',
    icon: '🍽️',
  },
  {
    key: 'drink',
    label: 'ドリンク',
    icon: '🥤',
  },
  {
    key: 'goods',
    label: 'グッズ',
    icon: '🛍️',
  },
  {
    key: 'rest',
    label: '休憩',
    icon: '🪑',
  },
  {
    key: 'info',
    label: '案内',
    icon: 'ℹ️',
  },
]

export const booths: Booth[] = [
  {
    id: 'food-area-a',
    name: 'フードエリアA（仮）',
    genre: 'food',
    area: 'エリア未定',
    description: '食事系の出店を想定した仮データです。',
    tags: ['食事', '昼食', '夕食'],
    note: '公式情報公開後に実データへ差し替え予定',
    isPlaceholder: true,
  },
  {
    id: 'food-area-b',
    name: 'フードエリアB（仮）',
    genre: 'food',
    area: 'エリア未定',
    description: '軽食やスイーツ系の出店を想定した仮データです。',
    tags: ['軽食', 'スイーツ'],
    note: '公式情報公開後に実データへ差し替え予定',
    isPlaceholder: true,
  },
  {
    id: 'drink-station',
    name: 'ドリンク補給スポット（仮）',
    genre: 'drink',
    area: 'エリア未定',
    description: '水分補給に使う場所を想定した仮データです。',
    tags: ['水分補給', '暑さ対策'],
    note: '現地の公式案内に合わせて更新予定',
    isPlaceholder: true,
  },
  {
    id: 'official-goods',
    name: 'グッズ販売エリア（仮）',
    genre: 'goods',
    area: 'エリア未定',
    description: 'グッズ販売場所を想定した仮データです。',
    tags: ['グッズ', '物販'],
    note: '販売時間・場所は公式情報確認後に反映予定',
    isPlaceholder: true,
  },
  {
    id: 'rest-space',
    name: '休憩スポット（仮）',
    genre: 'rest',
    area: 'エリア未定',
    description: '休憩や待ち合わせに使える場所を想定した仮データです。',
    tags: ['休憩', '待ち合わせ'],
    note: '実際の休憩可能エリアは公式案内確認後に更新予定',
    isPlaceholder: true,
  },
  {
    id: 'information',
    name: '案内・インフォメーション（仮）',
    genre: 'info',
    area: 'エリア未定',
    description: '困った時に確認する案内所を想定した仮データです。',
    tags: ['案内', '問い合わせ'],
    note: '公式の会場案内公開後に更新予定',
    isPlaceholder: true,
  },
]