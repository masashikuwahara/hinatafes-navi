<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  checklistCategories,
  checklistItems,
  type ChecklistItem,
} from '~/data/checklistItems'

type DisplayCategory = {
  id: string
  label: string
  description?: string
}

type DisplayChecklistItem = {
  id: string
  category: string
  title: string
  description?: string
  isRequired?: boolean
  isCustom?: boolean
}

type ItemEdit = {
  title?: string
  description?: string
}

const CHECKED_STORAGE_KEY = 'hinatafes-checklist-checked-v2'
const CUSTOM_STORAGE_KEY = 'hinatafes-checklist-custom-v2'
const EDIT_STORAGE_KEY = 'hinatafes-checklist-edits-v2'
const DELETED_STORAGE_KEY = 'hinatafes-checklist-deleted-v2'

useAppSeo({
  title: '持ち物チェックリスト',
  description:
    'ひなたフェス2026参加前に確認したい持ち物チェックリストです。チケット、スマートフォン、モバイルバッテリー、暑さ対策グッズ、雨具、身分証などを出発前に確認できます。',
})

const checkedIds = ref<string[]>([])
const customItems = ref<DisplayChecklistItem[]>([])
const itemEdits = ref<Record<string, ItemEdit>>({})
const deletedItemIds = ref<string[]>([])

const activeCategoryId = ref('')
const newItemTitle = ref('')
const newItemDescription = ref('')

const editingItemId = ref<string | null>(null)
const editingTitle = ref('')
const editingDescription = ref('')

const hasMounted = ref(false)

const normalizeCategory = (category: unknown): DisplayCategory => {
  const raw = category as {
    id?: string
    key?: string
    label?: string
    name?: string
    title?: string
    description?: string
  }

  return {
    id: String(raw.id ?? raw.key ?? 'other'),
    label: String(raw.label ?? raw.name ?? raw.title ?? 'その他'),
    description: raw.description,
  }
}

const normalizeChecklistItem = (
  item: ChecklistItem,
  index: number,
): DisplayChecklistItem => {
  const raw = item as ChecklistItem & {
    id?: string
    category?: string
    name?: string
    title?: string
    label?: string
    description?: string
    memo?: string
    isRequired?: boolean
    required?: boolean
  }

  return {
    id: String(raw.id ?? `item-${index}`),
    category: String(raw.category ?? 'other'),
    title: String(raw.name ?? raw.title ?? raw.label ?? '持ち物'),
    description: raw.description ?? raw.memo,
    isRequired: Boolean(raw.isRequired ?? raw.required ?? false),
    isCustom: false,
  }
}

const categories = computed<DisplayCategory[]>(() => {
  return checklistCategories.map((category) => normalizeCategory(category))
})

const defaultCategoryId = computed(() => {
  return categories.value[0]?.id ?? 'other'
})

const currentCategoryId = computed(() => {
  return activeCategoryId.value || defaultCategoryId.value
})

const baseItems = computed<DisplayChecklistItem[]>(() => {
  return checklistItems.map((item, index) => normalizeChecklistItem(item, index))
})

const visibleBaseItems = computed<DisplayChecklistItem[]>(() => {
  return baseItems.value.filter((item) => !deletedItemIds.value.includes(item.id))
})

const allItems = computed<DisplayChecklistItem[]>(() => {
  return [...visibleBaseItems.value, ...customItems.value].map((item) => {
    const edit = itemEdits.value[item.id]

    if (!edit) {
      return item
    }

    return {
      ...item,
      title: edit.title || item.title,
      description:
        edit.description !== undefined ? edit.description : item.description,
    }
  })
})

const currentCategory = computed(() => {
  return categories.value.find((category) => category.id === currentCategoryId.value)
})

const currentItems = computed(() => {
  return allItems.value.filter((item) => item.category === currentCategoryId.value)
})

const totalCount = computed(() => allItems.value.length)

const checkedCount = computed(() => {
  const validIds = new Set(allItems.value.map((item) => item.id))
  return checkedIds.value.filter((id) => validIds.has(id)).length
})

const uncheckedCount = computed(() => {
  return totalCount.value - checkedCount.value
})

const progressPercent = computed(() => {
  if (totalCount.value === 0) {
    return 0
  }

  return Math.round((checkedCount.value / totalCount.value) * 100)
})

const isAllChecked = computed(() => {
  return totalCount.value > 0 && uncheckedCount.value === 0
})

