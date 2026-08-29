<script setup lang="ts">
import { onMounted } from 'vue'

type PrimaryAction = {
  to: string
  label: string
  title: string
  description: string
  status: string
  className: string
}

type SubAction = {
  to: string
  title: string
  description: string
  label: string
}

useAppSeo({
  title: 'ひなたフェス2026 現地ナビ',
  description:
    'ひなたフェス2026の会場で使える現地ナビです。マップ、スケジュール、出店・ブース、持ち物、メモ、熱中症対策をスマホで素早く確認できます。',
})

const primaryActions: PrimaryAction[] = [
  {
    to: '/map',
    label: 'MAP',
    title: '会場マップ',
    description: '現在地・スポット・エリアを確認',
    status: '迷ったらここ',
    className: 'border-sky-200 bg-sky-50/80 text-sky-950 shadow-sm',
  },
  {
    to: '/schedule',
    label: 'TIME',
    title: 'スケジュール',
    description: '次の予定と時間を確認',
    status: '開演前に確認',
    className: 'border-amber-200 bg-amber-50/80 text-amber-950 shadow-sm',
  },
  {
    to: '/booths',
    label: 'SHOP',
    title: '出店・ブース',
    description: 'フード・物販・企画を探す',
    status: '近くを探す',
    className: 'border-emerald-200 bg-emerald-50/80 text-emerald-950 shadow-sm',
  },
]

const subActions: SubAction[] = [
  {
    to: '/checklist',
    title: '持ち物チェック',
    description: '忘れ物防止',
    label: 'CHECK',
  },
  {
    to: '/memo',
    title: '参戦メモ',
    description: '座席・集合場所',
    label: 'MEMO',
  },
  {
    to: '/heat',
    title: '熱中症対策',
    description: '水分・休憩',
    label: 'HEAT',
  },
  {
    to: '/penlight',
    title: 'ペンライト',
    description: 'カラー確認',
    label: 'COLOR',
  },
]

const quickChecks = [
  'チケット',
  'スマホ',
  'モバイルバッテリー',
  'タオル',
  '水分',
  '雨具',
]

const weatherLocation = {
  name: 'ひなたフェス会場周辺',
  latitude: 31.8244,
  longitude: 131.4485,
}

const {
  weather,
  weatherText,
  weatherIcon,
  heatRisk,
  isLoading,
  errorMessage,
  lastUpdatedLabel,
  fetchWeather,
} = useWeather(weatherLocation)

const getHeatRiskPanelClass = (level?: string) => {
  const classes: Record<string, string> = {
    normal: 'border-sky-200 bg-sky-50/80 text-sky-950',
    caution: 'border-yellow-200 bg-yellow-50/80 text-yellow-950',
    warning: 'border-orange-200 bg-orange-50/80 text-orange-950',
    danger: 'border-red-200 bg-red-50/80 text-red-950',
  }

  return classes[level ?? 'normal'] ?? classes.normal
}

onMounted(() => {
  void fetchWeather()
})
</script>

