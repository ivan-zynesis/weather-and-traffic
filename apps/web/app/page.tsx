"use client";

import "react";
import styles from "./page.module.css";
import { List } from "@repo/ui/list";
import { WeatherBox } from "@repo/ui/weather-box";
import { useSdk } from "./client-sdk";
import { useEffect, useState } from "react";

import {
  DatePicker,
  LocalizationProvider,
  PickerValidDate,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Image from "next/image";

interface LocationRow {
  coordinate: {
    lat: number;
    lng: number;
  };
  imgSrc: string;
}

export default function Page(): JSX.Element {
  const sdk = useSdk();

  const [fetchingState, setFetchingState] = useState<
    "LOADING" | "LOADED" | "ERROR"
  >("LOADING");
  const [locationRows, setLocationRows] = useState<Array<LocationRow>>([]);
  const [selectedRow, setSelectedRow] = useState<LocationRow | null>(null);

  const [selectedDate, setSelectedDate] = useState<PickerValidDate | null>(
    null,
  );
  const [selectedTime, setSelectedTime] = useState<PickerValidDate | null>(
    null,
  );

  const [fetchingWeatherState, setFetchingWeatherState] = useState<
    "IDLE" | "LOADING" | "ERROR"
  >("IDLE");
  const [selectedRowWeather, setSelectedRowWeather] = useState<{
    area: string;
    forecast: string;
  } | null>(null);

  const fetchTrafficCams = async () => {
    const filter =
      selectedDate === null || selectedTime === null
        ? undefined
        : `${selectedDate.toISOString().slice(0, 10)}T${selectedTime.toISOString().slice(11, 19)}`;

    sdk.trafficCam
      .trafficCamControllerGet(filter)
      .then((res) => {
        const list = res.data.cameras.map((c) => ({
          coordinate: {
            lat: c.location.lat,
            lng: c.location.lng,
          },
          locationName: c.location.name,
          imgSrc: c.image.src,
        }));
        setFetchingState("LOADED");
        setLocationRows(list);
      })
      .catch(() => {
        setFetchingState("ERROR");
      });
  };

  const fetchWeatherForecast = async (coordinate: {
    lat: number;
    lng: number;
  }) => {
    sdk.weatherForecasts
      .weatherForecastControllerGet(`${coordinate.lat},${coordinate.lng}`)
      .then((res) => {
        setFetchingWeatherState("IDLE");
        setSelectedRowWeather(res.data);
      })
      .catch(() => {
        setFetchingWeatherState("ERROR");
        setSelectedRowWeather(null);
      });
  };

  useEffect(() => {
    fetchTrafficCams();
  }, []);

  useEffect(() => {
    if (!selectedRow) {
      return;
    }
    setFetchingWeatherState("LOADING");
    void fetchWeatherForecast(selectedRow.coordinate);
  }, [selectedRow]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <main className={styles.main}>
        <div className={styles.dateTimePickerBar}>
          <DatePicker
            label="Date"
            onChange={(newValue) => setSelectedDate(newValue)}
            value={selectedDate}
          />
          <TimePicker
            className={styles.padLeft}
            label="Time"
            onChange={(newValue) => setSelectedTime(newValue)}
          />
          <button
            className={styles.button}
            disabled={fetchingState !== "LOADED"}
            onClick={() => fetchTrafficCams()}
          >
            Refetch
          </button>
        </div>
        <div className={styles.listRowBox}>
          <List
            state={fetchingState}
            className={styles.list}
            statusTextClassName={styles.description}
            data={locationRows}
            renderRow={(d, i) => (
              <span
                className={styles.description}
                onClick={() => setSelectedRow(locationRows[i]!)}
              >
                {i + 1}. ({d.coordinate.lat}, lng: {d.coordinate.lng})
              </span>
            )}
          />
          {
            <WeatherBox
              containerClassName={styles.weatherBox}
              spanClassName={styles.description}
              queryState={fetchingWeatherState}
              data={selectedRowWeather}
            />
          }
        </div>
        {selectedRow === null ? null : (
          <div>
            <Image
              className={styles.trafficImage}
              src={selectedRow.imgSrc}
              alt="fallback"
              width="0"
              height="0"
              sizes="100vw"
            />
          </div>
        )}
      </main>
    </LocalizationProvider>
  );
}
