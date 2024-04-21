"use client";

interface Props {
  containerClassName?: string;
  spanClassName?: string;
  queryState: "IDLE" | "ERROR" | "LOADING";
  data: {
    area: string;
    forecast: string;
  } | null;
}

export const WeatherBox = ({
  containerClassName,
  spanClassName,
  data,
  queryState,
}: Props) => {
  let area: string;
  let forecast: string;

  if (queryState === "LOADING") {
    area = "Loading...";
    forecast = "Loading...";
  } else if (queryState === "ERROR") {
    area = "Failed to locate coordinate";
    forecast = "Failed to get forecast";
  } else {
    area = data?.area ?? "Unknown";
    forecast = data?.forecast ?? "Unknown";
  }

  return (
    <div className={containerClassName}>
      <span className={spanClassName}>
        {area}
        <br />
        {forecast}
      </span>
    </div>
  );
};
