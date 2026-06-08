<script setup lang="ts">
import {
  sortedHomeFeatures,
  todayFeatures,
} from '~/data/homeFeatures'

useHead({
  title: 'ひなたフェス2026 現地ナビ',
  meta: [
    {
      name: 'description',
      content:
        'ひなたフェス2026の現地参加時に使いやすい、非公式ファン向けナビアプリです。持ち物、スケジュール、ブース、マップ、熱中症対策などをまとめます。',
    },
  ],
})
</script>

<template>
  <div class="space-y-8 pb-8">
    <section
      class="overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-yellow-50 p-5 shadow-sm"
    >
      <div class="space-y-4">
        <div
          class="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-sky-700 shadow-sm"
        >
          <span>☀️</span>
          <span>現地でサッと確認</span>
        </div>

        <div class="space-y-3">
          <h1 class="text-2xl font-extrabold leading-tight text-slate-900">
            ひなたフェス2026<br>
            現地ナビ
          </h1>

          <p class="text-sm leading-relaxed text-slate-600">
            持ち物、スケジュール、ブース、マップ、熱中症対策などをまとめて確認できる、
            非公式ファン向けの現地サポートアプリです。
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <NuxtLink
            to="/checklist"
            class="rounded-2xl bg-sky-500 px-4 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-sky-600"
          >
            持ち物を確認
          </NuxtLink>

          <NuxtLink
            to="/schedule"
            class="rounded-2xl bg-white px-4 py-3 text-center text-sm font-bold text-sky-700 shadow-sm ring-1 ring-sky-100 transition hover:bg-sky-50"
          >
            予定を見る
          </NuxtLink>
        </div>

        <p class="text-xs leading-relaxed text-slate-500">
          ※公式情報ではありません。イベント詳細は必ず公式サイト・公式発表も確認してください。
        </p>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-end justify-between gap-3">
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-sky-500">
            Today
          </p>
          <h2 class="text-xl font-extrabold text-slate-900">
            今日使う
          </h2>
        </div>

        <p class="text-xs text-slate-500">
          現地でよく使う機能
        </p>
      </div>

      <div class="grid grid-cols-1 gap-3">
        <FeatureCard
          v-for="feature in todayFeatures"
          :key="feature.id"
          :feature="feature"
          compact
        />
      </div>
    </section>

    <section class="space-y-4">
      <div>
        <p class="text-xs font-bold uppercase tracking-wider text-sky-500">
          Menu
        </p>
        <h2 class="text-xl font-extrabold text-slate-900">
          主要機能
        </h2>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FeatureCard
          v-for="feature in sortedHomeFeatures"
          :key="feature.id"
          :feature="feature"
        />
      </div>
    </section>

    <section
      class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
    >
      <h2 class="text-lg font-extrabold text-slate-900">
        使い方メモ
      </h2>

      <div class="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
        <p>
          まずは「持ち物チェック」と「スケジュール」を確認して、当日の行動を整理します。
        </p>
        <p>
          現地では「ブース」「マップ」「熱中症対策」をすぐ開けるようにしておくと便利です。
        </p>
      </div>
    </section>
  </div>
</template>