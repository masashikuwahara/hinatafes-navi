<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { boothItems } from '~/data/booths'
import { hinaaiBooths } from '~/data/hinaaiBooths'

type DisplayBoothItem = {
  id: string
  name: string
  genre: string
  area: string
  location?: string
  description?: string
  openingHours?: string
  tags: string[]
  isRecommended?: boolean
  isOfficial?: boolean
}

type FilterOption = {
  id: string
  label: string
}

const FAVORITE_STORAGE_KEY = 'hinatafes-booth-favorites-v2'

useAppSeo({
  title: '出店・ブース一覧',
  description:
    'ひなたフェス2026の出店・ブース一覧です。フード、物販、企画ブースなどをジャンルやエリアで絞り込み、気になるブースをお気に入り保存できます。',
})

const hinataExpoBooths = hinaaiBooths.filter(
  (booth) => booth.area === 'hinata-expo',
)

const hinataBudokanBooths = hinaaiBooths.filter(
  (booth) => booth.area === 'hinata-budokan',
)

const keyword = ref('')
const selectedGenre = ref('all')
const selectedArea = ref('all')
const showFavoritesOnly = ref(false)
const favoriteIds = ref<string[]>([])
const hasMounted = ref(false)

const normalizeTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag))
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  return []
}

const normalizeBoothItem = (item: unknown, index: number): DisplayBoothItem => {
  const raw = item as {
    id?: string | number
    slug?: string
    name?: string
    title?: string
    boothName?: string
    genre?: string
    category?: string
    type?: string
    area?: string
    areaLabel?: string
    location?: string
    place?: string
    venue?: string
    description?: string
    summary?: string
    memo?: string
    openingHours?: string
    hours?: string
    tags?: string[] | string
    keywords?: string[] | string
    isRecommended?: boolean
    recommended?: boolean
    isOfficial?: boolean
    official?: boolean
  }

  return {
    id: String(raw.id ?? raw.slug ?? `booth-${index}`),
    name: String(raw.name ?? raw.title ?? raw.boothName ?? '出店・ブース'),
    genre: String(raw.genre ?? raw.category ?? raw.type ?? 'other'),
    area: String(raw.area ?? raw.areaLabel ?? 'unknown'),
    location: raw.location ?? raw.place ?? raw.venue,
    description: raw.description ?? raw.summary ?? raw.memo,
    openingHours: raw.openingHours ?? raw.hours,
    tags: [
      ...normalizeTags(raw.tags),
      ...normalizeTags(raw.keywords),
    ],
    isRecommended: Boolean(raw.isRecommended ?? raw.recommended ?? false),
    isOfficial: Boolean(raw.isOfficial ?? raw.official ?? false),
  }
}

const items = computed<DisplayBoothItem[]>(() => {
  return boothItems.map((item, index) => normalizeBoothItem(item, index))
})

const genreOptions = computed<FilterOption[]>(() => {
  const genres = Array.from(new Set(items.value.map((item) => item.genre)))

  return [
    {
      id: 'all',
      label: 'すべて',
    },
    ...genres.map((genre) => ({
      id: genre,
      label: getGenreLabel(genre),
    })),
  ]
})

const areaOptions = computed<FilterOption[]>(() => {
  const areas = Array.from(new Set(items.value.map((item) => item.area)))

  return [
    {
      id: 'all',
      label: '全エリア',
    },
    ...areas.map((area) => ({
      id: area,
      label: getAreaLabel(area),
    })),
  ]
})

const filteredItems = computed(() => {
  const searchText = keyword.value.trim().toLowerCase()

  return items.value.filter((item) => {
    const matchesKeyword =
      !searchText ||
      [
        item.name,
        item.genre,
        item.area,
        item.location,
        item.description,
        ...item.tags,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchText)

    const matchesGenre =
      selectedGenre.value === 'all' || item.genre === selectedGenre.value

    const matchesArea =
      selectedArea.value === 'all' || item.area === selectedArea.value

    const matchesFavorite =
      !showFavoritesOnly.value || isFavorite(item.id)

    return matchesKeyword && matchesGenre && matchesArea && matchesFavorite
  })
})

const favoriteItems = computed(() => {
  return items.value.filter((item) => isFavorite(item.id))
})

const isFiltering = computed(() => {
  return (
    keyword.value.trim() !== '' ||
    selectedGenre.value !== 'all' ||
    selectedArea.value !== 'all' ||
    showFavoritesOnly.value
  )
})

const isFavorite = (itemId: string) => {
  return favoriteIds.value.includes(itemId)
}

const toggleFavorite = (itemId: string) => {
  if (isFavorite(itemId)) {
    favoriteIds.value = favoriteIds.value.filter((id) => id !== itemId)
    return
  }

  favoriteIds.value = [...favoriteIds.value, itemId]
}

