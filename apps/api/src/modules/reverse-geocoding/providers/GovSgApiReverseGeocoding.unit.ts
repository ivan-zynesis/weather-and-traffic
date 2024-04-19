import { LocalConsole } from '../../telemetry/providers/LocalConsole';
import { InMemoryCacheProvider } from '../../cache/providers/InMemory';
import { GovSgApiReverseGeocoding } from './GovSgApiReverseGeocoding';
import { GovSgApi } from '../../data-service/providers/GovSgApi';

const reverseGeoLocation = new GovSgApiReverseGeocoding(
  new GovSgApi(new LocalConsole(), new InMemoryCacheProvider()),
);

describe('GovSgApiReverseGeocoding', () => {
  it.each([
    { lat: 1.29531332, lng: 103.871146, expectation: 'Marine Parade' },
    { lat: 1.319541067, lng: 103.8785627, expectation: 'Geylang' },
    { lat: 1.363519886, lng: 103.905394, expectation: 'Paya Lebar' },
    { lat: 1.27066408655104, lng: 103.856977943394, expectation: 'City' },
  ])('$expectation', async (test) => {
    expect(
      await reverseGeoLocation.lookup({
        lat: test.lat,
        lng: test.lng,
      }),
    ).toStrictEqual(test.expectation);
  });
});
