<script setup lang="ts">
const route = useRoute()

const pageLabels: Record<string, string> = {
  '/': 'TOP',
  '/map': 'MAP',
  '/schedule': 'TIME',
  '/booths': 'BOOTH',
  '/checklist': 'CHECK',
  '/memo': 'MEMO',
  '/heat': 'HEAT',
  '/penlight': 'COLOR',
}

const pageNames: Record<string, string> = {
  '/': 'トップ',
  '/map': '会場マップ',
  '/schedule': 'スケジュール',
  '/booths': '出店・ブース',
  '/checklist': '持ち物',
  '/memo': '参戦メモ',
  '/heat': '熱中症対策',
  '/penlight': 'ペンライト',
}

const currentPath = computed(() => route.path)

const currentLabel = computed(() => {
  return pageLabels[currentPath.value] ?? 'NAV'
})

const currentPageName = computed(() => {
  return pageNames[currentPath.value] ?? '現地ナビ'
})
</script>

<template>
  <header class="sticky top-0 z-40 border-b-2 border-slate-800 bg-white">
    <div class="mx-auto max-w-md px-4 py-2">
      <div class="flex items-center justify-between gap-3">
        <NuxtLink
          to="/"
          class="min-w-0 active:opacity-70"
          aria-label="トップページへ戻る"
        >
          <p class="text-[10px] font-black tracking-[0.16em] text-sky-700">
            HINATA FES 2026
          </p>

          <p class="mt-0.5 truncate text-sm font-black leading-tight text-slate-950">
            ひなたフェス2026 現地ナビ
          </p>
        </NuxtLink>

        <div class="shrink-0 text-right">
          <p class="border-2 border-slate-800 bg-[#f7fbfc] px-2 py-1 text-[11px] font-black leading-none text-slate-900">
            {{ currentLabel }}
          </p>

          <p class="mt-1 max-w-[6rem] truncate text-[10px] font-bold text-slate-500">
            {{ currentPageName }}
          </p>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  font-family:
    'Noto Sans JP',
    'BIZ UDPGothic',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

p {
  font-family:
    'Zen Kaku Gothic New',
    'Noto Sans JP',
    system-ui,
    sans-serif;
}
</style>