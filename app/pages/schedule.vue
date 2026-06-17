<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { scheduleItems } from '~/data/schedule'

type DisplayScheduleItem = {
  id: string
  date: string
  startTime: string
  endTime?: string
  title: string
  location?: string
  area?: string
  category: string
  description?: string
  isImportant?: boolean
}

type FilterOption = {
  id: string
  label: string
}

useAppSeo({
  title: 'スケジュール',
  description:
    'ひなたフェス2026のスケジュール確認ページです。ライブ、出店、ブース、移動、休憩の予定を現地で素早く確認できます。',
})

const selectedDate = ref('')
const selectedCategory = ref('all')
const currentTimeText = ref('')

const normalizeScheduleItem = (
  item: unknown,
  index: number,
): DisplayScheduleItem => {
  const raw = item as {
    id?: string | number
    date?: string
    day?: string
    startTime?: string
    start_time?: string
    time?: string
    endTime?: string
    end_time?: string
    title?: string
    name?: string
    location?: string
    place?: string
    area?: string
    category?: string
    type?: string
    description?: string
    memo?: string
    isImportant?: boolean
    important?: boolean
  }

  return {
    id: String(raw.id ?? `schedule-${index}`),
    date: String(raw.date ?? raw.day ?? '2026-09-12'),
    startTime: String(raw.startTime ?? raw.start_time ?? raw.time ?? '00:00'),
    endTime: raw.endTime ?? raw.end_time,
    title: String(raw.title ?? raw.name ?? '予定'),
    location: raw.location ?? raw.place,
    area: raw.area,
    category: String(raw.category ?? raw.type ?? 'other'),
    description: raw.description ?? raw.memo,
    isImportant: Boolean(raw.isImportant ?? raw.important ?? false),
  }
}

const items = computed<DisplayScheduleItem[]>(() => {
  return scheduleItems
    .map((item, index) => normalizeScheduleItem(item, index))
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
})

const dates = computed(() => {
  return Array.from(new Set(items.value.map((item) => item.date)))
})

const currentDate = computed(() => {
  return selectedDate.value || dates.value[0] || ''
})

const categoryOptions = computed<FilterOption[]>(() => {
  const categories = Array.from(new Set(items.value.map((item) => item.category)))

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

const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const matchesDate = item.date === currentDate.value
    const matchesCategory =
      selectedCategory.value === 'all' || item.category === selectedCategory.value

    return matchesDate && matchesCategory
  })
})

const nextItem = computed(() => {
  if (!currentTimeText.value) {
    return filteredItems.value[0]
  }

  return filteredItems.value.find((item) => item.startTime >= currentTimeText.value)
})

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    live: 'ライブ',
    stage: 'ステージ',
    booth: 'ブース',
    food: 'フード',
    goods: '物販',
    transport: '交通',
    rest: '休憩',
    heat: '暑さ',
    other: 'その他',
  }

  return labels[category] ?? category
}

const getCategoryClass = (category: string) => {
  const classes: Record<string, string> = {
    live: 'border-sky-600 bg-sky-50 text-sky-800',
    stage: 'border-sky-600 bg-sky-50 text-sky-800',
    booth: 'border-emerald-600 bg-emerald-50 text-emerald-800',
    food: 'border-orange-600 bg-orange-50 text-orange-800',
    goods: 'border-purple-600 bg-purple-50 text-purple-800',
    transport: 'border-slate-600 bg-slate-50 text-slate-800',
    rest: 'border-teal-600 bg-teal-50 text-teal-800',
    heat: 'border-red-600 bg-red-50 text-red-800',
    other: 'border-slate-500 bg-white text-slate-700',
  }

  return classes[category] ?? classes.other
}

const formatDateLabel = (date: string) => {
  const labels: Record<string, string> = {
    '2026-09-12': '9/12 Sat',
    '2026-09-13': '9/13 Sun',
  }

  return labels[date] ?? date
}

const updateCurrentTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  currentTimeText.value = `${hours}:${minutes}`
}

onMounted(() => {
  selectedDate.value = dates.value[0] ?? ''
  updateCurrentTime()
})
</script>

