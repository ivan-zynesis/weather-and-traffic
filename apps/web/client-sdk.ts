import {Configuration, StatusApi} from "@repo/client-sdk";

export class Sdk {
  readonly status: StatusApi

  constructor(config: Configuration) {
    this.status = new StatusApi(config);
  }
}

const config = new Configuration({
  basePath: 'http://localhost:3001',
  baseOptions: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});

/**
 * This should a hook that depending on authenticated user context
 * a simplified version since no auth implemented in this assignment
 */
export function useSdk(): Sdk {
  return new Sdk(config);
}
