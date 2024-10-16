import * as app from '../../../main/address/index';
import RespondentSelectPostCodeController from '../../../main/controllers/RespondentSelectPostCodeController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { ET3HubLinkNames, LinkStatus } from '../../../main/definitions/links';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { addressLookupResponse } from '../mocks/mockedAddressLookupResponse';

describe('RespondentSelectPostCodeController', () => {
  let controller: RespondentSelectPostCodeController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let translationMock: Record<string, string>;
  const updateET3DataMock = jest.fn();
  beforeEach(() => {
    jest.spyOn(app, 'getAddressesForPostcode').mockImplementation(() => Promise.resolve(addressLookupResponse));
    controller = new RespondentSelectPostCodeController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: mockCaseWithIdWithRespondents,
      },
    });
    request.session.userCase.respondentAddresses = [
      {
        street1: 'street1',
        street2: 'street2',
        town: 'town',
        country: 'country',
        postcode: 'postcode',
      },
    ];
    translationMock = {
      selectAddress: 'Select an address',
    };
    ET3Util.updateET3Data = updateET3DataMock;

    // Mock translation function
    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);
  });

  describe('GET method', () => {
    it('should render the Respondent Select Post Code page with the correct form content', async () => {
      request.session.userCase.responseRespondentAddressPostCode = 'TEST POSTCODE';
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_SELECT_POST_CODE, expect.anything());

      // Verify that the label function returns the correct value
      const renderMock = response.render as jest.Mock;
      const form = renderMock.mock.calls[0][1].form;

      expect(form.fields.respondentAddressTypes.label(translationMock)).toBe('Select an address');
    });
  });

  describe('POST method', () => {
    it('should handle the post method with valid data', async () => {
      request.body = {
        respondentAddressTypes: '0',
      };
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);

      // Ensure request object responseRespondentAddress fields are correctly filled
      request.session.userCase.responseRespondentAddressLine1 = request.session.userCase.respondentAddresses[0].street1;
      request.session.userCase.responseRespondentAddressLine2 = request.session.userCase.respondentAddresses[0].street2;
      request.session.userCase.responseRespondentAddressPostTown = request.session.userCase.respondentAddresses[0].town;
      request.session.userCase.responseRespondentAddressCountry =
        request.session.userCase.respondentAddresses[0].country;
      request.session.userCase.responseRespondentAddressPostCode =
        request.session.userCase.respondentAddresses[0].postcode;
      // Ensure updateET3Data is called correctly
      expect(updateET3DataMock).toHaveBeenCalledWith(request, ET3HubLinkNames.ContactDetails, LinkStatus.IN_PROGRESS);
    });
  });

  it('should have session error when respondent address not found', async () => {
    request.body = {
      respondentAddressTypes: '1',
    };
    await controller.post(request, response);

    // Ensure session has errors
    expect(request.session.errors).toHaveLength(1);
    // Ensure page is redirected to itself correctly
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_SELECT_POST_CODE);
  });

  it('should have session error with invalid data', async () => {
    request.body = {
      respondentAddressTypes: undefined,
    };
    await controller.post(request, response);

    // Ensure session has errors
    expect(request.session.errors).toHaveLength(1);
    // Ensure page is redirected to itself correctly
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_SELECT_POST_CODE);
  });
});
