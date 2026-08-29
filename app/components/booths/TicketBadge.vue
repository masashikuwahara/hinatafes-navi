<script setup lang="ts">
import type { HinaaiTicketType } from '~/data/hinaaiBooths'

const props = defineProps<{
  type: HinaaiTicketType
}>()

const ticketConfig: Record<
  HinaaiTicketType,
  {
    label: string
    description: string
    classes: string
  }
> = {
  required: {
    label: '整理券必須',
    description: 'このコンテンツへの参加には整理券が必要です。',
    classes:
      'border-amber-200 bg-amber-50 text-amber-800',
  },

  'venue-timed': {
    label: '施設整理券',
    description: '施設への入場に時間別整理券が必要です。',
    classes:
      'border-purple-200 bg-purple-50 text-purple-800',
  },

  none: {
    label: '整理券不要',
    description: '整理券なしで利用できます。',
    classes:
      'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-black"
    :class="ticketConfig[props.type].classes"
    :title="ticketConfig[props.type].description"
  >
    <span aria-hidden="true">
      🎫
    </span>

    {{ ticketConfig[props.type].label }}
  </span>
</template>