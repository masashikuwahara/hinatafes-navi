type UseAppSeoOptions = {
  title?: string
  description?: string
  path?: string
  image?: string
  noindex?: boolean
}

export const useAppSeo = (options: UseAppSeoOptions = {}) => {
  const siteName = 'ひなたフェス2026 現地ナビ'
  const siteUrl = 'https://hinatafes.kasumizaka46.com'

  const defaultTitle =
    'ひなたフェス2026 現地ナビ｜持ち物・マップ・宮崎遠征準備'

  const defaultDescription =
    'ひなたフェス2026に参加するファン向けの非公式現地ナビアプリです。持ち物チェックリスト、会場マップ、スケジュール、出店・ブース、熱中症対策、ペンライトカラー確認、宮崎遠征前の確認メモなどをスマホで素早く確認できます。'

  const title = options.title
    ? `${options.title} | ${siteName}`
    : defaultTitle

  const description = options.description ?? defaultDescription

  const path = options.path ?? '/'
  const canonicalUrl = `${siteUrl}${path === '/' ? '' : path}`

  const ogImage = `${siteUrl}${options.image ?? '/images/ogp/default.png'}`

  const robots = options.noindex ? 'noindex,follow' : 'index,follow'

  useSeoMeta({
    title,
    description,

    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogUrl: canonicalUrl,
    ogSiteName: siteName,
    ogLocale: 'ja_JP',
    ogImage: ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt:
      'ひなたフェス2026 現地ナビ。持ち物、会場マップ、スケジュール、宮崎遠征準備をスマホで確認できる非公式ファンアプリ。',

    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    twitterImageAlt:
      'ひなたフェス2026 現地ナビ。持ち物、会場マップ、スケジュール、宮崎遠征準備をスマホで確認できる非公式ファンアプリ。',

    robots,
  })

  useHead({
    htmlAttrs: {
      lang: 'ja',
    },
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl,
      },
    ],
    meta: [
      {
        name: 'theme-color',
        content: '#7cc7e8',
      },
      {
        name: 'format-detection',
        content: 'telephone=no',
      },
    ],
  })
}