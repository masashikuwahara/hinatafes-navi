<script setup lang="ts">
import { computed } from 'vue'
import {
  penlightColors,
  penlightMembers,
  type PenlightColorKey,
} from '~/data/penlights'

useAppSeo({
  title: 'ペンライトカラー確認',
  description:
    'ひなたフェス2026の現地で確認しやすいペンライトカラー確認ページです。日向坂46メンバーのペンライトカラーをスマホで素早く確認できます。',
  path: '/penlight',
})

const getColor = (key: PenlightColorKey) => {
  return penlightColors.find((color) => color.key === key)
}

const getColorName = (key: PenlightColorKey) => {
  return getColor(key)?.name ?? key
}

const getColorStyle = (key: PenlightColorKey) => {
  const color = getColor(key)

  return {
    backgroundColor: color?.hex ?? '#ffffff',
  }
}

const membersByGeneration = computed(() => {
  const generations = Array.from(
    new Set(penlightMembers.map((member) => member.generation)),
  )

  return generations.map((generation) => {
    return {
      generation,
      members: penlightMembers.filter(
        (member) => member.generation === generation,
      ),
    }
  })
})
</script>

<template>
  <main class="min-h-screen bg-[#f7fbfc] pb-24 text-slate-900">
    <div class="mx-auto max-w-md px-4 py-4">
      <!-- ヘッダー -->
      <section class="rounded-xl border border-sky-100 bg-white px-3 py-3 shadow-sm">
        <p class="text-xs font-black tracking-[0.16em] text-sky-700">
          PENLIGHT COLOR
        </p>

        <div class="mt-1 flex items-end justify-between gap-3">
          <div>
            <h1 class="text-[1.35rem] font-black leading-tight">
              ペンライトカラー
            </h1>
            <p class="mt-1 text-sm font-medium leading-snug text-slate-700">
              期別に、メンバーの2色をすぐ確認できます。
            </p>
          </div>

          <NuxtLink
            to="/"
            class="shrink-0 rounded-md border border-sky-200 bg-white px-2 py-1 text-xs font-black shadow-sm active:bg-sky-50"
          >
            TOP
          </NuxtLink>
        </div>
      </section>

      <!-- 概要 -->
      <section class="sticky top-0 z-20 -mx-4 mt-3 border-y border-sky-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-black text-slate-500">
              登録メンバー
            </p>
            <p class="mt-0.5 text-xl font-black leading-none">
              全{{ penlightMembers.length }}名
            </p>
          </div>
        </div>

        <div class="mt-3 rounded-lg border border-sky-100 bg-sky-50/80 px-2 py-2">
          <p class="text-xs font-bold leading-relaxed text-sky-950">
            ライブ前に推しメンの色を確認。色名と色見本をセットで表示しています。
          </p>
        </div>
      </section>

      <!-- 期別カラー一覧 -->
      <section class="mt-5">
        <div class="space-y-5">
          <section
            v-for="group in membersByGeneration"
            :key="group.generation"
            class="border-y border-slate-200 bg-white"
          >
            <div class="flex items-center justify-between border-b border-sky-100 bg-sky-50/80 px-3 py-2">
              <h3 class="text-base font-black text-sky-950">
                {{ group.generation }}
              </h3>

              <p class="text-xs font-black text-sky-800">
                {{ group.members.length }}名
              </p>
            </div>

            <div>
              <article
                v-for="member in group.members"
                :key="member.id"
                class="border-b border-dashed border-slate-200 px-3 py-3 last:border-b-0"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <h4 class="truncate text-base font-black leading-snug text-slate-950">
                      {{ member.name }}
                    </h4>

                    <div class="mt-2 grid grid-cols-2 gap-2">
                      <div class="border border-slate-200 bg-[#fffdf7] px-2 py-2">
                        <p class="text-[10px] font-black text-slate-500">
                          1色目
                        </p>

                        <div class="mt-1 flex items-center gap-2">
                          <span
                            class="h-6 w-4 shrink-0 rounded-[3px] border border-slate-300"
                            :style="getColorStyle(member.color1)"
                            :title="getColorName(member.color1)"
                          />

                          <span class="min-w-0 truncate text-xs font-black text-slate-800">
                            {{ getColorName(member.color1) }}
                          </span>
                        </div>
                      </div>

                      <div class="border border-slate-200 bg-[#fffdf7] px-2 py-2">
                        <p class="text-[10px] font-black text-slate-500">
                          2色目
                        </p>

                        <div class="mt-1 flex items-center gap-2">
                          <span
                            class="h-6 w-4 shrink-0 rounded-[3px] border border-slate-300"
                            :style="getColorStyle(member.color2)"
                            :title="getColorName(member.color2)"
                          />

                          <span class="min-w-0 truncate text-xs font-black text-slate-800">
                            {{ getColorName(member.color2) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex shrink-0 items-center gap-1.5 pt-1">
                    <span
                      class="h-10 w-5 rounded-[3px] border border-slate-300"
                      :style="getColorStyle(member.color1)"
                      :title="getColorName(member.color1)"
                    />

                    <span
                      class="h-10 w-5 rounded-[3px] border border-slate-300"
                      :style="getColorStyle(member.color2)"
                      :title="getColorName(member.color2)"
                    />
                  </div>
                </div>

                <p
                  v-if="member.memo"
                  class="mt-3 rounded-lg border border-sky-100 bg-sky-50/80 px-2 py-2 text-xs font-bold leading-relaxed text-sky-950"
                >
                  {{ member.memo }}
                </p>
              </article>
            </div>
          </section>
        </div>
      </section>

      <!-- 現地メモ -->
      <section class="mt-4 rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-3 shadow-sm">
        <h2 class="text-sm font-black text-orange-950">
          確認メモ
        </h2>
        <p class="mt-1 text-sm font-medium leading-relaxed text-orange-950">
          白や淡い色は画面上では見え方が変わる場合があります。現地では周囲の明るさに合わせて確認してください。
        </p>
      </section>
    </div>
  </main>
</template>

<style scoped>
main {
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

h1,
h2,
h3,
h4 {
  font-family:
    'BIZ UDPGothic',
    'Hiragino Maru Gothic ProN',
    'Zen Kaku Gothic New',
    'Noto Sans JP',
    system-ui,
    sans-serif;
}
</style>