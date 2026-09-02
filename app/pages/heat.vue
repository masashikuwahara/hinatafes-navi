<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { eventStatus } from '~/data/eventStatus'


type HeatAction = {
  id: string
  title: string
  description: string
  level: 'normal' | 'important'
}

type HeatLog = {
  drinkCount: number
  lastDrinkAt: string | null
  checkedActionIds: string[]
  restMemo: string
}

const STORAGE_KEY = 'hinatafes-heat-log-v2'

useAppSeo({
  title: '暑さ・天候対策｜ひなたフェス2026 開催中止',
  description:
    'ひなたフェス2026は開催中止となりました。開催時に公式から案内されていた暑さ・天候対策情報を記録として掲載しています。',
})

const currentTimeText = ref('')
const drinkCount = ref(0)
const lastDrinkAt = ref<string | null>(null)
const checkedActionIds = ref<string[]>([])
const restMemo = ref('')
const hasMounted = ref(false)

let timerId: number | undefined

const heatActions: HeatAction[] = [
  {
    id: 'drink',
    title: '水分を飲む',
    description: 'のどが渇く前に少しずつ飲む',
    level: 'important',
  },
  {
    id: 'salt',
    title: '塩分を取る',
    description: '汗をかいたら塩分も意識する',
    level: 'normal',
  },
  {
    id: 'shade',
    title: '日陰・屋内に移動',
    description: '直射日光を避けて体温を下げる',
    level: 'important',
  },
  {
    id: 'rest',
    title: '無理せず休む',
    description: '予定より体調を優先する',
    level: 'important',
  },
  {
    id: 'cool',
    title: '首・わき・手首を冷やす',
    description: '冷感グッズやタオルを使う',
    level: 'normal',
  },
]

const dangerSigns = [
  'めまい',
  '頭痛',
  '吐き気',
  '手足のしびれ',
  '汗が止まらない',
  'ぼーっとする',
  'まっすぐ歩けない',
  '返事がおかしい',
]

const checkedActionCount = computed(() => {
  return heatActions.filter((action) => checkedActionIds.value.includes(action.id)).length
})

const actionProgressText = computed(() => {
  return `${checkedActionCount.value} / ${heatActions.length}`
})

const lastDrinkText = computed(() => {
  if (!lastDrinkAt.value) {
    return 'まだ記録なし'
  }

  return `${lastDrinkAt.value} に記録`
})

const heatStatusText = computed(() => {
  if (drinkCount.value === 0) {
    return 'まず水分を確認'
  }

  if (checkedActionCount.value < 2) {
    return '休憩も確認'
  }

  return 'こまめに継続'
})

const isChecked = (actionId: string) => {
  return checkedActionIds.value.includes(actionId)
}

const toggleAction = (actionId: string) => {
  if (isChecked(actionId)) {
    checkedActionIds.value = checkedActionIds.value.filter((id) => id !== actionId)
    return
  }

  checkedActionIds.value = [...checkedActionIds.value, actionId]
}

const formatCurrentTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

const updateCurrentTime = () => {
  currentTimeText.value = formatCurrentTime()
}

const recordDrink = () => {
  drinkCount.value += 1
  lastDrinkAt.value = formatCurrentTime()

  if (!checkedActionIds.value.includes('drink')) {
    checkedActionIds.value = [...checkedActionIds.value, 'drink']
  }
}

const resetTodayLog = () => {
  drinkCount.value = 0
  lastDrinkAt.value = null
  checkedActionIds.value = []
  restMemo.value = ''
}

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return
    }

    const parsed = JSON.parse(saved) as Partial<HeatLog>

    drinkCount.value = Number(parsed.drinkCount ?? 0)
    lastDrinkAt.value = parsed.lastDrinkAt ?? null
    checkedActionIds.value = Array.isArray(parsed.checkedActionIds)
      ? parsed.checkedActionIds
      : []
    restMemo.value = parsed.restMemo ?? ''
  } catch {
    drinkCount.value = 0
    lastDrinkAt.value = null
    checkedActionIds.value = []
    restMemo.value = ''
  }
}

const saveToStorage = () => {
  if (!hasMounted.value) {
    return
  }

  const log: HeatLog = {
    drinkCount: drinkCount.value,
    lastDrinkAt: lastDrinkAt.value,
    checkedActionIds: checkedActionIds.value,
    restMemo: restMemo.value,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(log))
}

onMounted(() => {
  updateCurrentTime()
  loadFromStorage()
  hasMounted.value = true

  timerId = window.setInterval(updateCurrentTime, 60_000)
})

onUnmounted(() => {
  if (timerId) {
    window.clearInterval(timerId)
  }
})

