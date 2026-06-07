<script setup lang="ts">
useSeoMeta({
  title: 'トップ',
  description:
    'ひなたフェス2026の現地参加をサポートする、非公式のスマホ向け現地ナビアプリです。',
})

type Feature = {
  title: string
  description: string
  to: string
  icon: string
  badge?: string
  priority?: boolean
}

const features: Feature[] = [
  {
    title: '持ち物チェック',
    description: '忘れ物防止用のチェックリスト。チェック状態は保存予定です。',
    to: '/checklist',
    icon: '✅',
    badge: '優先',
    priority: true,
  },
  {
    title: 'スケジュール',
    description: '開場、物販、ブース、ライブ前後の予定を確認します。',
    to: '/schedule',
    icon: '🕒',
    badge: '優先',
    priority: true,
  },
  {
    title: '会場マップ',
    description: '会場内スポットや集合場所を確認するための土台です。',
    to: '/map',
    icon: '🗺️',
    priority: true,
  },
  {
    title: '出店・ブース',
    description: 'フード、物販、展示などをジャンル別に探せるようにします。',
    to: '/booths',
    icon: '🏕️',
  },
  {
    title: '熱中症対策',
    description: '水分補給、休憩、日差し対策をすぐ確認できるページです。',
    to: '/heat',
    icon: '☀️',
  },
  {
    title: 'ペンライトカラー',
    description: 'メンバー別のペンライトカラー確認機能の入口です。',
    to: '/penlight',
    icon: '💡',
  },
  {
    title: '参戦メモ',
    description: '座席、集合場所、買ったもの、感想などを保存する予定です。',
    to: '/memo',
    icon: '📝',
  },
]
</script>

<template>
  <div class="space-y-6">
    <section class="hf-card overflow-hidden">
      <div class="mb-4 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
        スマホでサッと確認
      </div>

      <h2 class="text-2xl font-black leading-tight text-slate-900">
        ひなたフェス2026を<br>
        現地で迷わず楽しむ
      </h2>

      <p class="mt-3 text-sm leading-7 text-slate-600">
        持ち物、予定、マップ、メモなど、当日よく使う情報をまとめるための非公式ナビアプリです。
      </p>
    </section>

    <section class="space-y-3">
      <div class="flex items-end justify-between">
        <div>
          <p class="text-xs font-bold text-sky-600">
            MENU
          </p>
          <h2 class="hf-section-title">
            今日使う機能
          </h2>
        </div>

        <span class="hf-pill">
          Phase 1
        </span>
      </div>

      <div class="grid gap-3">
        <FeatureCard
          v-for="feature in features"
          :key="feature.to"
          v-bind="feature"
        />
      </div>
    </section>
  </div>
</template>