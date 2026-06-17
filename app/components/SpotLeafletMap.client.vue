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

type CurrentLocation = UserLocation & {
  updatedAt?: string
}

const props = defineProps<{
  spots: Spot[]
  currentLocation: CurrentLocation | null
  selectedSpotId?: string | null
  shouldFollowCurrentLocation?: boolean
  followRequestKey?: number
}>()

const emit = defineEmits<{
  (event: 'user-moved-map'): void
}>()

const mapElement = ref<HTMLDivElement | null>(null)
const isMounted = ref(false)

let map: import('leaflet').Map | null = null
let leaflet: typeof import('leaflet') | null = null
let spotLayerGroup: import('leaflet').LayerGroup | null = null
let currentLocationMarker: import('leaflet').Marker | null = null
let currentLocationCircle: import('leaflet').Circle | null = null
let isProgrammaticMove = false

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

const runProgrammaticMove = (callback: () => void) => {
  isProgrammaticMove = true
  callback()

  window.setTimeout(() => {
    isProgrammaticMove = false
  }, 400)
}

const centerToCurrentLocation = () => {
  if (!map || !currentLocation.value) {
    return
  }

  const latLng: [number, number] = [
    currentLocation.value.latitude,
    currentLocation.value.longitude,
  ]

  runProgrammaticMove(() => {
    requestAnimationFrame(() => {
      if (!map) {
        return
      }

      map.invalidateSize()

      map.setView(
        latLng,
        Math.max(map.getZoom(), 17),
        {
          animate: true,
        },
      )
    })
  })
}

const getInitialLatLng = (): [number, number] => {
  const firstSpot = mappableSpots.value[0]

  if (currentLocation.value) {
    return [
      currentLocation.value.latitude,
      currentLocation.value.longitude,
    ]
  }

  if (firstSpot) {
    return [
      firstSpot.latitude,
      firstSpot.longitude,
    ]
  }

  return [35.681236, 139.767125]
}

