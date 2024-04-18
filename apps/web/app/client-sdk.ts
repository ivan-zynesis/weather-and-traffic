import {Configuration, StatusApi, TrafficCamApi} from "@repo/generated-api-client";

/**
 * TODO: improvement
 * Updating of this class can be automated by watching `generated-api-client` package changes
 */
export class Sdk {
  readonly status: StatusApi;
  readonly trafficCam: TrafficCamApi;

  constructor(config: Configuration) {
    this.status = new StatusApi(config);
    this.trafficCam = new TrafficCamApi(config);
  }
}

const config = new Configuration({
  basePath: "http://localhost:3001",
});

/**
 * This should a hook that depending on authenticated user context
 * a simplified version since no auth implemented in this assignment
 */
export function useSdk(): Sdk {
  return new Sdk(config);
}
