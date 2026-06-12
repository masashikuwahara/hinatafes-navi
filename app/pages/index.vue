<script setup lang="ts">
import {
  sortedHomeFeatures,
  todayFeatures,
} from '~/data/homeFeatures'

useHead({
  title: 'ひなたフェス2026 現地ナビ',
  meta: [
    {
      name: 'description',
      content:
        'ひなたフェス2026の現地参加時に使いやすい、非公式ファン向けナビアプリです。持ち物、スケジュール、ブース、マップ、熱中症対策などをまとめます。',
    },
  ],
})

// const festivalTargetDate = new Date('2026-09-01T00:00:00+09:00')
// const festivalTargetLabel = '2026年9月1日 00:00（仮）'

const festivalStartDate = new Date('2026-09-01T00:00:00+09:00')
const festivalEndDate = new Date('2026-09-01T23:59:59+09:00')
const festivalTargetLabel = '2026年9月1日（仮）'
const festivalTargetDate = festivalStartDate

const now = ref<Date | null>(null)
let timer: ReturnType<typeof setInterval> | undefined

type CountdownParts = {
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  isFinished: boolean
}

const addMonths = (date: Date, months: number) => {
  const result = new Date(date)
  const day = result.getDate()

  result.setDate(1)
  result.setMonth(result.getMonth() + months)

  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate()

  result.setDate(Math.min(day, lastDay))

  return result
}

const countdown = computed<CountdownParts | null>(() => {
  if (!now.value) {
    return null
  }

  if (now.value.getTime() >= festivalTargetDate.getTime()) {
    return {
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isFinished: true,
    }
  }

  let months =
    (festivalTargetDate.getFullYear() - now.value.getFullYear()) * 12 +
    (festivalTargetDate.getMonth() - now.value.getMonth())

  if (addMonths(now.value, months).getTime() > festivalTargetDate.getTime()) {
    months -= 1
  }

  const monthBaseDate = addMonths(now.value, months)
  let remainingMs = festivalTargetDate.getTime() - monthBaseDate.getTime()

  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24))
  remainingMs -= days * 1000 * 60 * 60 * 24

  const hours = Math.floor(remainingMs / (1000 * 60 * 60))
  remainingMs -= hours * 1000 * 60 * 60

  const minutes = Math.floor(remainingMs / (1000 * 60))
  remainingMs -= minutes * 1000 * 60

  const seconds = Math.floor(remainingMs / 1000)

  return {
    months,
    days,
    hours,
    minutes,
    seconds,
    isFinished: false,
  }
})

const totalDays = computed(() => {
  if (!now.value) {
    return null
  }

  const diffMs = festivalTargetDate.getTime() - now.value.getTime()

  if (diffMs <= 0) {
    return 0
  }

  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
})

const formatTwoDigits = (value: number) => {
  return String(value).padStart(2, '0')
}

// onMounted(() => {
//   now.value = new Date()

//   timer = setInterval(() => {
//     now.value = new Date()
//   }, 1000)
// })

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const festivalStatus = computed(() => {
  if (!now.value) {
    return 'loading'
  }

  const currentTime = now.value.getTime()
  const startTime = festivalStartDate.getTime()
  const endTime = festivalEndDate.getTime()

  if (currentTime < startTime) {
    return 'before'
  }

  if (currentTime >= startTime && currentTime <= endTime) {
    return 'today'
  }

  return 'ended'
})

const weatherLocation = {
  name: '会場周辺',
  latitude: 31.824,
  longitude: 131.448,
}

const {
  weather,
  weatherText,
  weatherIcon,
  heatRisk,
  isLoading: isWeatherLoading,
  errorMessage: weatherErrorMessage,
  lastUpdatedLabel,
  fetchWeather,
} = useWeather(weatherLocation)

onMounted(() => {
  now.value = new Date()

  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)

  fetchWeather()
})
</script>

