<script setup lang="ts">
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
    className: 'border-sky-500 bg-sky-50 text-sky-950',
  },
  {
    to: '/schedule',
    label: 'TIME',
    title: 'スケジュール',
    description: '次の予定と時間を確認',
    status: '開演前に確認',
    className: 'border-amber-500 bg-amber-50 text-amber-950',
  },
  {
    to: '/booths',
    label: 'SHOP',
    title: '出店・ブース',
    description: 'フード・物販・企画を探す',
    status: '近くを探す',
    className: 'border-emerald-500 bg-emerald-50 text-emerald-950',
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
</script>

<template>
  <main class="min-h-screen bg-[#f7fbfc] pb-24 text-slate-900">
    <div class="mx-auto max-w-md px-4 py-4">
      <!-- 上部：案内板風ヘッダー -->
      <section class="border-b-4 border-sky-400 pb-3">
        <p class="text-xs font-bold tracking-[0.18em] text-sky-700">
          HINATA FES 2026
        </p>

        <div class="mt-1 flex items-end justify-between gap-3">
          <div>
            <h1 class="text-[1.45rem] font-black leading-tight tracking-tight">
              現地ナビ
            </h1>
            <p class="mt-1 text-sm font-medium text-slate-700">
              会場で確認する情報を、すぐ開けるようにまとめています。
            </p>
          </div>

          <div class="shrink-0 border-2 border-slate-800 bg-white px-2 py-1 text-center">
            <p class="text-[10px] font-bold leading-none text-slate-500">
              TODAY
            </p>
            <p class="mt-1 text-sm font-black leading-none">
              当日用
            </p>
          </div>
        </div>
      </section>

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
              'block border-l-[6px] border-y-2 border-r-2 px-3 py-3 active:translate-y-[1px]',
              action.className,
            ]"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="border border-current bg-white px-1.5 py-0.5 text-[10px] font-black">
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
            class="border-2 border-slate-300 bg-white px-3 py-3 active:bg-slate-50"
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
      <section class="mt-5 border-2 border-dashed border-slate-300 bg-white px-3 py-3">
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
            <span class="inline-block h-4 w-4 border-2 border-slate-500 bg-white" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </section>

      <!-- 注意メモ -->
      <section class="mt-4 border-l-4 border-orange-500 bg-orange-50 px-3 py-3">
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