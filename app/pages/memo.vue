<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

type MemoState = {
  seat: string
  meetingPlace: string
  locker: string
  shopping: string
  food: string
  transport: string
  freeMemo: string
}

type MemoFieldKey = keyof MemoState

type MemoField = {
  id: MemoFieldKey
  label: string
  shortLabel: string
  description: string
  placeholder: string
  rows: number
  important?: boolean
}

const STORAGE_KEY = 'hinatafes-memo-v2'

useAppSeo({
  title: '参戦メモ',
  description:
    'ひなたフェス2026の参戦メモです。座席、集合場所、ロッカー、買ったもの、帰りの交通、当日のメモをスマホに保存できます。',
})

const defaultMemo: MemoState = {
  seat: '',
  meetingPlace: '',
  locker: '',
  shopping: '',
  food: '',
  transport: '',
  freeMemo: '',
}

const memo = ref<MemoState>({ ...defaultMemo })
const hasMounted = ref(false)
const lastSavedAt = ref<string | null>(null)

const memoFields: MemoField[] = [
  {
    id: 'seat',
    label: '座席メモ',
    shortLabel: '座席',
    description: '入場前・開演前にすぐ確認',
    placeholder: '例：アリーナ A3 / スタンド 1塁側 など',
    rows: 3,
    important: true,
  },
  {
    id: 'meetingPlace',
    label: '集合場所',
    shortLabel: '集合',
    description: '友人との合流、待ち合わせ場所',
    placeholder: '例：木の花ドーム前、入場ゲート付近 など',
    rows: 3,
    important: true,
  },
  {
    id: 'locker',
    label: '荷物・ロッカー',
    shortLabel: '荷物',
    description: '預けた場所、持ち歩くもの',
    placeholder: '例：駅ロッカー 023番 / 予備バッテリーはバッグ内 など',
    rows: 3,
  },
  {
    id: 'shopping',
    label: '買ったもの・買うもの',
    shortLabel: '買い物',
    description: 'グッズ、物販、あとで見たい出店',
    placeholder: '例：タオル購入済み / 生写真あとで確認 など',
    rows: 4,
  },
  {
    id: 'food',
    label: '食べたいもの・休憩',
    shortLabel: 'フード',
    description: 'フード、飲み物、休憩場所',
    placeholder: '例：冷たいドリンクを買う / 14:00ごろ休憩 など',
    rows: 4,
  },
  {
    id: 'transport',
    label: '帰り・交通メモ',
    shortLabel: '帰り',
    description: '帰りのバス、電車、集合時間',
    placeholder: '例：臨時バス利用 / 21:30までに駅方面へ移動 など',
    rows: 4,
    important: true,
  },
  {
    id: 'freeMemo',
    label: '当日メモ',
    shortLabel: '自由',
    description: 'その場で残したいこと',
    placeholder: '例：次に行く場所、気づいたこと、感想メモ など',
    rows: 5,
  },
]

const filledCount = computed(() => {
  return memoFields.filter((field) => memo.value[field.id].trim() !== '').length
})

const emptyCount = computed(() => {
  return memoFields.length - filledCount.value
})

const progressText = computed(() => {
  return `${filledCount.value} / ${memoFields.length}`
})

const savedStatusText = computed(() => {
  if (!lastSavedAt.value) {
    return 'まだ保存なし'
  }

  return `${lastSavedAt.value} 保存`
})

const summaryItems = computed(() => {
  return [
    {
      label: '座席',
      value: memo.value.seat.trim() || '未入力',
      href: '#memo-seat',
    },
    {
      label: '集合',
      value: memo.value.meetingPlace.trim() || '未入力',
      href: '#memo-meetingPlace',
    },
    {
      label: '帰り',
      value: memo.value.transport.trim() || '未入力',
      href: '#memo-transport',
    },
  ]
})

const quickLinks = computed(() => {
  return memoFields.map((field) => ({
    id: field.id,
    label: field.shortLabel,
    href: `#memo-${field.id}`,
    filled: memo.value[field.id].trim() !== '',
  }))
})

const formatTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return
    }

    const parsed = JSON.parse(saved) as Partial<MemoState>

    memo.value = {
      ...defaultMemo,
      ...parsed,
    }
  } catch {
    memo.value = { ...defaultMemo }
  }
}

const saveToStorage = () => {
  if (!hasMounted.value) {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(memo.value))
  lastSavedAt.value = formatTime()
}

const clearMemo = () => {
  memo.value = { ...defaultMemo }
  lastSavedAt.value = formatTime()
}

onMounted(() => {
  loadFromStorage()
  hasMounted.value = true
})

watch(memo, saveToStorage, {
  deep: true,
})
</script>

