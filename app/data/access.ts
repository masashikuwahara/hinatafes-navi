export type ParkingLot = {
  id: string
  name: string
  address: string
  capacity: number
  shuttleDuration: string
  walkingDuration: string
}

export type BusRoute = {
  id: string
  title: string
  from: string
  to: string
  firstDeparture: string
  lastDeparture?: string
  firstArrival?: string
  lastArrival?: string
  frequency?: string
  duration?: string
  notes: string[]
}

export type BusFare = {
  stop: string
  returnStop?: string
  adult: number
  child: number
}

export const accessMeta = {
  eventDates: ['2026-09-05', '2026-09-06'],
  venue: 'ひなたサンマリンスタジアム宮崎',
  sourceUrl: 'https://www.hinata-fes2026.com/access/',
  sourceLabel: 'ひなたフェス2026 公式交通情報',
  lastVerifiedAt: '2026-09-02',
}

export const parkingInfo = {
  openTime: '9:00',
  closeTime: '24:00',
  shuttleStartTime: '10:00',
  notes: [
    '会場との往復には無料シャトルバスを利用できます。',
    '駐車場の開場は9:00からです。',
    '開場時間前に会場近隣で車両待ちをすることは禁止されています。',
    '無料シャトルバスは10:00から運行開始予定です。',
    '高さ2.3m × 長さ5m × 幅2mを超える車両は利用できません。',
    '駐車場チケットのみの購入も可能です。',
  ],
}

export const parkingLots: ParkingLot[] = [
  {
    id: 'miyazaki-university',
    name: '宮崎大学',
    address: '宮崎県宮崎市学園木花台西1-1',
    capacity: 1000,
    shuttleDuration: '約10〜15分',
    walkingDuration: '約60分',
  },
  {
    id: 'kibana-junior-high-school',
    name: '宮崎市立木花中学校',
    address: '宮崎県宮崎市学園木花台南1-1',
    capacity: 300,
    shuttleDuration: '約5〜10分',
    walkingDuration: '約40分',
  },
]

export const outboundBusRoutes: BusRoute[] = [
  {
    id: 'miyazaki-station-to-venue',
    title: '宮崎駅 → フェス会場',
    from: '宮崎駅 西①番のりば',
    to: 'ひなたサンマリンスタジアム宮崎',
    firstDeparture: '10:00',
    lastDeparture: '16:00',
    firstArrival: '10:35',
    lastArrival: '16:35',
    frequency: '20〜30分間隔',
    duration: '約35分',
    notes: [
      '記載のないバス停には停車しません。',
      '時間・経路は予定で、変更される場合があります。',
    ],
  },
  {
    id: 'miyazaki-airport-to-venue',
    title: '宮崎空港 → フェス会場',
    from: '宮崎空港',
    to: 'ひなたサンマリンスタジアム宮崎',
    firstDeparture: '10:00',
    lastDeparture: '16:00',
    firstArrival: '10:10',
    lastArrival: '16:10',
    frequency: '20〜30分間隔',
    duration: '約10分',
    notes: [
      '記載のないバス停には停車しません。',
      '時間・経路は予定で、変更される場合があります。',
    ],
  },
]

export const returnBusRoute = {
  id: 'venue-to-miyazaki-station',
  title: 'フェス会場 → 宮崎駅方面',
  from: 'ひなたサンマリンスタジアム宮崎',
  to: '宮崎駅西口',
  startTime: 'コンサート終了後',
  lastDeparture: '未定',
  operatingGuide: 'コンサートの進行状況に合わせて随時運行',
  estimatedEnd: '終演後 約2時間程度運行予定',
  stops: [
    '宮交シティ',
    '橘通1丁目',
    '橘通3丁目',
    '宮崎駅西口',
  ],
  notes: [
    '復路は降車のみです。',
    '宮崎空港には立ち寄りません。',
    '記載のないバス停には停車しません。',
    '時間・経路は予定で、変更される場合があります。',
  ],
}

export const busFares: BusFare[] = [
  {
    stop: '宮崎駅西口',
    adult: 620,
    child: 310,
  },
  {
    stop: '山形屋前',
    returnStop: 'カリーノ宮崎前',
    adult: 620,
    child: 310,
  },
  {
    stop: '橘通1丁目',
    adult: 580,
    child: 290,
  },
  {
    stop: '宮交シティ',
    adult: 480,
    child: 240,
  },
  {
    stop: '宮崎空港',
    adult: 370,
    child: 190,
  },
]

export const busPaymentMethods = [
  'ひなたフェス2026 記念乗車券',
  '現金',
  '交通系ICカード等',
]

export const accessImportantNotices = [
  '臨時バスの運行日は2026年9月5日（土）・9月6日（日）です。',
  '往路の臨時バスは10:00〜16:00に運行されます。',
  '復路はコンサート終了後、進行状況に合わせて随時運行されます。',
  'コンサートが中止になった場合、臨時バスの運行はありません。',
  '運行時間・経路は変更される可能性があります。当日は公式情報も確認してください。',
]