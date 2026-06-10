export type BoothGenre =
  | 'food'
  | 'drink'
  | 'goods'
  | 'experience'
  | 'rest'
  | 'info'

export type BoothArea =
  | 'food-area'
  | 'goods-area'
  | 'event-area'
  | 'support-area'

export type BoothItem = {
  id: number
  name: string
  genre: BoothGenre
  area: BoothArea
  place: string
  openingHours: string
  description: string
  notes?: string
  tags: string[]
  isOfficialInfoConfirmed?: boolean
}

export const boothItems: BoothItem[] = [
  {
    id: 1,
    name: 'ひなたフードスタンド',
    genre: 'food',
    area: 'food-area',
    place: 'フードエリア',
    openingHours: '10:30〜18:00',
    description:
      '軽食を中心に楽しめるフードブースです。ライブ前の腹ごしらえにおすすめです。',
    notes: '混雑時は早めの利用がおすすめです。',
    tags: ['軽食', 'ライブ前', '仮データ'],
  },
  {
    id: 2,
    name: '冷たいドリンク販売',
    genre: 'drink',
    area: 'food-area',
    place: 'フードエリア',
    openingHours: '10:00〜18:30',
    description:
      '水分補給用のドリンクを販売する想定のブースです。暑さ対策としてこまめに利用しましょう。',
    notes: '熱中症対策のため、早めの水分補給を意識しましょう。',
    tags: ['ドリンク', '熱中症対策', '休憩'],
    isOfficialInfoConfirmed: false,
  },
  {
    id: 3,
    name: 'グッズ販売ブース',
    genre: 'goods',
    area: 'goods-area',
    place: 'グッズ販売エリア',
    openingHours: '10:00〜17:00',
    description:
      '公式グッズ販売を想定したブースです。販売時間や在庫状況は公式発表を確認してください。',
    notes: '実際の販売内容は公式情報に差し替えてください。',
    tags: ['グッズ', 'ペンライト', 'タオル'],
  },
  {
    id: 4,
    name: 'フォトスポット',
    genre: 'experience',
    area: 'event-area',
    place: 'イベントエリア',
    openingHours: '09:00〜18:00',
    description:
      '記念撮影に使えるスポットを想定しています。混雑時は譲り合って利用しましょう。',
    tags: ['写真', '記念', 'フェス感'],
  },
  {
    id: 5,
    name: '休憩スペース',
    genre: 'rest',
    area: 'support-area',
    place: '休憩エリア',
    openingHours: '09:00〜終演後',
    description:
      '日差しや疲労を避けるための休憩スペースです。体調が悪くなる前に利用しましょう。',
    notes: '長時間の占有は避け、譲り合って使いましょう。',
    tags: ['休憩', '熱中症対策', '体力回復'],
  },
  {
    id: 6,
    name: '総合案内ブース',
    genre: 'info',
    area: 'support-area',
    place: '案内エリア',
    openingHours: '09:00〜終演後',
    description:
      '迷ったときや困ったときに確認する案内ブースを想定しています。',
    tags: ['案内', '迷子対策', '困ったとき'],
  },
  {
    id: 7,
    name: '宮崎グルメブース',
    genre: 'food',
    area: 'food-area',
    place: 'フードエリア',
    openingHours: '10:30〜18:00',
    description:
      '地域グルメを楽しめる想定のブースです。フェスらしい食事導線として配置しています。',
    tags: ['ご当地', '食事', '仮データ'],
  },
  {
    id: 8,
    name: 'メッセージボードエリア',
    genre: 'experience',
    area: 'event-area',
    place: 'イベントエリア',
    openingHours: '10:00〜18:00',
    description:
      '参加記念のメッセージを書けるような企画ブースを想定しています。',
    tags: ['参加型', '記念', 'ファン企画'],
  },
]