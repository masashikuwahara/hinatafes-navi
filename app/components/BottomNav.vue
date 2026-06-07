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
  <nav class="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
    <div class="grid grid-cols-5 rounded-3xl border border-white/80 bg-white/90 p-2 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-bold transition"
        :class="isActive(item.to)
          ? 'bg-sky-100 text-sky-700'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'"
      >
        <span class="text-lg leading-none">
          {{ item.icon }}
        </span>
        <span>
          {{ item.label }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>