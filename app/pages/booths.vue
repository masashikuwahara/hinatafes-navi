<script setup lang="ts">
import {
  boothGenreOptions,
  booths,
  type Booth,
  type BoothGenre,
} from '~/data/booths'

type GenreFilter = BoothGenre | 'all'

useHead({
  title: '出店・ブース一覧 | ひなたフェス2026 現地ナビ',
  meta: [
    {
      name: 'description',
      content:
        'ひなたフェス2026の出店・ブース情報を確認できます。気になるブースはお気に入りとして端末に保存できます。',
    },
  ],
})

const selectedGenre = ref<GenreFilter>('all')
const showFavoritesOnly = ref(false)

const { value: favoriteBoothIds, reset } = useLocalStorage<string[]>(
  'booths:favorite-ids',
  [],
)

const favoriteCount = computed(() => favoriteBoothIds.value.length)

const filteredBooths = computed(() => {
  return booths.filter((booth) => {
    const matchesGenre =
      selectedGenre.value === 'all' || booth.genre === selectedGenre.value

    const matchesFavorite =
      !showFavoritesOnly.value || favoriteBoothIds.value.includes(booth.id)

    return matchesGenre && matchesFavorite
  })
})

const isFavorite = (boothId: string) => {
  return favoriteBoothIds.value.includes(boothId)
}

const toggleFavorite = (booth: Booth) => {
  if (isFavorite(booth.id)) {
    favoriteBoothIds.value = favoriteBoothIds.value.filter((id) => id !== booth.id)
    return
  }

  favoriteBoothIds.value = [...favoriteBoothIds.value, booth.id]
}

const selectGenre = (genre: GenreFilter) => {
  selectedGenre.value = genre
}

const toggleFavoritesOnly = () => {
  showFavoritesOnly.value = !showFavoritesOnly.value
}

const resetFavorites = () => {
  if (!import.meta.client) {
    return
  }

  const confirmed = window.confirm('お気に入りをすべて解除しますか？')

  if (!confirmed) {
    return
  }

  reset()
  showFavoritesOnly.value = false
}

const getGenreOption = (genre: BoothGenre) => {
  return boothGenreOptions.find((option) => option.key === genre)
}

const getGenreLabel = (genre: BoothGenre) => {
  return getGenreOption(genre)?.label ?? genre
}

const getGenreIcon = (genre: BoothGenre) => {
  return getGenreOption(genre)?.icon ?? '📍'
}

const getGenreClass = (genre: BoothGenre) => {
  if (genre === 'food') {
    return 'bg-orange-100 text-orange-700'
  }

  if (genre === 'drink') {
    return 'bg-sky-100 text-sky-700'
  }

  if (genre === 'goods') {
    return 'bg-pink-100 text-pink-700'
  }

  if (genre === 'rest') {
    return 'bg-emerald-100 text-emerald-700'
  }

  return 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6">
    <section
      class="rounded-3xl bg-gradient-to-br from-sky-100 via-white to-yellow-50 p-5 shadow-sm ring-1 ring-sky-100 sm:p-6"
    >
      <p class="text-sm font-bold text-sky-600">
        BOOTHS
      </p>

      <h1 class="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        出店・ブース一覧
      </h1>

      <p class="mt-3 text-sm leading-7 text-slate-600">
        気になる出店やブースをお気に入りに保存できます。
        現在は仮データです。公式情報公開後に内容を差し替えます。
      </p>

      <div class="mt-5 grid grid-cols-2 gap-3">
        <div class="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100">
          <p class="text-xs font-bold text-slate-500">
            表示中
          </p>
          <p class="mt-1 text-2xl font-bold text-slate-900">
            {{ filteredBooths.length }}
          </p>
        </div>

        <div class="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100">
          <p class="text-xs font-bold text-slate-500">
            お気に入り
          </p>
          <p class="mt-1 text-2xl font-bold text-sky-600">
            {{ favoriteCount }}
          </p>
        </div>
      </div>
    </section>

    <section class="mt-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <h2 class="text-sm font-bold text-slate-900">
        ジャンルで絞り込み
      </h2>

      <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="option in boothGenreOptions"
          :key="option.key"
          type="button"
          class="shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition active:scale-[0.98]"
          :class="
            selectedGenre === option.key
              ? 'border-sky-400 bg-sky-500 text-white shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          "
          @click="selectGenre(option.key)"
        >
          <span class="mr-1">{{ option.icon }}</span>
          {{ option.label }}
        </button>
      </div>

      <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          class="rounded-2xl border px-4 py-3 text-sm font-bold transition active:scale-[0.98]"
          :class="
            showFavoritesOnly
              ? 'border-yellow-300 bg-yellow-100 text-yellow-800'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          "
          @click="toggleFavoritesOnly"
        >
          ★ お気に入りのみ表示
        </button>

        <button
          type="button"
          class="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50 active:scale-[0.98]"
          @click="resetFavorites"
        >
          お気に入りリセット
        </button>
      </div>
    </section>

    <section class="mt-6 space-y-4">
      <article
        v-for="booth in filteredBooths"
        :key="booth.id"
        class="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="rounded-full px-2.5 py-1 text-xs font-bold"
                :class="getGenreClass(booth.genre)"
              >
                {{ getGenreIcon(booth.genre) }}
                {{ getGenreLabel(booth.genre) }}
              </span>

              <span
                v-if="booth.isPlaceholder"
                class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500"
              >
                仮データ
              </span>
            </div>

            <h2 class="mt-3 text-lg font-bold leading-7 text-slate-900">
              {{ booth.name }}
            </h2>

            <p class="mt-2 text-sm leading-7 text-slate-600">
              {{ booth.description }}
            </p>
          </div>

          <button
            type="button"
            class="flex size-12 shrink-0 items-center justify-center rounded-2xl border text-xl transition active:scale-[0.95]"
            :class="
              isFavorite(booth.id)
                ? 'border-yellow-300 bg-yellow-100 text-yellow-600'
                : 'border-slate-200 bg-white text-slate-300 hover:bg-slate-50'
            "
            :aria-label="isFavorite(booth.id) ? 'お気に入り解除' : 'お気に入り追加'"
            @click="toggleFavorite(booth)"
          >
            ★
          </button>
        </div>

        <div class="mt-4 rounded-2xl bg-slate-50 p-3">
          <p class="text-xs font-bold text-slate-500">
            場所
          </p>
          <p class="mt-1 text-sm font-bold text-slate-800">
            {{ booth.area }}
          </p>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="tag in booth.tags"
            :key="tag"
            class="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-100"
          >
            #{{ tag }}
          </span>
        </div>

        <p
          v-if="booth.note"
          class="mt-3 text-xs leading-5 text-slate-500"
        >
          ※ {{ booth.note }}
        </p>
      </article>

      <div
        v-if="filteredBooths.length === 0"
        class="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100"
      >
        <p class="text-3xl">
          🔍
        </p>
        <h2 class="mt-3 font-bold text-slate-900">
          表示できるブースがありません
        </h2>
        <p class="mt-2 text-sm leading-7 text-slate-500">
          ジャンルやお気に入り条件を変更してみてください。
        </p>
      </div>
    </section>
  </main>
</template>