import request from 'supertest';

import { mockApp } from '../unit/mocks/mockApp';

describe('Info page', () => {
  describe('on GET', () => {
    test('should return sample info page', async () => {
      await request(mockApp({}))
        .get('/info')
        .expect(res => expect(res.status).toStrictEqual(200));
    });

    test('should reject request with 415 when Content-Encoding is br (CVE-2026-111497 mitigation)', async () => {
      await request(mockApp({}))
        .post('/info')
        .set('Content-Encoding', 'br')
        .send('payload')
        .expect(res => expect(res.status).toStrictEqual(415));
    });
  });
});
