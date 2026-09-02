<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  spots,
  spotCategories,
  type SpotCategory,
  type SpotArea,
} from '~/data/spots'
import { eventStatus } from '~/data/eventStatus'

type CoordinateStatus = 'confirmed' | 'approximate'

type DisplaySpot = {
  id: string
  name: string
  category: SpotCategory
  area: SpotArea
  description?: string
  latitude: number
  longitude: number
  coordinateStatus: CoordinateStatus
  isImportant?: boolean
}

type CurrentLocation = {
  latitude: number
  longitude: number
  accuracy: number | null
  updatedAt: string
}

type CategoryFilter = {
  id: SpotCategory | 'all'
  label: string
}

const LOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15_000,
  maximumAge: 5_000,
}

useAppSeo({
  title: '会場マップ｜ひなたフェス2026 開催中止',
  description:
    'ひなたフェス2026は開催中止となりました。開催時に予定されていた会場スポット・マップ情報を記録として掲載しています。',
})

const selectedCategory = ref<SpotCategory | 'all'>('all')
const selectedSpotId = ref<string | null>(null)
const currentLocation = ref<CurrentLocation | null>(null)
const isGettingLocation = ref(false)
const isFollowingLocation = ref(false)
const locationErrorMessage = ref('')
const watchId = ref<number | null>(null)
const followRequestKey = ref(0)

const normalizeSpot = (spot: unknown, index: number): DisplaySpot => {
  const raw = spot as {
    id?: string | number
    slug?: string
    name?: string
    title?: string
    category?: SpotCategory
    type?: SpotCategory
    area?: SpotArea
    areaKey?: SpotArea
    description?: string
    memo?: string
    latitude?: number
    lat?: number
    longitude?: number
    lng?: number
    coordinateStatus?: CoordinateStatus
    coordinate_status?: CoordinateStatus
    isImportant?: boolean
    important?: boolean
  }

  return {
    id: String(raw.id ?? raw.slug ?? `spot-${index}`),
    name: String(raw.name ?? raw.title ?? 'スポット'),
    category: raw.category ?? raw.type ?? 'other',
    area: raw.area ?? raw.areaKey ?? 'unknown',
    description: raw.description ?? raw.memo,
    latitude: Number(raw.latitude ?? raw.lat ?? 0),
    longitude: Number(raw.longitude ?? raw.lng ?? 0),
    coordinateStatus:
      raw.coordinateStatus ?? raw.coordinate_status ?? 'approximate',
    isImportant: Boolean(raw.isImportant ?? raw.important ?? false),
  }
}

const spotItems = computed<DisplaySpot[]>(() => {
  return spots
    .map((spot, index) => normalizeSpot(spot, index))
    .filter((spot) => spot.latitude !== 0 && spot.longitude !== 0)
})

const categoryFilters = computed<CategoryFilter[]>(() => {
  return [
    {
      id: 'all',
      label: 'すべて',
    },
    ...spotCategories.map((category) => ({
      id: category.value,
      label: `${category.icon} ${category.label}`,
    })),
  ]
})

const filteredSpots = computed(() => {
  const items =
    selectedCategory.value === 'all'
      ? spotItems.value
      : spotItems.value.filter((spot) => spot.category === selectedCategory.value)

  return [...items].sort((a, b) => {
    const distanceA = getDistanceFromCurrentLocation(a)
    const distanceB = getDistanceFromCurrentLocation(b)

    if (distanceA === null && distanceB === null) {
      return getCategoryPriority(a.category) - getCategoryPriority(b.category)
    }

    if (distanceA === null) {
      return 1
    }

    if (distanceB === null) {
      return -1
    }

    return distanceA - distanceB
  })
})

const selectedSpot = computed(() => {
  if (!selectedSpotId.value) {
    return null
  }

  return spotItems.value.find((spot) => spot.id === selectedSpotId.value) ?? null
})

const locationStatusText = computed(() => {
  if (isFollowingLocation.value) {
    return '追従中'
  }

  if (currentLocation.value) {
    return '取得済み'
  }

  if (locationErrorMessage.value) {
    return '取得できません'
  }

  return '未取得'
})

