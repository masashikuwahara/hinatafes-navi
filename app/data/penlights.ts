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
    name: '山口陽世',
    generation: '三期生',
    color1: 'pearl-green',
    color2: 'yellow',
  },
]