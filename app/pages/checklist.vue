<script setup lang="ts">
import { computed, ref } from 'vue'
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

type EditableChecklistItem = ChecklistItem & {
  isCustom?: boolean
}

type ChecklistItemOverride = Partial<
  Pick<ChecklistItem, 'label' | 'description' | 'category' | 'priority'>
>

type ChecklistFormState = {
  id: string | null
  mode: 'create' | 'edit'
  label: string
  description: string
  category: ChecklistItem['category']
  priority: ChecklistItem['priority']
}

const { value: checkedItemIds, reset: resetCheckedItemIds } = useLocalStorage<string[]>(
  'checklist:checked-item-ids',
  [],
)

const { value: customItems, reset: resetCustomItems } = useLocalStorage<ChecklistItem[]>(
  'checklist:custom-items',
  [],
)

const { value: itemOverrides, reset: resetItemOverrides } = useLocalStorage<
  Record<string, ChecklistItemOverride>
>('checklist:item-overrides', {})

const { value: hiddenItemIds, reset: resetHiddenItemIds } = useLocalStorage<string[]>(
  'checklist:hidden-item-ids',
  [],
)

const defaultCategoryKey = checklistCategories[0]?.key as ChecklistItem['category']

const createEmptyForm = (): ChecklistFormState => ({
  id: null,
  mode: 'create',
  label: '',
  description: '',
  category: defaultCategoryKey,
  priority: 'medium',
})

const isFormOpen = ref(false)
const form = ref<ChecklistFormState>(createEmptyForm())

const editingItemId = ref<string | null>(null)
const editForm = ref<ChecklistFormState>(createEmptyForm())

const canSaveForm = (targetForm: ChecklistFormState) => {
  return targetForm.label.trim().length > 0
}

const priorityOptions: { value: ChecklistItem['priority']; label: string }[] = [
  { value: 'high', label: '重要' },
  { value: 'medium', label: '推奨' },
  { value: 'low', label: '任意' },
]

const defaultChecklistItems = computed<EditableChecklistItem[]>(() => {
  return checklistItems
    .filter((item) => !hiddenItemIds.value.includes(item.id))
    .map((item) => {
      return {
        ...item,
        ...itemOverrides.value[item.id],
        isCustom: false,
      }
    })
})

const allChecklistItems = computed<EditableChecklistItem[]>(() => {
  return [
    ...defaultChecklistItems.value,
    ...customItems.value.map((item) => ({
      ...item,
      isCustom: true,
    })),
  ]
})

const visibleItemIds = computed(() => {
  return allChecklistItems.value.map((item) => item.id)
})

const totalCount = computed(() => allChecklistItems.value.length)

const checkedCount = computed(() => {
  return checkedItemIds.value.filter((id) => visibleItemIds.value.includes(id)).length
})

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
      items: allChecklistItems.value.filter((item) => item.category === category.key),
    }
  })
})

const hasCustomSettings = computed(() => {
  return (
    customItems.value.length > 0 ||
    hiddenItemIds.value.length > 0 ||
    Object.keys(itemOverrides.value).length > 0
  )
})