const accuracyText = computed(() => {
  if (!currentLocation.value?.accuracy) {
    return '未取得'
  }

  return `約${Math.round(currentLocation.value.accuracy)}m`
})

const updatedAtText = computed(() => {
  if (!currentLocation.value?.updatedAt) {
    return 'まだ更新なし'
  }

  return `${currentLocation.value.updatedAt} 更新`
})

const nearestSpots = computed(() => {
  if (!currentLocation.value) {
    return filteredSpots.value.slice(0, 5)
  }

  return filteredSpots.value
    .filter((spot) => getDistanceFromCurrentLocation(spot) !== null)
    .slice(0, 5)
})

const formatTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    entrance: '入口',
    stage: 'ステージ',
    goods: '物販',
    food: 'フード',
    booth: 'ブース',
    rest: '休憩',
    toilet: 'トイレ',
    water: '給水',
    medical: '救護',
    transport: '交通',
    meeting: '集合',
    other: 'その他',
  }

  return labels[category] ?? category
}

const getAreaLabel = (area: string) => {
  const labels: Record<string, string> = {
    center: '中央',
    north: '北側',
    south: '南側',
    east: '東側',
    west: '西側',
    outside: '会場外',
    unknown: '未確認',
  }

  return labels[area] ?? area
}

const getCategoryPriority = (category: SpotCategory) => {
  const priorities: Record<SpotCategory, number> = {
    medical: 1,
    toilet: 2,
    water: 3,
    transport: 4,
    entrance: 5,
    stage: 6,
    food: 7,
    goods: 8,
    booth: 9,
    rest: 10,
    meeting: 11,
    other: 12,
  }

  return priorities[category] ?? 99
}

const getCategoryClass = (category: string) => {
  const classes: Record<string, string> = {
    entrance: 'border-slate-200 bg-slate-50/80 text-slate-800',
    stage: 'border-sky-200 bg-sky-50/80 text-sky-800',
    goods: 'border-purple-200 bg-purple-50/80 text-purple-800',
    food: 'border-orange-200 bg-orange-50/80 text-orange-800',
    booth: 'border-emerald-200 bg-emerald-50/80 text-emerald-800',
    rest: 'border-teal-200 bg-teal-50/80 text-teal-800',
    toilet: 'border-blue-200 bg-blue-50/80 text-blue-800',
    water: 'border-cyan-200 bg-cyan-50/80 text-cyan-800',
    medical: 'border-red-200 bg-red-50/80 text-red-800',
    transport: 'border-slate-200 bg-slate-50/80 text-slate-800',
    meeting: 'border-amber-200 bg-amber-50/80 text-amber-800',
    other: 'border-slate-200 bg-white text-slate-700',
  }

  return classes[category] ?? classes.other
}

const getDistance = (
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number,
) => {
  const earthRadius = 6_371_000
  const toRadians = (degree: number) => (degree * Math.PI) / 180

  const lat1 = toRadians(fromLatitude)
  const lat2 = toRadians(toLatitude)
  const deltaLat = toRadians(toLatitude - fromLatitude)
  const deltaLng = toRadians(toLongitude - fromLongitude)

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadius * c
}

const getDistanceFromCurrentLocation = (spot: DisplaySpot) => {
  if (!currentLocation.value) {
    return null
  }

  return getDistance(
    currentLocation.value.latitude,
    currentLocation.value.longitude,
    spot.latitude,
    spot.longitude,
  )
}

const formatDistance = (spot: DisplaySpot) => {
  const distance = getDistanceFromCurrentLocation(spot)

  if (distance === null) {
    return '距離未取得'
  }

  if (distance < 1000) {
    return `約${Math.round(distance)}m`
  }

  return `約${(distance / 1000).toFixed(1)}km`
}

const handlePositionSuccess = (position: GeolocationPosition) => {
  currentLocation.value = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    updatedAt: formatTime(),
  }

  locationErrorMessage.value = ''
  isGettingLocation.value = false
}

