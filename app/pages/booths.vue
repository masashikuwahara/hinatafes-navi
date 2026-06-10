<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  boothItems,
  type BoothArea,
  type BoothGenre,
} from '~/data/booths'

useHead({
  title: '出店・ブース一覧 | ひなたフェス2026 現地ナビ',
  meta: [
    {
      name: 'description',
      content:
        'ひなたフェス2026の出店・ブース情報をジャンルやエリア別に確認できます。お気に入り保存にも対応しています。',
    },
  ],
})

const selectedGenre = ref<BoothGenre | 'all'>('all')
const selectedArea = ref<BoothArea | 'all'>('all')
const showFavoritesOnly = ref(false)

const { value: favoriteBoothIds } = useLocalStorage<string[]>(
  'booths:favorite-ids',
  [],
)

const genreOptions: Array<{
  value: BoothGenre | 'all'
  label: string
}> = [
  { value: 'all', label: 'すべて' },
  { value: 'food', label: 'フード' },
  { value: 'drink', label: 'ドリンク' },
  { value: 'goods', label: 'グッズ' },
  { value: 'experience', label: '体験' },
  { value: 'rest', label: '休憩' },
  { value: 'info', label: '案内' },
]

const areaOptions: Array<{
  value: BoothArea | 'all'
  label: string
}> = [
  { value: 'all', label: 'すべて' },
  { value: 'food-area', label: 'フードエリア' },
  { value: 'goods-area', label: 'グッズエリア' },
  { value: 'event-area', label: 'イベントエリア' },
  { value: 'support-area', label: 'サポートエリア' },
]

const safeFavoriteBoothIds = computed<string[]>(() => {
  return Array.isArray(favoriteBoothIds.value)
    ? favoriteBoothIds.value.map(String)
    : []
})

const filteredBoothItems = computed(() => {
  return boothItems.filter((booth) => {
    const matchesGenre =
      selectedGenre.value === 'all' || booth.genre === selectedGenre.value

    const matchesArea =
      selectedArea.value === 'all' || booth.area === selectedArea.value

    const matchesFavorite =
      !showFavoritesOnly.value ||
      safeFavoriteBoothIds.value.includes(String(booth.id))

    return matchesGenre && matchesArea && matchesFavorite
  })
})

const favoriteCount = computed(() => safeFavoriteBoothIds.value.length)

const getGenreLabel = (genre: BoothGenre) => {
  return (
    genreOptions.find((option) => option.value === genre)?.label ?? 'その他'
  )
}

const getAreaLabel = (area: BoothArea) => {
  return areaOptions.find((option) => option.value === area)?.label ?? '未設定'
}

