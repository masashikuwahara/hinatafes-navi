<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { spots } from '~/data/spots'

type SpotCategory =
  | 'entrance'
  | 'stage'
  | 'goods'
  | 'food'
  | 'booth'
  | 'rest'
  | 'toilet'
  | 'water'
  | 'medical'
  | 'transport'
  | 'meeting'
  | 'other'

type SpotArea =
  | 'center'
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'outside'
  | 'unknown'

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
  title: '会場マップ',
  description:
    'ひなたフェス2026の会場マップです。現在地、スポット、トイレ、救護、交通、出店・ブースなどを現地で確認できます。',
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
  const categories = Array.from(
    new Set(spotItems.value.map((spot) => spot.category)),
  )

  return [
    {
      id: 'all',
      label: 'すべて',
    },
    ...categories.map((category) => ({
      id: category,
      label: getCategoryLabel(category),
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
    entrance: 'border-slate-600 bg-slate-50 text-slate-800',
    stage: 'border-sky-600 bg-sky-50 text-sky-800',
    goods: 'border-purple-600 bg-purple-50 text-purple-800',
    food: 'border-orange-600 bg-orange-50 text-orange-800',
    booth: 'border-emerald-600 bg-emerald-50 text-emerald-800',
    rest: 'border-teal-600 bg-teal-50 text-teal-800',
    toilet: 'border-blue-600 bg-blue-50 text-blue-800',
    water: 'border-cyan-600 bg-cyan-50 text-cyan-800',
    medical: 'border-red-600 bg-red-50 text-red-800',
    transport: 'border-slate-600 bg-slate-50 text-slate-800',
    meeting: 'border-amber-600 bg-amber-50 text-amber-800',
    other: 'border-slate-500 bg-white text-slate-700',
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
      <section class="border-b-4 border-sky-400 pb-3">
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
            class="shrink-0 border-2 border-slate-800 bg-white px-2 py-1 text-xs font-black active:bg-slate-100"
          >
            TOP
          </NuxtLink>
        </div>
      </section>

      <!-- 現在地ステータス -->
      <section
        class="sticky top-0 z-30 -mx-4 mt-3 border-y-2 border-slate-800 bg-white px-4 py-3"
      >
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="border-r border-slate-300 pr-2">
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

          <div class="border-r border-slate-300 px-2">
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
            class="border-2 border-slate-800 bg-slate-900 px-3 py-2 text-sm font-black text-white active:translate-y-[1px] disabled:opacity-60"
            :disabled="isGettingLocation"
            @click="getCurrentLocation"
          >
            {{ isGettingLocation ? '取得中' : '現在地を更新' }}
          </button>

          <button
            type="button"
            class="border-2 px-3 py-2 text-sm font-black active:translate-y-[1px]"
            :class="
              isFollowingLocation
                ? 'border-orange-600 bg-orange-100 text-orange-950'
                : 'border-slate-300 bg-white text-slate-800'
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
          class="mt-2 border-l-4 border-orange-500 bg-orange-50 px-2 py-2 text-xs font-bold leading-relaxed text-orange-950"
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

        <div class="overflow-hidden border-2 border-slate-800 bg-white">
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
        class="mt-4 border-l-4 border-sky-500 bg-sky-50 px-3 py-3"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="border px-1.5 py-0.5 text-[10px] font-black"
                :class="getCategoryClass(selectedSpot.category)"
              >
                {{ getCategoryLabel(selectedSpot.category) }}
              </span>

              <span class="border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-black text-slate-600">
                {{ getAreaLabel(selectedSpot.area) }}
              </span>

              <span
                v-if="selectedSpot.coordinateStatus === 'approximate'"
                class="border border-orange-500 bg-orange-50 px-1.5 py-0.5 text-[10px] font-black text-orange-700"
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
              class="border-2 px-3 py-2 text-xs font-black active:translate-y-[1px]"
              :class="
                selectedCategory === category.id
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700'
              "
              @click="selectCategory(category.id)"
            >
              {{ category.label }}
            </button>
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

        <ul class="border-y-2 border-slate-800 bg-white">
          <li
            v-for="spot in nearestSpots"
            :key="spot.id"
            class="border-b border-dashed border-slate-300 last:border-b-0"
          >
            <button
              type="button"
              class="block w-full px-3 py-3 text-left active:bg-slate-50"
              :class="selectedSpotId === spot.id ? 'bg-sky-50' : ''"
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
                      class="border px-1.5 py-0.5 text-[10px] font-black"
                      :class="getCategoryClass(spot.category)"
                    >
                      {{ getCategoryLabel(spot.category) }}
                    </span>

                    <span
                      v-if="spot.isImportant"
                      class="border border-orange-500 bg-orange-50 px-1.5 py-0.5 text-[10px] font-black text-orange-700"
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

                <span class="shrink-0 text-lg font-black text-slate-400">
                  →
                </span>
              </div>
            </button>
          </li>
        </ul>
      </section>

      <!-- 現地メモ -->
      <section class="mt-4 border-l-4 border-orange-500 bg-orange-50 px-3 py-3">
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
    'Noto Sans JP',
    'BIZ UDPGothic',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

h1,
h2 {
  font-family:
    'Zen Kaku Gothic New',
    'Noto Sans JP',
    system-ui,
    sans-serif;
}
</style>