<template>
  <main class="min-h-screen bg-[#f7fbfc] pb-24 text-slate-900">
    <div class="mx-auto max-w-md px-4 py-4">
      <!-- 上部：案内板風ヘッダー -->
      <section class="rounded-xl border border-sky-100 bg-white px-3 py-3 shadow-sm">
        <p class="text-xs font-black tracking-[0.16em] text-sky-700">
          HINATA FES 2026 / FIELD GUIDE
        </p>

        <div class="mt-1 flex items-end justify-between gap-3">
          <div>
            <h1 class="text-[1.45rem] font-black leading-tight tracking-tight">
              ひなたフェス案内板
            </h1>
            <p class="mt-1 text-sm font-medium text-slate-700">
              会場マップ、予定、出店、持ち物を当日すぐ確認できます。
            </p>
          </div>

          <!-- <div class="shrink-0 border-2 border-slate-800 bg-white px-2 py-1 text-center">
            <p class="text-[10px] font-bold leading-none text-slate-500">
              TODAY
            </p>
            <p class="mt-1 text-sm font-black leading-none">
              現地用
            </p>
          </div> -->
        </div>
      </section>

      <!-- 会場の天気・暑さ -->
      <section class="mt-4 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
        <div class="flex items-center justify-between gap-3 border-b border-sky-100 bg-sky-50/80 px-3 py-2">
          <div>
            <p class="text-xs font-black tracking-[0.12em] text-sky-700">
              WEATHER
            </p>
            <h2 class="mt-0.5 text-base font-black text-sky-950">
              会場の天気・暑さ
            </h2>
          </div>

          <button
            type="button"
            class="shrink-0 rounded-md border border-sky-200 bg-white px-2 py-1 text-xs font-black shadow-sm active:translate-y-[1px] disabled:opacity-60"
            :disabled="isLoading"
            @click="fetchWeather"
          >
            {{ isLoading ? '取得中' : '更新' }}
          </button>
        </div>

        <div class="px-3 py-3">
          <p
            v-if="errorMessage"
            class="rounded-md border border-orange-100 bg-orange-50 px-2 py-2 text-sm font-bold leading-relaxed text-orange-950"
          >
            {{ errorMessage }}
          </p>

          <template v-else>
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-black text-slate-500">
                  {{ weatherIcon }} {{ weatherText }}
                </p>

                <p class="mt-1 text-2xl font-black leading-none text-slate-950">
                  <span v-if="weather">
                    {{ Math.round(weather.temperature_2m) }}℃
                  </span>
                  <span v-else>
                    --
                  </span>
                </p>
              </div>

              <div class="text-right">
                <p class="text-xs font-black text-slate-500">
                  更新
                </p>
                <p class="mt-1 text-sm font-black text-slate-800">
                  {{ lastUpdatedLabel }}
                </p>
              </div>
            </div>

            <div class="mt-3 grid grid-cols-3 rounded-lg border border-slate-200 bg-slate-50/40 py-2 text-center">
              <div class="border-r border-slate-200 px-2">
                <p class="text-[10px] font-black text-slate-500">
                  体感
                </p>
                <p class="mt-1 text-sm font-black">
                  <span v-if="weather">
                    {{ Math.round(weather.apparent_temperature) }}℃
                  </span>
                  <span v-else>
                    --
                  </span>
                </p>
              </div>

              <div class="border-r border-slate-200 px-2">
                <p class="text-[10px] font-black text-slate-500">
                  湿度
                </p>
                <p class="mt-1 text-sm font-black">
                  <span v-if="weather">
                    {{ weather.relative_humidity_2m }}%
                  </span>
                  <span v-else>
                    --
                  </span>
                </p>
              </div>

              <div class="px-2">
                <p class="text-[10px] font-black text-slate-500">
                  風
                </p>
                <p class="mt-1 text-sm font-black">
                  <span v-if="weather">
                    {{ weather.wind_speed_10m }}m/s
                  </span>
                  <span v-else>
                    --
                  </span>
                </p>
              </div>
            </div>

            <div
              v-if="heatRisk"
              class="mt-3 rounded-lg border px-2 py-2"
              :class="getHeatRiskPanelClass(heatRisk.level)"
            >
              <div class="flex items-center justify-between gap-2">
                <p class="text-xs font-black">
                  暑さ：{{ heatRisk.label }}
                </p>

                <NuxtLink
                  to="/heat"
                  class="shrink-0 text-xs font-black underline underline-offset-4"
                >
                  対策を見る
                </NuxtLink>
              </div>

              <p class="mt-1 text-xs font-bold leading-relaxed">
                {{ heatRisk.message }}
              </p>
            </div>
          </template>
        </div>
      </section>

      <ImportantNotices />

      <!-- 今日使う -->
      <section class="mt-4">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-base font-black">
            今日すぐ使う
          </h2>
          <p class="text-xs font-bold text-slate-500">
            迷ったら上から確認
          </p>
        </div>

        <div class="space-y-2">
          <NuxtLink
            v-for="action in primaryActions"
            :key="action.to"
            :to="action.to"
            :class="[
              'block rounded-lg border border-l-[5px] px-3 py-3 transition active:translate-y-[1px]',
              action.className,
            ]"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="rounded-md border border-current bg-white/80 px-1.5 py-0.5 text-[10px] font-black">
                    {{ action.label }}
                  </span>
                  <span class="text-xs font-bold">
                    {{ action.status }}
                  </span>
                </div>

                <p class="mt-1 text-lg font-black leading-tight">
                  {{ action.title }}
                </p>
                <p class="mt-1 text-sm font-medium leading-snug">
                  {{ action.description }}
                </p>
              </div>

              <span class="shrink-0 text-xl font-black">
                →
              </span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- 補助導線 -->
      <section class="mt-5">
        <h2 class="mb-2 text-base font-black">
          開演前・移動中に確認
        </h2>

        <div class="grid grid-cols-2 gap-2">
          <NuxtLink
            v-for="action in subActions"
            :key="action.to"
            :to="action.to"
            class="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm transition active:bg-slate-50"
          >
            <p class="text-[10px] font-black tracking-[0.12em] text-sky-700">
              {{ action.label }}
            </p>
            <p class="mt-1 text-sm font-black leading-tight">
              {{ action.title }}
            </p>
            <p class="mt-1 text-xs font-medium text-slate-600">
              {{ action.description }}
            </p>
          </NuxtLink>
        </div>
      </section>

      <!-- しおり風チェック -->
      <section class="mt-5 rounded-xl border border-dashed border-slate-200 bg-white px-3 py-3 shadow-sm">
        <div class="flex items-center justify-between gap-2">
          <h2 class="text-base font-black">
            出発前の確認
          </h2>
          <NuxtLink
            to="/checklist"
            class="text-xs font-black text-sky-700 underline underline-offset-4"
          >
            リストを開く
          </NuxtLink>
        </div>

        <ul class="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
          <li
            v-for="item in quickChecks"
            :key="item"
            class="flex items-center gap-2 text-sm font-bold"
          >
            <span class="inline-block h-4 w-4 rounded-[3px] border border-slate-400 bg-white" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </section>

      <!-- 注意メモ -->
      <section class="mt-4 rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-3 shadow-sm">
        <h2 class="text-sm font-black text-orange-950">
          屋外利用メモ
        </h2>
        <p class="mt-1 text-sm font-medium leading-relaxed text-orange-950">
          暑さ・雨・電波状況に注意。必要な情報は早めに開いて確認しておくと安心です。
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