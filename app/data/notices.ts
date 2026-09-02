export type NoticeLevel = 'info' | 'important' | 'warning'

export type Notice = {
  id: string
  level: NoticeLevel
  title: string
  description: string
  publishedAt: string
  sourceUrl: string
  sourceLabel: string
  href?: string
  showOnHome: boolean
  isActive: boolean
}

export const notices: Notice[] = [
  {
    id: 'event-cancelled-20260902',
    level: 'warning',
    title: 'ひなたフェス2026 開催中止',
    description:
      '9月5日・6日に開催予定だった「ひなたフェス2026」は開催中止となりました。払い戻し等については9月3日昼以降、公式から順次案内される予定です。',
    publishedAt: '2026-09-02',
    sourceUrl:
      'https://www.hinatazaka46.com/s/official/news/detail/E00906',
    sourceLabel: '日向坂46公式',
    showOnHome: false,
    isActive: true,
  },
  {
    id: 'parade-rain-cancel-20260827',
    level: 'warning',
    title: '雨天時はスペシャルパレード中止',
    description:
      '当日に雨が降った場合、スペシャルパレードは中止となります。小雨の場合も中止の方針が公式から発表されています。',
    publishedAt: '2026-08-27',
    sourceUrl: 'https://www.hinata-fes2026.com/diary/5kbgi5pqq/',
    sourceLabel: 'ひなたフェス2026公式',
    href: '/schedule',
    showOnHome: true,
    isActive: true,
  },
  {
    id: 'parasol-rule-20260827',
    level: 'important',
    title: 'スタジアムでも日傘を使用できます',
    description:
      'スタジアム内では開場14:30から16:20まで日傘を使用できます。入場ゲート通過前後では使用を控えるよう案内されています。',
    publishedAt: '2026-08-27',
    sourceUrl: 'https://www.hinata-fes2026.com/diary/5kbgi5pqq/',
    sourceLabel: 'ひなたフェス2026公式',
    href: '/heat',
    showOnHome: true,
    isActive: true,
  },
]