<template>
  <main class="min-h-screen bg-[#f7fbfc] pb-24 text-slate-900">
    <div class="mx-auto max-w-md px-4 py-4">
      <!-- ヘッダー -->
      <section class="rounded-xl border border-sky-100 bg-white px-3 py-3 shadow-sm">
        <p class="text-xs font-black tracking-[0.16em] text-sky-700">
          FIELD MEMO
        </p>

        <div class="mt-1 flex items-end justify-between gap-3">
          <div>
            <h1 class="text-[1.35rem] font-black leading-tight">
              参戦メモ
            </h1>
            <p class="mt-1 text-sm font-medium leading-snug text-slate-700">
              座席・集合場所・帰りの予定を、すぐ見返せるように残します。
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

      <!-- 固定メモ要約 -->
      <section
        class="sticky top-0 z-20 -mx-4 mt-3 border-y border-sky-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-black text-slate-500">
              メモ状況
            </p>
            <p class="mt-0.5 text-xl font-black leading-none">
              {{ progressText }}
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs font-black text-slate-500">
              未入力
            </p>
            <p class="mt-0.5 text-xl font-black leading-none text-orange-700">
              {{ emptyCount }}
            </p>
          </div>
        </div>

        <div class="mt-3 space-y-1.5">
          <a
            v-for="item in summaryItems"
            :key="item.label"
            :href="item.href"
            class="block rounded-lg border border-sky-100 bg-sky-50/80 px-2 py-1.5 shadow-sm active:bg-sky-100"
          >
            <div class="flex gap-2">
              <p class="w-10 shrink-0 text-xs font-black text-sky-800">
                {{ item.label }}
              </p>
              <p
                class="line-clamp-1 text-xs font-bold text-sky-950"
                :class="item.value === '未入力' ? 'text-slate-500' : ''"
              >
                {{ item.value }}
              </p>
            </div>
          </a>
        </div>

        <p class="mt-2 text-right text-[11px] font-bold text-slate-500">
          {{ savedStatusText }}
        </p>
      </section>

      <!-- メモ内リンク -->
      <section class="mt-4">
        <div class="-mx-4 overflow-x-auto px-4">
          <div class="flex w-max gap-2 pb-1">
            <a
              v-for="link in quickLinks"
              :key="link.id"
              :href="link.href"
              class="rounded-lg border px-3 py-2 text-xs font-black shadow-sm active:translate-y-[1px]"
              :class="
                link.filled
                  ? 'border-sky-200 bg-sky-50 text-sky-950'
                  : 'border-slate-200 bg-white text-slate-700'
              "
            >
              {{ link.label }}
            </a>
          </div>
        </div>
      </section>

      <!-- 現地ですぐ開くリンク -->
      <section class="mt-4 grid grid-cols-3 gap-2">
        <NuxtLink
          to="/map"
          class="rounded-lg border border-sky-200 bg-sky-50/80 px-2 py-2 text-center shadow-sm active:translate-y-[1px]"
        >
          <p class="text-[10px] font-black tracking-[0.12em] text-sky-700">
            MAP
          </p>
          <p class="mt-1 text-xs font-black text-sky-950">
            場所確認
          </p>
        </NuxtLink>

        <NuxtLink
          to="/schedule"
          class="rounded-lg border border-amber-200 bg-amber-50/80 px-2 py-2 text-center shadow-sm active:translate-y-[1px]"
        >
          <p class="text-[10px] font-black tracking-[0.12em] text-amber-700">
            TIME
          </p>
          <p class="mt-1 text-xs font-black text-amber-950">
            予定確認
          </p>
        </NuxtLink>

        <NuxtLink
          to="/booths"
          class="rounded-lg border border-emerald-200 bg-emerald-50/80 px-2 py-2 text-center shadow-sm active:translate-y-[1px]"
        >
          <p class="text-[10px] font-black tracking-[0.12em] text-emerald-700">
            BOOTH
          </p>
          <p class="mt-1 text-xs font-black text-emerald-950">
            出店確認
          </p>
        </NuxtLink>
      </section>

      <!-- メモ欄 -->
      <section class="mt-5">
        <div class="mb-2 flex items-end justify-between gap-3">
          <h2 class="text-base font-black">
            メモ帳
          </h2>
          <p class="text-xs font-black text-slate-500">
            自動保存
          </p>
        </div>

        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <section
            v-for="field in memoFields"
            :id="`memo-${field.id}`"
            :key="field.id"
            class="scroll-mt-36 border-b border-dashed border-slate-200 px-3 py-3 last:border-b-0"
          >
            <div class="mb-2 flex items-start justify-between gap-3">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-base font-black leading-tight">
                    {{ field.label }}
                  </h3>

                  <span
                    v-if="field.important"
                    class="rounded-md border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[10px] font-black text-orange-700"
                  >
                    重要
                  </span>

                  <span
                    v-if="memo[field.id].trim() !== ''"
                    class="rounded-md border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[10px] font-black text-sky-700"
                  >
                    入力済み
                  </span>
                </div>

                <p class="mt-1 text-xs font-medium text-slate-600">
                  {{ field.description }}
                </p>
              </div>
            </div>

            <textarea
              v-model="memo[field.id]"
              :rows="field.rows"
              :placeholder="field.placeholder"
              class="w-full resize-none rounded-lg border border-slate-200 bg-[#fffdf7] px-3 py-2 text-base font-medium leading-relaxed outline-none transition focus:border-sky-300 focus:bg-white"
            />
          </section>
        </div>
      </section>

      <!-- 操作 -->
      <section class="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black shadow-sm active:bg-slate-50"
          @click="saveToStorage"
        >
          今すぐ保存
        </button>

        <button
          type="button"
          class="rounded-lg border border-red-100 bg-white px-3 py-2 text-sm font-black text-red-700 shadow-sm active:bg-red-50"
          @click="clearMemo"
        >
          メモを空にする
        </button>
      </section>

      <!-- 注意メモ -->
      <section class="mt-4 rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-3 shadow-sm">
        <h2 class="text-sm font-black text-orange-950">
          メモの使い方
        </h2>
        <p class="mt-1 text-sm font-medium leading-relaxed text-orange-950">
          座席・集合場所・帰りの予定は、電波が弱くなる前に入力しておくと安心です。入力内容はこの端末に保存されます。
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
h2,
h3 {
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