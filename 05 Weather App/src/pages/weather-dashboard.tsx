import { AlertTriangle, MapPin, RefreshCcw } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  useForecastQuery,
  useReverseGeocode,
  useWeatherQuery,
} from "@/hooks/use-weather";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CurrentWeather } from "@/components/current-weather";
import { HourlyTemperature } from "@/components/hourly-temperature";
import { WeatherDetails } from "@/components/weather-details";
import { WeatherForecast } from "@/components/weather-forecast";
import { FavoriteCities } from "@/components/favorite-cities";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    getLocation,
    isLoading: locationLoading,
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocode(coordinates);

  console.log("weatherQuery", weatherQuery.data);
  console.log("forecastQuery", forecastQuery.data);
  console.log("locationQuery", locationQuery.data);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (locationError) {
    return (
      <Alert variant="destructive" className="space-y-4 !my-4 !mx-4 !p-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button
            variant={"outline"}
            onClick={getLocation}
            className="w-fit !p-2"
          >
            <MapPin className="!mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive" className="space-y-4 !my-4 !mx-4 !p-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather</p>
          <Button
            variant="outline"
            onClick={getLocation}
            className="w-fit !p-2"
          >
            <MapPin className="!mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName = locationQuery.data?.[0];
  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive" className="space-y-4 !my-4 !mx-4 !p-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again.</p>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="w-fit !p-2"
          >
            <RefreshCcw className="!mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4  ">
      {/* Favourites */}
      <FavoriteCities />

      {/* Referesh Button */}
      <div className="container !mx-4 flex h-16 items-center justify-between !px-4 ">
        <h1 className="text-2xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCcw
            className={`h-4 w-4 ${
              weatherQuery.isFetching || forecastQuery.isFetching
                ? "animate-spin"
                : ""
            }`}
          />
        </Button>
      </div>

      {/* Current and Hourly weather */}
      <div className="grid gap-6 ">
        <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
          {/* current weather  */}
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />
          {/* hourly temperature */}
          <HourlyTemperature data={forecastQuery.data} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* details */}
          <WeatherDetails data={weatherQuery.data} />
          {/* forecast */}
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};
export default WeatherDashboard;