const clearFilters = () => {
  keyword.value = ''
  selectedGenre.value = 'all'
  selectedArea.value = 'all'
  showFavoritesOnly.value = false
}

const getGenreLabel = (genre: string) => {
  const labels: Record<string, string> = {
    food: 'フード',
    goods: '物販',
    booth: 'ブース',
    exhibit: '展示',
    event: '企画',
    rest: '休憩',
    other: 'その他',
  }

  return labels[genre] ?? genre
}

const getAreaLabel = (area: string) => {
  const labels: Record<string, string> = {
    stadium: 'サンマリンスタジアム',
    expo: 'ひなたエキスポ',
    mall: 'ひなたモール',
    camp: 'キャンプエリア',
    outside: '会場外',
    unknown: '未確認',
  }

  return labels[area] ?? area
}

const getGenreClass = (genre: string) => {
  const classes: Record<string, string> = {
    food: 'border-orange-200 bg-orange-50/80 text-orange-800',
    goods: 'border-purple-200 bg-purple-50/80 text-purple-800',
    booth: 'border-emerald-200 bg-emerald-50/80 text-emerald-800',
    exhibit: 'border-sky-200 bg-sky-50/80 text-sky-800',
    event: 'border-sky-200 bg-sky-50/80 text-sky-800',
    rest: 'border-teal-200 bg-teal-50/80 text-teal-800',
    other: 'border-slate-200 bg-white text-slate-700',
  }

  return classes[genre] ?? classes.other
}

const loadFavorites = () => {
  try {
    const saved = localStorage.getItem(FAVORITE_STORAGE_KEY)

    if (saved) {
      favoriteIds.value = JSON.parse(saved)
    }
  } catch {
    favoriteIds.value = []
  }
}

const saveFavorites = () => {
  if (!hasMounted.value) {
    return
  }

  localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(favoriteIds.value))
}

onMounted(() => {
  loadFavorites()
  hasMounted.value = true
})

watch(favoriteIds, saveFavorites, {
  deep: true,
})
</script>