const handlePositionError = (error: GeolocationPositionError) => {
  const messages: Record<number, string> = {
    1: '位置情報の許可が必要です。',
    2: '現在地を取得できませんでした。',
    3: '現在地の取得がタイムアウトしました。',
  }

  locationErrorMessage.value =
    messages[error.code] ?? '現在地を取得できませんでした。'
  isGettingLocation.value = false
  isFollowingLocation.value = false
}

const getCurrentLocation = () => {
  if (!process.client || !navigator.geolocation) {
    locationErrorMessage.value = 'この端末では位置情報を利用できません。'
    return
  }

  isGettingLocation.value = true

  navigator.geolocation.getCurrentPosition(
    handlePositionSuccess,
    handlePositionError,
    LOCATION_OPTIONS,
  )
}

const startFollowingLocation = () => {
  if (!process.client || !navigator.geolocation) {
    locationErrorMessage.value = 'この端末では位置情報を利用できません。'
    return
  }

  if (watchId.value !== null) {
    navigator.geolocation.clearWatch(watchId.value)
  }

  isGettingLocation.value = true
  isFollowingLocation.value = true

  // 追従ボタンを押すたびに、地図側へ「今すぐ中央へ寄せる」合図を送る
  followRequestKey.value += 1

  watchId.value = navigator.geolocation.watchPosition(
    handlePositionSuccess,
    handlePositionError,
    LOCATION_OPTIONS,
  )
}

const stopFollowingLocation = () => {
  if (!process.client || watchId.value === null) {
    isFollowingLocation.value = false
    return
  }

  navigator.geolocation.clearWatch(watchId.value)
  watchId.value = null
  isFollowingLocation.value = false
}

const selectCategory = (category: SpotCategory | 'all') => {
  selectedCategory.value = category
}

const selectSpot = (spot: DisplaySpot | string) => {
  if (typeof spot === 'string') {
    selectedSpotId.value = spot
    return
  }

  selectedSpotId.value = spot.id
}

const focusSpot = (spot: DisplaySpot) => {
  selectedSpotId.value = spot.id
}

const toiletSpots = computed(() =>
  spotItems.value.filter((spot) => spot.category === 'toilet'),
)

onMounted(() => {
  getCurrentLocation()
})

onUnmounted(() => {
  stopFollowingLocation()
})
</script>