const canSaveItem = computed(() => {
  return canSaveForm(form.value)
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

const openCreateForm = () => {
  form.value = createEmptyForm()
  isFormOpen.value = true
}

const openEditForm = (item: EditableChecklistItem) => {
  isFormOpen.value = false

  editingItemId.value = item.id
  editForm.value = {
    id: item.id,
    mode: 'edit',
    label: item.label,
    description: item.description ?? '',
    category: item.category,
    priority: item.priority,
  }
}

const closeEditForm = () => {
  editingItemId.value = null
  editForm.value = createEmptyForm()
}

const saveEditingItem = (item: EditableChecklistItem) => {
  if (!editingItemId.value || !canSaveForm(editForm.value)) {
    return
  }

  const savedItem = {
    label: editForm.value.label.trim(),
    description: editForm.value.description.trim() || undefined,
    category: editForm.value.category,
    priority: editForm.value.priority,
  }

  if (item.isCustom) {
    customItems.value = customItems.value.map((customItem) => {
      if (customItem.id !== item.id) {
        return customItem
      }

      return {
        ...customItem,
        ...savedItem,
      }
    })
  } else {
    itemOverrides.value = {
      ...itemOverrides.value,
      [item.id]: savedItem,
    }
  }

  closeEditForm()
}

const closeForm = () => {
  isFormOpen.value = false
  form.value = createEmptyForm()
}

const saveItem = () => {
  if (!canSaveItem.value) {
    return
  }

  const savedItem = {
    label: form.value.label.trim(),
    description: form.value.description.trim() || undefined,
    category: form.value.category,
    priority: form.value.priority,
  }

  if (form.value.mode === 'create') {
    customItems.value = [
      ...customItems.value,
      {
        id: `custom-${Date.now()}`,
        ...savedItem,
      },
    ]

    closeForm()
    return
  }

  if (!form.value.id) {
    return
  }

  const isCustomItem = customItems.value.some((item) => item.id === form.value.id)

  if (isCustomItem) {
    customItems.value = customItems.value.map((item) => {
      if (item.id !== form.value.id) {
        return item
      }

      return {
        ...item,
        ...savedItem,
      }
    })
  } else {
    itemOverrides.value = {
      ...itemOverrides.value,
      [form.value.id]: savedItem,
    }
  }

  closeForm()
}

const removeItem = (item: EditableChecklistItem) => {
  if (item.isCustom) {
    customItems.value = customItems.value.filter((customItem) => customItem.id !== item.id)
  } else {
    hiddenItemIds.value = [...new Set([...hiddenItemIds.value, item.id])]
  }

  checkedItemIds.value = checkedItemIds.value.filter((id) => id !== item.id)

  if (editingItemId.value === item.id) {
    closeEditForm()
  }
}

const resetChecklist = () => {
  resetCheckedItemIds()
}

const resetCustomSettings = () => {
  resetCustomItems()
  resetItemOverrides()
  resetHiddenItemIds()

  const defaultItemIds = checklistItems.map((item) => item.id)
  checkedItemIds.value = checkedItemIds.value.filter((id) => defaultItemIds.includes(id))

  closeForm()
  closeEditForm()
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
        チェック状態や追加した項目はこの端末に保存されます。
      </p>
    </section>

    <section
      class="sticky top-[72px] z-10 mt-4 rounded-2xl border border-sky-100 bg-white/95 p-4 shadow-lg backdrop-blur"
    >
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

      <div class="mt-2 flex items-center justify-between">
        <p class="text-xs font-bold text-slate-500">
          {{ progressPercent }}%
        </p>

        <button
          type="button"
          class="rounded-full bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition active:scale-[0.98]"
          @click="openCreateForm"
        >
          項目を追加
        </button>
      </div>
    </section>

    <section
      v-if="isFormOpen"
      class="mt-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5"
    >
      <h2 class="text-lg font-bold text-slate-900">
        {{ form.mode === 'create' ? '持ち物を追加' : '持ち物を編集' }}
      </h2>

      <form class="mt-4 space-y-4" @submit.prevent="saveItem">
        <div>
          <label class="text-xs font-bold text-slate-500">
            持ち物名
          </label>
          <input
            v-model.trim="form.label"
            type="text"
            class="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            placeholder="例：日焼け止め"
          >
        </div>

        <div>
          <label class="text-xs font-bold text-slate-500">
            メモ
          </label>
          <textarea
            v-model.trim="form.description"
            rows="3"
            class="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            placeholder="例：塗り直し用に小さいものを持っていく"
          />
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label class="text-xs font-bold text-slate-500">
              カテゴリ
            </label>
            <select
              v-model="form.category"
              class="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option
                v-for="category in checklistCategories"
                :key="category.key"
                :value="category.key"
              >
                {{ category.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="text-xs font-bold text-slate-500">
              優先度
            </label>
            <select
              v-model="form.priority"
              class="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option
                v-for="priority in priorityOptions"
                :key="priority.value"
                :value="priority.value"
              >
                {{ priority.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            type="submit"
            class="flex-1 rounded-full bg-sky-500 px-5 py-3 text-sm font-bold text-white transition active:scale-[0.98] disabled:bg-slate-300"
            :disabled="!canSaveItem"
          >
            保存
          </button>

          <button
            type="button"
            class="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition active:scale-[0.98]"
            @click="closeForm"
          >
            キャンセル
          </button>
        </div>
      </form>
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

        <div v-if="category.items.length > 0" class="mt-4 space-y-3">
          <div
            v-for="item in category.items"
            :key="item.id"
            class="rounded-2xl border p-4 transition"
            :class="
              isChecked(item.id)
                ? 'border-sky-200 bg-sky-50'
                : 'border-slate-100 bg-white'
            "
          >
            <form
              v-if="editingItemId === item.id"
              class="space-y-4"
              @submit.prevent="saveEditingItem(item)"
            >
              <div>
                <label class="text-xs font-bold text-slate-500">
                  持ち物名
                </label>
                <input
                  v-model.trim="editForm.label"
                  type="text"
                  class="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="例：日焼け止め"
                >
              </div>

              <div>
                <label class="text-xs font-bold text-slate-500">
                  メモ
                </label>
                <textarea
                  v-model.trim="editForm.description"
                  rows="3"
                  class="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="例：塗り直し用に小さいものを持っていく"
                />
              </div>

              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label class="text-xs font-bold text-slate-500">
                    カテゴリ
                  </label>
                  <select
                    v-model="editForm.category"
                    class="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  >
                    <option
                      v-for="categoryOption in checklistCategories"
                      :key="categoryOption.key"
                      :value="categoryOption.key"
                    >
                      {{ categoryOption.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="text-xs font-bold text-slate-500">
                    優先度
                  </label>
                  <select
                    v-model="editForm.priority"
                    class="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  >
                    <option
                      v-for="priority in priorityOptions"
                      :key="priority.value"
                      :value="priority.value"
                    >
                      {{ priority.label }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="flex gap-3 border-t border-slate-100 pt-3">
                <button
                  type="submit"
                  class="flex-1 rounded-full bg-sky-500 px-5 py-3 text-sm font-bold text-white transition active:scale-[0.98] disabled:bg-slate-300"
                  :disabled="!canSaveForm(editForm)"
                >
                  保存
                </button>

                <button
                  type="button"
                  class="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition active:scale-[0.98]"
                  @click="closeEditForm"
                >
                  キャンセル
                </button>
              </div>
            </form>

            <template v-else>
              <button
                type="button"
                class="flex w-full items-start gap-3 text-left active:scale-[0.99]"
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

                    <span
                      v-if="item.isCustom"
                      class="rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-bold text-yellow-700"
                    >
                      追加
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

              <div class="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  class="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-500 ring-1 ring-slate-200 transition active:scale-[0.98]"
                  @click="openEditForm(item)"
                >
                  編集
                </button>

                <button
                  type="button"
                  class="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-rose-500 ring-1 ring-rose-100 transition active:scale-[0.98]"
                  @click="removeItem(item)"
                >
                  {{ item.isCustom ? '削除' : '非表示' }}
                </button>
              </div>
            </template>
          </div>
        </div>

        <p v-else class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
          このカテゴリの項目はありません。
        </p>
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

    <section
      v-if="hasCustomSettings"
      class="mt-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="font-bold text-slate-900">
            項目設定を初期状態に戻す
          </h2>
          <p class="mt-1 text-xs leading-5 text-slate-500">
            追加した項目、編集内容、非表示にした標準項目を元に戻します。
          </p>
        </div>

        <button
          type="button"
          class="rounded-full border border-rose-100 px-5 py-3 text-sm font-bold text-rose-500 transition hover:bg-rose-50 active:scale-[0.98]"
          @click="resetCustomSettings"
        >
          初期状態に戻す
        </button>
      </div>
    </section>
  </main>
</template>