<template>
  <main class="min-h-screen bg-[#f7fbfc] pb-24 text-slate-900">
    <div class="mx-auto max-w-md px-4 py-4">
      <!-- ヘッダー -->
      <section class="rounded-xl border border-sky-100 bg-white px-3 py-3 shadow-sm">
        <p class="text-xs font-black tracking-[0.16em] text-sky-700">
          BOOTH GUIDE
        </p>

        <div class="mt-1 flex items-end justify-between gap-3">
          <div>
            <h1 class="text-[1.35rem] font-black leading-tight">
              出店・ブース
            </h1>
            <p class="mt-1 text-sm font-medium leading-snug text-slate-700">
              食べる・買う・見る場所を、エリア別に確認します。
            </p>
          </div>

          <NuxtLink
            to="/"
            class="shrink-0 rounded-md border border-sky-200 bg-white px-2 py-1 text-xs font-black shadow-sm active:bg-sky-50"
          >
            TOP
          </NuxtLink>
        </div>
      </section>

      <!-- 検索・絞り込み -->
      <section class="sticky top-0 z-20 -mx-4 mt-3 border-y border-sky-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-black text-slate-500">
              表示件数
            </p>
            <p class="mt-0.5 text-xl font-black leading-none">
              {{ filteredItems.length }} / {{ items.length }}
            </p>
          </div>

          <button
            type="button"
            class="rounded-lg border px-3 py-2 text-xs font-black shadow-sm active:translate-y-[1px]"
            :class="
              showFavoritesOnly
                ? 'border-amber-200 bg-amber-50 text-amber-950'
                : 'border-slate-200 bg-white text-slate-700'
            "
            @click="showFavoritesOnly = !showFavoritesOnly"
          >
            ★ お気に入り
          </button>
        </div>

        <input
          v-model="keyword"
          type="search"
          placeholder="店名・場所・ジャンルで検索"
          class="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base font-bold outline-none transition focus:border-sky-300 focus:bg-sky-50/30"
        >

        <div class="mt-3 -mx-4 overflow-x-auto px-4">
          <div class="flex w-max gap-2 pb-1">
            <button
              v-for="option in genreOptions"
              :key="option.id"
              type="button"
              class="rounded-lg border px-3 py-2 text-xs font-black shadow-sm active:translate-y-[1px]"
              :class="
                selectedGenre === option.id
                  ? 'border-sky-200 bg-sky-700 text-white'
                  : 'border-slate-200 bg-white text-slate-700'
              "
              @click="selectedGenre = option.id"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="mt-2 -mx-4 overflow-x-auto px-4">
          <div class="flex w-max gap-2 pb-1">
            <button
              v-for="option in areaOptions"
              :key="option.id"
              type="button"
              class="rounded-lg border px-3 py-2 text-xs font-black shadow-sm active:translate-y-[1px]"
              :class="
                selectedArea === option.id
                  ? 'border-sky-200 bg-sky-50 text-sky-950'
                  : 'border-slate-200 bg-white text-slate-700'
              "
              @click="selectedArea = option.id"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- お気に入りメモ -->
      <section
        v-if="favoriteItems.length > 0 && !showFavoritesOnly"
        class="mt-4 rounded-lg border border-amber-100 bg-amber-50/80 px-3 py-3 shadow-sm"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-black text-amber-800">
              あとで見る
            </p>
            <p class="mt-1 text-sm font-black leading-snug text-amber-950">
              お気に入り {{ favoriteItems.length }}件
            </p>
          </div>

          <button
            type="button"
            class="shrink-0 rounded-md border border-amber-200 bg-white px-2 py-1 text-xs font-black text-amber-900 shadow-sm"
            @click="showFavoritesOnly = true"
          >
            表示
          </button>
        </div>
      </section>

      <!-- 一覧 -->
      <section class="mt-4">
        <div class="mb-2 flex items-end justify-between gap-3">
          <h2 class="text-base font-black">
            会場案内
          </h2>

          <button
            v-if="isFiltering"
            type="button"
            class="text-xs font-black text-sky-700 underline underline-offset-4"
            @click="clearFilters"
          >
            絞り込み解除
          </button>
        </div>

        <div
          v-if="filteredItems.length === 0"
          class="border-y border-dashed border-slate-200 bg-white px-3 py-5 text-center"
        >
          <p class="text-sm font-black">
            該当する出店・ブースがありません
          </p>
          <p class="mt-1 text-xs font-medium text-slate-600">
            検索語、ジャンル、エリアを変更してください。
          </p>
        </div>

        <ul v-else class="border-y border-slate-200 bg-white">
          <li
            v-for="item in filteredItems"
            :key="item.id"
            class="border-b border-dashed border-slate-200 last:border-b-0"
          >
            <div class="px-3 py-3">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      class="rounded-md border px-1.5 py-0.5 text-[10px] font-black"
                      :class="getGenreClass(item.genre)"
                    >
                      {{ getGenreLabel(item.genre) }}
                    </span>

                    <span class="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-black text-slate-600">
                      {{ getAreaLabel(item.area) }}
                    </span>

                    <span
                      v-if="item.isRecommended"
                      class="rounded-md border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[10px] font-black text-orange-700"
                    >
                      注目
                    </span>

                    <span
                      v-if="item.isOfficial"
                      class="rounded-md border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[10px] font-black text-sky-700"
                    >
                      公式
                    </span>
                  </div>

                  <p class="mt-2 text-base font-black leading-snug">
                    {{ item.name }}
                  </p>

                  <p
                    v-if="item.location"
                    class="mt-1 text-sm font-bold leading-snug text-slate-700"
                  >
                    場所：{{ item.location }}
                  </p>

                  <p
                    v-if="item.openingHours"
                    class="mt-1 text-sm font-bold leading-snug text-slate-700"
                  >
                    時間：{{ item.openingHours }}
                  </p>

                  <p
                    v-if="item.description"
                    class="mt-1 text-sm font-medium leading-relaxed text-slate-600"
                  >
                    {{ item.description }}
                  </p>

                  <div
                    v-if="item.tags.length > 0"
                    class="mt-2 flex flex-wrap gap-1.5"
                  >
                    <span
                      v-for="tag in item.tags"
                      :key="tag"
                      class="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-slate-600"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  class="shrink-0 rounded-md border px-2 py-1 text-sm font-black shadow-sm active:translate-y-[1px]"
                  :class="
                    isFavorite(item.id)
                      ? 'border-amber-200 bg-amber-50 text-amber-950'
                      : 'border-slate-200 bg-white text-slate-500'
                  "
                  :aria-pressed="isFavorite(item.id)"
                  @click="toggleFavorite(item.id)"
                >
                  ★
                </button>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <section class="mt-8">
        <div class="mb-4">
          <p class="text-xs font-black tracking-[0.12em] text-sky-600">
            HINA-AI AREA
          </p>

          <h2 class="mt-1 text-xl font-black text-slate-900">
            「日向坂で会いましょう」エリア
          </h2>

          <p class="mt-2 text-sm leading-6 text-slate-600">
            番組から生まれた体験コンテンツや展示を楽しめます。
          </p>
        </div>

        <div
          class="mb-5 rounded-2xl border border-slate-200 bg-white p-4"
        >
          <p class="text-sm font-black text-slate-900">
            🎫 整理券について
          </p>

          <div class="mt-3 space-y-3">
            <div class="flex items-start gap-3">
              <TicketBadge type="required" />

              <p class="flex-1 text-xs leading-5 text-slate-600">
                そのコンテンツ自体への参加に整理券が必要です。
              </p>
            </div>

            <div class="flex items-start gap-3">
              <TicketBadge type="venue-timed" />

              <p class="flex-1 text-xs leading-5 text-slate-600">
                コンテンツ個別ではなく、施設への入場に時間別整理券が必要です。
              </p>
            </div>

            <div class="flex items-start gap-3">
              <TicketBadge type="none" />

              <p class="flex-1 text-xs leading-5 text-slate-600">
                現時点で整理券が必要との案内はありません。
              </p>
            </div>
          </div>
        </div>

        <!-- ひなたエキスポ -->
        <div>
          <div class="mb-3 flex items-center justify-between gap-3">
            <div>
              <p class="text-xs font-bold text-emerald-600">
                ひなたエキスポ
              </p>

              <h3 class="font-black text-slate-900">
                第2陸上競技場
              </h3>
            </div>

            <span
              class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
            >
              3コンテンツ
            </span>
          </div>

          <div class="space-y-3">
            <article
              v-for="booth in hinataExpoBooths"
              :key="booth.id"
              class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div class="flex flex-wrap gap-2">
                <TicketBadge :type="booth.ticketType" />

                <span
                  v-if="booth.prizeAvailable"
                  class="rounded-full bg-pink-100 px-2.5 py-1 text-[11px] font-black text-pink-700"
                >
                  賞品あり
                </span>
              </div>

              <h4 class="mt-3 font-black leading-6 text-slate-900">
                {{ booth.name }}
              </h4>

              <p class="mt-1 text-xs font-bold text-sky-700">
                {{ booth.presenters.join('・') }} presents
              </p>

              <p class="mt-3 text-sm leading-6 text-slate-600">
                {{ booth.description }}
              </p>

              <div
                v-if="booth.ticketNote"
                class="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3"
              >
                <p class="text-xs font-bold leading-5 text-amber-800">
                  🎫 {{ booth.ticketNote }}
                </p>
              </div>
            </article>
          </div>
        </div>

        <!-- ひなた武道館 -->
        <div class="mt-8">
          <div class="mb-3 flex items-center justify-between gap-3">
            <div>
              <p class="text-xs font-bold text-sky-600">
                ひなた武道館
              </p>

              <h3 class="font-black text-slate-900">
                冷房完備エリア
              </h3>
            </div>

            <span
              class="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700"
            >
              2コンテンツ
            </span>
          </div>

          <div
            class="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3"
          >
            <p class="text-sm font-black text-amber-900">
              🎫 武道館は時間別整理券制
            </p>

            <p class="mt-1 text-xs leading-5 text-amber-800">
              整理券を持っていない場合、入場できない場合があります。
            </p>
          </div>

          <div class="space-y-3">
            <article
              v-for="booth in hinataBudokanBooths"
              :key="booth.id"
              class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <TicketBadge :type="booth.ticketType" />

              <h4 class="mt-3 font-black leading-6 text-slate-900">
                {{ booth.name }}
              </h4>

              <p class="mt-1 text-xs font-bold text-sky-700">
                {{ booth.presenters.join('・') }} presents
              </p>

              <p class="mt-3 text-sm leading-6 text-slate-600">
                {{ booth.description }}
              </p>

              <div
                v-if="booth.ticketNote"
                class="mt-3 rounded-xl border border-purple-200 bg-purple-50 p-3"
              >
                <p class="text-xs font-bold leading-5 text-purple-800">
                  🎫 {{ booth.ticketNote }}
                </p>
              </div>
            </article>
          </div>
        </div>

        <a
          href="https://www.hinata-fes2026.com/lp/hinaai/"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-sky-200 bg-white px-4 text-sm font-black text-sky-700"
        >
          公式「日向坂で会いましょう」エリアを見る
          <span class="ml-2">↗</span>
        </a>
      </section>

      <!-- 現地メモ -->
      <section class="mt-4 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-3 shadow-sm">
        <h2 class="text-sm font-black text-sky-950">
          探し方メモ
        </h2>
        <p class="mt-1 text-sm font-medium leading-relaxed text-sky-950">
          気になる出店は★で保存。混雑時はエリアで絞って、近い場所から確認すると迷いにくいです。
        </p>
      </section>
    </div>
  </main>
</template>

<style scoped>
main {
  font-family:
    'BIZ UDPGothic',
    'Hiragino Maru Gothic ProN',
    'Hiragino Sans',
    'Noto Sans JP',
    'Meiryo',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

h1,
h2 {
  font-family:
    'BIZ UDPGothic',
    'Hiragino Maru Gothic ProN',
    'Zen Kaku Gothic New',
    'Noto Sans JP',
    system-ui,
    sans-serif;
}
</style>