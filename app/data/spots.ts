export type SpotCategory =
  | 'entrance'
  | 'stage'
  | 'goods'
  | 'food'
  | 'booth'
  | 'rest'
  | 'toilet'
  | 'water'
  | 'medical'
  | 'transport'
  | 'meeting'
  | 'other'

export type SpotArea =
  | 'center'
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'outside'
  | 'unknown'

export type SpotCoordinateStatus = 'confirmed' | 'approximate' | 'unknown'

export type Spot = {
  id: string
  name: string
  category: SpotCategory
  area: SpotArea
  description: string
  memo?: string
  latitude: number | null
  longitude: number | null
  coordinateStatus: SpotCoordinateStatus
  tags: string[]
  isImportant?: boolean
  sortOrder: number
}

export const spotCategories: Array<{
  value: SpotCategory
  label: string
  icon: string
}> = [
  {
    value: 'entrance',
    label: '入口',
    icon: '🚪',
  },
  {
    value: 'stage',
    label: 'ステージ',
    icon: '🎤',
  },
  {
    value: 'goods',
    label: 'グッズ',
    icon: '🛍️',
  },
  {
    value: 'food',
    label: '飲食',
    icon: '🍴',
  },
  {
    value: 'booth',
    label: 'ブース',
    icon: '🏕️',
  },
  {
    value: 'rest',
    label: '休憩',
    icon: '🪑',
  },
  {
    value: 'toilet',
    label: 'トイレ',
    icon: '🚻',
  },
  {
    value: 'water',
    label: '給水',
    icon: '💧',
  },
  {
    value: 'medical',
    label: '救護',
    icon: '🏥',
  },
  {
    value: 'transport',
    label: '交通',
    icon: '🚌',
  },
  {
    value: 'meeting',
    label: '集合',
    icon: '📍',
  },
  {
    value: 'other',
    label: 'その他',
    icon: 'ℹ️',
  },
]

export const spotAreas: Array<{
  value: SpotArea
  label: string
}> = [
  {
    value: 'center',
    label: '中央エリア',
  },
  {
    value: 'north',
    label: '北エリア',
  },
  {
    value: 'south',
    label: '南エリア',
  },
  {
    value: 'east',
    label: '東エリア',
  },
  {
    value: 'west',
    label: '西エリア',
  },
  {
    value: 'outside',
    label: '会場外・周辺',
  },
  {
    value: 'unknown',
    label: '場所未定',
  },
]