const getGenreClass = (genre: BoothGenre) => {
  switch (genre) {
    case 'food':
      return 'bg-orange-100 text-orange-700'
    case 'drink':
      return 'bg-sky-100 text-sky-700'
    case 'goods':
      return 'bg-violet-100 text-violet-700'
    case 'experience':
      return 'bg-pink-100 text-pink-700'
    case 'rest':
      return 'bg-emerald-100 text-emerald-700'
    case 'info':
      return 'bg-slate-100 text-slate-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

const isFavorite = (boothId: number) => {
  return safeFavoriteBoothIds.value.includes(String(boothId))
}

const toggleFavorite = (boothId: number) => {
  const targetId = String(boothId)

  if (isFavorite(boothId)) {
    favoriteBoothIds.value = safeFavoriteBoothIds.value.filter(
      (id) => id !== targetId,
    )
    return
  }

  favoriteBoothIds.value = [...safeFavoriteBoothIds.value, targetId]
}
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 pb-24 pt-6">
    <section class="rounded-3xl bg-gradient-to-br from-sky-100 via-white to-yellow-50 p-5 shadow-sm">
      <p class="text-sm font-bold text-sky-600">
        Booths
      </p>

      <h1 class="mt-2 text-2xl font-bold text-slate-900">
        出店・ブース一覧
      </h1>

      <p class="mt-3 text-sm leading-7 text-slate-600">
        フード、グッズ、休憩、案内などのブース情報を確認できます。
        気になるブースはお気に入りに保存できます。
      </p>
    </section>

    <section class="mt-6 rounded-3xl border border-yellow-100 bg-yellow-50 p-4">
      <h2 class="text-sm font-bold text-yellow-800">
        公式情報について
      </h2>

      <p class="mt-2 text-xs leading-6 text-yellow-800">
        現在のブース情報は仮データです。実際の出店内容、営業時間、場所は公式発表後に更新してください。
      </p>
    </section>

    <section class="mt-6 space-y-4">
      <div>
        <h2 class="text-sm font-bold text-slate-700">
          ジャンルで絞り込み
        </h2>

        <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="genre in genreOptions"
            :key="genre.value"
            type="button"
            class="shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition"
            :class="
              selectedGenre === genre.value
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 bg-white text-slate-600'
            "
            @click="selectedGenre = genre.value"
          >
            {{ genre.label }}
          </button>
        </div>
      </div>

      <div>
        <h2 class="text-sm font-bold text-slate-700">
          エリアで絞り込み
        </h2>

        <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="area in areaOptions"
            :key="area.value"
            type="button"
            class="shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition"
            :class="
              selectedArea === area.value
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 bg-white text-slate-600'
            "
            @click="selectedArea = area.value"
          >
            {{ area.label }}
          </button>
        </div>
      </div>

      <div class="rounded-3xl bg-white p-4 shadow-sm">
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition"
          :class="
            showFavoritesOnly
              ? 'border-pink-300 bg-pink-50 text-pink-700'
              : 'border-slate-200 bg-white text-slate-700'
          "
          @click="showFavoritesOnly = !showFavoritesOnly"
        >
          <span>
            <span class="block text-sm font-bold">
              お気に入りのみ表示
            </span>
            <span class="mt-1 block text-xs text-slate-500">
              保存済み：{{ favoriteCount }}件
            </span>
          </span>

          <span class="text-xl">
            {{ showFavoritesOnly ? '♥' : '♡' }}
          </span>
        </button>
      </div>
    </section>

    <section class="mt-6">
      <div class="flex items-end justify-between">
        <h2 class="text-lg font-bold text-slate-900">
          ブース一覧
        </h2>

        <p class="text-xs text-slate-500">
          {{ filteredBoothItems.length }}件
        </p>
      </div>

      <div
        v-if="filteredBoothItems.length > 0"
        class="mt-4 space-y-4"
      >
        <article
          v-for="booth in filteredBoothItems"
          :key="booth.id"
          class="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-bold"
                  :class="getGenreClass(booth.genre)"
                >
                  {{ getGenreLabel(booth.genre) }}
                </span>

                <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                  {{ getAreaLabel(booth.area) }}
                </span>
              </div>

              <h3 class="mt-3 text-base font-bold text-slate-900">
                {{ booth.name }}
              </h3>
            </div>

            <button
              type="button"
              class="shrink-0 rounded-full border px-3 py-2 text-lg transition"
              :class="
                isFavorite(booth.id)
                  ? 'border-pink-300 bg-pink-50 text-pink-500'
                  : 'border-slate-200 bg-white text-slate-400'
              "
              :aria-label="
                isFavorite(booth.id)
                  ? `${booth.name}をお気に入りから外す`
                  : `${booth.name}をお気に入りに追加する`
              "
              @click="toggleFavorite(booth.id)"
            >
              {{ isFavorite(booth.id) ? '♥' : '♡' }}
            </button>
          </div>

          <div class="mt-3 space-y-1 text-sm text-slate-600">
            <p>
              <span class="font-bold text-slate-700">場所：</span>
              {{ booth.place }}
            </p>

            <p>
              <span class="font-bold text-slate-700">時間：</span>
              {{ booth.openingHours }}
            </p>
          </div>

          <p class="mt-3 text-sm leading-7 text-slate-600">
            {{ booth.description }}
          </p>

          <p
            v-if="booth.notes"
            class="mt-3 rounded-2xl bg-sky-50 px-3 py-2 text-xs leading-6 text-sky-700"
          >
            {{ booth.notes }}
          </p>

          <div
            v-if="booth.tags.length > 0"
            class="mt-3 flex flex-wrap gap-2"
          >
            <span
              v-for="tag in booth.tags"
              :key="tag"
              class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500"
            >
              #{{ tag }}
            </span>
          </div>
        </article>
      </div>

      <div
        v-else
        class="mt-4 rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center"
      >
        <p class="text-sm font-bold text-slate-700">
          条件に一致するブースがありません
        </p>

        <p class="mt-2 text-xs text-slate-500">
          ジャンル、エリア、お気に入り条件を変更してください。
        </p>
      </div>
    </section>
  </main>
</template>