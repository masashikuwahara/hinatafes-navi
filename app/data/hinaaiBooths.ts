export type HinaaiTicketType =
  | 'required'
  | 'venue-timed'
  | 'none'

export type HinaaiBooth = {
  id: string
  name: string
  presenters: string[]
  area: 'hinata-expo' | 'hinata-budokan'
  venue: string
  description: string
  isFree: boolean
  ticketType: HinaaiTicketType
  ticketNote?: string
  prizeAvailable: boolean
  tags: string[]
  sourceUrl: string
  sortOrder: number
}

const sourceUrl = 'https://www.hinata-fes2026.com/lp/hinaai/'

export const hinaaiBooths: HinaaiBooth[] = [
  {
    id: 'hinaai-struck-out',
    name: 'おひさま褒め褒めストラックアウト',
    presenters: ['大田美月'],
    area: 'hinata-expo',
    venue: '第2陸上競技場（ひなたエキスポ）',
    description:
      'ストラックアウトの的にボールを投げ、的に当たるとメンバーからのお褒めメッセージが流れます。1人5球で、ビンゴが揃うと賞品を獲得できます。',
    isFree: true,
    ticketType: 'required',
    ticketNote:
      '無料で参加できますが、整理券を持っている方のみ参加できます。',
    prizeAvailable: true,
    tags: ['ひなあい', '体験', 'ゲーム', '整理券'],
    sourceUrl,
    sortOrder: 1,
  },

  {
    id: 'hinaai-tsumutsumu',
    name: 'プレッシャーつむつむ',
    presenters: ['小坂菜緒'],
    area: 'hinata-expo',
    venue: '第2陸上競技場（ひなたエキスポ）',
    description:
      '番組でおなじみの企画を体験できます。4人1組で協力し、メンバーの記録を超えると賞品を獲得できます。何を積むかは当日のお楽しみです。',
    isFree: true,
    ticketType: 'required',
    ticketNote:
      '無料で参加できますが、整理券を持っている方のみ参加できます。',
    prizeAvailable: true,
    tags: ['ひなあい', '体験', 'ゲーム', '整理券'],
    sourceUrl,
    sortOrder: 2,
  },

  {
    id: 'hinaai-group-photo-panels',
    name: '各軍団等身大フォトパネル',
    presenters: ['髙橋未来虹'],
    area: 'hinata-expo',
    venue: '第2陸上競技場（ひなたエキスポ）',
    description:
      '4つの新軍団「シン・小坂の懐入り隊」「森本連れ出し隊」「小西FABULOUS最強★柱軍団」「清水無敵軍団」の等身大フォトパネルを設置。軍団独自のポーズで一緒に撮影できます。',
    isFree: true,
    ticketType: 'none',
    prizeAvailable: false,
    tags: ['ひなあい', 'フォトスポット', '撮影'],
    sourceUrl,
    sortOrder: 3,
  },

  {
    id: 'hinaai-tv-set',
    name: '「日向坂で会いましょう」番組セット',
    presenters: ['平尾帆夏', '佐藤優羽'],
    area: 'hinata-budokan',
    venue: 'ひなた武道館',
    description:
      '番組収録で使用している「登場口」「MCテーブル」や、メンバーが椅子に座った1sパネル、フォトスポットスタンドなどを設置します。',
    isFree: true,
    ticketType: 'venue-timed',
    ticketNote:
      'ひなた武道館への入場は時間ごとの整理券制です。整理券がない場合は入場できない場合があります。',
    prizeAvailable: false,
    tags: ['ひなあい', '展示', 'フォトスポット', '整理券'],
    sourceUrl,
    sortOrder: 4,
  },

  {
    id: 'hinaai-museum',
    name: 'ひなあい博物館',
    presenters: ['正源司陽子', '竹内希来里', '片山紗希'],
    area: 'hinata-budokan',
    venue: 'ひなた武道館',
    description:
      '番組内で使用したフリップ、小道具、衣装、メンバーが企画で制作した作品などの一部を展示します。',
    isFree: true,
    ticketType: 'venue-timed',
    ticketNote:
      'ひなた武道館への入場は時間ごとの整理券制です。整理券がない場合は入場できない場合があります。',
    prizeAvailable: false,
    tags: ['ひなあい', '展示', '博物館', '整理券'],
    sourceUrl,
    sortOrder: 5,
  },
]