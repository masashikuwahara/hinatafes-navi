<script setup lang="ts">
type VisitMemo = {
  seat: string
  gate: string
  meetingPlace: string
  meetingTime: string
  goodsMemo: string
  foodMemo: string
  returnRoute: string
  hotelMemo: string
  liveMemo: string
  freeMemo: string
  updatedAt: string | null
}

const defaultMemo: VisitMemo = {
  seat: '',
  gate: '',
  meetingPlace: '',
  meetingTime: '',
  goodsMemo: '',
  foodMemo: '',
  returnRoute: '',
  hotelMemo: '',
  liveMemo: '',
  freeMemo: '',
  updatedAt: null,
}

useAppSeo({
  title: '参戦メモ',
  description:
    'ひなたフェス2026の座席、集合場所、買ったもの、感想などを端末内に保存できる個人用メモです。',
  path: '/memo',
  noindex: true,
})

const { value: memo, isReady, reset } = useLocalStorage<VisitMemo>(
  'memo:visit',
  defaultMemo,
)

const markUpdated = () => {
  memo.value.updatedAt = new Date().toISOString()
}

const lastUpdatedLabel = computed(() => {
  if (!memo.value.updatedAt) {
    return 'まだ保存されていません'
  }

  return new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(memo.value.updatedAt))
})

const hasMemo = computed(() => {
  return Object.entries(memo.value).some(([key, value]) => {
    if (key === 'updatedAt') {
      return false
    }

    return String(value).trim() !== ''
  })
})