<template>
  <div class="app-container space-y-6 pb-8 pt-4">
    <section
      class="overflow-hidden rounded-card border border-hinata-border bg-gradient-to-br from-hinata-sky-soft via-white to-hinata-yellow-soft p-5 shadow-card"
    >
      <div class="space-y-4">
        <div
          class="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-hinata-navy shadow-soft"
        >
          <span>☀️</span>
          <span>現地でサッと確認</span>
        </div>

        <div class="space-y-3">
          <h1 class="text-2xl font-extrabold leading-tight text-hinata-navy">
            ひなたフェス2026<br>
            現地ナビ
          </h1>

          <p class="text-sm leading-relaxed text-hinata-muted">
            持ち物、スケジュール、ブース、マップ、熱中症対策などをまとめて確認できる、
            非公式ファン向けの現地サポートアプリです。
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <NuxtLink
            to="/checklist"
            class="app-button-primary"
          >
            持ち物を確認
          </NuxtLink>

          <NuxtLink
            to="/schedule"
            class="app-button-secondary"
          >
            予定を見る
          </NuxtLink>
        </div>

        <p class="text-xs leading-relaxed text-hinata-muted">
          ※公式情報ではありません。イベント詳細は必ず公式サイト・公式発表も確認してください。
        </p>
      </div>
    </section>

    <section
      v-if="countdown && totalDays !== null"
      class="rounded-card bg-gradient-to-br from-hinata-sky-soft via-white to-hinata-green/10 p-5 shadow-card"
    >
      <div class="text-center">
        <p class="text-xs font-bold uppercase tracking-wider text-hinata-sky">
          Countdown
        </p>

        <h2 class="mt-1 text-lg font-extrabold text-hinata-navy">
          ひなたフェス2026 開催まで
        </h2>

        <p class="mt-1 text-xs leading-5 text-hinata-muted">
          目標日時：{{ festivalTargetLabel }}
        </p>
      </div>

      <div
        v-if="festivalStatus === 'before'"
        class="mt-5 grid grid-cols-4 gap-3 text-center"
      >
        <div class="rounded-button bg-white p-3 shadow-soft">
          <p class="text-3xl font-black text-hinata-navy">
            {{ totalDays }}
          </p>
          <p class="mt-1 text-xs font-bold text-hinata-muted">
            日
          </p>
        </div>

        <div class="rounded-button bg-white p-3 shadow-soft">
          <p class="text-3xl font-black text-hinata-navy">
            {{ formatTwoDigits(countdown.hours) }}
          </p>
          <p class="mt-1 text-xs font-bold text-hinata-muted">
            時間
          </p>
        </div>

        <div class="rounded-button bg-white p-3 shadow-soft">
          <p class="text-3xl font-black text-hinata-navy">
            {{ formatTwoDigits(countdown.minutes) }}
          </p>
          <p class="mt-1 text-xs font-bold text-hinata-muted">
            分
          </p>
        </div>

        <div class="rounded-button bg-white p-3 shadow-soft">
          <p class="text-3xl font-black text-hinata-navy">
            {{ formatTwoDigits(countdown.seconds) }}
          </p>
          <p class="mt-1 text-xs font-bold text-hinata-muted">
            秒
          </p>
        </div>
      </div>

      <div
        v-else-if="festivalStatus === 'today'"
        class="mt-5 rounded-card bg-white p-5 text-center shadow-soft"
      >
        <p class="text-4xl font-black text-hinata-navy">
          本日開催！
        </p>

        <p class="mt-3 text-sm font-bold leading-6 text-hinata-muted">
          持ち物・予定・マップを確認して、現地で安全に楽しみましょう。
        </p>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <NuxtLink
            to="/schedule"
            class="app-button-primary"
          >
            予定を見る
          </NuxtLink>

          <NuxtLink
            to="/map"
            class="app-button-secondary"
          >
            マップを見る
          </NuxtLink>
        </div>
      </div>

      <div
        v-else-if="festivalStatus === 'ended'"
        class="mt-5 rounded-card bg-white p-5 text-center shadow-soft"
      >
        <p class="text-2xl font-black text-hinata-navy">
          開催終了
        </p>

        <p class="mt-3 text-sm font-bold leading-6 text-hinata-muted">
          おつかれさまでした。参戦メモに感想を残しておくのもおすすめです。
        </p>

        <NuxtLink
          to="/memo"
          class="app-button-secondary mt-4 w-full"
        >
          メモを書く
        </NuxtLink>
      </div>
    </section>

    <section class="app-card-soft">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-hinata-sky">
            Weather
          </p>

          <h2 class="app-section-title">
            本日の天気・暑さ
          </h2>

          <p class="app-section-description">
            {{ weatherLocation.name }}の現在に近い天気情報を表示します。
          </p>
        </div>

        <button
          type="button"
          class="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-hinata-navy shadow-soft active:scale-[0.98]"
          :disabled="isWeatherLoading"
          @click="fetchWeather"
        >
          {{ isWeatherLoading ? '更新中' : '更新' }}
        </button>
      </div>

      <div
        v-if="weatherErrorMessage"
        class="mt-4 rounded-button border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700"
      >
        {{ weatherErrorMessage }}
      </div>

      <div
        v-else
        class="mt-4 space-y-4"
      >
        <div class="grid grid-cols-3 gap-3 text-center">
          <div class="rounded-button bg-white px-3 py-3 shadow-soft">
            <p class="text-xs font-bold text-hinata-muted">
              天気
            </p>

            <p class="mt-1 text-lg font-black text-hinata-navy">
              {{ weatherIcon }}
            </p>

            <p class="mt-1 text-xs font-bold text-hinata-navy">
              {{ weatherText }}
            </p>
          </div>

          <div class="rounded-button bg-white px-3 py-3 shadow-soft">
            <p class="text-xs font-bold text-hinata-muted">
              気温
            </p>

            <p class="mt-1 text-xl font-black text-hinata-navy">
              {{ weather ? Math.round(weather.temperature_2m) : '--' }}℃
            </p>
          </div>

          <div class="rounded-button bg-white px-3 py-3 shadow-soft">
            <p class="text-xs font-bold text-hinata-muted">
              湿度
            </p>

            <p class="mt-1 text-xl font-black text-hinata-navy">
              {{ weather ? Math.round(weather.relative_humidity_2m) : '--' }}%
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="rounded-button bg-white px-3 py-3 shadow-soft">
            <p class="text-xs font-bold text-hinata-muted">
              体感温度
            </p>

            <p class="mt-1 text-xl font-black text-hinata-navy">
              {{ weather ? Math.round(weather.apparent_temperature) : '--' }}℃
            </p>
          </div>

          <div class="rounded-button bg-white px-3 py-3 shadow-soft">
            <p class="text-xs font-bold text-hinata-muted">
              風速
            </p>

            <p class="mt-1 text-xl font-black text-hinata-navy">
              {{ weather ? Math.round(weather.wind_speed_10m) : '--' }}
              <span class="text-xs">
                km/h
              </span>
            </p>
          </div>
        </div>

        <div
          v-if="heatRisk"
          class="rounded-button border px-4 py-3 text-sm font-bold leading-6"
          :class="heatRisk.className"
        >
          <div class="flex items-start gap-2">
            <span>
              {{ heatRisk.level === 'normal' ? '✅' : '⚠️' }}
            </span>

            <div>
              <p>
                {{ heatRisk.label }}
              </p>

              <p class="mt-1 text-xs font-medium leading-5">
                {{ heatRisk.message }}
              </p>
            </div>
          </div>
        </div>

        <p class="text-right text-xs text-hinata-muted">
          最終更新：{{ lastUpdatedLabel }}
        </p>

        <p class="text-xs leading-5 text-hinata-muted">
          ※天気情報はOpen-Meteoのデータを利用しています。現地の状況や公式情報もあわせて確認してください。
        </p>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-end justify-between gap-3">
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-hinata-sky">
            Today
          </p>

          <h2 class="text-xl font-extrabold text-hinata-navy">
            今日使う
          </h2>
        </div>

        <p class="text-xs text-hinata-muted">
          現地でよく使う機能
        </p>
      </div>

      <div class="grid grid-cols-1 gap-3">
        <FeatureCard
          v-for="feature in todayFeatures"
          :key="feature.id"
          :feature="feature"
          compact
        />
      </div>
    </section>

    <section class="space-y-4">
      <div>
        <p class="text-xs font-bold uppercase tracking-wider text-hinata-sky">
          Menu
        </p>

        <h2 class="text-xl font-extrabold text-hinata-navy">
          主要機能
        </h2>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <FeatureCard
          v-for="feature in sortedHomeFeatures"
          :key="feature.id"
          :feature="feature"
          compact
        />
      </div>
    </section>

    <section class="app-card">
      <h2 class="app-section-title">
        使い方メモ
      </h2>

      <div class="mt-4 space-y-3 text-sm leading-relaxed text-hinata-muted">
        <p>
          まずは「持ち物チェック」と「スケジュール」を確認して、当日の行動を整理します。
        </p>

        <p>
          現地では「ブース」「マップ」「熱中症対策」をすぐ開けるようにしておくと便利です。
        </p>
      </div>
    </section>
  </div>
</template>