export type HeatCardType = 'action' | 'item' | 'warning' | 'emergency'

export type HeatInfoItem = {
  id: number
  type: HeatCardType
  title: string
  description: string
  icon: string
  priority?: 'high' | 'normal'
}

export type HeatOfficialLink = {
  id: number
  title: string
  description: string
  url: string
}

export const heatActions: HeatInfoItem[] = [
  {
    id: 1,
    type: 'action',
    title: 'こまめに水分補給',
    description:
      'のどが渇く前に、少しずつ水分を取りましょう。汗を多くかいたときは塩分補給も意識します。',
    icon: '💧',
    priority: 'high',
  },
  {
    id: 2,
    type: 'action',
    title: '日陰や屋内で休憩',
    description:
      '長時間歩き続けず、日陰・屋内・休憩スペースで体を冷やしましょう。',
    icon: '🌿',
    priority: 'high',
  },
  {
    id: 3,
    type: 'action',
    title: '無理に予定を詰めない',
    description:
      'グッズ、出店、撮影、移動を詰め込みすぎず、休憩時間を先に確保しておくと安心です。',
    icon: '🕒',
  },
  {
    id: 4,
    type: 'action',
    title: '体調が悪い時は早めに離脱',
    description:
      '少しでも異変を感じたら、我慢せず涼しい場所に移動しましょう。',
    icon: '🏥',
    priority: 'high',
  },
]

export const heatItems: HeatInfoItem[] = [
  {
    id: 1,
    type: 'item',
    title: '飲み物',
    description:
      '水、お茶、スポーツドリンクなど。現地で買える場所も事前に確認しておきましょう。',
    icon: '🥤',
  },
  {
    id: 2,
    type: 'item',
    title: '塩分補給できるもの',
    description:
      '塩分タブレット、飴、経口補水系の飲料など。摂りすぎには注意しましょう。',
    icon: '🧂',
  },
  {
    id: 3,
    type: 'item',
    title: 'タオル・冷感グッズ',
    description:
      '汗拭き用タオル、冷感タオル、保冷剤、ハンディファンなどがあると安心です。',
    icon: '🧊',
  },
  {
    id: 4,
    type: 'item',
    title: '帽子・日傘',
    description:
      '直射日光を避けるための帽子や日傘。周囲の迷惑にならない場所で使いましょう。',
    icon: '🧢',
  },
]

export const heatWarnings: HeatInfoItem[] = [
  {
    id: 1,
    type: 'warning',
    title: 'めまい・立ちくらみ',
    description:
      '無理に歩き続けず、すぐに涼しい場所で休みましょう。',
    icon: '⚠️',
    priority: 'high',
  },
  {
    id: 2,
    type: 'warning',
    title: '大量の汗・体が熱い',
    description:
      '体を冷やし、水分と塩分を補給しましょう。',
    icon: '🥵',
    priority: 'high',
  },
  {
    id: 3,
    type: 'warning',
    title: '頭痛・吐き気・だるさ',
    description:
      '予定を中断し、周囲の人やスタッフに相談してください。',
    icon: '🌀',
    priority: 'high',
  },
  {
    id: 4,
    type: 'warning',
    title: '反応がおかしい・意識がぼんやり',
    description:
      '危険な状態の可能性があります。すぐに周囲へ助けを求めてください。',
    icon: '🚨',
    priority: 'high',
  },
]

export const emergencySteps: HeatInfoItem[] = [
  {
    id: 1,
    type: 'emergency',
    title: '涼しい場所へ移動',
    description:
      '日陰、屋内、冷房のある場所などに移動します。',
    icon: '1',
    priority: 'high',
  },
  {
    id: 2,
    type: 'emergency',
    title: '衣服をゆるめて体を冷やす',
    description:
      '首、わきの下、足の付け根などを冷やします。',
    icon: '2',
    priority: 'high',
  },
  {
    id: 3,
    type: 'emergency',
    title: '水分・塩分を補給',
    description:
      '飲める状態であれば、少しずつ水分を取ります。',
    icon: '3',
  },
  {
    id: 4,
    type: 'emergency',
    title: '危険な場合は119番',
    description:
      '自力で水が飲めない、意識がない、反応がおかしい場合は救急車を呼びましょう。',
    icon: '4',
    priority: 'high',
  },
]

export const officialHeatLinks: HeatOfficialLink[] = [
  {
    id: 1,
    title: '環境省 熱中症予防情報サイト',
    description:
      '暑さ指数、熱中症警戒アラートなどを確認できます。',
    url: 'https://www.wbgt.env.go.jp/',
  },
  {
    id: 2,
    title: '厚生労働省 熱中症予防のための情報・資料サイト',
    description:
      '熱中症の予防、症状、応急処置に関する情報を確認できます。',
    url: 'https://www.mhlw.go.jp/seisakunitsuite/bunya/kenkou_iryou/kenkou/nettyuu/nettyuu_taisaku/',
  },
]