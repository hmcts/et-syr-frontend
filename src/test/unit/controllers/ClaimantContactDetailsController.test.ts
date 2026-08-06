import ClaimantContactDetailsController from '../../../main/controllers/ClaimantContactDetailsController';
import { CaseType } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCase from '../mocks/mockUserCase';

describe('Claimant Contact Details Controller', () => {
  let controller: ClaimantContactDetailsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantContactDetailsController();
    request = mockRequest({});
    response = mockResponse();
    jest.clearAllMocks();
  });

  describe('GET method', () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);

    it('should render the page for a single claim with no group-claim fields', async () => {
      request.session.user = mockUserDetails;
      request.session.userCase = mockUserCase;
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_CONTACT_DETAILS,
        expect.objectContaining({
          isGroupClaim: false,
          additionalClaimantsSummaryLists: [],
          additionalClaimantsPdfUrl: undefined,
        })
      );
    });

    it('should pass isGroupClaim true for MULTIPLE caseType', async () => {
      request.session.user = mockUserDetails;
      request.session.userCase = { ...mockUserCase, caseType: CaseType.MULTIPLE };
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_CONTACT_DETAILS,
        expect.objectContaining({ isGroupClaim: true })
      );
    });

    it('should display claimants as summary lists when no PDF document is in documentCollection', async () => {
      request.session.user = mockUserDetails;
      request.session.userCase = {
        ...mockUserCase,
        caseType: CaseType.MULTIPLE,
        additionalClaimants: [
          { firstName: 'Jane', lastName: 'Smith' },
          { firstName: 'Bob', lastName: 'Jones' },
        ],
      };
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_CONTACT_DETAILS,
        expect.objectContaining({
          additionalClaimantsPdfUrl: undefined,
          additionalClaimantsSummaryLists: expect.arrayContaining([
            expect.objectContaining({ name: expect.any(String) }),
          ]),
        })
      );
    });

    it('should use pre-generated PDF URL when Claimant Contact Details PDF is in documentCollection', async () => {
      const pdfBinaryUrl = 'http://gateway/documents/pdf-uuid/binary';
      request.session.user = mockUserDetails;
      request.session.userCase = {
        ...mockUserCase,
        caseType: CaseType.MULTIPLE,
        additionalClaimants: Array.from({ length: 6 }, (_, i) => ({ firstName: `Claimant${i}`, lastName: 'Test' })),
        documentCollection: [
          {
            id: 'doc-1',
            value: {
              uploadedDocument: {
                document_url: 'http://gateway/documents/pdf-uuid',
                document_filename: 'Claimant Contact Details.pdf',
                document_binary_url: pdfBinaryUrl,
              },
            },
          },
        ],
      };
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_CONTACT_DETAILS,
        expect.objectContaining({
          additionalClaimantsPdfUrl: pdfBinaryUrl,
          additionalClaimantsSummaryLists: [],
        })
      );
    });

    it('should fall back to summary lists when no PDF document is found in documentCollection', async () => {
      request.session.user = mockUserDetails;
      request.session.userCase = {
        ...mockUserCase,
        caseType: CaseType.MULTIPLE,
        additionalClaimants: [
          { firstName: 'Jane', lastName: 'Smith' },
          { firstName: 'Bob', lastName: 'Jones' },
        ],
        documentCollection: [],
      };
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_CONTACT_DETAILS,
        expect.objectContaining({
          additionalClaimantsPdfUrl: undefined,
          additionalClaimantsSummaryLists: expect.arrayContaining([
            expect.objectContaining({ name: expect.any(String) }),
          ]),
        })
      );
    });
  });
});
