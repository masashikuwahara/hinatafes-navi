<template>
  <div class="min-h-screen bg-[#eef7fb] text-slate-900">
    <AppHeader />

    <div class="mx-auto min-h-screen max-w-md border-x-2 border-slate-200 bg-[#f7fbfc]">
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
    'Noto Sans JP',
    'BIZ UDPGothic',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}
</style>