const resetMemo = () => {
  if (!import.meta.client) {
    return
  }

  const confirmed = window.confirm('参戦メモをすべてリセットしますか？')

  if (!confirmed) {
    return
  }

  reset()
}
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6">
    <section
      class="rounded-3xl bg-gradient-to-br from-sky-100 via-white to-yellow-50 p-5 shadow-sm ring-1 ring-sky-100 sm:p-6"
    >
      <p class="text-sm font-bold text-sky-600">
        MEMO
      </p>

      <h1 class="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        参戦メモ
      </h1>

      <p class="mt-3 text-sm leading-7 text-slate-600">
        座席、集合場所、買ったもの、帰りの交通、ライブの感想などをメモできます。
        入力内容はこの端末に自動保存されます。
      </p>

      <div class="mt-5 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-bold text-slate-500">
              保存状態
            </p>

            <p class="mt-1 text-sm font-bold text-slate-900">
              <span v-if="isReady">
                {{ hasMemo ? 'メモあり' : '未入力' }}
              </span>
              <span v-else>
                読み込み中
              </span>
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs font-bold text-slate-500">
              最終更新
            </p>

            <p class="mt-1 text-sm font-bold text-sky-600">
              {{ lastUpdatedLabel }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-6 space-y-5">
      <div class="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
        <div class="flex items-start gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-xl">
            🎫
          </div>

          <div>
            <h2 class="text-lg font-bold text-slate-900">
              座席・入場メモ
            </h2>
            <p class="mt-1 text-xs leading-5 text-slate-500">
              当日すぐ確認したい座席や入場口をメモできます。
            </p>
          </div>
        </div>

        <div class="mt-4 space-y-4">
          <label class="block">
            <span class="text-sm font-bold text-slate-700">
              座席
            </span>
            <input
              v-model="memo.seat"
              type="text"
              placeholder="例：アリーナA / スタンド〇列 など"
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              @input="markUpdated"
            >
          </label>

          <label class="block">
            <span class="text-sm font-bold text-slate-700">
              入場口・ゲート
            </span>
            <input
              v-model="memo.gate"
              type="text"
              placeholder="例：東ゲート / 入場口B など"
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              @input="markUpdated"
            >
          </label>
        </div>
      </div>

      <div class="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
        <div class="flex items-start gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-50 text-xl">
            🤝
          </div>

          <div>
            <h2 class="text-lg font-bold text-slate-900">
              集合メモ
            </h2>
            <p class="mt-1 text-xs leading-5 text-slate-500">
              友人との集合場所や時間を控えておけます。
            </p>
          </div>
        </div>

        <div class="mt-4 space-y-4">
          <label class="block">
            <span class="text-sm font-bold text-slate-700">
              集合場所
            </span>
            <input
              v-model="memo.meetingPlace"
              type="text"
              placeholder="例：駅前、会場入口付近、物販エリア近く など"
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              @input="markUpdated"
            >
          </label>

          <label class="block">
            <span class="text-sm font-bold text-slate-700">
              集合時間
            </span>
            <input
              v-model="memo.meetingTime"
              type="text"
              placeholder="例：13:30 / 開場30分前 など"
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              @input="markUpdated"
            >
          </label>
        </div>
      </div>

      <div class="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
        <div class="flex items-start gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-xl">
            🛍️
          </div>

          <div>
            <h2 class="text-lg font-bold text-slate-900">
              買い物・出店メモ
            </h2>
            <p class="mt-1 text-xs leading-5 text-slate-500">
              グッズ、フード、出店で買いたいものをメモできます。
            </p>
          </div>
        </div>

        <div class="mt-4 space-y-4">
          <label class="block">
            <span class="text-sm font-bold text-slate-700">
              グッズメモ
            </span>
            <textarea
              v-model="memo.goodsMemo"
              rows="4"
              placeholder="例：推しメンタオル、ペンライト、Tシャツ など"
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              @input="markUpdated"
            />
          </label>

          <label class="block">
            <span class="text-sm font-bold text-slate-700">
              フード・出店メモ
            </span>
            <textarea
              v-model="memo.foodMemo"
              rows="4"
              placeholder="例：食べたいメニュー、行きたいブース など"
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              @input="markUpdated"
            />
          </label>
        </div>
      </div>

      <div class="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
        <div class="flex items-start gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
            🚃
          </div>

          <div>
            <h2 class="text-lg font-bold text-slate-900">
              交通・宿泊メモ
            </h2>
            <p class="mt-1 text-xs leading-5 text-slate-500">
              帰りのルートや宿泊先の確認用メモです。
            </p>
          </div>
        </div>

        <div class="mt-4 space-y-4">
          <label class="block">
            <span class="text-sm font-bold text-slate-700">
              帰りの交通
            </span>
            <textarea
              v-model="memo.returnRoute"
              rows="4"
              placeholder="例：最寄り駅、終電、バス乗り場、タクシー候補 など"
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              @input="markUpdated"
            />
          </label>

          <label class="block">
            <span class="text-sm font-bold text-slate-700">
              宿泊メモ
            </span>
            <textarea
              v-model="memo.hotelMemo"
              rows="4"
              placeholder="例：ホテル名、チェックイン時間、駅からの行き方 など"
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              @input="markUpdated"
            />
          </label>
        </div>
      </div>

      <div class="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
        <div class="flex items-start gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-xl">
            ☀️
          </div>

          <div>
            <h2 class="text-lg font-bold text-slate-900">
              ライブ感想・自由メモ
            </h2>
            <p class="mt-1 text-xs leading-5 text-slate-500">
              当日の思い出や気づいたことを残せます。
            </p>
          </div>
        </div>

        <div class="mt-4 space-y-4">
          <label class="block">
            <span class="text-sm font-bold text-slate-700">
              ライブ感想
            </span>
            <textarea
              v-model="memo.liveMemo"
              rows="5"
              placeholder="例：印象に残った曲、MC、演出、推しの見どころ など"
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              @input="markUpdated"
            />
          </label>

          <label class="block">
            <span class="text-sm font-bold text-slate-700">
              自由メモ
            </span>
            <textarea
              v-model="memo.freeMemo"
              rows="5"
              placeholder="その他メモしたいこと"
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              @input="markUpdated"
            />
          </label>
        </div>
      </div>
    </section>

    <section class="mt-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="font-bold text-slate-900">
            メモをリセット
          </h2>
          <p class="mt-1 text-xs leading-5 text-slate-500">
            入力した参戦メモをすべて削除します。
          </p>
        </div>

        <button
          type="button"
          class="rounded-full border border-rose-200 px-5 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50 active:scale-[0.98]"
          @click="resetMemo"
        >
          全てリセット
        </button>
      </div>
    </section>
  </main>
</template>