export const spots: Spot[] = [
  {
    id: 'main-entrance',
    name: '会場入口（仮）',
    category: 'entrance',
    area: 'unknown',
    description: '入場時の目印になるスポットです。正式な入口情報が出たら更新します。',
    memo: '待ち合わせ場所にする場合は、混雑しすぎない場所か確認しましょう。',
    latitude: null,
    longitude: null,
    coordinateStatus: 'unknown',
    tags: ['入場', '待ち合わせ', '最初に確認'],
    isImportant: true,
    sortOrder: 10,
  },
  {
    id: 'information',
    name: '総合案内（仮）',
    category: 'other',
    area: 'unknown',
    description: '困ったときに確認したい案内スポットです。',
    memo: '落とし物、会場内の確認、体調不良時の相談先などは公式案内を優先してください。',
    latitude: null,
    longitude: null,
    coordinateStatus: 'unknown',
    tags: ['案内', '困ったとき', '公式確認'],
    isImportant: true,
    sortOrder: 20,
  },
  {
    id: 'main-stage',
    name: 'メインステージ周辺（仮）',
    category: 'stage',
    area: 'unknown',
    description: 'ライブやイベントの中心になる想定のスポットです。',
    memo: '実際のステージ位置は公式発表後に更新します。',
    latitude: null,
    longitude: null,
    coordinateStatus: 'unknown',
    tags: ['ステージ', 'ライブ', 'イベント'],
    isImportant: true,
    sortOrder: 30,
  },
  {
    id: 'goods-area',
    name: 'グッズ販売エリア（仮）',
    category: 'goods',
    area: 'unknown',
    description: 'グッズ販売の確認用スポットです。',
    memo: '販売時間、整理券、決済方法などは公式情報を確認してください。',
    latitude: null,
    longitude: null,
    coordinateStatus: 'unknown',
    tags: ['グッズ', '物販', '購入'],
    isImportant: true,
    sortOrder: 40,
  },
  {
    id: 'food-area',
    name: '飲食・キッチンカーエリア（仮）',
    category: 'food',
    area: 'unknown',
    description: '飲食店やキッチンカーを探すためのスポットです。',
    memo: '混雑時は早めの購入や時間をずらすことも検討しましょう。',
    latitude: null,
    longitude: null,
    coordinateStatus: 'unknown',
    tags: ['飲食', 'キッチンカー', '休憩'],
    sortOrder: 50,
  },
  {
    id: 'booth-area',
    name: '出店・ブースエリア（仮）',
    category: 'booth',
    area: 'unknown',
    description: '出店や企画ブースを探すためのスポットです。',
    memo: 'ブース一覧ページと連携できるようにしていきます。',
    latitude: null,
    longitude: null,
    coordinateStatus: 'unknown',
    tags: ['ブース', '出店', '企画'],
    sortOrder: 60,
  },
  {
    id: 'rest-area',
    name: '休憩エリア（仮）',
    category: 'rest',
    area: 'unknown',
    description: '座って休める場所、日陰、待機場所の確認用スポットです。',
    memo: '熱中症対策画面とも関連する重要スポットです。',
    latitude: null,
    longitude: null,
    coordinateStatus: 'unknown',
    tags: ['休憩', '日陰', '熱中症対策'],
    isImportant: true,
    sortOrder: 70,
  },
  {
    id: 'water-area',
    name: '給水・自販機エリア（仮）',
    category: 'water',
    area: 'unknown',
    description: '水分補給に使える場所の確認用スポットです。',
    memo: '現地では早めの水分補給を意識しましょう。',
    latitude: null,
    longitude: null,
    coordinateStatus: 'unknown',
    tags: ['給水', '自販機', '熱中症対策'],
    isImportant: true,
    sortOrder: 80,
  },
  {
    id: 'toilet-area',
    name: 'トイレ（仮）',
    category: 'toilet',
    area: 'unknown',
    description: 'トイレの場所を確認するためのスポットです。',
    memo: '開演前や終演後は混雑しやすいため、早めの確認がおすすめです。',
    latitude: null,
    longitude: null,
    coordinateStatus: 'unknown',
    tags: ['トイレ', '混雑注意'],
    isImportant: true,
    sortOrder: 90,
  },
  {
    id: 'medical-area',
    name: '救護・体調不良時の相談先（仮）',
    category: 'medical',
    area: 'unknown',
    description: '体調が悪くなったときに確認したいスポットです。',
    memo: '無理をせず、少しでも異変を感じたら早めに休憩しましょう。',
    latitude: null,
    longitude: null,
    coordinateStatus: 'unknown',
    tags: ['救護', '体調不良', '熱中症対策'],
    isImportant: true,
    sortOrder: 100,
  },
  {
    id: 'transport-area',
    name: '帰りの交通導線（仮）',
    category: 'transport',
    area: 'outside',
    description: '終演後の帰宅ルートやバス・駅方面の確認用スポットです。',
    memo: '混雑時に備えて、帰りのルートは事前に確認しておくと安心です。',
    latitude: null,
    longitude: null,
    coordinateStatus: 'unknown',
    tags: ['帰宅', 'バス', '駅', '交通'],
    isImportant: true,
    sortOrder: 110,
  },
  {
    id: 'meeting-point',
    name: '集合場所候補（仮）',
    category: 'meeting',
    area: 'unknown',
    description: '同行者との集合場所として使う候補スポットです。',
    memo: '人が密集しすぎる場所は避け、分かりやすい目印を選びましょう。',
    latitude: null,
    longitude: null,
    coordinateStatus: 'unknown',
    tags: ['集合', '待ち合わせ', '同行者'],
    sortOrder: 120,
  },
]

export const getSpotCategory = (category: SpotCategory) => {
  return spotCategories.find((item) => item.value === category)
}

export const getSpotArea = (area: SpotArea) => {
  return spotAreas.find((item) => item.value === area)
}