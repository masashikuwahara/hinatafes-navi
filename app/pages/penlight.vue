<script setup lang="ts">
import { computed } from 'vue'
import {
  penlightColors,
  penlightMembers,
  type PenlightColorKey,
} from '~/data/penlights'

useHead({
  title: 'ペンライトカラー | ひなたフェス2026 現地ナビ',
  meta: [
    {
      name: 'description',
      content:
        '日向坂46メンバーのペンライトカラーを一覧で確認できます。ひなたフェス2026現地での確認用ページです。',
    },
  ],
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
  <main class="mx-auto max-w-3xl px-4 pb-24 pt-6">
    <section class="rounded-3xl bg-gradient-to-br from-sky-100 via-white to-yellow-50 p-5 shadow-sm">
      <p class="text-sm font-bold text-sky-600">
        Penlight
      </p>

      <h1 class="mt-2 text-2xl font-bold text-slate-900">
        ペンライトカラー
      </h1>

      <p class="mt-3 text-sm leading-7 text-slate-600">
        日向坂46メンバーのペンライトカラーを一覧で確認できます。
        現地で素早く見られるように、シンプルな表示にしています。
      </p>
    </section>

    <section class="mt-6 rounded-3xl border border-yellow-100 bg-yellow-50 p-4">
      <h2 class="text-sm font-bold text-yellow-800">
        データについて
      </h2>

      <p class="mt-2 text-xs leading-6 text-yellow-800">
        現在はサンプルデータです。後で既存のHINACOLORまたは公式情報をもとに、現役メンバー分へ差し替えてください。
      </p>
    </section>

    <section class="mt-6">
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900">
            メンバー別カラー一覧
          </h2>

          <p class="mt-1 text-xs text-slate-500">
            全{{ penlightMembers.length }}名
          </p>
        </div>
      </div>

      <div class="mt-4 space-y-5">
        <section
          v-for="group in membersByGeneration"
          :key="group.generation"
          class="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
        >
          <div class="bg-sky-50 px-4 py-3">
            <h3 class="text-sm font-bold text-sky-700">
              {{ group.generation }}
            </h3>
          </div>

          <div>
            <article
              v-for="member in group.members"
              :key="member.id"
              class="border-b border-slate-100 p-4 last:border-b-0"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <h4 class="truncate text-base font-bold text-slate-900">
                    {{ member.name }}
                  </h4>
                </div>

                <div class="flex shrink-0 items-center gap-2">
                  <span
                    class="h-7 w-7 rounded-full border border-slate-200 shadow-sm"
                    :style="getColorStyle(member.color1)"
                    :title="getColorName(member.color1)"
                  />

                  <span
                    class="h-7 w-7 rounded-full border border-slate-200 shadow-sm"
                    :style="getColorStyle(member.color2)"
                    :title="getColorName(member.color2)"
                  />
                </div>
              </div>

              <div class="mt-3 grid grid-cols-2 gap-2">
                <div class="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                  <span
                    class="h-4 w-4 shrink-0 rounded-full border border-slate-200"
                    :style="getColorStyle(member.color1)"
                  />

                  <span class="truncate text-xs font-bold text-slate-700">
                    {{ getColorName(member.color1) }}
                  </span>
                </div>

                <div class="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                  <span
                    class="h-4 w-4 shrink-0 rounded-full border border-slate-200"
                    :style="getColorStyle(member.color2)"
                  />

                  <span class="truncate text-xs font-bold text-slate-700">
                    {{ getColorName(member.color2) }}
                  </span>
                </div>
              </div>

              <p
                v-if="member.memo"
                class="mt-3 rounded-2xl bg-sky-50 px-3 py-2 text-xs leading-6 text-sky-700"
              >
                {{ member.memo }}
              </p>
            </article>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>