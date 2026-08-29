<script setup lang="ts">
import {
  accessMeta,
  parkingInfo,
  parkingLots,
  outboundBusRoutes,
  returnBusRoute,
  busFares,
  busPaymentMethods,
  accessImportantNotices,
} from '~/data/access'

useSeoMeta({
  title: '交通・アクセス｜ひなたフェス2026 現地ナビ',
  description:
    'ひなたフェス2026の宮崎駅・宮崎空港からの臨時バス、場外駐車場、無料シャトルバス、運賃などの交通情報を現地向けにまとめています。',
})
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6">
    <!-- Header -->
    <header>
      <p class="text-xs font-bold tracking-wider text-sky-600">
        ACCESS
      </p>

      <h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-900">
        交通・アクセス
      </h1>

      <p class="mt-2 text-sm leading-6 text-slate-600">
        宮崎駅・宮崎空港からの臨時バスや、
        場外駐車場から会場までの移動情報をまとめています。
      </p>

      <div
        class="mt-4 flex items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs text-sky-800"
      >
        <span
          class="inline-block h-2 w-2 shrink-0 rounded-full bg-sky-500"
        />

        <span>
          公式情報確認：
          {{ accessMeta.lastVerifiedAt }}
        </span>
      </div>
    </header>

    <!-- Quick Navigation -->
    <nav
      class="mt-6 grid grid-cols-3 gap-2"
      aria-label="交通情報メニュー"
    >
      <a
        href="#bus"
        class="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-sm font-bold text-slate-700 shadow-sm"
      >
        🚌
        <span class="mt-1 block">
          臨時バス
        </span>
      </a>

      <a
        href="#parking"
        class="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-sm font-bold text-slate-700 shadow-sm"
      >
        🚗
        <span class="mt-1 block">
          駐車場
        </span>
      </a>

      <a
        href="#fare"
        class="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-sm font-bold text-slate-700 shadow-sm"
      >
        💴
        <span class="mt-1 block">
          運賃
        </span>
      </a>
    </nav>

    <!-- Important -->
    <section class="mt-6">
      <div
        class="rounded-2xl border border-amber-200 bg-amber-50 p-4"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100"
          >
            ⚠️
          </div>

          <div>
            <h2 class="font-bold text-slate-900">
              当日の交通について
            </h2>

            <ul class="mt-2 space-y-2">
              <li
                v-for="notice in accessImportantNotices"
                :key="notice"
                class="flex gap-2 text-sm leading-6 text-slate-700"
              >
                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />

                <span>
                  {{ notice }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Outbound bus -->
    <section
      id="bus"
      class="mt-8 scroll-mt-24"
    >
      <div class="mb-4">
        <p class="text-xs font-bold tracking-wider text-sky-600">
          GO TO VENUE
        </p>

        <h2 class="mt-1 text-xl font-bold text-slate-900">
          会場へ行く
        </h2>
      </div>

      <div class="space-y-4">
        <article
          v-for="route in outboundBusRoutes"
          :key="route.id"
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div class="border-b border-slate-100 bg-sky-50/70 p-4">
            <span
              class="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700"
            >
              臨時バス
            </span>

            <h3 class="mt-2 text-base font-bold text-slate-900">
              {{ route.title }}
            </h3>
          </div>

          <div class="p-4">
            <!-- Route -->
            <div class="flex items-center gap-3">
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700"
              >
                発
              </div>

              <div class="min-w-0 flex-1">
                <p class="text-xs text-slate-500">
                  出発
                </p>

                <p class="font-bold text-slate-900">
                  {{ route.from }}
                </p>
              </div>
            </div>

            <div class="ml-[17px] h-5 border-l-2 border-dashed border-sky-200" />

            <div class="flex items-center gap-3">
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700"
              >
                着
              </div>

              <div class="min-w-0 flex-1">
                <p class="text-xs text-slate-500">
                  到着
                </p>

                <p class="font-bold text-slate-900">
                  {{ route.to }}
                </p>
              </div>
            </div>

            <!-- Info -->
            <div class="mt-5 grid grid-cols-2 gap-3">
              <div class="rounded-xl bg-slate-50 p-3">
                <p class="text-xs text-slate-500">
                  運行時間
                </p>

                <p class="mt-1 font-bold text-slate-900">
                  {{ route.firstDeparture }}
                  〜
                  {{ route.lastDeparture }}
                </p>
              </div>

              <div class="rounded-xl bg-slate-50 p-3">
                <p class="text-xs text-slate-500">
                  運行間隔
                </p>

                <p class="mt-1 font-bold text-slate-900">
                  {{ route.frequency }}
                </p>
              </div>

              <div class="rounded-xl bg-slate-50 p-3">
                <p class="text-xs text-slate-500">
                  所要時間
                </p>

                <p class="mt-1 font-bold text-slate-900">
                  {{ route.duration }}
                </p>
              </div>

              <div class="rounded-xl bg-slate-50 p-3">
                <p class="text-xs text-slate-500">
                  最終到着
                </p>

                <p class="mt-1 font-bold text-slate-900">
                  {{ route.lastArrival }}
                </p>
              </div>
            </div>

            <ul class="mt-4 space-y-1">
              <li
                v-for="note in route.notes"
                :key="note"
                class="text-xs leading-5 text-slate-500"
              >
                ※ {{ note }}
              </li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <!-- Return -->
    <section class="mt-10">
      <div class="mb-4">
        <p class="text-xs font-bold tracking-wider text-indigo-600">
          RETURN
        </p>

        <h2 class="mt-1 text-xl font-bold text-slate-900">
          ライブ終了後
        </h2>
      </div>

      <article
        class="rounded-2xl border border-indigo-100 bg-white shadow-sm"
      >
        <div class="border-b border-indigo-100 bg-indigo-50/70 p-4">
          <span
            class="inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700"
          >
            復路
          </span>

          <h3 class="mt-2 font-bold text-slate-900">
            {{ returnBusRoute.title }}
          </h3>
        </div>

        <div class="p-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl bg-slate-50 p-3">
              <p class="text-xs text-slate-500">
                運行開始
              </p>

              <p class="mt-1 text-sm font-bold text-slate-900">
                {{ returnBusRoute.startTime }}
              </p>
            </div>

            <div class="rounded-xl bg-slate-50 p-3">
              <p class="text-xs text-slate-500">
                最終便
              </p>

              <p class="mt-1 text-sm font-bold text-slate-900">
                {{ returnBusRoute.lastDeparture }}
              </p>
            </div>
          </div>

          <div
            class="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 p-3"
          >
            <p class="text-xs font-bold text-indigo-700">
              運行目安
            </p>

            <p class="mt-1 text-sm font-bold text-slate-900">
              {{ returnBusRoute.estimatedEnd }}
            </p>
          </div>

          <div class="mt-5">
            <p class="text-sm font-bold text-slate-900">
              降車停留所
            </p>

            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="stop in returnBusRoute.stops"
                :key="stop"
                class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
              >
                {{ stop }}
              </span>
            </div>
          </div>

          <div
            class="mt-4 rounded-xl border border-rose-100 bg-rose-50 p-3"
          >
            <p class="text-sm font-bold text-rose-700">
              宮崎空港には立ち寄りません
            </p>

            <p class="mt-1 text-xs leading-5 text-rose-600">
              宮崎駅方面の復路臨時バスは宮崎空港を経由しません。
            </p>
          </div>

          <ul class="mt-4 space-y-1">
            <li
              v-for="note in returnBusRoute.notes"
              :key="note"
              class="text-xs leading-5 text-slate-500"
            >
              ※ {{ note }}
            </li>
          </ul>
        </div>
      </article>
    </section>

    <!-- Parking -->
    <section
      id="parking"
      class="mt-10 scroll-mt-24"
    >
      <div class="mb-4">
        <p class="text-xs font-bold tracking-wider text-emerald-600">
          PARKING
        </p>

        <h2 class="mt-1 text-xl font-bold text-slate-900">
          場外駐車場
        </h2>

        <p class="mt-2 text-sm text-slate-600">
          駐車可能時間
          <strong class="text-slate-900">
            {{ parkingInfo.openTime }}〜{{ parkingInfo.closeTime }}
          </strong>
          （予定）
        </p>
      </div>

      <div class="space-y-4">
        <article
          v-for="parking in parkingLots"
          :key="parking.id"
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <span
                class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700"
              >
                場外駐車場
              </span>

              <h3 class="mt-2 text-base font-bold text-slate-900">
                {{ parking.name }}
              </h3>

              <p class="mt-1 text-xs leading-5 text-slate-500">
                {{ parking.address }}
              </p>
            </div>

            <div class="shrink-0 text-right">
              <p class="text-xs text-slate-500">
                収容
              </p>

              <p class="text-lg font-bold text-slate-900">
                {{ parking.capacity.toLocaleString() }}
                <span class="text-xs font-normal">
                  台
                </span>
              </p>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="rounded-xl bg-emerald-50 p-3">
              <p class="text-xs text-emerald-700">
                無料シャトル
              </p>

              <p class="mt-1 font-bold text-slate-900">
                {{ parking.shuttleDuration }}
              </p>
            </div>

            <div class="rounded-xl bg-slate-50 p-3">
              <p class="text-xs text-slate-500">
                徒歩
              </p>

              <p class="mt-1 font-bold text-slate-900">
                {{ parking.walkingDuration }}
              </p>
            </div>
          </div>
        </article>
      </div>

      <div
        class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
      >
        <h3 class="text-sm font-bold text-slate-900">
          駐車場利用時の注意
        </h3>

        <ul class="mt-3 space-y-2">
          <li
            v-for="note in parkingInfo.notes"
            :key="note"
            class="flex gap-2 text-sm leading-6 text-slate-600"
          >
            <span class="text-emerald-500">
              •
            </span>

            <span>
              {{ note }}
            </span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Fares -->
    <section
      id="fare"
      class="mt-10 scroll-mt-24"
    >
      <div class="mb-4">
        <p class="text-xs font-bold tracking-wider text-amber-600">
          FARE
        </p>

        <h2 class="mt-1 text-xl font-bold text-slate-900">
          臨時バス運賃
        </h2>
      </div>

      <div
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="overflow-x-auto">
          <table class="w-full min-w-[480px]">
            <thead class="bg-slate-50">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-slate-600"
                >
                  バス停
                </th>

                <th
                  class="px-4 py-3 text-right text-xs font-bold text-slate-600"
                >
                  大人
                </th>

                <th
                  class="px-4 py-3 text-right text-xs font-bold text-slate-600"
                >
                  こども
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="fare in busFares"
                :key="fare.stop"
              >
                <td class="px-4 py-3">
                  <p class="text-sm font-medium text-slate-900">
                    {{ fare.stop }}
                  </p>

                  <p
                    v-if="fare.returnStop"
                    class="mt-0.5 text-xs text-slate-500"
                  >
                    帰り：{{ fare.returnStop }}
                  </p>
                </td>

                <td
                  class="px-4 py-3 text-right text-sm font-bold text-slate-900"
                >
                  ¥{{ fare.adult.toLocaleString() }}
                </td>

                <td
                  class="px-4 py-3 text-right text-sm text-slate-700"
                >
                  ¥{{ fare.child.toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p class="mt-2 text-xs leading-5 text-slate-500">
        ※ 表示額は各バス停とフェス会場間の片道運賃です。
      </p>

      <div class="mt-5">
        <h3 class="text-sm font-bold text-slate-900">
          利用できる支払い方法
        </h3>

        <div class="mt-2 flex flex-wrap gap-2">
          <span
            v-for="payment in busPaymentMethods"
            :key="payment"
            class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
          >
            {{ payment }}
          </span>
        </div>
      </div>
    </section>

    <!-- Official Link -->
    <section class="mt-10">
      <div
        class="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5"
      >
        <p class="text-xs font-bold tracking-wider text-sky-600">
          OFFICIAL INFORMATION
        </p>

        <h2 class="mt-1 font-bold text-slate-900">
          最新情報は公式サイトでも確認
        </h2>

        <p class="mt-2 text-sm leading-6 text-slate-600">
          バスの運行時間や経路は変更される可能性があります。
          当日は公式交通情報もあわせて確認してください。
        </p>

        <a
          :href="accessMeta.sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-bold text-white transition hover:bg-sky-700"
        >
          公式交通情報を見る
          <span class="ml-2">
            ↗
          </span>
        </a>
      </div>
    </section>
  </div>
</template>