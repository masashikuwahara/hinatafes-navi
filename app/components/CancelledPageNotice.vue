<script setup lang="ts">
import { eventStatus } from '~/data/eventStatus'

withDefaults(
  defineProps<{
    pageLabel?: string
    description?: string
  }>(),
  {
    pageLabel: 'このページ',
    description:
      '以下は開催時に予定されていた情報です。現在のイベント案内としては利用できません。',
  },
)
</script>

<template>
  <section
    v-if="eventStatus.status === 'cancelled'"
    class="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-4 shadow-sm"
  >
    <div class="flex items-start gap-3">
      <div
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-black text-red-700"
      >
        !
      </div>

      <div class="min-w-0 flex-1">
        <p class="text-xs font-black tracking-[0.08em] text-red-700">
          EVENT CANCELLED
        </p>

        <h2 class="mt-1 text-base font-black leading-6 text-red-950">
          {{ pageLabel }}は当日利用情報ではありません
        </h2>

        <p class="mt-2 text-sm font-medium leading-6 text-red-900">
          ひなたフェス2026は開催中止となりました。
          {{ description }}
        </p>

        <a
          :href="eventStatus.sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-xs font-black text-red-700"
        >
          開催中止の公式発表を見る
          <span class="ml-1">↗</span>
        </a>
      </div>
    </div>
  </section>
</template>