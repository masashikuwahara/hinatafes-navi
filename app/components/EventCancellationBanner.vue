<script setup lang="ts">
import { eventStatus } from '~/data/eventStatus'
</script>

<template>
  <section
    v-if="eventStatus.status === 'cancelled'"
    class="overflow-hidden rounded-xl border-2 border-red-300 bg-white shadow-sm"
    aria-labelledby="event-cancelled-title"
  >
    <div
      class="bg-red-600 px-4 py-2 text-center text-xs font-black tracking-[0.12em] text-white"
    >
      IMPORTANT NOTICE
    </div>

    <div class="px-4 py-5">
      <div class="text-center">
        <p
          class="inline-flex rounded-md bg-red-50 px-3 py-1 text-xs font-black text-red-700"
        >
          開催中止
        </p>

        <h2
          id="event-cancelled-title"
          class="mt-3 text-xl font-black leading-snug text-slate-950"
        >
          ひなたフェス2026は
          <br>
          開催中止となりました
        </h2>
      </div>

      <p
        class="mt-4 text-sm font-medium leading-7 text-slate-700"
      >
        {{ eventStatus.message }}
      </p>

      <div
        class="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3"
      >
        <p class="text-xs font-black text-amber-900">
          払い戻しなどの今後の案内
        </p>

        <p
          class="mt-1 text-sm font-medium leading-6 text-amber-950"
        >
          {{ eventStatus.refundMessage }}
        </p>
      </div>

      <div class="mt-4">
        <a
          :href="eventStatus.sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex min-h-11 w-full items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-black text-white shadow-sm active:bg-red-700"
        >
          日向坂46公式のお知らせを確認
          <span class="ml-2">
            ↗
          </span>
        </a>
      </div>

      <p
        class="mt-3 text-center text-[11px] font-bold text-slate-500"
      >
        2026年9月2日 公式発表
      </p>
    </div>
  </section>
</template>