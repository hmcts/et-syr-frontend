import { AppRequest } from '../../../../main/definitions/appRequest';
import { PageUrls, languages } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { getNextPage } from '../../../../main/helpers/controller/ContactTribunalSelectedControllerHelper';
import { mockRequest } from '../../mocks/mockRequest';

describe('Contact Tribunal Selected Controller Helper', () => {
  describe('getNextPage', () => {
    const request: AppRequest = mockRequest({});
    it('should return COPY_TO_OTHER_PARTY page for Type A/B applications when claimant is system user', () => {
      const nextPage = getNextPage(application.CHANGE_PERSONAL_DETAILS, request);
      expect(nextPage).toBe(PageUrls.COPY_TO_OTHER_PARTY + languages.ENGLISH_URL_PARAMETER);
    });

    it('should return CONTACT_TRIBUNAL_CYA page for Type C', () => {
      const nextPage = getNextPage(application.ORDER_WITNESS_ATTEND, request);
      expect(nextPage).toBe(PageUrls.CONTACT_TRIBUNAL_CYA + languages.ENGLISH_URL_PARAMETER);
    });
  });
});
