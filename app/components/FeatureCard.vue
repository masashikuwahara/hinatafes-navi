<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description: string
  to: string
  icon: string
  badge?: string
  priority?: boolean
}>(), {
  badge: '',
  priority: false,
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="hf-card-link"
    :class="priority ? 'border-sky-200 bg-sky-50/80' : ''"
  >
    <div class="flex items-start gap-3">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-2xl">
        {{ icon }}
      </div>

      <div class="min-w-0 flex-1">
        <div class="mb-1 flex items-center gap-2">
          <h2 class="font-bold text-slate-900">
            {{ title }}
          </h2>

          <span
            v-if="badge"
            class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700"
          >
            {{ badge }}
          </span>
        </div>

        <p class="text-sm leading-6 text-slate-600">
          {{ description }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>