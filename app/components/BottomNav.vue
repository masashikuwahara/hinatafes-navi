<script setup lang="ts">
type NavItem = {
  label: string
  to: string
  icon: string
}

const route = useRoute()

const navItems: NavItem[] = [
  {
    label: 'ホーム',
    to: '/',
    icon: '🏠',
  },
  {
    label: '持ち物',
    to: '/checklist',
    icon: '✅',
  },
  {
    label: '予定',
    to: '/schedule',
    icon: '🕒',
  },
  {
    label: 'マップ',
    to: '/map',
    icon: '🗺️',
  },
  {
    label: 'メモ',
    to: '/memo',
    icon: '📝',
  },
]

const isActive = (to: string) => {
  if (to === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(to)
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-screen-sm px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
    aria-label="下部ナビゲーション"
  >
    <div
      class="grid grid-cols-5 rounded-card border border-hinata-border bg-white/95 p-2 shadow-card backdrop-blur"
    >
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex min-h-14 flex-col items-center justify-center gap-1 rounded-button px-1.5 py-2 text-xs font-bold transition active:scale-[0.97]"
        :class="isActive(item.to)
          ? 'bg-hinata-sky-soft text-hinata-navy'
          : 'text-hinata-muted hover:bg-hinata-sky-pale hover:text-hinata-navy'"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        <span
          class="flex h-6 items-center justify-center text-lg leading-none"
          aria-hidden="true"
        >
          {{ item.icon }}
        </span>

        <span class="leading-none">
          {{ item.label }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>