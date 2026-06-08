export type HomeFeatureId =
  | 'checklist'
  | 'schedule'
  | 'booths'
  | 'map'
  | 'heat'
  | 'penlight'
  | 'memo'

export type FeatureTheme =
  | 'sky'
  | 'yellow'
  | 'green'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'slate'

export type HomeFeature = {
  id: HomeFeatureId
  title: string
  shortTitle: string
  description: string
  to: string
  icon: string
  theme: FeatureTheme
  isTodayUse: boolean
  sortOrder: number
}

export const homeFeatures: HomeFeature[] = [
  {
    id: 'checklist',
    title: '持ち物チェック',
    shortTitle: '持ち物',
    description: '忘れ物を防ぐためのチェックリスト。チェック状態は端末に保存予定です。',
    to: '/checklist',
    icon: '🎒',
    theme: 'sky',
    isTodayUse: true,
    sortOrder: 1,
  },
  {
    id: 'schedule',
    title: 'スケジュール',
    shortTitle: '予定',
    description: 'イベント、開場、物販、移動などの予定を確認します。',
    to: '/schedule',
    icon: '🗓️',
    theme: 'yellow',
    isTodayUse: true,
    sortOrder: 2,
  },
  {
    id: 'booths',
    title: '出店・ブース',
    shortTitle: 'ブース',
    description: 'フード、物販、展示などのブース情報を確認します。',
    to: '/booths',
    icon: '🏕️',
    theme: 'orange',
    isTodayUse: true,
    sortOrder: 3,
  },
  {
    id: 'map',
    title: '会場マップ',
    shortTitle: 'マップ',
    description: '会場内のスポットや移動時に確認したい場所をまとめます。',
    to: '/map',
    icon: '🗺️',
    theme: 'green',
    isTodayUse: true,
    sortOrder: 4,
  },
  {
    id: 'heat',
    title: '熱中症対策',
    shortTitle: '暑さ対策',
    description: '水分補給、休憩、体調管理のための情報をまとめます。',
    to: '/heat',
    icon: '🥤',
    theme: 'pink',
    isTodayUse: true,
    sortOrder: 5,
  },
  {
    id: 'penlight',
    title: 'ペンライトカラー',
    shortTitle: 'ペンラ',
    description: 'メンバーごとのペンライトカラーを素早く確認します。',
    to: '/penlight',
    icon: '🔦',
    theme: 'purple',
    isTodayUse: false,
    sortOrder: 6,
  },
  {
    id: 'memo',
    title: '参戦メモ',
    shortTitle: 'メモ',
    description: '座席、集合場所、買ったもの、感想などをメモします。',
    to: '/memo',
    icon: '📝',
    theme: 'slate',
    isTodayUse: false,
    sortOrder: 7,
  },
]

export const todayFeatures = homeFeatures
  .filter((feature) => feature.isTodayUse)
  .sort((a, b) => a.sortOrder - b.sortOrder)

export const sortedHomeFeatures = [...homeFeatures].sort(
  (a, b) => a.sortOrder - b.sortOrder,
)