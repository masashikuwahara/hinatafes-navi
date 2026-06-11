<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  getSpotCategory,
  type Spot,
} from '~/data/spots'
import type { UserLocation } from '~/composables/useGeolocation'

type MappableSpot = Spot & {
  latitude: number
  longitude: number
}

const props = defineProps<{
  spots: Spot[]
  currentLocation?: UserLocation | null
}>()

const mapElement = ref<HTMLDivElement | null>(null)
const isMounted = ref(false)

let map: import('leaflet').Map | null = null
let leaflet: typeof import('leaflet') | null = null

const currentLocation = computed(() => props.currentLocation ?? null)

const mappableSpots = computed<MappableSpot[]>(() => {
  return props.spots.filter((spot): spot is MappableSpot => {
    return spot.latitude !== null && spot.longitude !== null
  })
})

const canShowMap = computed(() => {
  return mappableSpots.value.length > 0 || currentLocation.value !== null
})

const escapeHtml = (text: string) => {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

const resetMap = () => {
  if (!map) {
    return
  }

  map.remove()
  map = null
}

const buildMap = async () => {
  await nextTick()

  resetMap()

  if (!isMounted.value || !mapElement.value || !canShowMap.value) {
    return
  }

  if (!leaflet) {
    leaflet = await import('leaflet')
  }

  const L = leaflet
  const bounds = L.latLngBounds([])

  const firstSpot = mappableSpots.value[0]

  const initialLatLng: [number, number] = firstSpot
    ? [firstSpot.latitude, firstSpot.longitude]
    : currentLocation.value
      ? [currentLocation.value.latitude, currentLocation.value.longitude]
      : [35.681236, 139.767125]

  map = L.map(mapElement.value, {
    zoomControl: true,
  }).setView(initialLatLng, 16)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  mappableSpots.value.forEach((spot) => {
    if (!map) {
      return
    }

    const category = getSpotCategory(spot.category)
    const latLng: [number, number] = [spot.latitude, spot.longitude]

    const icon = L.divIcon({
      className: '',
      html: `<div class="leaflet-spot-marker">${escapeHtml(category?.icon ?? '📍')}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -34],
    })

    L.marker(latLng, { icon })
      .addTo(map)
      .bindPopup(`
        <div class="leaflet-spot-popup">
          <p class="leaflet-spot-popup__category">
            ${escapeHtml(category?.label ?? 'スポット')}
          </p>
          <p class="leaflet-spot-popup__name">
            ${escapeHtml(spot.name)}
          </p>
          <p class="leaflet-spot-popup__description">
            ${escapeHtml(spot.description)}
          </p>
        </div>
      `)

    bounds.extend(latLng)
  })

  if (currentLocation.value && map) {
    const currentLatLng: [number, number] = [
      currentLocation.value.latitude,
      currentLocation.value.longitude,
    ]

    const currentLocationIcon = L.divIcon({
      className: '',
      html: '<div class="leaflet-current-location-marker"><span></span></div>',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    })

    L.marker(currentLatLng, {
      icon: currentLocationIcon,
      zIndexOffset: 1000,
    })
      .addTo(map)
      .bindPopup(`
        <div class="leaflet-spot-popup">
          <p class="leaflet-spot-popup__category">
            現在地
          </p>
          <p class="leaflet-spot-popup__name">
            あなたの現在地
          </p>
          <p class="leaflet-spot-popup__description">
            誤差 約${Math.round(currentLocation.value.accuracy)}m
          </p>
        </div>
      `)

    L.circle(currentLatLng, {
      radius: currentLocation.value.accuracy,
      color: '#38bdf8',
      fillColor: '#38bdf8',
      fillOpacity: 0.12,
      weight: 1,
    }).addTo(map)

    bounds.extend(currentLatLng)
  }

  if (bounds.isValid()) {
    map.fitBounds(bounds, {
      padding: [36, 36],
      maxZoom: 17,
    })
  }

  requestAnimationFrame(() => {
    map?.invalidateSize()
  })
}

onMounted(() => {
  isMounted.value = true
  void buildMap()
})

watch(
  [mappableSpots, currentLocation],
  () => {
    void buildMap()
  },
  {
    deep: true,
  }
)

onBeforeUnmount(() => {
  resetMap()
})
</script>

<template>
  <div>
    <div
      v-if="!canShowMap"
      class="grid min-h-[280px] place-items-center rounded-3xl border border-dashed border-sky-200 bg-gradient-to-br from-sky-50 via-white to-yellow-50 p-6 text-center"
    >
      <div>
        <div class="mx-auto flex size-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm">
          🗺️
        </div>

        <p class="mt-4 text-base font-bold text-slate-800">
          地図に表示できるスポットがまだありません
        </p>

        <p class="mt-2 text-sm leading-7 text-slate-600">
          現在地を取得するか、data/spots.ts の latitude / longitude に座標を入れると地図が表示されます。
        </p>
      </div>
    </div>

    <div
      v-else
      ref="mapElement"
      class="h-[320px] w-full overflow-hidden rounded-3xl border border-sky-100 bg-slate-100"
    />
  </div>
</template>

<style>
.leaflet-spot-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 2px solid #7dd3fc;
  border-radius: 9999px;
  background: #ffffff;
  box-shadow: 0 8px 18px rgb(15 23 42 / 18%);
  font-size: 20px;
}

.leaflet-current-location-marker {
  position: relative;
  width: 28px;
  height: 28px;
  border: 3px solid #ffffff;
  border-radius: 9999px;
  background: #0ea5e9;
  box-shadow: 0 0 0 6px rgb(14 165 233 / 20%), 0 8px 18px rgb(15 23 42 / 25%);
}

.leaflet-current-location-marker span {
  position: absolute;
  inset: 8px;
  border-radius: 9999px;
  background: #ffffff;
}

.leaflet-spot-popup {
  max-width: 220px;
}

.leaflet-spot-popup__category {
  margin: 0 0 4px;
  color: #0284c7;
  font-size: 11px;
  font-weight: 700;
}

.leaflet-spot-popup__name {
  margin: 0;
  color: #0f172a;
  font-size: 14px;
  font-weight: 700;
}

.leaflet-spot-popup__description {
  margin: 6px 0 0;
  color: #475569;
  font-size: 12px;
  line-height: 1.7;
}
</style>