export type PenlightColorKey =
  | 'pastel-blue'
  | 'emerald-green'
  | 'green'
  | 'pearl-green'
  | 'light-green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'white'
  | 'sakura-pink'
  | 'pink'
  | 'passion-pink'
  | 'violet'
  | 'purple'
  | 'blue'

export type PenlightColor = {
  key: PenlightColorKey
  name: string
  hex: string
  textColor: 'dark' | 'light'
}

export type PenlightMember = {
  id: number
  name: string
  generation: string
  color1: PenlightColorKey
  color2: PenlightColorKey
  memo?: string
}

export const penlightColors: PenlightColor[] = [
  {
    key: 'pastel-blue',
    name: 'パステルブルー',
    hex: '#49BDF0',
    textColor: 'dark',
  },
  {
    key: 'emerald-green',
    name: 'エメラルドグリーン',
    hex: '#00a968',
    textColor: 'light',
  },
  {
    key: 'green',
    name: 'グリーン',
    hex: '#00a960',
    textColor: 'light',
  },
  {
    key: 'pearl-green',
    name: 'パールグリーン',
    hex: '#98fb98',
    textColor: 'dark',
  },
  {
    key: 'light-green',
    name: 'ライトグリーン',
    hex: '#90ee90',
    textColor: 'dark',
  },
  {
    key: 'yellow',
    name: 'イエロー',
    hex: '#ffdc00',
    textColor: 'dark',
  },
  {
    key: 'orange',
    name: 'オレンジ',
    hex: '#ee7800',
    textColor: 'light',
  },
  {
    key: 'red',
    name: 'レッド',
    hex: '#ff0000',
    textColor: 'light',
  },
  {
    key: 'white',
    name: 'ホワイト',
    hex: '#ffffff',
    textColor: 'dark',
  },
  {
    key: 'sakura-pink',
    name: 'サクラピンク',
    hex: '#fceeeb',
    textColor: 'dark',
  },
  {
    key: 'pink',
    name: 'ピンク',
    hex: '#ffc0cb',
    textColor: 'dark',
  },
  {
    key: 'passion-pink',
    name: 'パッションピンク',
    hex: '#fc0fc0',
    textColor: 'light',
  },
  {
    key: 'violet',
    name: 'バイオレット',
    hex: '#5a4498',
    textColor: 'light',
  },
  {
    key: 'purple',
    name: 'パープル',
    hex: '#9b72b0',
    textColor: 'light',
  },
  {
    key: 'blue',
    name: 'ブルー',
    hex: '#0000ff',
    textColor: 'light',
  },
]

export const penlightMembers: PenlightMember[] = [
  {
    id: 1,
    name: '金村美玖',
    generation: '二期生',
    color1: 'pastel-blue',
    color2: 'yellow',
  },
  {
    id: 2,
    name: '小坂菜緒',
    generation: '二期生',
    color1: 'purple',
    color2: 'white',
  },
  {
    id: 3,
    name: '上村ひなの',
    generation: '三期生',
    color1: 'red',
    color2: 'emerald-green',
  },
  {
    id: 4,
    name: '髙橋未来虹',
    generation: '三期生',
    color1: 'green',
    color2: 'purple',
  },
  {
    id: 5,
    name: '森本茉莉',
    generation: '三期生',
    color1: 'orange',
    color2: 'blue',
  },
  {
    id: 6,
    name: '石塚瑶季',
    generation: '四期生',
    color1: 'sakura-pink',
    color2: 'orange',
  },
  {
    id: 7,
    name: '小西夏菜実',
    generation: '四期生',
    color1: 'purple',
    color2: 'blue',
  },
  {
    id: 8,
    name: '清水理央',
    generation: '四期生',
    color1: 'pastel-blue',
    color2: 'pink',
  },
  {
    id: 9,
    name: '正源司陽子',
    generation: '四期生',
    color1: 'orange',
    color2: 'red',
  },
  {
    id: 10,
    name: '竹内希来里',
    generation: '四期生',
    color1: 'yellow',
    color2: 'red',
  },
  {
    id: 11,
    name: '平尾帆夏',
    generation: '四期生',
    color1: 'pastel-blue',
    color2: 'orange',
  },
  {
    id: 12,
    name: '平岡海月',
    generation: '四期生',
    color1: 'blue',
    color2: 'yellow',
  },
  {
    id: 13,
    name: '藤嶌果歩',
    generation: '四期生',
    color1: 'sakura-pink',
    color2: 'blue',
  },
  {
    id: 14,
    name: '宮地すみれ',
    generation: '四期生',
    color1: 'violet',
    color2: 'red',
  },
  {
    id: 15,
    name: '山下葉留花',
    generation: '四期生',
    color1: 'white',
    color2: 'emerald-green',
  },
  {
    id: 16,
    name: '渡辺莉奈',
    generation: '四期生',
    color1: 'blue',
    color2: 'white',
  },
  {
    id: 17,
    name: '大田美月',
    generation: '五期生',
    color1: 'sakura-pink',
    color2: 'pink',
  },
  {
    id: 18,
    name: '大野愛実',
    generation: '五期生',
    color1: 'red',
    color2: 'red',
  },
  {
    id: 19,
    name: '片山紗希',
    generation: '五期生',
    color1: 'pastel-blue',
    color2: 'pastel-blue',
  },
  {
    id: 20,
    name: '蔵盛妃那乃',
    generation: '五期生',
    color1: 'sakura-pink',
    color2: 'red',
  },
  {
    id: 21,
    name: '坂井新奈',
    generation: '五期生',
    color1: 'white',
    color2: 'white',
  },
  {
    id: 22,
    name: '佐藤優羽',
    generation: '五期生',
    color1: 'emerald-green',
    color2: 'emerald-green',
  },
  {
    id: 23,
    name: '下田衣珠季',
    generation: '五期生',
    color1: 'pastel-blue',
    color2: 'emerald-green',
  },
  {
    id: 24,
    name: '高井俐香',
    generation: '五期生',
    color1: 'purple',
    color2: 'yellow',
  },
  {
    id: 25,
    name: '鶴崎仁香',
    generation: '五期生',
    color1: 'yellow',
    color2: 'orange',
  },
  {
    id: 26,
    name: '松尾桜',
    generation: '五期生',
    color1: 'sakura-pink',
    color2: 'white',
  },
]