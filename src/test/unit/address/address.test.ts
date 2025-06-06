import axios from 'axios';

import { getAddressesForPostcode } from '../../../main/address';
import { emptyPostcodeResponse, validPostcodeResponse } from '../mocks/mockPostcodeResponses';
import { expectedGetAddressForPostCodeResponse } from '../mocks/mockedAddressLookupResponse';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Address Test', () => {
  it('should return addresses for a given postcode', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: validPostcodeResponse });

    const actual = await getAddressesForPostcode('EX44PN');

    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.os.uk/search/places/v1/postcode', {
      headers: { accept: 'application/json' },
      params: { key: expect.any(String), postcode: 'EX44PN' },
    });

    expect(actual).toEqual(expectedGetAddressForPostCodeResponse);
  });

  it('should return no results when not found', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: emptyPostcodeResponse });
    const actual = await getAddressesForPostcode('EX13DJ');
    expect(actual).toEqual([]);
  });
});
