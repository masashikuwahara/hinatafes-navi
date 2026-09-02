export type EventStatus =
  | 'scheduled'
  | 'cancelled'
  | 'finished'

export const eventStatus = {
  status: 'cancelled' as EventStatus,

  title: 'ひなたフェス2026',

  dates: [
    '2026-09-05',
    '2026-09-06',
  ],

  headline: 'ひなたフェス2026 開催中止',

  message:
    '2026年9月5日（土）・6日（日）に開催予定だった「ひなたフェス2026」は、天候予報や交通への影響などを踏まえ、安全を最優先として開催中止となりました。',

  announcedAt: '2026-09-02',

  refundMessage:
    '各種料金の払い戻しなど、中止に伴う案内は9月3日（木）昼以降、公式から順次発表される予定です。',

  sourceUrl:
    'https://www.hinatazaka46.com/s/official/news/detail/E00906',

  sourceLabel:
    '日向坂46公式「ひなたフェス2026」開催中止のお知らせ',
}