<script setup lang="ts">
import { computed } from 'vue'
import { eventStatus } from '~/data/eventStatus'

type NavItem = {
  label: string
  shortLabel: string
  to: string
  external?: boolean
}

const route = useRoute()

const normalNavItems: NavItem[] = [
  {
    label: 'マップ',
    shortLabel: 'MAP',
    to: '/map',
  },
  {
    label: '予定',
    shortLabel: 'TIME',
    to: '/schedule',
  },
  {
    label: '出店',
    shortLabel: 'BOOTH',
    to: '/booths',
  },
  {
    label: 'アクセス',
    shortLabel: 'ACCESS',
    to: '/access',
  },
  {
    label: '持ち物',
    shortLabel: 'CHECK',
    to: '/checklist',
  },
  {
    label: 'メモ',
    shortLabel: 'MEMO',
    to: '/memo',
  },
]

const cancelledNavItems: NavItem[] = [
  {
    label: 'トップ',
    shortLabel: 'HOME',
    to: '/',
  },
  {
    label: '公式情報',
    shortLabel: 'INFO',
    to: eventStatus.sourceUrl,
    external: true,
  },
  {
    label: '交通',
    shortLabel: 'ACCESS',
    to: '/access',
  },
  {
    label: '日程',
    shortLabel: 'TIME',
    to: '/schedule',
  },
]

const navItems = computed(() =>
  eventStatus.status === 'cancelled'
    ? cancelledNavItems
    : normalNavItems,
)

const isActive = (item: NavItem) => {
  if (item.external) {
    return false
  }

  if (item.to === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(item.to)
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
    aria-label="下部ナビゲーション"
  >
    <div
      class="mx-auto max-w-md overflow-hidden rounded-xl border border-sky-100 bg-white/95 shadow-[0_-10px_30px_rgba(15,23,42,0.14)] backdrop-blur"
    >
      <div
        class="grid"
        :class="
          eventStatus.status === 'cancelled'
            ? 'grid-cols-4'
            : 'grid-cols-6'
        "
      >
        <template
          v-for="item in navItems"
          :key="item.to"
        >
          <!-- 外部リンク -->
          <a
            v-if="item.external"
            :href="item.to"
            target="_blank"
            rel="noopener noreferrer"
            class="min-h-[58px] border-r border-slate-100 bg-white/80 px-1 py-2 text-center text-slate-700 last:border-r-0 active:bg-slate-50"
          >
            <span
              class="mx-auto block w-fit rounded-md border border-red-200 bg-red-50 px-1.5 py-0.5 text-[9px] font-black leading-none tracking-[0.06em] text-red-700"
            >
              {{ item.shortLabel }}
            </span>

            <span class="mt-1.5 block text-[11px] font-black leading-none">
              {{ item.label }}
            </span>
          </a>

          <!-- 内部リンク -->
          <NuxtLink
            v-else
            :to="item.to"
            class="min-h-[58px] border-r border-slate-100 px-1 py-2 text-center last:border-r-0 active:bg-slate-50"
            :class="
              isActive(item)
                ? 'bg-sky-50/80 text-sky-950'
                : 'bg-white/80 text-slate-700'
            "
            :aria-current="isActive(item) ? 'page' : undefined"
          >
            <span
              class="mx-auto block w-fit rounded-md border px-1.5 py-0.5 text-[9px] font-black leading-none tracking-[0.06em]"
              :class="
                isActive(item)
                  ? 'border-sky-200 bg-white text-sky-700'
                  : 'border-slate-200 bg-white text-slate-500'
              "
            >
              {{ item.shortLabel }}
            </span>

            <span class="mt-1.5 block text-[11px] font-black leading-none">
              {{ item.label }}
            </span>
          </NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  font-family:
    'BIZ UDPGothic',
    'Hiragino Maru Gothic ProN',
    'Hiragino Sans',
    'Noto Sans JP',
    'Meiryo',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}
</style>