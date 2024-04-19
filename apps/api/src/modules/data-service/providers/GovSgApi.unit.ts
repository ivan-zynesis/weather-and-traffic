import { GovSgApi } from './GovSgApi';
import { LocalConsole } from '../../telemetry/providers/LocalConsole';
import { InMemoryCacheProvider } from '../../cache/providers/InMemory';

const api = new GovSgApi(new LocalConsole(), new InMemoryCacheProvider());

describe('GovSgApi', () => {
  it('should provide a time series query of TrafficCamData', async () => {
    const latest = await api.query();
    expect(latest.length).toBeGreaterThan(0);

    const lastTimestamp = latest[latest.length - 1]!.cursor;

    const next = await api.query(lastTimestamp);
    expect(next.length).toBeGreaterThan(0);

    // expect to 'desc' ordered
    const combined = latest.concat(next);
    combined.forEach((row) => {
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
      const thisRow = new Date(combined[i]!.cursor).getTime();
      expect(thisRow).toBeLessThanOrEqual(prevRow);
    }
  });

  it('should be able to get weather forecasts - without filter', async () => {
    const forecasts = await api.getForecasts();
    expect(forecasts).toStrictEqual({
      timestamp: expect.any(String),
      updateTimestamp: expect.any(String),
      validPeriod: {
        start: expect.any(String),
        end: expect.any(String),
      },
      forecasts: expect.any(Array),
    });

    forecasts.forecasts.forEach((forecast) => {
      expect(forecast).toStrictEqual({
        area: expect.any(String),
        forecast: expect.any(String),
      });
    });
  });

  it('should be able to get weather forecasts - with `date` filter', async () => {
    const forecasts = await api.getForecasts({
      date: '2024-04-19',
    });
    expect(forecasts).toStrictEqual({
      timestamp: expect.any(String),
      updateTimestamp: expect.any(String),
      validPeriod: {
        start: expect.any(String),
        end: expect.any(String),
      },
      forecasts: expect.any(Array),
    });
  });

  it('should be able to get weather forecasts - with `date_time` filter', async () => {
    const forecasts = await api.getForecasts({
      date_time: '2024-04-19T13:34:54',
    });
    expect(forecasts).toStrictEqual({
      timestamp: expect.any(String),
      updateTimestamp: expect.any(String),
      validPeriod: {
        start: expect.any(String),
        end: expect.any(String),
      },
      forecasts: expect.any(Array),
    });
  });

  it('should be able to get area metadata', async () => {
    const areaMetadata = await api.getAreaMetadata();
    areaMetadata.forEach((area) => {
      expect(area).toStrictEqual({
        name: expect.any(String),
        labelLocation: {
          lat: expect.any(Number),
          lng: expect.any(Number),
        },
      });
    });
  });
});
