import { Coordinates } from "@/api/types";
import { weatherAPI } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_KEYS={
    weather:(coordinates: Coordinates | null) => ["weather", coordinates] as const,
    forecast:(coordinates: Coordinates | null) => ["forecast", coordinates] as const,
    location:(coordinates: Coordinates | null) => ["location", coordinates] as const,  
    search:(query: string) => ["location-search", query] as const  
} as const;


export function useWeatherQuery(coordinates: Coordinates | null) {
  return  useQuery({
    queryKey: WEATHER_KEYS.weather(coordinates ?? {lat: 0, lon: 0}),
    queryFn:()=>coordinates?weatherAPI.getCurrentWeather(coordinates):null,
    enabled: !!coordinates,
  });
}

export function useForecastQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () =>
      coordinates ? weatherAPI.getForecast(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useReverseGeocode(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.location(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () =>
      coordinates ? weatherAPI.reverseGeocode(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useSearchLocations(query: string) {
  return useQuery({
    queryKey: WEATHER_KEYS.search(query),
    queryFn: () => weatherAPI.searchLocations(query),
    enabled: query.length>=3,
  });
}
