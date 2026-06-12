type WeatherCode =
  | 0
  | 1
  | 2
  | 3
  | 45
  | 48
  | 51
  | 53
  | 55
  | 56
  | 57
  | 61
  | 63
  | 65
  | 66
  | 67
  | 71
  | 73
  | 75
  | 77
  | 80
  | 81
  | 82
  | 85
  | 86
  | 95
  | 96
  | 99

type OpenMeteoCurrent = {
  time: string
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  weather_code: WeatherCode
  wind_speed_10m: number
}

type OpenMeteoResponse = {
  current: OpenMeteoCurrent
}

type WeatherLocation = {
  name: string
  latitude: number
  longitude: number
}

type HeatRiskLevel = 'normal' | 'caution' | 'warning' | 'danger'

type HeatRisk = {
  level: HeatRiskLevel
  label: string
  message: string
  className: string
}

const getWeatherText = (code: WeatherCode) => {
  const weatherMap: Record<number, string> = {
    0: '快晴',
    1: '晴れ',
    2: '一部くもり',
    3: 'くもり',
    45: '霧',
    48: '霧',
    51: '小雨',
    53: '小雨',
    55: '雨',
    56: '冷たい小雨',
    57: '冷たい雨',
    61: '小雨',
    63: '雨',
    65: '強い雨',
    66: '冷たい雨',
    67: '冷たい強い雨',
    71: '雪',
    73: '雪',
    75: '強い雪',
    77: '雪',
    80: 'にわか雨',
    81: 'にわか雨',
    82: '強いにわか雨',
    85: 'にわか雪',
    86: '強いにわか雪',
    95: '雷雨',
    96: '雷雨',
    99: '雷雨',
  }

  return weatherMap[code] ?? '不明'
}

const getWeatherIcon = (code: WeatherCode) => {
  if (code === 0 || code === 1) {
    return '☀️'
  }

  if (code === 2) {
    return '🌤️'
  }

  if (code === 3) {
    return '☁️'
  }

  if ([45, 48].includes(code)) {
    return '🌫️'
  }

  if (
    [
      51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82,
    ].includes(code)
  ) {
    return '雨'
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return '雪'
  }

  if ([95, 96, 99].includes(code)) {
    return '雷'
  }

  return '🌡️'
}

const getHeatRisk = (
  temperature: number,
  apparentTemperature: number,
  humidity: number,
): HeatRisk => {
  if (apparentTemperature >= 35 || temperature >= 35) {
    return {
      level: 'danger',
      label: '危険',
      message: '体感温度または気温が高い状態です。日陰での休憩と水分補給を優先してください。',
      className: 'border-red-200 bg-red-50 text-red-700',
    }
  }

  if (temperature >= 32) {
    return {
      level: 'warning',
      label: '厳重注意',
      message: 'かなり暑い状態です。長時間の移動や待機は無理せず、こまめに休憩してください。',
      className: 'border-orange-200 bg-orange-50 text-orange-700',
    }
  }

  if (temperature >= 30 && humidity >= 75) {
    return {
      level: 'caution',
      label: '蒸し暑さ注意',
      message: '湿度が高く、汗が乾きにくい状態です。水分と塩分を意識してください。',
      className: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    }
  }

  return {
    level: 'normal',
    label: '通常',
    message: '現在は強い暑さ警告の条件には該当していません。こまめな水分補給は続けましょう。',
    className: 'border-hinata-border bg-white text-hinata-navy',
  }
}

export const useWeather = (location: WeatherLocation) => {
  const weather = ref<OpenMeteoCurrent | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const lastUpdatedAt = ref<Date | null>(null)

  const fetchWeather = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const params = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'weather_code',
          'wind_speed_10m',
        ].join(','),
        timezone: 'Asia/Tokyo',
      })

      const response = await $fetch<OpenMeteoResponse>(
        `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      )

      weather.value = response.current
      lastUpdatedAt.value = new Date()
    } catch (error) {
      console.error(error)
      errorMessage.value = '天気情報を取得できませんでした。時間をおいて再度お試しください。'
    } finally {
      isLoading.value = false
    }
  }

  const weatherText = computed(() => {
    if (!weather.value) {
      return '取得中'
    }

    return getWeatherText(weather.value.weather_code)
  })

  const weatherIcon = computed(() => {
    if (!weather.value) {
      return '🌤️'
    }

    return getWeatherIcon(weather.value.weather_code)
  })

  const heatRisk = computed<HeatRisk | null>(() => {
    if (!weather.value) {
      return null
    }

    return getHeatRisk(
      weather.value.temperature_2m,
      weather.value.apparent_temperature,
      weather.value.relative_humidity_2m,
    )
  })

  const lastUpdatedLabel = computed(() => {
    if (!lastUpdatedAt.value) {
      return '未更新'
    }

    return lastUpdatedAt.value.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    })
  })

  return {
    weather,
    weatherText,
    weatherIcon,
    heatRisk,
    isLoading,
    errorMessage,
    lastUpdatedLabel,
    fetchWeather,
  }
}