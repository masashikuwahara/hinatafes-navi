export type ScheduleCategory =
  | 'live'
  | 'goods'
  | 'food'
  | 'stage'
  | 'notice'

export type ScheduleItem = {
  id: number
  date: string
  dayLabel: string
  startTime: string
  endTime?: string
  title: string
  place: string
  category: ScheduleCategory
  description: string
  isImportant?: boolean
}

export const scheduleItems: ScheduleItem[] = [
  {
    id: 1,
    date: '2026-09-12',
    dayLabel: 'DAY1',
    startTime: '09:00',
    endTime: '10:00',
    title: '会場エリア オープン',
    place: '会場周辺',
    category: 'notice',
    description: '入場導線や各エリアの案内を確認しましょう。',
    isImportant: true,
  },
  {
    id: 2,
    date: '2026-09-12',
    dayLabel: 'DAY1',
    startTime: '10:00',
    endTime: '17:00',
    title: 'グッズ販売',
    place: 'グッズ販売エリア',
    category: 'goods',
    description: '混雑状況に注意しながら、時間に余裕を持って移動しましょう。',
  },
  {
    id: 3,
    date: '2026-09-12',
    dayLabel: 'DAY1',
    startTime: '10:30',
    endTime: '18:00',
    title: '出店・フードエリア営業',
    place: 'フードエリア',
    category: 'food',
    description: '水分補給と休憩を取りながら楽しみましょう。',
  },
  {
    id: 4,
    date: '2026-09-12',
    dayLabel: 'DAY1',
    startTime: '12:00',
    endTime: '13:00',
    title: 'ステージイベント',
    place: 'イベントステージ',
    category: 'stage',
    description: '詳細は公式発表後に更新予定です。',
  },
  {
    id: 5,
    date: '2026-09-12',
    dayLabel: 'DAY1',
    startTime: '17:00',
    title: 'ライブ開場',
    place: 'ライブ会場',
    category: 'live',
    description: 'チケット、本人確認書類、ペンライトなどを確認しましょう。',
    isImportant: true,
  },
  {
    id: 6,
    date: '2026-09-12',
    dayLabel: 'DAY1',
    startTime: '18:30',
    title: 'ライブ開演',
    place: 'ライブ会場',
    category: 'live',
    description: '開演前に水分補給とトイレを済ませておくと安心です。',
    isImportant: true,
  },
  {
    id: 7,
    date: '2026-09-13',
    dayLabel: 'DAY2',
    startTime: '09:00',
    endTime: '10:00',
    title: '会場エリア オープン',
    place: '会場周辺',
    category: 'notice',
    description: '前日と導線が変わる場合もあるため、現地案内を確認しましょう。',
    isImportant: true,
  },
  {
    id: 8,
    date: '2026-09-13',
    dayLabel: 'DAY2',
    startTime: '10:00',
    endTime: '17:00',
    title: 'グッズ販売',
    place: 'グッズ販売エリア',
    category: 'goods',
    description: '売り切れや混雑に注意して行動しましょう。',
  },
  {
    id: 9,
    date: '2026-09-13',
    dayLabel: 'DAY2',
    startTime: '10:30',
    endTime: '18:00',
    title: '出店・フードエリア営業',
    place: 'フードエリア',
    category: 'food',
    description: '暑さ対策をしながら、こまめに休憩を取りましょう。',
  },
  {
    id: 10,
    date: '2026-09-13',
    dayLabel: 'DAY2',
    startTime: '17:00',
    title: 'ライブ開場',
    place: 'ライブ会場',
    category: 'live',
    description: '帰りの交通手段もあらかじめ確認しておきましょう。',
    isImportant: true,
  },
  {
    id: 11,
    date: '2026-09-13',
    dayLabel: 'DAY2',
    startTime: '18:30',
    title: 'ライブ開演',
    place: 'ライブ会場',
    category: 'live',
    description: '終演後は混雑が予想されるため、余裕を持って移動しましょう。',
    isImportant: true,
  },
]