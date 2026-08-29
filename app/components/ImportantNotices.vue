<script setup lang="ts">
import { computed } from 'vue'
import {
  notices,
  type NoticeLevel,
} from '~/data/notices'

const homeNotices = computed(() =>
  notices.filter((notice) => notice.isActive && notice.showOnHome),
)

const levelClasses: Record<NoticeLevel, string> = {
  info: 'border-sky-200 bg-sky-50/80',
  important: 'border-amber-200 bg-amber-50/80',
  warning: 'border-rose-200 bg-rose-50/80',
}

const badgeClasses: Record<NoticeLevel, string> = {
  info: 'bg-sky-100 text-sky-700',
  important: 'bg-amber-100 text-amber-700',
  warning: 'bg-rose-100 text-rose-700',
}

const badgeLabels: Record<NoticeLevel, string> = {
  info: 'お知らせ',
  important: '重要',
  warning: '注意',
}
</script>

<template>
  <section
    v-if="homeNotices.length"
    aria-labelledby="important-notices-title"
  >
    <div class="mb-3 flex items-center justify-between gap-3">
      <div>
        <p class="text-xs font-semibold tracking-wide text-sky-600">
          OFFICIAL UPDATE
        </p>

        <h2
          id="important-notices-title"
          class="mt-1 text-lg font-bold text-slate-900"
        >
          重要なお知らせ
        </h2>
      </div>

      <span class="text-xs text-slate-500">
        公式情報
      </span>
    </div>

    <div class="space-y-3">
      <article
        v-for="notice in homeNotices"
        :key="notice.id"
        class="rounded-xl border p-4 shadow-sm"
        :class="levelClasses[notice.level]"
      >
        <div class="flex items-start gap-3">
          <div class="min-w-0 flex-1">
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <span
                class="rounded-md px-2 py-1 text-[11px] font-bold"
                :class="badgeClasses[notice.level]"
              >
                {{ badgeLabels[notice.level] }}
              </span>

              <span class="text-xs text-slate-500">
                {{ notice.publishedAt }}
              </span>
            </div>

            <h3 class="text-sm font-bold leading-6 text-slate-900">
              {{ notice.title }}
            </h3>

            <p class="mt-1 text-sm leading-6 text-slate-600">
              {{ notice.description }}
            </p>

            <div class="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <NuxtLink
                v-if="notice.href"
                :to="notice.href"
                class="font-semibold text-sky-700 hover:text-sky-800"
              >
                現地ナビで確認
              </NuxtLink>

              <a
                :href="notice.sourceUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
              >
                公式情報を見る
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>