<script setup lang="ts">
import {
  checklistCategories,
  checklistItems,
  type ChecklistItem,
} from '~/data/checklistItems'

useAppSeo({
  title: '持ち物チェックリスト',
  description:
    'ひなたフェス2026参加前に確認したい持ち物チェックリストです。チケット、スマートフォン、モバイルバッテリー、暑さ対策グッズ、雨具、身分証などを出発前に確認できます。',
  path: '/checklist',
})

const { value: checkedItemIds, reset } = useLocalStorage<string[]>(
  'checklist:checked-item-ids',
  [],
)

const totalCount = computed(() => checklistItems.length)

const checkedCount = computed(() => checkedItemIds.value.length)

const remainingCount = computed(() => totalCount.value - checkedCount.value)

const progressPercent = computed(() => {
  if (totalCount.value === 0) {
    return 0
  }

  return Math.round((checkedCount.value / totalCount.value) * 100)
})

const groupedChecklistItems = computed(() => {
  return checklistCategories.map((category) => {
    return {
      ...category,
      items: checklistItems.filter((item) => item.category === category.key),
    }
  })
})

const isChecked = (itemId: string) => {
  return checkedItemIds.value.includes(itemId)
}

const toggleItem = (item: ChecklistItem) => {
  if (isChecked(item.id)) {
    checkedItemIds.value = checkedItemIds.value.filter((id) => id !== item.id)
    return
  }

  checkedItemIds.value = [...checkedItemIds.value, item.id]
}

const resetChecklist = () => {
  reset()
}

const getPriorityLabel = (priority: ChecklistItem['priority']) => {
  if (priority === 'high') {
    return '重要'
  }

  if (priority === 'medium') {
    return '推奨'
  }

  return '任意'
}

const getPriorityClass = (priority: ChecklistItem['priority']) => {
  if (priority === 'high') {
    return 'bg-rose-100 text-rose-700'
  }

  if (priority === 'medium') {
    return 'bg-sky-100 text-sky-700'
  }

  return 'bg-slate-100 text-slate-500'
}
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6">
    <section
      class="rounded-3xl bg-gradient-to-br from-sky-100 via-white to-yellow-50 p-5 shadow-sm ring-1 ring-sky-100 sm:p-6"
    >
      <p class="text-sm font-bold text-sky-600">
        CHECKLIST
      </p>

      <h1 class="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        持ち物チェックリスト
      </h1>

      <p class="mt-3 text-sm leading-7 text-slate-600">
        当日に必要なものを事前に確認できます。
        チェック状態はこの端末に保存されます。
      </p>

      <div class="mt-5 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-bold text-slate-500">
              準備状況
            </p>
            <p class="mt-1 text-2xl font-bold text-slate-900">
              {{ checkedCount }} / {{ totalCount }}
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs font-bold text-slate-500">
              残り
            </p>
            <p class="mt-1 text-2xl font-bold text-sky-600">
              {{ remainingCount }}
            </p>
          </div>
        </div>

        <div class="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            class="h-full rounded-full bg-gradient-to-r from-sky-400 to-yellow-300 transition-all duration-300"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>

        <p class="mt-2 text-right text-xs font-bold text-slate-500">
          {{ progressPercent }}%
        </p>
      </div>
    </section>

    <section class="mt-6 space-y-5">
      <div
        v-for="category in groupedChecklistItems"
        :key="category.key"
        class="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-xl"
          >
            {{ category.icon }}
          </div>

          <div>
            <h2 class="text-lg font-bold text-slate-900">
              {{ category.label }}
            </h2>
            <p class="mt-1 text-xs leading-5 text-slate-500">
              {{ category.description }}
            </p>
          </div>
        </div>

        <div class="mt-4 space-y-3">
          <button
            v-for="item in category.items"
            :key="item.id"
            type="button"
            class="flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition active:scale-[0.99]"
            :class="
              isChecked(item.id)
                ? 'border-sky-200 bg-sky-50'
                : 'border-slate-100 bg-white hover:bg-slate-50'
            "
            @click="toggleItem(item)"
          >
            <span
              class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-sm font-bold"
              :class="
                isChecked(item.id)
                  ? 'border-sky-500 bg-sky-500 text-white'
                  : 'border-slate-300 bg-white text-transparent'
              "
            >
              ✓
            </span>

            <span class="min-w-0 flex-1">
              <span class="flex flex-wrap items-center gap-2">
                <span
                  class="font-bold"
                  :class="isChecked(item.id) ? 'text-slate-500 line-through' : 'text-slate-900'"
                >
                  {{ item.label }}
                </span>

                <span
                  class="rounded-full px-2 py-0.5 text-[11px] font-bold"
                  :class="getPriorityClass(item.priority)"
                >
                  {{ getPriorityLabel(item.priority) }}
                </span>
              </span>

              <span
                v-if="item.description"
                class="mt-1 block text-xs leading-5 text-slate-500"
              >
                {{ item.description }}
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>

    <section class="mt-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="font-bold text-slate-900">
            チェックをやり直す
          </h2>
          <p class="mt-1 text-xs leading-5 text-slate-500">
            準備を最初から確認したい場合はリセットできます。
          </p>
        </div>

        <button
          type="button"
          class="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
          @click="resetChecklist"
        >
          全てリセット
        </button>
      </div>
    </section>
  </main>
</template>