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

export type CoolingSpot = {
  id: string
  name: string
  type: 'air-conditioned' | 'shade'
  label: string
  description: string
}

export type HeatRule = {
  id: string
  title: string
  description: string
  level: 'info' | 'important' | 'warning'
}

export const heatMeta = {
  sourceUrl: 'https://www.hinata-fes2026.com/diary/5kbgi5pqq/',
  sourceLabel: 'ひなたフェス2026 対策本部',
  publishedAt: '2026-08-27',
  lastVerifiedAt: '2026-08-29',
}

export const parasolRules: HeatRule[] = [
  {
    id: 'parasol-park',
    title: '園内で日傘を使用できます',
    description:
      '園内の移動中、飲食店の列、休憩中などでも日傘を利用できます。',
    level: 'info',
  },
  {
    id: 'parasol-stadium',
    title: 'スタジアム内は14:30〜16:20まで',
    description:
      'ひなたサンマリンスタジアム宮崎では、開場14:30からライブ開演10分前の16:20まで日傘を使用できます。',
    level: 'important',
  },
  {
    id: 'parasol-gate',
    title: '入場ゲート前後では日傘を控える',
    description:
      '混雑緩和とスムーズな入場のため、入場ゲートを通過する前後は日傘の使用を控えるよう公式から案内されています。',
    level: 'warning',
  },
  {
    id: 'parasol-seat',
    title: '周囲に配慮して使用',
    description:
      'スタジアムの座席では周囲との距離が近いため、周りの方に配慮して使用してください。',
    level: 'info',
  },
]

export const coolingSpots: CoolingSpot[] = [
  {
    id: 'hinata-budokan',
    name: 'ひなた武道館',
    type: 'air-conditioned',
    label: '空調あり',
    description:
      '前回も「おひさま休憩所」として使用された、空調の効いた休憩スペースです。',
  },
  {
    id: 'hinata-kibana-dome',
    name: 'ひなた木の花ドーム',
    type: 'air-conditioned',
    label: '空調あり',
    description:
      '「ひなたモール」として使用されます。グッズ売り場やFCブースなども設置される空調の効いた屋内エリアです。',
  },
  {
    id: 'hinata-expo-shade',
    name: 'ひなたエキスポ',
    type: 'shade',
    label: '日陰エリア',
    description:
      '第2陸上競技場。前回以上に日陰エリアを拡張する予定と公式から案内されています。',
  },
  {
    id: 'cloak-course',
    name: 'クローク周辺・園内走路',
    type: 'shade',
    label: '大型日除け',
    description:
      '空調はありませんが、大きな日除けになっており、風が抜けるエリアとして案内されています。',
  },
]

export const weatherRules: HeatRule[] = [
  {
    id: 'parade-rain-cancel',
    title: '雨天時はスペシャルパレード中止',
    description:
      '当日に雨が降った場合、スペシャルパレードは中止となります。小雨の場合も含む方針です。',
    level: 'warning',
  },
]

export const heatOfficialNotes = [
  '9月上旬でも強い日差しや厳しい暑さとなる可能性があります。',
  '無理をせず、自分の体調を優先してフェスを楽しんでください。',
]