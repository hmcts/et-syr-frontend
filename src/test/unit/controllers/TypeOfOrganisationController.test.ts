import TypeOfOrganisationController from '../../../main/controllers/TypeOfOrganisationController';
import { TypeOfOrganisation } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/type-of-organisation.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('Type of organisation Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: TypeOfOrganisationController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  let translationMock: Record<string, string>;

  beforeEach(() => {
    controller = new TypeOfOrganisationController();
    request = mockRequest({});
    response = mockResponse();

    translationMock = {
      individual: 'Individual',
      individualTextLabel: 'Provide more detail for individual',
      limitedCompany: 'Limited company',
      limitedCompanyTextLabel: 'Company registration number',
      partnership: 'Partnership',
      unincorporatedAssociation: 'Unincorporated association',
      other: 'Other',
    };
  });

  describe('GET method', () => {
    it('should render the Type of Organisation page with the correct form content', async () => {
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.TYPE_OF_ORGANISATION, expect.anything());

      // Test the labels for each option
      const renderMock = response.render as jest.Mock;
      const form = renderMock.mock.calls[0][1].form;

      // Test the main options and subfield labels
      expect(form.fields.et3ResponseRespondentEmployerType.values[0].label(translationMock)).toBe('Individual');
      expect(
        form.fields.et3ResponseRespondentEmployerType.values[0].subFields.et3ResponseRespondentPreferredTitle.label(
          translationMock
        )
      ).toBe('Provide more detail for individual');
      expect(form.fields.et3ResponseRespondentEmployerType.values[1].label(translationMock)).toBe('Limited company');
      expect(
        form.fields.et3ResponseRespondentEmployerType.values[1].subFields.et3ResponseRespondentCompanyNumber.label(
          translationMock
        )
      ).toBe('Company registration number');
      expect(form.fields.et3ResponseRespondentEmployerType.values[2].label(translationMock)).toBe('Partnership');
      expect(form.fields.et3ResponseRespondentEmployerType.values[3].label(translationMock)).toBe(
        'Unincorporated association'
      );
      expect(form.fields.et3ResponseRespondentEmployerType.values[4].label(translationMock)).toBe('Other');
    });

    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.TYPE_OF_ORGANISATION, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when yes is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseRespondentEmployerType: TypeOfOrganisation.INDIVIDUAL,
        },
      });
      request.url = PageUrls.TYPE_OF_ORGANISATION;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_ADDRESS);
    });

    it('should redirect to next page when no is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseRespondentEmployerType: TypeOfOrganisation.OTHER,
        },
      });
      request.url = PageUrls.TYPE_OF_ORGANISATION;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_ADDRESS);
    });
  });
});
