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

useAppSeo({
  title: '持ち物チェックリスト',
  description:
    'ひなたフェス2026参加前に確認したい持ち物チェックリストです。チケット、スマートフォン、モバイルバッテリー、暑さ対策グッズ、雨具、身分証などを出発前に確認できます。',
})

const checkedIds = ref<string[]>([])
const customItems = ref<DisplayChecklistItem[]>([])
const itemEdits = ref<Record<string, ItemEdit>>({})

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

const allItems = computed<DisplayChecklistItem[]>(() => {
  return [...baseItems.value, ...customItems.value].map((item) => {
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

const deleteCustomItem = (itemId: string) => {
  customItems.value = customItems.value.filter((item) => item.id !== itemId)
  checkedIds.value = checkedIds.value.filter((id) => id !== itemId)

  const nextEdits = { ...itemEdits.value }
  delete nextEdits[itemId]
  itemEdits.value = nextEdits
}

const clearCheckedItems = () => {
  checkedIds.value = []
}

const resetCustomEdits = () => {
  customItems.value = []
  itemEdits.value = {}
  checkedIds.value = checkedIds.value.filter((id) =>
    baseItems.value.some((item) => item.id === id),
  )
}

const loadFromStorage = () => {
  try {
    const savedChecked = localStorage.getItem(CHECKED_STORAGE_KEY)
    const savedCustom = localStorage.getItem(CUSTOM_STORAGE_KEY)
    const savedEdits = localStorage.getItem(EDIT_STORAGE_KEY)

    if (savedChecked) {
      checkedIds.value = JSON.parse(savedChecked)
    }

    if (savedCustom) {
      customItems.value = JSON.parse(savedCustom)
    }

    if (savedEdits) {
      itemEdits.value = JSON.parse(savedEdits)
    }
  } catch {
    checkedIds.value = []
    customItems.value = []
    itemEdits.value = {}
  }
}

const saveToStorage = () => {
  if (!hasMounted.value) {
    return
  }

  localStorage.setItem(CHECKED_STORAGE_KEY, JSON.stringify(checkedIds.value))
  localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(customItems.value))
  localStorage.setItem(EDIT_STORAGE_KEY, JSON.stringify(itemEdits.value))
}

onMounted(() => {
  activeCategoryId.value = defaultCategoryId.value
  loadFromStorage()
  hasMounted.value = true
})

watch([checkedIds, customItems, itemEdits], saveToStorage, {
  deep: true,
})
</script>

<template>
  <main class="min-h-screen bg-[#f7fbfc] pb-24 text-slate-900">
    <div class="mx-auto max-w-md px-4 py-4">
      <!-- 画面ヘッダー -->
      <section class="border-b-4 border-sky-400 pb-3">
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
            class="shrink-0 border-2 border-slate-800 bg-white px-2 py-1 text-xs font-black active:bg-slate-100"
          >
            TOP
          </NuxtLink>
        </div>
      </section>

      <!-- 固定進捗 -->
      <section
        class="sticky top-0 z-20 -mx-4 mt-3 border-y-2 border-slate-800 bg-white px-4 py-3"
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
            <p class="mt-0.5 text-xl font-black leading-none text-orange-700">
              {{ uncheckedCount }}
            </p>
          </div>
        </div>

        <div class="mt-3 h-3 border-2 border-slate-800 bg-white">
          <div
            class="h-full bg-sky-400"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>

        <div
          v-if="requiredRemainingItems.length > 0"
          class="mt-2 border-l-4 border-orange-500 bg-orange-50 px-2 py-2"
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
              class="border-2 px-3 py-2 text-left text-xs font-black active:translate-y-[1px]"
              :class="
                currentCategoryId === category.id
                  ? 'border-sky-600 bg-sky-100 text-sky-950'
                  : 'border-slate-300 bg-white text-slate-700'
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
      <section class="mt-4 border-2 border-dashed border-slate-300 bg-white p-3">
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
            class="w-full border-2 border-slate-300 bg-white px-3 py-2 text-base font-bold outline-none focus:border-sky-500"
          >

          <input
            v-model="newItemDescription"
            type="text"
            placeholder="メモ任意：ロッカーに入れる など"
            class="w-full border-2 border-slate-300 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-sky-500"
          >

          <button
            type="button"
            class="w-full border-2 border-slate-800 bg-slate-900 px-3 py-2 text-sm font-black text-white active:translate-y-[1px]"
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

        <ul class="border-y-2 border-slate-800 bg-white">
          <li
            v-for="item in currentItems"
            :key="item.id"
            class="border-b border-dashed border-slate-300 last:border-b-0"
          >
            <div
              v-if="editingItemId === item.id"
              class="space-y-2 bg-sky-50 px-3 py-3"
            >
              <p class="text-xs font-black text-sky-800">
                この場で編集
              </p>

              <input
                v-model="editingTitle"
                type="text"
                class="w-full border-2 border-slate-300 bg-white px-3 py-2 text-base font-bold outline-none focus:border-sky-500"
              >

              <input
                v-model="editingDescription"
                type="text"
                class="w-full border-2 border-slate-300 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-sky-500"
              >

              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  class="border-2 border-slate-800 bg-slate-900 px-3 py-2 text-sm font-black text-white"
                  @click="saveEdit(item)"
                >
                  保存
                </button>

                <button
                  type="button"
                  class="border-2 border-slate-300 bg-white px-3 py-2 text-sm font-black"
                  @click="cancelEdit"
                >
                  やめる
                </button>
              </div>
            </div>

            <div
              v-else
              class="flex items-start gap-3 px-3 py-3"
              :class="isChecked(item.id) ? 'bg-slate-50 text-slate-500' : ''"
            >
              <button
                type="button"
                class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border-2 border-slate-800 text-base font-black"
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
                    class="border border-orange-500 bg-orange-50 px-1.5 py-0.5 text-[10px] font-black text-orange-700"
                  >
                    重要
                  </span>

                  <span
                    v-if="item.isCustom"
                    class="border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-black text-slate-500"
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
                  class="border border-slate-300 bg-white px-2 py-1 text-[11px] font-black text-slate-600"
                  @click="startEdit(item)"
                >
                  編集
                </button>

                <button
                  v-if="item.isCustom"
                  type="button"
                  class="border border-red-300 bg-white px-2 py-1 text-[11px] font-black text-red-600"
                  @click="deleteCustomItem(item.id)"
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
          class="border-2 border-slate-300 bg-white px-3 py-2 text-sm font-black active:bg-slate-50"
          @click="clearCheckedItems"
        >
          チェックを外す
        </button>

        <button
          type="button"
          class="border-2 border-slate-300 bg-white px-3 py-2 text-sm font-black text-red-700 active:bg-red-50"
          @click="resetCustomEdits"
        >
          追加・編集を戻す
        </button>
      </section>

      <!-- 現地メモ -->
      <section class="mt-4 border-l-4 border-sky-500 bg-sky-50 px-3 py-3">
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