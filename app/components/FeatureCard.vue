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
    card: 'border-hinata-border bg-white hover:border-hinata-sky/60 hover:bg-hinata-sky-pale',
    icon: 'bg-hinata-sky-soft text-hinata-navy',
    badge: 'bg-hinata-sky-soft text-hinata-navy',
    arrow: 'text-hinata-sky',
  },
  yellow: {
    card: 'border-hinata-yellow/60 bg-white hover:border-hinata-yellow hover:bg-hinata-yellow-soft',
    icon: 'bg-hinata-yellow-soft text-hinata-navy',
    badge: 'bg-hinata-yellow-soft text-hinata-navy',
    arrow: 'text-hinata-navy',
  },
  green: {
    card: 'border-hinata-green/40 bg-white hover:border-hinata-green hover:bg-hinata-green/10',
    icon: 'bg-hinata-green/15 text-hinata-navy',
    badge: 'bg-hinata-green/15 text-hinata-navy',
    arrow: 'text-hinata-green',
  },
  orange: {
    card: 'border-hinata-orange/40 bg-white hover:border-hinata-orange hover:bg-hinata-orange/10',
    icon: 'bg-hinata-orange/15 text-hinata-navy',
    badge: 'bg-hinata-orange/15 text-hinata-navy',
    arrow: 'text-hinata-orange',
  },
  pink: {
    card: 'border-hinata-pink/40 bg-white hover:border-hinata-pink hover:bg-hinata-pink/10',
    icon: 'bg-hinata-pink/15 text-hinata-navy',
    badge: 'bg-hinata-pink/15 text-hinata-navy',
    arrow: 'text-hinata-pink',
  },
  purple: {
    card: 'border-hinata-purple/40 bg-white hover:border-hinata-purple hover:bg-hinata-purple/10',
    icon: 'bg-hinata-purple/15 text-hinata-navy',
    badge: 'bg-hinata-purple/15 text-hinata-navy',
    arrow: 'text-hinata-purple',
  },
  slate: {
    card: 'border-hinata-border bg-white hover:border-hinata-sky/50 hover:bg-hinata-sky-pale',
    icon: 'bg-hinata-sky-pale text-hinata-navy',
    badge: 'bg-hinata-sky-pale text-hinata-navy',
    arrow: 'text-hinata-muted',
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
    class="group flex h-full flex-col justify-between rounded-card border shadow-soft transition duration-200 active:scale-[0.98]"
    :class="[
      themeClasses[feature.theme].card,
      compact ? 'p-4' : 'p-5',
    ]"
  >
    <div>
      <div class="mb-3 flex items-start justify-between gap-3">
        <div
          class="flex size-11 shrink-0 items-center justify-center rounded-button text-xl"
          :class="themeClasses[feature.theme].icon"
          aria-hidden="true"
        >
          {{ feature.icon }}
        </div>

        <span
          v-if="feature.isTodayUse"
          class="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
          :class="themeClasses[feature.theme].badge"
        >
          今日使う
        </span>
      </div>

      <h3
        class="font-bold leading-snug text-hinata-navy"
        :class="compact ? 'text-base' : 'text-lg'"
      >
        {{ feature.title }}
      </h3>

      <p
        class="mt-2 leading-relaxed text-hinata-muted"
        :class="compact ? 'text-xs' : 'text-sm'"
      >
        {{ feature.description }}
      </p>
    </div>

    <!-- <div class="mt-4 flex items-center justify-end text-sm font-bold">
      <span
        class="transition group-hover:translate-x-1"
        :class="themeClasses[feature.theme].arrow"
      >
        開く →
      </span>
    </div> -->
  </NuxtLink>
</template>