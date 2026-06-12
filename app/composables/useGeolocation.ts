export type UserLocation = {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

export type GeolocationStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'unsupported'

export const useGeolocation = () => {
  const status = ref<GeolocationStatus>('idle')
  const location = ref<UserLocation | null>(null)
  const errorMessage = ref('')
  const isSupported = ref(false)
  const isWatching = ref(false)

  let watchId: number | null = null

  onMounted(() => {
    isSupported.value = import.meta.client && 'geolocation' in navigator
  })

  onUnmounted(() => {
    stopWatchingLocation()
  })

  const getErrorMessage = (error: GeolocationPositionError) => {
    if (error.code === error.PERMISSION_DENIED) {
      return '位置情報の利用が許可されませんでした。ブラウザの設定を確認してください。'
    }

    if (error.code === error.POSITION_UNAVAILABLE) {
      return '現在地を取得できませんでした。電波状況や端末の設定を確認してください。'
    }

    if (error.code === error.TIMEOUT) {
      return '現在地の取得がタイムアウトしました。場所を変えてもう一度お試しください。'
    }

    return '現在地の取得中にエラーが発生しました。'
  }

  const setLocationFromPosition = (position: GeolocationPosition) => {
    location.value = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    }

    status.value = 'success'
  }

  const getCurrentLocation = () => {
    errorMessage.value = ''

    if (!import.meta.client || !isSupported.value) {
      status.value = 'unsupported'
      errorMessage.value = 'このブラウザでは位置情報を利用できません。'
      return
    }

    status.value = 'loading'

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationFromPosition(position)
      },
      (error) => {
        status.value = 'error'
        errorMessage.value = getErrorMessage(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    )
  }

  const startWatchingLocation = () => {
    errorMessage.value = ''

    if (!import.meta.client || !isSupported.value) {
      status.value = 'unsupported'
      errorMessage.value = 'このブラウザでは位置情報を利用できません。'
      return
    }

    if (watchId !== null) {
      return
    }

    status.value = 'loading'
    isWatching.value = true

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocationFromPosition(position)
      },
      (error) => {
        status.value = 'error'
        errorMessage.value = getErrorMessage(error)
        stopWatchingLocation()
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      },
    )
  }

  const stopWatchingLocation = () => {
    if (!import.meta.client) {
      return
    }

    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      watchId = null
    }

    isWatching.value = false
  }

  const clearLocation = () => {
    stopWatchingLocation()

    location.value = null
    errorMessage.value = ''
    status.value = 'idle'
  }

  return {
    status,
    location,
    errorMessage,
    isSupported,
    isWatching,
    getCurrentLocation,
    startWatchingLocation,
    stopWatchingLocation,
    clearLocation,
  }
}