watch([drinkCount, lastDrinkAt, checkedActionIds, restMemo], saveToStorage, {
  deep: true,
})
</script>

<template>
  <main class="min-h-screen bg-[#f7fbfc] pb-24 text-slate-900">
    <div class="mx-auto max-w-md px-4 py-4">
      <!-- ヘッダー -->
      <section class="rounded-xl border border-orange-100 bg-white px-3 py-3 shadow-sm">
        <p class="text-xs font-black tracking-[0.16em] text-orange-700">
          HEAT CARE
        </p>

        <div class="mt-1 flex items-end justify-between gap-3">
          <div>
            <h1 class="text-[1.35rem] font-black leading-tight tracking-tight">
              ひなたフェス2026の暑さ対策・熱中症対策
            </h1>
            <p class="mt-1 text-sm font-medium leading-snug text-slate-700">
              ひなたフェス2026の宮崎遠征・屋外イベント参加前に、
              暑さ対策、水分補給、休憩のタイミングを確認します。
            </p>
          </div>

          <NuxtLink
            to="/"
            class="shrink-0 rounded-md border border-orange-200 bg-white px-2 py-1 text-xs font-black shadow-sm active:bg-orange-50"
          >
            TOP
          </NuxtLink>
        </div>
      </section>

      <CancelledPageNotice
        class="mt-3"
        page-label="暑さ・天候対策情報"
        description="以下は、ひなたフェス2026開催時に利用する予定だった暑さ・天候対策の記録です。"
      />

      <!-- 固定ステータス -->
      <section v-if="eventStatus.status !== 'cancelled'"
        class="sticky top-0 z-20 -mx-4 mt-3 border-y border-orange-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur"
      >
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="border-r border-slate-200 pr-2">
            <p class="text-xs font-black text-slate-500">
              現在
            </p>
            <p class="mt-1 text-xl font-black leading-none">
              {{ currentTimeText }}
            </p>
          </div>

          <div class="border-r border-slate-200 px-2">
            <p class="text-xs font-black text-slate-500">
              水分
            </p>
            <p class="mt-1 text-xl font-black leading-none text-sky-700">
              {{ drinkCount }}回
            </p>
          </div>

          <div class="pl-2">
            <p class="text-xs font-black text-slate-500">
              確認
            </p>
            <p class="mt-1 text-xl font-black leading-none text-orange-700">
              {{ actionProgressText }}
            </p>
          </div>
        </div>

        <div class="mt-3 flex items-center justify-between gap-3 rounded-lg border border-orange-100 bg-orange-50/80 px-2 py-2">
          <div class="min-w-0">
            <p class="text-xs font-black text-orange-800">
              {{ heatStatusText }}
            </p>
            <p class="mt-0.5 text-xs font-bold leading-snug text-orange-950">
              {{ lastDrinkText }}
            </p>
          </div>

          <button
            type="button"
            class="shrink-0 rounded-lg border border-orange-700 bg-orange-600 px-3 py-2 text-xs font-black text-white shadow-sm active:translate-y-[1px]"
            @click="recordDrink"
          >
            水分を飲んだ
          </button>
        </div>
      </section>

      <!-- まずやること -->
      <section class="mt-4">
        <div class="mb-2 flex items-end justify-between gap-3">
          <h2 class="mt-1 text-xl font-bold text-slate-900">
            {{
              eventStatus.status === 'cancelled'
                ? '開催時に予定されていた暑さ・天候対策'
                : '公式 暑さ・天候対策'
            }}
          </h2>
          <p class="text-xs font-black text-slate-500">
            チェックして確認
          </p>
        </div>

        <ul class="border-y border-slate-200 bg-white">
          <li
            v-for="action in heatActions"
            :key="action.id"
            class="border-b border-dashed border-slate-200 last:border-b-0"
          >
            <div
              class="flex items-start gap-3 px-3 py-3"
              :class="isChecked(action.id) ? 'bg-slate-50/80 text-slate-500' : ''"
            >
              <button
                type="button"
                class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] border border-slate-300 text-base font-black shadow-sm"
                :class="
                  isChecked(action.id)
                    ? 'bg-orange-400 text-slate-950'
                    : 'bg-white text-transparent'
                "
                :aria-pressed="isChecked(action.id)"
                @click="toggleAction(action.id)"
              >
                ✓
              </button>

              <button
                type="button"
                class="min-w-0 flex-1 text-left"
                @click="toggleAction(action.id)"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <p
                    class="text-base font-black leading-snug"
                    :class="isChecked(action.id) ? 'line-through' : ''"
                  >
                    {{ action.title }}
                  </p>

                  <span
                    v-if="action.level === 'important'"
                    class="rounded-md border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[10px] font-black text-orange-700"
                  >
                    優先
                  </span>
                </div>

                <p
                  class="mt-1 text-sm font-medium leading-snug text-slate-600"
                  :class="isChecked(action.id) ? 'line-through' : ''"
                >
                  {{ action.description }}
                </p>
              </button>
            </div>
          </li>
        </ul>
      </section>

      <!-- 危険サイン -->
      <section class="mt-5 rounded-xl border border-red-200 bg-red-50/80 px-3 py-3 shadow-sm">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-black tracking-[0.12em] text-red-700">
              WARNING
            </p>
            <h2 class="mt-1 text-base font-black text-red-950">
              熱中症の危険サイン
            </h2>
          </div>

          <p class="shrink-0 rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-black text-red-800 shadow-sm">
            無理しない
          </p>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="sign in dangerSigns"
            :key="sign"
            class="rounded-md border border-red-200 bg-white px-2 py-1 text-sm font-black text-red-900"
          >
            {{ sign }}
          </span>
        </div>

        <p class="mt-3 text-sm font-bold leading-relaxed text-red-950">
          体調に違和感がある場合は、予定を優先せず、涼しい場所・救護・スタッフ確認を優先してください。
        </p>
      </section>

      <!-- 会場内の確認導線 -->
      <section class="mt-5">
        <h2 class="mb-2 text-base font-black">
          ひなたフェス会場で確認する場所
        </h2>

        <div class="grid grid-cols-2 gap-2">
          <NuxtLink
            to="/map"
            class="rounded-lg border border-sky-200 bg-sky-50/80 px-3 py-3 shadow-sm active:translate-y-[1px]"
          >
            <p class="text-[10px] font-black tracking-[0.12em] text-sky-700">
              MAP
            </p>
            <p class="mt-1 text-sm font-black text-sky-950">
              救護・休憩場所
            </p>
            <p class="mt-1 text-xs font-bold text-sky-900">
              マップで確認
            </p>
          </NuxtLink>

          <NuxtLink
            to="/checklist"
            class="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm active:bg-slate-50"
          >
            <p class="text-[10px] font-black tracking-[0.12em] text-slate-500">
              GOODS
            </p>
            <p class="mt-1 text-sm font-black">
              暑さ対策グッズ
            </p>
            <p class="mt-1 text-xs font-bold text-slate-600">
              持ち物を確認
            </p>
          </NuxtLink>
        </div>
      </section>

      <!-- 休憩メモ -->
      <section class="mt-5 rounded-xl border border-dashed border-slate-200 bg-white p-3 shadow-sm">
        <div class="flex items-center justify-between gap-2">
          <div>
            <h2 class="text-sm font-black text-sky-950">
              ひなたフェス2026の暑さ対策メモ
            </h2>
            <p class="mt-1 text-sm font-medium leading-relaxed text-sky-950">
              ひなたフェス2026では、宮崎での移動や屋外での待機時間が長くなる可能性があります。
              暑い日は「まだ大丈夫」と思う前に休憩し、移動・待機・開演前のタイミングで、
              こまめに水分補給と暑さ対策グッズの確認をしてください。
            </p>
          </div>
        </div>

        <textarea
          v-model="restMemo"
          rows="4"
          placeholder="例：木の花ドーム付近で休憩、14:30に集合 など"
          class="mt-3 w-full resize-none rounded-lg border border-slate-200 bg-[#fffdf7] px-3 py-2 text-base font-medium leading-relaxed outline-none transition focus:border-sky-300 focus:bg-white"
        />
      </section>

      <!-- 操作 -->
      <section class="mt-5">
        <button
          type="button"
          class="w-full rounded-lg border border-red-100 bg-white px-3 py-2 text-sm font-black text-red-700 shadow-sm active:bg-red-50"
          @click="resetTodayLog"
        >
          今日の記録をリセット
        </button>
      </section>

      <!-- 現地メモ -->
      <section class="mt-4 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-3 shadow-sm">
        <h2 class="text-sm font-black text-sky-950">
          現地メモ
        </h2>
        <p class="mt-1 text-sm font-medium leading-relaxed text-sky-950">
          暑い日は「まだ大丈夫」と思う前に休憩。移動・待機・開演前のタイミングで、こまめに水分を確認してください。
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

textarea {
  font-family:
    'BIZ UDPGothic',
    'Hiragino Maru Gothic ProN',
    'Hiragino Sans',
    'Noto Sans JP',
    'Meiryo',
    system-ui,
    sans-serif;
}
</style>