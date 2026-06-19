<template>
  <div class="min-h-screen bg-[#eef7fb] text-slate-900">
    <AppHeader />

    <div class="mx-auto min-h-screen max-w-md border-x border-sky-100 bg-[#f7fbfc] shadow-sm">
      <main
        id="main-content"
        class="min-h-[calc(100vh-9rem)]"
      >
        <slot />
      </main>

      <AppFooter />
      <BottomNav />
    </div>
  </div>
</template>

<style scoped>
div {
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