const progressStatusMessage = computed(() => {
  if (totalCount.value === 0) {
    return '項目がありません。必要な持ち物を追加できます。'
  }

  if (isAllChecked.value) {
    return 'すべてOKです。忘れ物はありません。'
  }

  return `あと${uncheckedCount.value}件、未チェックがあります。`
})

const requiredRemainingItems = computed(() => {
  return allItems.value
    .filter((item) => item.isRequired && !isChecked(item.id))
    .slice(0, 4)
})

const isChecked = (itemId: string) => {
  return checkedIds.value.includes(itemId)
}

const toggleItem = (itemId: string) => {
  if (isChecked(itemId)) {
    checkedIds.value = checkedIds.value.filter((id) => id !== itemId)
    return
  }

  checkedIds.value = [...checkedIds.value, itemId]
}

const getCategoryCount = (categoryId: string) => {
  return allItems.value.filter((item) => item.category === categoryId).length
}

const getCategoryCheckedCount = (categoryId: string) => {
  return allItems.value.filter(
    (item) => item.category === categoryId && isChecked(item.id),
  ).length
}

const selectCategory = (categoryId: string) => {
  activeCategoryId.value = categoryId
}

const addCustomItem = () => {
  const title = newItemTitle.value.trim()

  if (!title) {
    return
  }

  const item: DisplayChecklistItem = {
    id: `custom-${Date.now()}`,
    category: currentCategoryId.value,
    title,
    description: newItemDescription.value.trim() || undefined,
    isRequired: false,
    isCustom: true,
  }

  customItems.value = [...customItems.value, item]
  newItemTitle.value = ''
  newItemDescription.value = ''
}

const startEdit = (item: DisplayChecklistItem) => {
  editingItemId.value = item.id
  editingTitle.value = item.title
  editingDescription.value = item.description ?? ''
}

const cancelEdit = () => {
  editingItemId.value = null
  editingTitle.value = ''
  editingDescription.value = ''
}

const saveEdit = (item: DisplayChecklistItem) => {
  const title = editingTitle.value.trim()

  if (!title) {
    return
  }

  itemEdits.value = {
    ...itemEdits.value,
    [item.id]: {
      title,
      description: editingDescription.value.trim(),
    },
  }

  cancelEdit()
}

const deleteChecklistItem = (item: DisplayChecklistItem) => {
  checkedIds.value = checkedIds.value.filter((id) => id !== item.id)

  const nextEdits = { ...itemEdits.value }
  delete nextEdits[item.id]
  itemEdits.value = nextEdits

  if (item.isCustom) {
    customItems.value = customItems.value.filter(
      (customItem) => customItem.id !== item.id,
    )
  } else {
    deletedItemIds.value = Array.from(new Set([...deletedItemIds.value, item.id]))
  }

  if (editingItemId.value === item.id) {
    cancelEdit()
  }
}

const clearCheckedItems = () => {
  checkedIds.value = []
}

const resetCustomEdits = () => {
  customItems.value = []
  itemEdits.value = {}
  deletedItemIds.value = []

  checkedIds.value = checkedIds.value.filter((id) =>
    baseItems.value.some((item) => item.id === id),
  )

  cancelEdit()
}

const loadFromStorage = () => {
  try {
    const savedChecked = localStorage.getItem(CHECKED_STORAGE_KEY)
    const savedCustom = localStorage.getItem(CUSTOM_STORAGE_KEY)
    const savedEdits = localStorage.getItem(EDIT_STORAGE_KEY)
    const savedDeleted = localStorage.getItem(DELETED_STORAGE_KEY)

    if (savedChecked) {
      checkedIds.value = JSON.parse(savedChecked)
    }

    if (savedCustom) {
      customItems.value = JSON.parse(savedCustom)
    }

    if (savedEdits) {
      itemEdits.value = JSON.parse(savedEdits)
    }

    if (savedDeleted) {
      deletedItemIds.value = JSON.parse(savedDeleted)
    }
  } catch {
    checkedIds.value = []
    customItems.value = []
    itemEdits.value = {}
    deletedItemIds.value = []
  }
}

const saveToStorage = () => {
  if (!hasMounted.value) {
    return
  }

  localStorage.setItem(CHECKED_STORAGE_KEY, JSON.stringify(checkedIds.value))
  localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(customItems.value))
  localStorage.setItem(EDIT_STORAGE_KEY, JSON.stringify(itemEdits.value))
  localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(deletedItemIds.value))
}

