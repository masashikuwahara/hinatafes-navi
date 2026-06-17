<template>
  <div class="min-h-screen bg-[#eef7fb] text-slate-900">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[1000] focus:border-2 focus:border-slate-900 focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-black"
    >
      本文へ移動
    </a>

    <div class="mx-auto min-h-screen max-w-md border-x-2 border-slate-200 bg-[#f7fbfc]">
      <div class="border-b-2 border-slate-800 bg-white px-4 py-2">
        <p class="text-[11px] font-black tracking-[0.16em] text-sky-700">
          HINATA FES 2026
        </p>
        <p class="mt-0.5 text-sm font-black text-slate-900">
          ひなたフェス2026 現地ナビ
        </p>
      </div>

      <main
        id="main-content"
        class="min-h-[calc(100vh-9rem)]"
      >
        <slot />
      </main>

      <div class="border-t border-slate-300 bg-white px-4 py-3 pb-24">
        <p class="text-xs font-bold leading-relaxed text-slate-500">
          非公式ファン向け現地サポートアプリです。最新情報は公式案内もあわせて確認してください。
        </p>
      </div>

      <BottomNav />
    </div>
  </div>
</template>

<style scoped>
div {
  font-family:
    'Noto Sans JP',
    'BIZ UDPGothic',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}
</style>