<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  getSpotArea,
  getSpotCategory,
  spotAreas,
  spotCategories,
  spots,
  type SpotArea,
  type SpotCategory,
} from '~/data/spots'

const {
  status: geolocationStatus,
  location: currentLocation,
  errorMessage: geolocationErrorMessage,
  isSupported: isGeolocationSupported,
  getCurrentLocation,
  clearLocation,
} = useGeolocation()

const geolocationStatusLabel = computed(() => {
  if (geolocationStatus.value === 'loading') {
    return '現在地を取得中'
  }

  if (geolocationStatus.value === 'success') {
    return '現在地を取得済み'
  }

  if (geolocationStatus.value === 'error') {
    return '現在地を取得できませんでした'
  }

  if (geolocationStatus.value === 'unsupported') {
    return '位置情報非対応'
  }

  return '未取得'
})

const currentLocationAccuracyLabel = computed(() => {
  if (!currentLocation.value) {
    return ''
  }

  return `誤差 約${Math.round(currentLocation.value.accuracy)}m`
})

useHead({
  title: '会場マップ・スポット一覧 | ひなたフェス2026 現地ナビ',
  meta: [
    {
      name: 'description',
      content:
        'ひなたフェス2026の会場内スポット、入口、グッズ、飲食、休憩、給水、トイレ、救護などを確認できるページです。',
    },
  ],
})

const selectedCategory = ref<SpotCategory | 'all'>('all')
const selectedArea = ref<SpotArea | 'all'>('all')
const keyword = ref('')
const importantOnly = ref(false)

