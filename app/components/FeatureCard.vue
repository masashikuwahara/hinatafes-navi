<script setup lang="ts">
import type { FeatureTheme, HomeFeature } from '~/data/homeFeatures'

withDefaults(
  defineProps<{
    feature: HomeFeature
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

const themeClasses = {
  sky: {
    card: 'border-sky-100 bg-sky-50/80 hover:border-sky-300 hover:bg-sky-50',
    icon: 'bg-sky-100 text-sky-700',
    badge: 'bg-sky-100 text-sky-700',
    arrow: 'text-sky-500',
  },
  yellow: {
    card: 'border-yellow-100 bg-yellow-50/80 hover:border-yellow-300 hover:bg-yellow-50',
    icon: 'bg-yellow-100 text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-700',
    arrow: 'text-yellow-600',
  },
  green: {
    card: 'border-emerald-100 bg-emerald-50/80 hover:border-emerald-300 hover:bg-emerald-50',
    icon: 'bg-emerald-100 text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    arrow: 'text-emerald-500',
  },
  orange: {
    card: 'border-orange-100 bg-orange-50/80 hover:border-orange-300 hover:bg-orange-50',
    icon: 'bg-orange-100 text-orange-700',
    badge: 'bg-orange-100 text-orange-700',
    arrow: 'text-orange-500',
  },
  pink: {
    card: 'border-pink-100 bg-pink-50/80 hover:border-pink-300 hover:bg-pink-50',
    icon: 'bg-pink-100 text-pink-700',
    badge: 'bg-pink-100 text-pink-700',
    arrow: 'text-pink-500',
  },
  purple: {
    card: 'border-purple-100 bg-purple-50/80 hover:border-purple-300 hover:bg-purple-50',
    icon: 'bg-purple-100 text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
    arrow: 'text-purple-500',
  },
  slate: {
    card: 'border-slate-100 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-50',
    icon: 'bg-slate-100 text-slate-700',
    badge: 'bg-slate-100 text-slate-700',
    arrow: 'text-slate-500',
  },
} satisfies Record<
  FeatureTheme,
  {
    card: string
    icon: string
    badge: string
    arrow: string
  }
>
</script>

<template>
  <NuxtLink
    :to="feature.to"
    class="group flex h-full flex-col justify-between rounded-2xl border shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
    :class="[
      themeClasses[feature.theme].card,
      compact ? 'p-4' : 'p-5',
    ]"
  >
    <div>
      <div class="mb-3 flex items-start justify-between gap-3">
        <div
          class="flex size-11 items-center justify-center rounded-2xl text-xl"
          :class="themeClasses[feature.theme].icon"
        >
          {{ feature.icon }}
        </div>

        <span
          v-if="feature.isTodayUse"
          class="rounded-full px-2.5 py-1 text-xs font-bold"
          :class="themeClasses[feature.theme].badge"
        >
          今日使う
        </span>
      </div>

      <h3
        class="font-bold leading-snug text-slate-900"
        :class="compact ? 'text-base' : 'text-lg'"
      >
        {{ feature.title }}
      </h3>

      <p
        class="mt-2 leading-relaxed text-slate-600"
        :class="compact ? 'text-xs' : 'text-sm'"
      >
        {{ feature.description }}
      </p>
    </div>

    <div class="mt-4 flex items-center justify-end text-sm font-bold">
      <span
        class="transition group-hover:translate-x-1"
        :class="themeClasses[feature.theme].arrow"
      >
        開く →
      </span>
    </div>
  </NuxtLink>
</template>