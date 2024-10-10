import TypeOfOrganisationController from '../../../main/controllers/TypeOfOrganisationController';
import { TypeOfOrganisation } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { createMockedUpdateET3ResponseWithET3FormFunction, mockFormError } from '../mocks/mockStaticFunctions';

describe('TypeOfOrganisationController', () => {
  let controller: TypeOfOrganisationController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let translationMock: Record<string, string>;
  const updateET3ResponseWithET3FormMock = jest.fn();
  beforeEach(() => {
    controller = new TypeOfOrganisationController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {
          typeOfOrg: TypeOfOrganisation.INDIVIDUAL,
        },
      },
    });
    ET3Util.updateET3ResponseWithET3Form = updateET3ResponseWithET3FormMock;
    translationMock = {
      individual: 'Individual',
      individualTextLabel: 'Provide more detail for individual',
      limitedCompany: 'Limited company',
      limitedCompanyTextLabel: 'Company registration number',
      partnership: 'Partnership',
      unincorporatedAssociation: 'Unincorporated association',
      other: 'Other',
    };

    // Mock the translation function
    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);
  });

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

  it('should handle the post method with valid data', async () => {
    updateET3ResponseWithET3FormMock.mockImplementation(
      createMockedUpdateET3ResponseWithET3FormFunction(
        PageUrls.RESPONDENT_ADDRESS,
        request,
        response,
        [],
        mockCaseWithIdWithRespondents
      )
    );
    await controller.post(request, response);
    expect(request.session.userCase).toEqual(mockCaseWithIdWithRespondents);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_ADDRESS);
  });

  it('should redirect back to Type of Organisation if ET3 data update fails', async () => {
    updateET3ResponseWithET3FormMock.mockImplementation(
      createMockedUpdateET3ResponseWithET3FormFunction(
        request.url,
        request,
        response,
        [mockFormError],
        mockCaseWithIdWithRespondents
      )
    );
    await controller.post(request, response);
    expect(request.session.errors).toEqual([mockFormError]);
    expect(response.redirect).toHaveBeenCalledWith(request.url);
  });
});
