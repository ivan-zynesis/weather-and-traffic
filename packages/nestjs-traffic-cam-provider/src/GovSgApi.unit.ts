import {GovSgApi} from "./GovSgApi";
import {LocalConsole} from "@repo/telemetry";

let api = new GovSgApi(new LocalConsole());

describe('GovSgApi', () => {
  it('should provide a time series query of TrafficCamData', async () => {
    const latest = await api.query();
    expect(latest.length).toBeGreaterThan(0);

    const lastTimestamp = latest[latest.length - 1]!.cursor;

    const next = await api.query(lastTimestamp);
    expect(next.length).toBeGreaterThan(0);

    // expect to 'desc' ordered
    const combined = latest.concat(next);
    combined.forEach(row => {
      expect(row).toStrictEqual({
        cameraId: expect.any(String),
        cursor: expect.any(String),
        image: {
          src: expect.stringMatching(/^(https?:\/\/).+\.(jpg|png)$/),
          metadata: {
            width: expect.any(Number),
            height: expect.any(Number),
            md5: expect.any(String),
          },
        },
        location: {
          lat: expect.any(Number),
          lng: expect.any(Number),
        },
      });
    });

    for (let i = 1; i < combined.length; i += 1) {
      const prevRow = new Date(combined[i - 1]!.cursor).getTime();
      const thisRow = new Date(combined[i ]!.cursor).getTime();
      expect(thisRow).toBeLessThanOrEqual(prevRow);
    }
  });
});