<template>
  <main class="min-h-screen bg-[#f7fbfc] pb-24 text-slate-900">
    <div class="mx-auto max-w-md px-4 py-4">
      <!-- ヘッダー -->
      <section class="border-b-4 border-sky-400 pb-3">
        <p class="text-xs font-black tracking-[0.16em] text-sky-700">
          TIME TABLE
        </p>

        <div class="mt-1 flex items-end justify-between gap-3">
          <div>
            <h1 class="text-[1.35rem] font-black leading-tight">
              スケジュール
            </h1>
            <p class="mt-1 text-sm font-medium leading-snug text-slate-700">
              時間・場所・移動前の確認用です。
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

      <!-- 日付切り替え -->
      <section class="sticky top-0 z-20 -mx-4 mt-3 border-y-2 border-slate-800 bg-white px-4 py-3">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-black text-slate-500">
              表示日
            </p>
            <p class="mt-0.5 text-xl font-black leading-none">
              {{ formatDateLabel(currentDate) }}
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs font-black text-slate-500">
              現在時刻
            </p>
            <p class="mt-0.5 text-xl font-black leading-none text-sky-700">
              {{ currentTimeText }}
            </p>
          </div>
        </div>

        <div class="mt-3 grid gap-2" :class="dates.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'">
          <button
            v-for="date in dates"
            :key="date"
            type="button"
            class="border-2 px-3 py-2 text-sm font-black active:translate-y-[1px]"
            :class="
              currentDate === date
                ? 'border-sky-600 bg-sky-100 text-sky-950'
                : 'border-slate-300 bg-white text-slate-700'
            "
            @click="selectedDate = date"
          >
            {{ formatDateLabel(date) }}
          </button>
        </div>
      </section>

      <!-- 次の予定 -->
      <section
        v-if="nextItem"
        class="mt-4 border-l-4 border-orange-500 bg-orange-50 px-3 py-3"
      >
        <p class="text-xs font-black text-orange-800">
          次に確認
        </p>

        <div class="mt-1 flex gap-3">
          <p class="w-[4.5rem] shrink-0 text-lg font-black leading-tight text-orange-950">
            {{ nextItem.startTime }}
          </p>

          <div class="min-w-0">
            <p class="text-base font-black leading-snug text-orange-950">
              {{ nextItem.title }}
            </p>
            <p
              v-if="nextItem.location || nextItem.area"
              class="mt-1 text-sm font-bold text-orange-950"
            >
              {{ nextItem.location || nextItem.area }}
            </p>
          </div>
        </div>
      </section>

      <!-- カテゴリ -->
      <section class="mt-4">
        <div class="-mx-4 overflow-x-auto px-4">
          <div class="flex w-max gap-2 pb-1">
            <button
              v-for="option in categoryOptions"
              :key="option.id"
              type="button"
              class="border-2 px-3 py-2 text-xs font-black active:translate-y-[1px]"
              :class="
                selectedCategory === option.id
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700'
              "
              @click="selectedCategory = option.id"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- タイムテーブル -->
      <section class="mt-4">
        <div class="mb-2 flex items-end justify-between gap-3">
          <h2 class="text-base font-black">
            タイムテーブル
          </h2>

          <p class="text-xs font-black text-slate-500">
            {{ filteredItems.length }}件
          </p>
        </div>

        <div
          v-if="filteredItems.length === 0"
          class="border-2 border-dashed border-slate-300 bg-white px-3 py-5 text-center"
        >
          <p class="text-sm font-black">
            表示できる予定がありません
          </p>
          <p class="mt-1 text-xs font-medium text-slate-600">
            日付またはカテゴリを変更してください。
          </p>
        </div>

        <ol v-else class="border-y-2 border-slate-800 bg-white">
          <li
            v-for="item in filteredItems"
            :key="item.id"
            class="border-b border-dashed border-slate-300 last:border-b-0"
          >
            <div class="flex gap-3 px-3 py-3">
              <div class="w-[4.5rem] shrink-0">
                <p class="text-lg font-black leading-none tracking-tight">
                  {{ item.startTime }}
                </p>

                <p
                  v-if="item.endTime"
                  class="mt-1 text-xs font-bold text-slate-500"
                >
                  - {{ item.endTime }}
                </p>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="border px-1.5 py-0.5 text-[10px] font-black"
                    :class="getCategoryClass(item.category)"
                  >
                    {{ getCategoryLabel(item.category) }}
                  </span>

                  <span
                    v-if="item.isImportant"
                    class="border border-orange-500 bg-orange-50 px-1.5 py-0.5 text-[10px] font-black text-orange-700"
                  >
                    重要
                  </span>
                </div>

                <p class="mt-1 text-base font-black leading-snug">
                  {{ item.title }}
                </p>

                <p
                  v-if="item.location || item.area"
                  class="mt-1 text-sm font-bold leading-snug text-slate-700"
                >
                  {{ item.location || item.area }}
                </p>

                <p
                  v-if="item.description"
                  class="mt-1 text-sm font-medium leading-relaxed text-slate-600"
                >
                  {{ item.description }}
                </p>
              </div>
            </div>
          </li>
        </ol>
      </section>

      <!-- 現地メモ -->
      <section class="mt-4 border-l-4 border-sky-500 bg-sky-50 px-3 py-3">
        <h2 class="text-sm font-black text-sky-950">
          移動前メモ
        </h2>
        <p class="mt-1 text-sm font-medium leading-relaxed text-sky-950">
          ライブ前はトイレ・水分・移動時間も含めて早めに確認。電波が弱い場所では、先に予定を開いておくと安心です。
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