<script setup lang="ts">
import {
  heatMeta,
  parasolRules,
  coolingSpots,
  weatherRules,
  heatOfficialNotes,
} from '~/data/heat'

const levelClasses = {
  info: 'border-sky-200 bg-sky-50',
  important: 'border-amber-200 bg-amber-50',
  warning: 'border-rose-200 bg-rose-50',
}

const coolingSpotClasses = {
  'air-conditioned':
    'border-sky-200 bg-sky-50 text-sky-700',
  shade:
    'border-emerald-200 bg-emerald-50 text-emerald-700',
}
</script>

<template>
  <div class="space-y-8">
    <!-- Official Update -->
    <section>
      <div class="mb-4">
        <p class="text-xs font-bold tracking-wider text-sky-600">
          OFFICIAL GUIDE
        </p>

        <h2 class="mt-1 text-xl font-bold text-slate-900">
          公式 暑さ・天候対策
        </h2>

        <p class="mt-2 text-sm leading-6 text-slate-600">
          ひなたフェス2026対策本部から発表された、
          当日の暑さ・天候対策です。
        </p>
      </div>

      <div
        class="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs text-sky-800"
      >
        公式情報確認：{{ heatMeta.lastVerifiedAt }}
      </div>
    </section>

    <!-- Parasol -->
    <section>
      <div class="mb-3 flex items-center gap-2">
        <span class="text-xl">
          ☂️
        </span>

        <h3 class="text-lg font-bold text-slate-900">
          日傘の使用ルール
        </h3>
      </div>

      <div class="space-y-3">
        <article
          v-for="rule in parasolRules"
          :key="rule.id"
          class="rounded-2xl border p-4"
          :class="levelClasses[rule.level]"
        >
          <h4 class="text-sm font-bold text-slate-900">
            {{ rule.title }}
          </h4>

          <p class="mt-1 text-sm leading-6 text-slate-600">
            {{ rule.description }}
          </p>
        </article>
      </div>
    </section>

    <!-- Cooling spots -->
    <section>
      <div class="mb-3">
        <p class="text-xs font-bold tracking-wider text-sky-600">
          COOLING SPOTS
        </p>

        <h3 class="mt-1 text-lg font-bold text-slate-900">
          暑さを避けられる場所
        </h3>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <article
          v-for="spot in coolingSpots"
          :key="spot.id"
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <span
            class="inline-flex rounded-full border px-2.5 py-1 text-xs font-bold"
            :class="coolingSpotClasses[spot.type]"
          >
            {{ spot.label }}
          </span>

          <h4 class="mt-3 font-bold text-slate-900">
            {{ spot.name }}
          </h4>

          <p class="mt-1 text-sm leading-6 text-slate-600">
            {{ spot.description }}
          </p>
        </article>
      </div>

      <NuxtLink
        to="/map"
        class="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-sky-200 bg-white px-4 text-sm font-bold text-sky-700"
      >
        会場マップで場所を確認
      </NuxtLink>
    </section>

    <!-- Rain -->
    <section>
      <div class="mb-3 flex items-center gap-2">
        <span class="text-xl">
          🌧️
        </span>

        <h3 class="text-lg font-bold text-slate-900">
          雨天時
        </h3>
      </div>

      <article
        v-for="rule in weatherRules"
        :key="rule.id"
        class="rounded-2xl border border-rose-200 bg-rose-50 p-4"
      >
        <div class="flex gap-3">
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100"
          >
            !
          </div>

          <div>
            <h4 class="font-bold text-rose-800">
              {{ rule.title }}
            </h4>

            <p class="mt-1 text-sm leading-6 text-rose-700">
              {{ rule.description }}
            </p>
          </div>
        </div>
      </article>
    </section>

    <!-- Notes -->
    <section
      class="rounded-2xl border border-amber-200 bg-amber-50 p-4"
    >
      <h3 class="text-sm font-bold text-slate-900">
        無理をしないことが最優先
      </h3>

      <ul class="mt-2 space-y-2">
        <li
          v-for="note in heatOfficialNotes"
          :key="note"
          class="flex gap-2 text-sm leading-6 text-slate-700"
        >
          <span class="text-amber-500">
            •
          </span>

          <span>
            {{ note }}
          </span>
        </li>
      </ul>
    </section>

    <!-- Official link -->
    <section
      class="rounded-2xl border border-slate-200 bg-white p-4"
    >
      <p class="text-sm font-bold text-slate-900">
        最新情報
      </p>

      <p class="mt-1 text-xs leading-5 text-slate-500">
        天候によって運営内容が変更される可能性があります。
      </p>

      <a
        :href="heatMeta.sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-600 px-4 text-sm font-bold text-white"
      >
        公式の暑さ・天候対策を見る
        <span class="ml-2">
          ↗
        </span>
      </a>
    </section>
  </div>
</template>