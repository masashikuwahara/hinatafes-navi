<script setup lang="ts">
import { computed, ref } from 'vue'
import { scheduleItems, type ScheduleCategory } from '~/data/schedule'

useHead({
  title: 'スケジュール | ひなたフェス2026 現地ナビ',
  meta: [
    {
      name: 'description',
      content:
        'ひなたフェス2026のイベントスケジュールを日付別・カテゴリ別に確認できます。',
    },
  ],
})

const selectedDate = ref<string>('all')
const selectedCategory = ref<ScheduleCategory | 'all'>('all')

const dateOptions = computed(() => {
  const dates = Array.from(new Set(scheduleItems.map((item) => item.date)))

  return dates.map((date) => {
    const firstItem = scheduleItems.find((item) => item.date === date)

    return {
      value: date,
      label: firstItem ? `${firstItem.dayLabel} / ${date}` : date,
    }
  })
})

const categoryOptions: Array<{
  value: ScheduleCategory | 'all'
  label: string
}> = [
  { value: 'all', label: 'すべて' },
  { value: 'live', label: 'ライブ' },
  { value: 'goods', label: 'グッズ' },
  { value: 'food', label: 'フード' },
  { value: 'stage', label: 'ステージ' },
  { value: 'notice', label: '案内' },
]

const filteredScheduleItems = computed(() => {
  return scheduleItems.filter((item) => {
    const matchesDate =
      selectedDate.value === 'all' || item.date === selectedDate.value

    const matchesCategory =
      selectedCategory.value === 'all' ||
      item.category === selectedCategory.value

    return matchesDate && matchesCategory
  })
})

const getCategoryLabel = (category: ScheduleCategory) => {
  return (
    categoryOptions.find((option) => option.value === category)?.label ??
    'その他'
  )
}

const getCategoryClass = (category: ScheduleCategory) => {
  switch (category) {
    case 'live':
      return 'bg-sky-100 text-sky-700'
    case 'goods':
      return 'bg-violet-100 text-violet-700'
    case 'food':
      return 'bg-orange-100 text-orange-700'
    case 'stage':
      return 'bg-pink-100 text-pink-700'
    case 'notice':
      return 'bg-emerald-100 text-emerald-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 pb-24 pt-6">
    <section class="rounded-3xl bg-gradient-to-br from-sky-100 via-white to-yellow-50 p-5 shadow-sm">
      <p class="text-sm font-bold text-sky-600">
        Schedule
      </p>

      <h1 class="mt-2 text-2xl font-bold text-slate-900">
        スケジュール
      </h1>

      <p class="mt-3 text-sm leading-7 text-slate-600">
        ひなたフェス2026の予定を日付別・カテゴリ別に確認できます。
        公式発表後に内容を更新していきます。
      </p>
    </section>

    <section class="mt-6 space-y-4">
      <div>
        <h2 class="text-sm font-bold text-slate-700">
          日付で絞り込み
        </h2>

        <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            class="shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition"
            :class="
              selectedDate === 'all'
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 bg-white text-slate-600'
            "
            @click="selectedDate = 'all'"
          >
            すべて
          </button>

          <button
            v-for="date in dateOptions"
            :key="date.value"
            type="button"
            class="shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition"
            :class="
              selectedDate === date.value
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 bg-white text-slate-600'
            "
            @click="selectedDate = date.value"
          >
            {{ date.label }}
          </button>
        </div>
      </div>

      <div>
        <h2 class="text-sm font-bold text-slate-700">
          カテゴリで絞り込み
        </h2>

        <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="category in categoryOptions"
            :key="category.value"
            type="button"
            class="shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition"
            :class="
              selectedCategory === category.value
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 bg-white text-slate-600'
            "
            @click="selectedCategory = category.value"
          >
            {{ category.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="mt-6">
      <div class="flex items-end justify-between">
        <h2 class="text-lg font-bold text-slate-900">
          予定一覧
        </h2>

        <p class="text-xs text-slate-500">
          {{ filteredScheduleItems.length }}件
        </p>
      </div>

      <div
        v-if="filteredScheduleItems.length > 0"
        class="mt-4 space-y-4"
      >
        <article
          v-for="item in filteredScheduleItems"
          :key="item.id"
          class="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-bold"
                  :class="getCategoryClass(item.category)"
                >
                  {{ getCategoryLabel(item.category) }}
                </span>

                <span
                  v-if="item.isImportant"
                  class="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-700"
                >
                  重要
                </span>
              </div>

              <h3 class="mt-3 text-base font-bold text-slate-900">
                {{ item.title }}
              </h3>
            </div>

            <div class="shrink-0 rounded-2xl bg-sky-50 px-3 py-2 text-center">
              <p class="text-xs font-bold text-sky-600">
                {{ item.dayLabel }}
              </p>
              <p class="mt-1 text-sm font-bold text-slate-900">
                {{ item.startTime }}
              </p>
            </div>
          </div>

          <div class="mt-3 text-sm text-slate-600">
            <p>
              <span class="font-bold text-slate-700">時間：</span>
              {{ item.startTime }}
              <template v-if="item.endTime">
                〜 {{ item.endTime }}
              </template>
            </p>

            <p class="mt-1">
              <span class="font-bold text-slate-700">場所：</span>
              {{ item.place }}
            </p>

            <p class="mt-3 leading-7">
              {{ item.description }}
            </p>
          </div>
        </article>
      </div>

      <div
        v-else
        class="mt-4 rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center"
      >
        <p class="text-sm font-bold text-slate-700">
          条件に一致する予定がありません
        </p>
        <p class="mt-2 text-xs text-slate-500">
          日付またはカテゴリを変更してください。
        </p>
      </div>
    </section>

    <section class="mt-6 rounded-3xl bg-slate-50 p-4">
      <h2 class="text-sm font-bold text-slate-800">
        注意
      </h2>

      <p class="mt-2 text-xs leading-6 text-slate-600">
        このページの内容は仮データです。実際の開催時間、場所、運営情報は公式発表を確認してください。
      </p>
    </section>
  </main>
</template>