const filteredSpots = computed(() => {
  const searchText = keyword.value.trim().toLowerCase()

  return [...spots]
    .filter((spot) => {
      if (selectedCategory.value !== 'all' && spot.category !== selectedCategory.value) {
        return false
      }

      if (selectedArea.value !== 'all' && spot.area !== selectedArea.value) {
        return false
      }

      if (importantOnly.value && !spot.isImportant) {
        return false
      }

      if (searchText) {
        const targetText = [
          spot.name,
          spot.description,
          spot.memo,
          ...spot.tags,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return targetText.includes(searchText)
      }

      return true
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)
})

const importantSpots = computed(() => {
  return spots
    .filter((spot) => spot.isImportant)
    .sort((a, b) => a.sortOrder - b.sortOrder)
})

const mappableSpots = computed(() => {
  return spots.filter(
    (spot) => spot.latitude !== null && spot.longitude !== null
  )
})

const unmappedSpots = computed(() => {
  return spots.filter(
    (spot) => spot.latitude === null || spot.longitude === null
  )
})

const resetFilters = () => {
  selectedCategory.value = 'all'
  selectedArea.value = 'all'
  keyword.value = ''
  importantOnly.value = false
}

const getCoordinateStatusLabel = (status: 'confirmed' | 'approximate' | 'unknown') => {
  if (status === 'confirmed') {
    return '位置確定'
  }

  if (status === 'approximate') {
    return 'おおよその位置'
  }

  return '位置未設定'
}

const getCoordinateStatusClass = (status: 'confirmed' | 'approximate' | 'unknown') => {
  if (status === 'confirmed') {
    return 'border-sky-200 bg-sky-50 text-sky-700'
  }

  if (status === 'approximate') {
    return 'border-amber-200 bg-amber-50 text-amber-700'
  }

  return 'border-slate-200 bg-slate-50 text-slate-500'
}
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 pb-24 pt-6">
    <!-- ページ見出し -->
    <section class="rounded-3xl bg-gradient-to-br from-sky-100 via-white to-yellow-50 p-5 shadow-sm">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-sky-500">
        MAP
      </p>

      <h1 class="mt-2 text-2xl font-bold text-slate-900">
        会場マップ・スポット一覧
      </h1>

      <p class="mt-3 text-sm leading-7 text-slate-600">
        入口、グッズ、飲食、休憩、給水、トイレ、救護など、現地で確認したいスポットをまとめます。
        位置情報や地図表示は今後追加予定です。
      </p>
    </section>

    <!-- 重要スポット -->
    <section class="mt-6">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900">
            まず確認したい場所
          </h2>
          <p class="mt-1 text-xs text-slate-500">
            入口・休憩・給水・救護など、当日使う可能性が高いスポットです。
          </p>
        </div>
      </div>

      <div class="mt-3 flex gap-3 overflow-x-auto pb-2">
        <article
          v-for="spot in importantSpots"
          :key="spot.id"
          class="min-w-[220px] rounded-2xl border border-sky-100 bg-white p-4 shadow-sm"
        >
          <div class="flex items-center gap-2">
            <span class="text-xl">
              {{ getSpotCategory(spot.category)?.icon }}
            </span>
            <span class="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-600">
              {{ getSpotCategory(spot.category)?.label }}
            </span>
          </div>

          <h3 class="mt-3 text-sm font-bold leading-6 text-slate-900">
            {{ spot.name }}
          </h3>

          <p class="mt-2 line-clamp-3 text-xs leading-6 text-slate-600">
            {{ spot.description }}
          </p>
        </article>
      </div>
    </section>

    <!-- 簡易マップ -->
    <section class="mt-6 rounded-3xl border border-sky-100 bg-white p-4 shadow-sm">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900">
            簡易マップ
          </h2>
          <p class="mt-1 text-xs text-slate-500">
            座標が登録されているスポットを地図上に表示します。
          </p>
        </div>

        <span class="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-600">
          OpenStreetMap
        </span>
      </div>

      <div class="mt-4">
        <ClientOnly>
          <SpotLeafletMap
            :spots="filteredSpots"
            :current-location="currentLocation"
          />

          <template #fallback>
            <div class="grid min-h-[280px] place-items-center rounded-3xl border border-dashed border-sky-200 bg-sky-50 p-6 text-center">
              <div>
                <div class="mx-auto flex size-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm">
                  🗺️
                </div>

                <p class="mt-4 text-sm font-bold text-slate-700">
                  地図を読み込み中です
                </p>
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>

      <div class="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-sm font-bold text-slate-800">
              現在地
            </h3>

            <p class="mt-1 text-xs leading-6 text-slate-500">
              ボタンを押すと、ブラウザの許可後に現在地を地図上へ表示します。
            </p>
          </div>

          <span
            class="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold"
            :class="
              geolocationStatus === 'success'
                ? 'bg-sky-100 text-sky-700'
                : geolocationStatus === 'error' || geolocationStatus === 'unsupported'
                  ? 'bg-rose-100 text-rose-700'
                  : geolocationStatus === 'loading'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-white text-slate-500'
            "
          >
            {{ geolocationStatusLabel }}
          </span>
        </div>

        <div class="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            class="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
            :disabled="geolocationStatus === 'loading' || !isGeolocationSupported"
            @click="getCurrentLocation"
          >
            <span v-if="geolocationStatus === 'loading'">
              取得中...
            </span>
            <span v-else>
              現在地を取得する
            </span>
          </button>

          <button
            v-if="currentLocation"
            type="button"
            class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600"
            @click="clearLocation"
          >
            現在地を消す
          </button>
        </div>

        <div
          v-if="currentLocation"
          class="mt-3 rounded-2xl bg-white px-4 py-3 text-xs leading-6 text-slate-600"
        >
          <p class="font-bold text-slate-700">
            {{ currentLocationAccuracyLabel }}
          </p>
          <p class="mt-1">
            緯度：{{ currentLocation.latitude.toFixed(6) }} /
            経度：{{ currentLocation.longitude.toFixed(6) }}
          </p>
        </div>

        <p
          v-if="geolocationErrorMessage"
          class="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-xs leading-6 text-rose-700"
        >
          {{ geolocationErrorMessage }}
        </p>

        <p
          v-if="!isGeolocationSupported"
          class="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-xs leading-6 text-rose-700"
        >
          このブラウザでは位置情報を利用できません。
        </p>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <span class="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
          座標あり：{{ mappableSpots.length }}件
        </span>

        <span class="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
          座標未設定：{{ unmappedSpots.length }}件
        </span>
      </div>

      <div class="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
        <p class="text-xs leading-6 text-slate-500">
          公式マップ画像は使用せず、スポットデータの座標をもとに地図表示します。
          正式な会場情報が出たら data/spots.ts の座標を更新します。
        </p>
      </div>
    </section>

    <!-- フィルター -->
    <section class="mt-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-bold text-slate-900">
            スポットを探す
          </h2>
          <p class="mt-1 text-xs text-slate-500">
            カテゴリ・エリア・キーワードで絞り込めます。
          </p>
        </div>

        <button
          type="button"
          class="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500"
          @click="resetFilters"
        >
          リセット
        </button>
      </div>

      <div class="mt-4">
        <label for="spot-keyword" class="text-xs font-bold text-slate-600">
          キーワード
        </label>
        <input
          id="spot-keyword"
          v-model="keyword"
          type="search"
          placeholder="例：トイレ、給水、グッズ"
          class="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
        >
      </div>

      <div class="mt-4">
        <p class="text-xs font-bold text-slate-600">
          カテゴリ
        </p>

        <div class="mt-2 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            class="shrink-0 rounded-full border px-3 py-2 text-xs font-bold transition"
            :class="
              selectedCategory === 'all'
                ? 'border-sky-400 bg-sky-500 text-white'
                : 'border-slate-200 bg-white text-slate-600'
            "
            @click="selectedCategory = 'all'"
          >
            すべて
          </button>

          <button
            v-for="category in spotCategories"
            :key="category.value"
            type="button"
            class="shrink-0 rounded-full border px-3 py-2 text-xs font-bold transition"
            :class="
              selectedCategory === category.value
                ? 'border-sky-400 bg-sky-500 text-white'
                : 'border-slate-200 bg-white text-slate-600'
            "
            @click="selectedCategory = category.value"
          >
            <span class="mr-1">{{ category.icon }}</span>
            {{ category.label }}
          </button>
        </div>
      </div>

      <div class="mt-4">
        <p class="text-xs font-bold text-slate-600">
          エリア
        </p>

        <div class="mt-2 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            class="shrink-0 rounded-full border px-3 py-2 text-xs font-bold transition"
            :class="
              selectedArea === 'all'
                ? 'border-yellow-400 bg-yellow-300 text-slate-900'
                : 'border-slate-200 bg-white text-slate-600'
            "
            @click="selectedArea = 'all'"
          >
            すべて
          </button>

          <button
            v-for="area in spotAreas"
            :key="area.value"
            type="button"
            class="shrink-0 rounded-full border px-3 py-2 text-xs font-bold transition"
            :class="
              selectedArea === area.value
                ? 'border-yellow-400 bg-yellow-300 text-slate-900'
                : 'border-slate-200 bg-white text-slate-600'
            "
            @click="selectedArea = area.value"
          >
            {{ area.label }}
          </button>
        </div>
      </div>

      <label class="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
        <input
          v-model="importantOnly"
          type="checkbox"
          class="size-5 rounded border-slate-300 text-sky-500 focus:ring-sky-200"
        >
        <span class="text-sm font-bold text-slate-700">
          重要スポットだけ表示する
        </span>
      </label>
    </section>

    <!-- 件数 -->
    <div class="mt-5 flex items-center justify-between">
      <p class="text-sm font-bold text-slate-700">
        {{ filteredSpots.length }}件のスポット
      </p>

      <p class="text-xs text-slate-400">
        仮データを含みます
      </p>
    </div>

    <!-- スポット一覧 -->
    <section class="mt-3 space-y-3">
      <article
        v-for="spot in filteredSpots"
        :key="spot.id"
        class="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex min-w-0 items-start gap-3">
            <div class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-xl">
              {{ getSpotCategory(spot.category)?.icon }}
            </div>

            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-600">
                  {{ getSpotCategory(spot.category)?.label }}
                </span>

                <span
                  class="rounded-full border px-2.5 py-1 text-xs font-bold"
                  :class="getCoordinateStatusClass(spot.coordinateStatus)"
                >
                  {{ getCoordinateStatusLabel(spot.coordinateStatus) }}
                </span>

                <span
                  v-if="spot.isImportant"
                  class="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-700"
                >
                  重要
                </span>
              </div>

              <h2 class="mt-2 text-base font-bold leading-7 text-slate-900">
                {{ spot.name }}
              </h2>

              <p class="mt-1 text-xs font-bold text-slate-500">
                {{ getSpotArea(spot.area)?.label }}
              </p>
            </div>
          </div>
        </div>

        <p class="mt-3 text-sm leading-7 text-slate-600">
          {{ spot.description }}
        </p>

        <p
          v-if="spot.memo"
          class="mt-3 rounded-2xl bg-yellow-50 px-4 py-3 text-xs leading-6 text-yellow-800"
        >
          {{ spot.memo }}
        </p>

        <div
          v-if="spot.tags.length > 0"
          class="mt-3 flex flex-wrap gap-2"
        >
          <span
            v-for="tag in spot.tags"
            :key="tag"
            class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500"
          >
            #{{ tag }}
          </span>
        </div>
      </article>

      <div
        v-if="filteredSpots.length === 0"
        class="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center"
      >
        <p class="text-sm font-bold text-slate-700">
          条件に合うスポットがありません
        </p>
        <p class="mt-2 text-xs leading-6 text-slate-500">
          キーワードやカテゴリを変更して探してください。
        </p>

        <button
          type="button"
          class="mt-4 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm"
          @click="resetFilters"
        >
          条件をリセットする
        </button>
      </div>
    </section>

    <!-- 注意書き -->
    <section class="mt-6 rounded-3xl bg-slate-50 p-4">
      <h2 class="text-sm font-bold text-slate-800">
        位置情報について
      </h2>

      <p class="mt-2 text-xs leading-6 text-slate-500">
        現在はスポット一覧のみの仮表示です。正式な会場情報が出た後、座標や地図表示を追加します。
        公式マップ画像の無断転載は避け、必要に応じて公式サイトへのリンクで案内します。
      </p>
    </section>
  </main>
</template>