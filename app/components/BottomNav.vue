<script setup lang="ts">
type NavItem = {
  label: string
  shortLabel: string
  to: string
}

const route = useRoute()

const navItems: NavItem[] = [
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

const isActive = (to: string) => {
  return route.path.startsWith(to)
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 border-t-2 border-slate-800 bg-white pb-[env(safe-area-inset-bottom)]"
    aria-label="下部ナビゲーション"
  >
    <div class="mx-auto grid max-w-md grid-cols-5">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="min-h-[58px] border-r border-slate-300 px-1 py-2 text-center last:border-r-0 active:bg-slate-100"
        :class="
          isActive(item.to)
            ? 'bg-sky-50 text-sky-950'
            : 'bg-white text-slate-700'
        "
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        <span
          class="mx-auto block w-fit border px-1.5 py-0.5 text-[9px] font-black leading-none tracking-[0.08em]"
          :class="
            isActive(item.to)
              ? 'border-sky-600 bg-white text-sky-700'
              : 'border-slate-300 bg-white text-slate-500'
          "
        >
          {{ item.shortLabel }}
        </span>

        <span class="mt-1.5 block text-xs font-black leading-none">
          {{ item.label }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
nav {
  font-family:
    'Noto Sans JP',
    'BIZ UDPGothic',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}
</style>