"use client";

import "react";
import styles from "./page.module.css";
import { List } from "@repo/ui/list";
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
  desc: string;
  imgSrc: string;
}

export default function Page(): JSX.Element {
  const sdk = useSdk();

  const [fetchingState, setFetchingState] = useState<
    "LOADING" | "LOADED" | "ERROR"
  >("LOADING");
  const [listData, setListData] = useState<Array<LocationRow>>([]);
  const [selectedRow, setSelectedRow] = useState<LocationRow | null>(null);

  const [selectedDate, setSelectedDate] = useState<PickerValidDate | null>(
    null,
  );
  const [selectedTime, setSelectedTime] = useState<PickerValidDate | null>(
    null,
  );

  const fetch = async () => {
    const filter =
      selectedDate === null || selectedTime === null
        ? undefined
        : `${selectedDate.toISOString().slice(0, 10)}T${selectedTime.toISOString().slice(11, 19)}`;

    sdk.trafficCam
      .trafficCamControllerGet(filter)
      .then((res) => {
        const list = res.data.cameras.map((c) => ({
          desc: `lat: ${c.location.lat}, lng: ${c.location.lng}`,
          imgSrc: c.image.src,
        }));
        setFetchingState("LOADED");
        setListData(list);
      })
      .catch(() => {
        setFetchingState("ERROR");
      });
  };

  useEffect(() => {
    fetch();
  }, []);

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
            onClick={() => fetch()}
          >
            Refetch
          </button>
        </div>
        <div className={styles.listRowBox}>
          <List
            state={fetchingState}
            className={styles.list}
            statusTextClassName={styles.description}
            data={listData}
            renderRow={(d, i) => (
              <span
                className={styles.description}
                onClick={() => setSelectedRow(listData[i]!)}
              >
                {i + 1}. {d.desc}
              </span>
            )}
          />
          <div className={styles.weatherBox}>
            <span className={styles.description}>Loading...</span>
          </div>
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
