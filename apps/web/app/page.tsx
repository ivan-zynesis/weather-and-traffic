"use client";

import * as React from "react";
import styles from "./page.module.css";
import { Button } from "@repo/ui/button";
import { useSdk } from "./client-sdk";
import { useEffect, useState } from "react";

import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Image from "next/image";

export default function Page(): JSX.Element {
  const sdk = useSdk();

  const [listData, setListData] = useState<string[]>([]);

  useEffect(() => {
    // data mocking
    setTimeout(() => {
      setListData(["lat: yyy, long: xxx", "lat: yyy, long: xxxx"]);
    }, 3000);

    // quick indicate the api is working
    sdk.status.statusControllerStatus().then((res) => {
      console.log("sdk read", res.data);
    });
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <main className={styles.main}>
        <div className={styles.dateTimePickerBar}>
          <DatePicker
            label="Date"
            onChange={(newValue) =>
              console.log("selected date:", newValue?.toISOString())
            }
          />
          <TimePicker
            label="Basic time picker"
            onChange={(newValue) =>
              console.log("selected time:", newValue?.toISOString())
            }
          />
        </div>
        <div className={styles.listRowBox}>
          <List className={styles.list}>
            {listData.length === 0 ? (
              <span className={styles.description}>List is empty</span>
            ) : (
              listData.map((data, index) => (
                <ListItem>
                  <span className={styles.description}>
                    {index + 1}. {data}
                  </span>
                </ListItem>
              ))
            )}
          </List>
          <div className={styles.weatherBox}>
            <span className={styles.description}>Loading...</span>
          </div>
        </div>
        <div>
          <Image
            className={styles.trafficImage}
            src="https://images.data.gov.sg/api/traffic-images/2024/04/8b749c44-8cd6-4f66-8184-69b4750a7199.jpg"
            alt="fallback"
            width="0"
            height="0"
            sizes="100vw"
          />
        </div>
        <Button appName="web" className={styles.button}>
          Click me!
        </Button>
      </main>
    </LocalizationProvider>
  );
}
