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
  {
    label: 'アクセス',
    shortLabel: 'ACCESS',
    to: '/access',
  },
]

const isActive = (to: string) => {
  return route.path.startsWith(to)
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
    aria-label="下部ナビゲーション"
  >
    <div class="mx-auto max-w-md overflow-hidden rounded-xl border border-sky-100 bg-white/95 shadow-[0_-10px_30px_rgba(15,23,42,0.14)] backdrop-blur">
      <div class="grid grid-cols-5">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="min-h-[58px] border-r border-slate-100 px-1 py-2 text-center last:border-r-0 active:bg-slate-50"
          :class="
            isActive(item.to)
              ? 'bg-sky-50/80 text-sky-950'
              : 'bg-white/80 text-slate-700'
          "
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <span
            class="mx-auto block w-fit rounded-md border px-1 py-0.5 text-[8px] font-black leading-none tracking-[0.04em]"
            :class="
              isActive(item.to)
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