<template>
  <main class="min-h-screen bg-[#f7fbfc] pb-24 text-slate-900">
    <div class="mx-auto max-w-md px-4 py-4">
      <!-- ヘッダー -->
      <section class="rounded-xl border border-sky-100 bg-white px-3 py-3 shadow-sm">
        <p class="text-xs font-black tracking-[0.16em] text-sky-700">
          FIELD MAP
        </p>

        <div class="mt-1 flex items-end justify-between gap-3">
          <div>
            <h1 class="text-[1.35rem] font-black leading-tight">
              会場マップ
            </h1>
            <p class="mt-1 text-sm font-medium leading-snug text-slate-700">
              現在地・スポット・近くの場所を確認します。
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

      <CancelledPageNotice
        class="mt-3"
        page-label="会場マップ"
        description="以下のスポット情報は、開催時の会場案内として準備していた内容です。開催中止後の現地案内としては利用しないでください。"
      />

      <p
        v-if="eventStatus.status === 'cancelled'"
        class="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-900"
      >
        開催中止のため、フェス参加目的で会場へ向かうためのマップとしては使用しないでください。
      </p>

      <!-- 現在地ステータス -->
      <section
        class="sticky top-0 z-30 -mx-4 mt-3 border-y border-sky-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur"
      >
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="border-r border-slate-200 pr-2">
            <p class="text-xs font-black text-slate-500">
              現在地
            </p>
            <p
              class="mt-1 text-base font-black leading-none"
              :class="currentLocation ? 'text-sky-700' : 'text-orange-700'"
            >
              {{ locationStatusText }}
            </p>
          </div>

          <div class="border-r border-slate-200 px-2">
            <p class="text-xs font-black text-slate-500">
              誤差
            </p>
            <p class="mt-1 text-base font-black leading-none">
              {{ accuracyText }}
            </p>
          </div>

          <div class="pl-2">
            <p class="text-xs font-black text-slate-500">
              スポット
            </p>
            <p class="mt-1 text-base font-black leading-none">
              {{ filteredSpots.length }}件
            </p>
          </div>
        </div>

        <p class="mt-2 text-right text-[11px] font-bold text-slate-500">
          {{ updatedAtText }}
        </p>

        <div class="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            class="rounded-lg border border-sky-700 bg-sky-700 px-3 py-2 text-sm font-black text-white shadow-sm active:translate-y-[1px] disabled:opacity-60"
            :disabled="isGettingLocation"
            @click="getCurrentLocation"
          >
            {{ isGettingLocation ? '取得中' : '現在地を更新' }}
          </button>

          <button
            type="button"
            class="rounded-lg border px-3 py-2 text-sm font-black shadow-sm active:translate-y-[1px]"
            :class="
              isFollowingLocation
                ? 'border-orange-200 bg-orange-50 text-orange-950'
                : 'border-slate-200 bg-white text-slate-800'
            "
            @click="
              isFollowingLocation
                ? stopFollowingLocation()
                : startFollowingLocation()
            "
          >
            {{ isFollowingLocation ? '追従を止める' : '追従する' }}
          </button>
        </div>

        <p
          v-if="locationErrorMessage"
          class="mt-2 rounded-lg border border-orange-100 bg-orange-50/80 px-2 py-2 text-xs font-bold leading-relaxed text-orange-950"
        >
          {{ locationErrorMessage }}
        </p>
      </section>

      <!-- 地図 -->
      <section class="mt-4">
        <div class="mb-2 flex items-end justify-between gap-3">
          <h2 class="text-base font-black">
            地図
          </h2>

          <p class="text-xs font-black text-slate-500">
            {{ selectedSpot ? selectedSpot.name : 'スポットを選択' }}
          </p>
        </div>

        <div class="map-shell relative z-0 isolate overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <ClientOnly>
            <SpotLeafletMap
              :spots="filteredSpots"
              :current-location="currentLocation"
              :selected-spot-id="selectedSpotId"
              :should-follow-current-location="isFollowingLocation"
              :follow-request-key="followRequestKey"
              @select-spot="selectSpot"
            />

            <template #fallback>
              <div class="flex h-[320px] items-center justify-center bg-slate-100 px-4 text-center">
                <p class="text-sm font-bold text-slate-600">
                  地図を読み込み中です。
                </p>
              </div>
            </template>
          </ClientOnly>
        </div>

        <p class="mt-2 text-xs font-bold leading-relaxed text-slate-500">
          位置情報の誤差が大きい場合があります。現地の案内表示とあわせて確認してください。
        </p>
      </section>

      <!-- 選択中スポット -->
      <section
        v-if="selectedSpot"
        class="mt-4 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-3 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="rounded-md border px-1.5 py-0.5 text-[10px] font-black"
                :class="getCategoryClass(selectedSpot.category)"
              >
                {{ getCategoryLabel(selectedSpot.category) }}
              </span>

              <span class="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-black text-slate-600">
                {{ getAreaLabel(selectedSpot.area) }}
              </span>

              <span
                v-if="selectedSpot.coordinateStatus === 'approximate'"
                class="rounded-md border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[10px] font-black text-orange-700"
              >
                おおよそ
              </span>
            </div>

            <h2 class="mt-2 text-base font-black leading-snug text-sky-950">
              {{ selectedSpot.name }}
            </h2>

            <p class="mt-1 text-sm font-black text-sky-900">
              {{ formatDistance(selectedSpot) }}
            </p>

            <p
              v-if="selectedSpot.description"
              class="mt-1 text-sm font-medium leading-relaxed text-sky-950"
            >
              {{ selectedSpot.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- カテゴリ -->
      <section class="mt-4">
        <div class="-mx-4 overflow-x-auto px-4">
          <div class="flex w-max gap-2 pb-1">
            <button
              v-for="category in categoryFilters"
              :key="category.id"
              type="button"
              class="rounded-lg border px-3 py-2 text-xs font-black shadow-sm active:translate-y-[1px]"
              :class="
                selectedCategory === category.id
                  ? 'border-sky-200 bg-sky-700 text-white'
                  : 'border-slate-200 bg-white text-slate-700'
              "
              @click="selectCategory(category.id)"
            >
              {{ category.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- トイレ案内 -->
      <section
        v-if="selectedCategory === 'toilet' && toiletSpots.length === 0"
        class="mt-3 rounded-xl border border-sky-200 bg-sky-50 p-4"
      >
        <div class="flex items-start gap-3">
          <span
            class="text-xl"
            aria-hidden="true"
          >
            🚻
          </span>

          <div>
            <p class="text-sm font-black text-sky-950">
              トイレ位置は公式発表待ちです
            </p>

            <p class="mt-1 text-xs font-medium leading-5 text-sky-800">
              ひなたフェス2026では前回よりトイレが増設され、
              各コンテンツの配置に合わせて設置場所と数が調整されています。
              詳細な位置が確認でき次第、このマップに追加します。
            </p>
          </div>
        </div>
      </section>

      <!-- 近くのスポット -->
      <section class="mt-4">
        <div class="mb-2 flex items-end justify-between gap-3">
          <h2 class="text-base font-black">
            近くのスポット
          </h2>

          <p class="text-xs font-black text-slate-500">
            {{ currentLocation ? '距離順' : 'カテゴリ順' }}
          </p>
        </div>

        <ul class="border-y border-slate-200 bg-white">
          <li
            v-for="spot in nearestSpots"
            :key="spot.id"
            class="border-b border-dashed border-slate-200 last:border-b-0"
          >
            <button
              type="button"
              class="block w-full px-3 py-3 text-left active:bg-slate-50"
              :class="selectedSpotId === spot.id ? 'bg-sky-50/70' : ''"
              @click="focusSpot(spot)"
            >
              <div class="flex items-start gap-3">
                <div class="w-[4.8rem] shrink-0">
                  <p class="text-sm font-black leading-tight text-sky-700">
                    {{ formatDistance(spot) }}
                  </p>
                  <p class="mt-1 text-[10px] font-black text-slate-500">
                    {{ getAreaLabel(spot.area) }}
                  </p>
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      class="rounded-md border px-1.5 py-0.5 text-[10px] font-black"
                      :class="getCategoryClass(spot.category)"
                    >
                      {{ getCategoryLabel(spot.category) }}
                    </span>

                    <span
                      v-if="spot.isImportant"
                      class="rounded-md border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[10px] font-black text-orange-700"
                    >
                      重要
                    </span>
                  </div>

                  <p class="mt-1 text-base font-black leading-snug">
                    {{ spot.name }}
                  </p>

                  <p
                    v-if="spot.description"
                    class="mt-1 line-clamp-2 text-sm font-medium leading-snug text-slate-600"
                  >
                    {{ spot.description }}
                  </p>
                </div>
              </div>
            </button>
          </li>
        </ul>
      </section>

      <!-- 現地メモ -->
      <section class="mt-4 rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-3 shadow-sm">
        <h2 class="text-sm font-black text-orange-950">
          マップ利用メモ
        </h2>
        <p class="mt-1 text-sm font-medium leading-relaxed text-orange-950">
          GPSは建物内・混雑時・電波状況でずれることがあります。トイレ、救護、交通は現地の案内表示もあわせて確認してください。
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

/* Leaflet が sticky ヘッダーや下部ナビより前に出ないようにする */
.map-shell :deep(.leaflet-container) {
  z-index: 0;
}

.map-shell :deep(.leaflet-pane),
.map-shell :deep(.leaflet-top),
.map-shell :deep(.leaflet-bottom),
.map-shell :deep(.leaflet-control-container) {
  z-index: 1;
}
</style>