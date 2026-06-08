export type ChecklistCategoryKey =
  | 'essential'
  | 'live'
  | 'heat'
  | 'weather'
  | 'travel'

export type ChecklistPriority = 'high' | 'medium' | 'low'

export type ChecklistCategory = {
  key: ChecklistCategoryKey
  label: string
  icon: string
  description: string
}

export type ChecklistItem = {
  id: string
  category: ChecklistCategoryKey
  label: string
  description?: string
  priority: ChecklistPriority
}

export const checklistCategories: ChecklistCategory[] = [
  {
    key: 'essential',
    label: '必須',
    icon: '🎫',
    description: '入場・移動・支払いに必要なもの',
  },
  {
    key: 'live',
    label: 'ライブ',
    icon: '🎤',
    description: 'ライブを楽しむためのもの',
  },
  {
    key: 'heat',
    label: '暑さ対策',
    icon: '☀️',
    description: '屋外イベント向けの体調管理グッズ',
  },
  {
    key: 'weather',
    label: '天気対策',
    icon: '🌂',
    description: '雨や日差しに備えるもの',
  },
  {
    key: 'travel',
    label: '移動・宿泊',
    icon: '🧳',
    description: '遠征や帰宅時に必要なもの',
  },
]

export const checklistItems: ChecklistItem[] = [
  {
    id: 'smartphone',
    category: 'essential',
    label: 'スマートフォン',
    description: '電子チケット、連絡、地図確認に使用',
    priority: 'high',
  },
  {
    id: 'ticket',
    category: 'essential',
    label: 'チケット・電子チケット確認',
    description: '入場前に表示方法も確認しておく',
    priority: 'high',
  },
  {
    id: 'wallet',
    category: 'essential',
    label: '財布・現金・カード',
    description: '通信障害やキャッシュレス非対応に備えて現金も少し用意',
    priority: 'high',
  },
  {
    id: 'ic-card',
    category: 'essential',
    label: '交通系ICカード',
    description: '残高確認も忘れずに',
    priority: 'high',
  },
  {
    id: 'mobile-battery',
    category: 'essential',
    label: 'モバイルバッテリー',
    description: '現地ではスマホの電池消費が多くなりやすい',
    priority: 'high',
  },
  {
    id: 'charging-cable',
    category: 'essential',
    label: '充電ケーブル',
    description: '端子の種類も確認',
    priority: 'high',
  },

  {
    id: 'penlight',
    category: 'live',
    label: 'ペンライト',
    description: '電池残量も確認',
    priority: 'high',
  },
  {
    id: 'penlight-battery',
    category: 'live',
    label: 'ペンライト用の予備電池',
    description: '必要な電池の種類を事前に確認',
    priority: 'medium',
  },
  {
    id: 'oshi-towel',
    category: 'live',
    label: '推しメンタオル',
    priority: 'medium',
  },
  {
    id: 'binoculars',
    category: 'live',
    label: '双眼鏡',
    description: '席によってはあると便利',
    priority: 'low',
  },

  {
    id: 'drink',
    category: 'heat',
    label: '飲み物',
    description: 'こまめな水分補給用',
    priority: 'high',
  },
  {
    id: 'salt-tablet',
    category: 'heat',
    label: '塩分タブレット・飴',
    description: '汗をかく日の補助に',
    priority: 'medium',
  },
  {
    id: 'cooling-goods',
    category: 'heat',
    label: '冷感タオル・冷却シート',
    priority: 'medium',
  },
  {
    id: 'handkerchief',
    category: 'heat',
    label: 'タオル・ハンカチ',
    priority: 'medium',
  },

  {
    id: 'hat',
    category: 'weather',
    label: '帽子',
    description: '日差し対策',
    priority: 'medium',
  },
  {
    id: 'sunscreen',
    category: 'weather',
    label: '日焼け止め',
    priority: 'medium',
  },
  {
    id: 'raincoat',
    category: 'weather',
    label: 'レインコート',
    description: '傘が使いにくい場所に備える',
    priority: 'medium',
  },
  {
    id: 'plastic-bag',
    category: 'weather',
    label: 'ビニール袋・ジップ袋',
    description: '雨対策、ゴミ入れ、小物整理に便利',
    priority: 'low',
  },

  {
    id: 'hotel-info',
    category: 'travel',
    label: '宿泊先情報',
    description: '住所、チェックイン時間、予約番号など',
    priority: 'medium',
  },
  {
    id: 'return-route',
    category: 'travel',
    label: '帰りの交通手段確認',
    description: '終電・バス・タクシー乗り場など',
    priority: 'high',
  },
  {
    id: 'medicine',
    category: 'travel',
    label: '常備薬',
    priority: 'medium',
  },
  {
    id: 'change-clothes',
    category: 'travel',
    label: '着替え',
    description: '汗・雨・遠征用',
    priority: 'low',
  },
]