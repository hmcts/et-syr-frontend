import { getServiceUrl } from '../../../main/utils/getServiceUrl';

describe('getServiceUrl', () => {
  it('should build a service URL using the request hostname', () => {
    const req = {
      headers: {},
      hostname: 'et-syr.example',
      app: {
        locals: {
          developmentMode: false,
        },
      },
    } as never;

    expect(getServiceUrl(req, '/callback')).toBe('https://et-syr.example/callback');
  });

  it('should prefer the forwarded host and include the configured port in development', () => {
    const req = {
      headers: {
        'x-forwarded-host': 'forwarded.example',
      },
      hostname: 'et-syr.example',
      app: {
        locals: {
          developmentMode: true,
        },
      },
    } as never;

    expect(getServiceUrl(req)).toBe('https://forwarded.example:3003');
  });
});