const createSpotIcon = (iconText: string) => {
  if (!leaflet) {
    return undefined
  }

  return leaflet.divIcon({
    className: '',
    html: `<div class="leaflet-spot-marker">${escapeHtml(iconText)}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -34],
  })
}

const createCurrentLocationIcon = () => {
  if (!leaflet) {
    return undefined
  }

  return leaflet.divIcon({
    className: '',
    html: '<div class="leaflet-current-location-marker"><span></span></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

const getSpotPopupHtml = (spot: MappableSpot) => {
  const category = getSpotCategory(spot.category)

  return `
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
  `
}

const getCurrentLocationPopupHtml = (location: UserLocation) => {
  return `
    <div class="leaflet-spot-popup">
      <p class="leaflet-spot-popup__category">
        現在地
      </p>
      <p class="leaflet-spot-popup__name">
        あなたの現在地
      </p>
      <p class="leaflet-spot-popup__description">
        誤差 約${Math.round(location.accuracy)}m
      </p>
    </div>
  `
}

const resetMap = () => {
  if (!map) {
    return
  }

  map.remove()
  map = null
  spotLayerGroup = null
  currentLocationMarker = null
  currentLocationCircle = null
}

const updateSpotMarkers = () => {
  if (!map || !leaflet) {
    return
  }

  if (!spotLayerGroup) {
    spotLayerGroup = leaflet.layerGroup().addTo(map)
  }

  spotLayerGroup.clearLayers()

  mappableSpots.value.forEach((spot) => {
    if (!leaflet || !spotLayerGroup) {
      return
    }

    const category = getSpotCategory(spot.category)
    const latLng: [number, number] = [
      spot.latitude,
      spot.longitude,
    ]

    const icon = createSpotIcon(category?.icon ?? '📍')

    leaflet
      .marker(latLng, {
        icon,
      })
      .bindPopup(getSpotPopupHtml(spot))
      .addTo(spotLayerGroup)
  })
}

const updateCurrentLocationMarker = () => {
  if (!map || !leaflet) {
    return
  }

  if (!currentLocation.value) {
    if (currentLocationMarker) {
      currentLocationMarker.remove()
      currentLocationMarker = null
    }

    if (currentLocationCircle) {
      currentLocationCircle.remove()
      currentLocationCircle = null
    }

    return
  }

  const latLng: [number, number] = [
    currentLocation.value.latitude,
    currentLocation.value.longitude,
  ]

  const popupHtml = getCurrentLocationPopupHtml(currentLocation.value)

  if (currentLocationMarker) {
    currentLocationMarker.setLatLng(latLng)

    const popup = currentLocationMarker.getPopup()

    if (popup) {
      popup.setContent(popupHtml)
    } else {
      currentLocationMarker.bindPopup(popupHtml)
    }
  } else {
    const icon = createCurrentLocationIcon()

    currentLocationMarker = leaflet
      .marker(latLng, {
        icon,
        zIndexOffset: 1000,
      })
      .bindPopup(popupHtml)
      .addTo(map)
  }

  if (currentLocationCircle) {
    currentLocationCircle.setLatLng(latLng)
    currentLocationCircle.setRadius(currentLocation.value.accuracy)
  } else {
    currentLocationCircle = leaflet
      .circle(latLng, {
        radius: currentLocation.value.accuracy,
        color: '#7cc7e8',
        fillColor: '#7cc7e8',
        fillOpacity: 0.12,
        weight: 1,
      })
      .addTo(map)
  }

  if (props.shouldFollowCurrentLocation) {
    centerToCurrentLocation()
  }
}

const fitMapToVisibleItems = () => {
  if (props.shouldFollowCurrentLocation) {
    return
  }

  if (!map || !leaflet) {
    return
  }

  const points: Array<[number, number]> = []

  mappableSpots.value.forEach((spot) => {
    points.push([
      spot.latitude,
      spot.longitude,
    ])
  })

  if (currentLocation.value) {
    points.push([
      currentLocation.value.latitude,
      currentLocation.value.longitude,
    ])
  }

  if (points.length === 0) {
    return
  }

  runProgrammaticMove(() => {
    if (!map || !leaflet) {
      return
    }

    if (points.length === 1) {
      const firstPoint = points[0]

      if (!firstPoint) {
        return
      }

      map.setView(firstPoint, 17)
      return
    }

    const bounds = leaflet.latLngBounds(points)

    map.fitBounds(bounds, {
      padding: [36, 36],
      maxZoom: 17,
    })
  })
}

const buildMapOnce = async () => {
  await nextTick()

  if (!isMounted.value || !mapElement.value || !canShowMap.value) {
    return
  }

  if (map) {
    return
  }

  if (!leaflet) {
    leaflet = await import('leaflet')
  }

  const initialLatLng = getInitialLatLng()

  map = leaflet.map(mapElement.value, {
    zoomControl: true,
  }).setView(initialLatLng, 16)

  leaflet
    .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    })
    .addTo(map)

  spotLayerGroup = leaflet.layerGroup().addTo(map)

  map.on('dragstart zoomstart', () => {
    if (!isProgrammaticMove) {
      emit('user-moved-map')
    }
  })

  updateSpotMarkers()
  updateCurrentLocationMarker()
  fitMapToVisibleItems()

  requestAnimationFrame(() => {
    map?.invalidateSize()

    if (props.shouldFollowCurrentLocation) {
      centerToCurrentLocation()
    }
  })
}

onMounted(() => {
  isMounted.value = true
  void buildMapOnce()
})

watch(
  canShowMap,
  async (value) => {
    if (value) {
      await buildMapOnce()
      requestAnimationFrame(() => {
        map?.invalidateSize()
      })
      return
    }

    resetMap()
  },
)

watch(
  mappableSpots,
  async () => {
    if (!canShowMap.value) {
      resetMap()
      return
    }

    await buildMapOnce()

    updateSpotMarkers()
    fitMapToVisibleItems()
  },
  {
    deep: true,
  },
)

watch(
  currentLocation,
  async () => {
    if (!canShowMap.value) {
      resetMap()
      return
    }

    await buildMapOnce()
    updateCurrentLocationMarker()

    if (props.shouldFollowCurrentLocation) {
      centerToCurrentLocation()
    }
  },
  {
    deep: true,
    flush: 'post',
  },
)

watch(
  () => props.shouldFollowCurrentLocation,
  async (shouldFollow) => {
    if (!shouldFollow) {
      return
    }

    await buildMapOnce()
    updateCurrentLocationMarker()
    centerToCurrentLocation()
  },
  {
    flush: 'post',
  },
)

watch(
  () => props.followRequestKey,
  async () => {
    if (!props.shouldFollowCurrentLocation) {
      return
    }

    await buildMapOnce()
    updateCurrentLocationMarker()
    centerToCurrentLocation()
  },
  {
    flush: 'post',
  },
)

onBeforeUnmount(() => {
  resetMap()
})
</script>

<template>
  <div>
    <div
      v-if="!canShowMap"
      class="grid min-h-[280px] place-items-center rounded-card border border-dashed border-hinata-border bg-gradient-to-br from-hinata-sky-soft via-white to-hinata-yellow-soft p-6 text-center"
    >
      <div>
        <div class="mx-auto flex size-16 items-center justify-center rounded-card bg-white text-3xl shadow-soft">
          🗺️
        </div>

        <p class="mt-4 text-base font-bold text-hinata-navy">
          地図に表示できるスポットがまだありません
        </p>

        <p class="mt-2 text-sm leading-7 text-hinata-muted">
          現在地を取得するか、data/spots.ts の latitude / longitude に座標を入れると地図が表示されます。
        </p>
      </div>
    </div>

    <div
      v-else
      ref="mapElement"
      class="h-[360px] w-full overflow-hidden rounded-card border border-hinata-border bg-slate-100"
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
  border: 2px solid #7cc7e8;
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
  background: #7cc7e8;
  box-shadow: 0 0 0 6px rgb(124 199 232 / 25%), 0 8px 18px rgb(15 23 42 / 25%);
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
  color: #1f3347;
  font-size: 14px;
  font-weight: 700;
}

.leaflet-spot-popup__description {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.7;
}
</style>