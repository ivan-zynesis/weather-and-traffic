import { GoogleReverseReverseGeocoding } from './GoogleApiReverseGeocoding';
import { ConfigService } from '@nestjs/config';
import { InMemoryCacheProvider } from '../../cache/providers/InMemory';

const reverseGeoLocation = new GoogleReverseReverseGeocoding(
  {
    get: () => 'AIzaSyDqEq4xCBO38OlE6Qb4P899YjusQs3U2Qc',
  } as any as ConfigService,
  new InMemoryCacheProvider(),
);

// api key has limited free tier usage
describe.skip('GoogleApiReverseGeocoding', () => {
  it.each([
    { lat: 1.29531332, lng: 103.871146, expectation: 'Kallang' },
    { lat: 1.319541067, lng: 103.8785627, expectation: 'Geylang' },
    { lat: 1.363519886, lng: 103.905394, expectation: 'Paya Lebar' },
    {
      lat: 1.27066408655104,
      lng: 103.856977943394,
      expectation: 'Straits View',
    },
  ])('$expectation', async (test) => {
    expect(
      await reverseGeoLocation.lookup({
        lat: test.lat,
        lng: test.lng,
      }),
    ).toStrictEqual(test.expectation);
  });
});
