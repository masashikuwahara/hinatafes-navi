<script setup lang="ts">
import {
  emergencySteps,
  heatActions,
  heatItems,
  heatWarnings,
  officialHeatLinks,
  type HeatInfoItem,
} from '~/data/heat'

useAppSeo({
  title: '熱中症対策',
  description:
    'ひなたフェス2026の宮崎遠征・屋外イベント参加時に確認したい熱中症対策メモです。水分補給、休憩、暑さ対策グッズなどをスマホで確認できます。',
  path: '/heat',
})

const getPriorityClass = (item: HeatInfoItem) => {
  if (item.priority === 'high') {
    return 'border-orange-200 bg-orange-50'
  }

  return 'border-slate-100 bg-white'
}

const getPriorityLabelClass = (item: HeatInfoItem) => {
  if (item.priority === 'high') {
    return 'bg-orange-100 text-orange-700'
  }

  return 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 pb-24 pt-6">
    <section class="rounded-3xl bg-gradient-to-br from-orange-100 via-white to-sky-50 p-5 shadow-sm">
      <p class="text-sm font-bold text-orange-600">
        Heat Safety
      </p>

      <h1 class="mt-2 text-2xl font-bold text-slate-900">
        熱中症対策
      </h1>

      <p class="mt-3 text-sm leading-7 text-slate-600">
        屋外イベントでは、楽しむ前に体調管理が最優先です。
        水分補給、休憩、暑さ対策をこまめに確認しましょう。
      </p>
    </section>

    <section class="mt-6 rounded-3xl border border-red-100 bg-red-50 p-4">
      <div class="flex gap-3">
        <div class="text-2xl">
          🚨
        </div>

        <div>
          <h2 class="text-sm font-bold text-red-700">
            危険な症状がある場合
          </h2>

          <p class="mt-2 text-xs leading-6 text-red-700">
            自力で水が飲めない、意識がない、反応がおかしい場合は、
            すぐに周囲の人やスタッフへ知らせ、必要に応じて119番に連絡してください。
          </p>
        </div>
      </div>
    </section>

    <section class="mt-6">
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900">
            今すぐやること
          </h2>

          <p class="mt-1 text-xs text-slate-500">
            現地で何度も確認する基本行動です。
          </p>
        </div>
      </div>

      <div class="mt-4 grid gap-3">
        <article
          v-for="item in heatActions"
          :key="item.id"
          class="rounded-3xl border p-4 shadow-sm"
          :class="getPriorityClass(item)"
        >
          <div class="flex gap-3">
            <div class="text-2xl">
              {{ item.icon }}
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold text-slate-900">
                  {{ item.title }}
                </h3>

                <span
                  v-if="item.priority === 'high'"
                  class="rounded-full px-2 py-0.5 text-[11px] font-bold"
                  :class="getPriorityLabelClass(item)"
                >
                  重要
                </span>
              </div>

              <p class="mt-2 text-sm leading-7 text-slate-600">
                {{ item.description }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-6">
      <h2 class="text-lg font-bold text-slate-900">
        持っておきたいもの
      </h2>

      <div class="mt-4 grid grid-cols-2 gap-3">
        <article
          v-for="item in heatItems"
          :key="item.id"
          class="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div class="text-2xl">
            {{ item.icon }}
          </div>

          <h3 class="mt-3 text-sm font-bold text-slate-900">
            {{ item.title }}
          </h3>

          <p class="mt-2 text-xs leading-6 text-slate-600">
            {{ item.description }}
          </p>
        </article>
      </div>
    </section>

    <section class="mt-6">
      <div class="rounded-3xl bg-white p-4 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900">
          休憩の目安
        </h2>

        <div class="mt-4 space-y-3">
          <div class="rounded-2xl bg-sky-50 p-4">
            <p class="text-sm font-bold text-sky-700">
              1〜2時間に1回ではなく、暑い日はもっとこまめに
            </p>

            <p class="mt-2 text-xs leading-6 text-slate-600">
              混雑、直射日光、移動距離、睡眠不足によって体への負担は大きく変わります。
              「まだ大丈夫」と思っても、早めに休憩を入れましょう。
            </p>
          </div>

          <div class="rounded-2xl bg-yellow-50 p-4">
            <p class="text-sm font-bold text-yellow-700">
              ライブ前に体力を使い切らない
            </p>

            <p class="mt-2 text-xs leading-6 text-slate-600">
              グッズ、フード、撮影を回る場合は、開場前に休憩時間を確保しておくのがおすすめです。
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-6">
      <h2 class="text-lg font-bold text-slate-900">
        危険サイン
      </h2>

      <p class="mt-1 text-xs text-slate-500">
        当てはまる場合は、予定を止めて体調確認を優先してください。
      </p>

      <div class="mt-4 grid gap-3">
        <article
          v-for="item in heatWarnings"
          :key="item.id"
          class="rounded-3xl border border-red-100 bg-white p-4 shadow-sm"
        >
          <div class="flex gap-3">
            <div class="text-2xl">
              {{ item.icon }}
            </div>

            <div>
              <h3 class="text-base font-bold text-red-700">
                {{ item.title }}
              </h3>

              <p class="mt-2 text-sm leading-7 text-slate-600">
                {{ item.description }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-6">
      <h2 class="text-lg font-bold text-slate-900">
        体調が悪くなったら
      </h2>

      <div class="mt-4 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <article
          v-for="step in emergencySteps"
          :key="step.id"
          class="border-b border-slate-100 p-4 last:border-b-0"
        >
          <div class="flex gap-3">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
              {{ step.icon }}
            </div>

            <div>
              <h3 class="text-base font-bold text-slate-900">
                {{ step.title }}
              </h3>

              <p class="mt-2 text-sm leading-7 text-slate-600">
                {{ step.description }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-6">
      <h2 class="text-lg font-bold text-slate-900">
        公式情報リンク
      </h2>

      <div class="mt-4 space-y-3">
        <a
          v-for="link in officialHeatLinks"
          :key="link.id"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:bg-sky-50"
        >
          <p class="text-sm font-bold text-sky-700">
            {{ link.title }}
          </p>

          <p class="mt-2 text-xs leading-6 text-slate-600">
            {{ link.description }}
          </p>

          <p class="mt-3 text-xs font-bold text-slate-400">
            外部サイトを開く →
          </p>
        </a>
      </div>
    </section>

    <section class="mt-6 rounded-3xl bg-slate-50 p-4">
      <h2 class="text-sm font-bold text-slate-800">
        注意
      </h2>

      <p class="mt-2 text-xs leading-6 text-slate-600">
        このページは現地での確認用メモです。体調不良時は無理をせず、公式案内、会場スタッフ、医療機関の指示を優先してください。
      </p>
    </section>
  </main>
</template>