onMounted(() => {
  activeCategoryId.value = defaultCategoryId.value
  loadFromStorage()
  hasMounted.value = true
})

watch([checkedIds, customItems, itemEdits, deletedItemIds], saveToStorage, {
  deep: true,
})
</script>

<template>
  <main class="min-h-screen bg-[#f7fbfc] pb-24 text-slate-900">
    <div class="mx-auto max-w-md px-4 py-4">
      <!-- 画面ヘッダー -->
      <section class="rounded-xl border border-sky-100 bg-white px-3 py-3 shadow-sm">
        <p class="text-xs font-black tracking-[0.16em] text-sky-700">
          CHECK LIST
        </p>

        <div class="mt-1 flex items-end justify-between gap-3">
          <div>
            <h1 class="text-[1.35rem] font-black leading-tight">
              持ち物チェック
            </h1>
            <p class="mt-1 text-sm font-medium leading-snug text-slate-700">
              出発前・開演前に、忘れ物を確認します。
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

      <!-- 固定進捗 -->
      <section
        class="sticky top-0 z-30 -mx-4 mt-3 border-y border-sky-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-black text-slate-500">
              準備状況
            </p>
            <p class="mt-0.5 text-xl font-black leading-none">
              {{ checkedCount }} / {{ totalCount }}
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs font-black text-slate-500">
              未チェック
            </p>
            <p
              class="mt-0.5 text-xl font-black leading-none"
              :class="isAllChecked ? 'text-emerald-700' : 'text-orange-700'"
            >
              {{ uncheckedCount }}
            </p>
          </div>
        </div>

        <div class="mt-3 h-3 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          <div
            class="h-full rounded-full bg-sky-400"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>

        <div
          class="mt-2 rounded-lg border px-2 py-2"
          :class="
            isAllChecked
              ? 'border-emerald-200 bg-emerald-50/80 text-emerald-950'
              : 'border-sky-200 bg-sky-50/80 text-sky-950'
          "
        >
          <p class="text-xs font-black">
            {{ progressStatusMessage }}
          </p>
        </div>

        <div
          v-if="requiredRemainingItems.length > 0"
          class="mt-2 rounded-lg border border-orange-200 bg-orange-50/80 px-2 py-2"
        >
          <p class="text-xs font-black text-orange-950">
            重要そうな未チェック
          </p>
          <p class="mt-1 text-xs font-bold leading-relaxed text-orange-950">
            {{ requiredRemainingItems.map((item) => item.title).join('、') }}
          </p>
        </div>
      </section>

      <!-- カテゴリ -->
      <section class="mt-4">
        <div class="-mx-4 overflow-x-auto px-4">
          <div class="flex w-max gap-2 pb-1">
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              class="rounded-lg border px-3 py-2 text-left text-xs font-black shadow-sm active:translate-y-[1px]"
              :class="
                currentCategoryId === category.id
                  ? 'border-sky-200 bg-sky-50 text-sky-950'
                  : 'border-slate-200 bg-white text-slate-700'
              "
              @click="selectCategory(category.id)"
            >
              <span class="block whitespace-nowrap">
                {{ category.label }}
              </span>
              <span class="mt-0.5 block whitespace-nowrap text-[10px]">
                {{ getCategoryCheckedCount(category.id) }} /
                {{ getCategoryCount(category.id) }}
              </span>
            </button>
          </div>
        </div>
      </section>

      <!-- 自分用追加 -->
      <section class="mt-4 rounded-xl border border-dashed border-slate-200 bg-white p-3 shadow-sm">
        <div class="flex items-center justify-between gap-2">
          <div>
            <h2 class="text-sm font-black">
              自分用を追加
            </h2>
            <p class="mt-0.5 text-xs font-medium text-slate-600">
              {{ currentCategory?.label }} に追加します
            </p>
          </div>
        </div>

        <div class="mt-3 space-y-2">
          <input
            v-model="newItemTitle"
            type="text"
            placeholder="例：替えのTシャツ"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base font-bold outline-none transition focus:border-sky-300 focus:bg-sky-50/30"
          >

          <input
            v-model="newItemDescription"
            type="text"
            placeholder="メモ任意：ロッカーに入れる など"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none transition focus:border-sky-300 focus:bg-sky-50/30"
          >

          <button
            type="button"
            class="w-full rounded-lg border border-sky-700 bg-sky-700 px-3 py-2 text-sm font-black text-white shadow-sm active:translate-y-[1px]"
            @click="addCustomItem"
          >
            このカテゴリに追加
          </button>
        </div>
      </section>

      <!-- リスト本体 -->
      <section class="mt-5">
        <div class="mb-2 flex items-end justify-between gap-3">
          <div>
            <h2 class="text-base font-black">
              {{ currentCategory?.label }}
            </h2>
            <p
              v-if="currentCategory?.description"
              class="mt-0.5 text-xs font-medium text-slate-600"
            >
              {{ currentCategory.description }}
            </p>
          </div>

          <p class="shrink-0 text-xs font-black text-slate-500">
            {{ currentItems.length }}件
          </p>
        </div>

        <ul class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <li
            v-for="item in currentItems"
            :key="item.id"
            class="border-b border-dashed border-slate-200 last:border-b-0"
          >
            <div
              v-if="editingItemId === item.id"
              class="space-y-2 bg-sky-50/70 px-3 py-3"
            >
              <p class="text-xs font-black text-sky-800">
                この場で編集
              </p>

              <input
                v-model="editingTitle"
                type="text"
                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base font-bold outline-none transition focus:border-sky-300"
              >

              <input
                v-model="editingDescription"
                type="text"
                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none transition focus:border-sky-300"
              >

              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  class="rounded-lg border border-sky-700 bg-sky-700 px-3 py-2 text-sm font-black text-white shadow-sm"
                  @click="saveEdit(item)"
                >
                  保存
                </button>

                <button
                  type="button"
                  class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black shadow-sm"
                  @click="cancelEdit"
                >
                  やめる
                </button>
              </div>
            </div>

            <div
              v-else
              class="flex items-start gap-3 px-3 py-3"
              :class="isChecked(item.id) ? 'bg-slate-50/80 text-slate-500' : ''"
            >
              <button
                type="button"
                class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] border border-slate-300 text-base font-black shadow-sm"
                :class="
                  isChecked(item.id)
                    ? 'bg-sky-400 text-slate-950'
                    : 'bg-white text-transparent'
                "
                :aria-pressed="isChecked(item.id)"
                @click="toggleItem(item.id)"
              >
                ✓
              </button>

              <button
                type="button"
                class="min-w-0 flex-1 text-left"
                @click="toggleItem(item.id)"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <p
                    class="text-base font-black leading-snug"
                    :class="isChecked(item.id) ? 'line-through' : ''"
                  >
                    {{ item.title }}
                  </p>

                  <span
                    v-if="item.isRequired"
                    class="rounded-md border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[10px] font-black text-orange-700"
                  >
                    重要
                  </span>

                  <span
                    v-if="item.isCustom"
                    class="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-black text-slate-500"
                  >
                    追加
                  </span>
                </div>

                <p
                  v-if="item.description"
                  class="mt-1 text-sm font-medium leading-snug text-slate-600"
                  :class="isChecked(item.id) ? 'line-through' : ''"
                >
                  {{ item.description }}
                </p>
              </button>

              <div class="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  class="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-black text-slate-600 shadow-sm"
                  @click="startEdit(item)"
                >
                  編集
                </button>

                <button
                  type="button"
                  class="rounded-md border border-red-200 bg-white px-2 py-1 text-[11px] font-black text-red-600 shadow-sm"
                  @click="deleteChecklistItem(item)"
                >
                  削除
                </button>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <!-- 操作 -->
      <section class="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black shadow-sm active:bg-slate-50"
          @click="clearCheckedItems"
        >
          チェックを外す
        </button>

        <button
          type="button"
          class="rounded-lg border border-red-100 bg-white px-3 py-2 text-sm font-black text-red-700 shadow-sm active:bg-red-50"
          @click="resetCustomEdits"
        >
          追加・編集・削除を戻す
        </button>
      </section>

      <!-- 現地メモ -->
      <section class="mt-4 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-3 shadow-sm">
        <h2 class="text-sm font-black text-sky-950">
          使い方メモ
        </h2>
        <p class="mt-1 text-sm font-medium leading-relaxed text-sky-950">
          チケット、スマホ、バッテリー、水分は出発前にもう一度確認。現地で必要になった物は「自分用を追加」から足せます。
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