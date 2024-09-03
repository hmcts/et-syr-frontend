import TypeOfOrganisationController from '../../../main/controllers/TypeOfOrganisationController';
import { TypeOfOrganisation } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('TypeOfOrganisationController', () => {
  let controller: TypeOfOrganisationController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let translationMock: Record<string, string>;

  beforeEach(() => {
    controller = new TypeOfOrganisationController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {
          respondents: [{ respondentName: 'Test Respondent' }],
        },
      },
    });

    translationMock = {
      individual: 'Individual',
      individualTextLabel: 'Please provide the individual’s name',
      limitedCompany: 'Limited Company',
      limitedCompanyTextLabel: 'Please provide the company registration number',
      partnership: 'Partnership',
      unincorporatedAssociation: 'Unincorporated association (such as a sports club)',
      other: 'Other',
    };

    // Mock translation function
    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);
  });

  it('should render the Type of Organisation page with the correct form content', async () => {
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TYPE_OF_ORGANISATION,
      expect.objectContaining({
        PageUrls,
        redirectUrl: expect.any(String),
        hideContactUs: true,
        languageParam: expect.any(String),
        form: expect.objectContaining({
          fields: expect.objectContaining({
            typeOfOrg: expect.objectContaining({
              classes: 'govuk-radios',
              id: 'typeOfOrg',
              type: 'radios',
              labelHidden: false,
              values: expect.arrayContaining([
                expect.objectContaining({
                  name: 'typeOfOrg',
                  label: expect.any(Function),
                  value: TypeOfOrganisation.INDIVIDUAL,
                  subFields: expect.objectContaining({
                    typeOfOrgDetail: expect.objectContaining({
                      id: 'typeOfOrgIndividualTxt',
                      name: 'typeOfOrgIndividualTxt',
                      type: 'text',
                      labelSize: 'normal',
                      label: expect.any(Function),
                      classes: 'govuk-text',
                      attributes: { maxLength: 20 },
                    }),
                  }),
                }),
                expect.objectContaining({
                  name: 'typeOfOrg',
                  label: expect.any(Function),
                  value: TypeOfOrganisation.LIMITED_COMPANY,
                  subFields: expect.objectContaining({
                    typeOfOrgDetail: expect.objectContaining({
                      id: 'typeOfOrgLimitedCompanyTxt',
                      name: 'typeOfOrgLimitedCompanyTxt',
                      type: 'text',
                      labelSize: 'normal',
                      label: expect.any(Function),
                      classes: 'govuk-text',
                      attributes: { maxLength: 8 },
                      validator: expect.any(Function),
                    }),
                  }),
                }),
              ]),
              validator: expect.any(Function),
            }),
          }),
          submit: submitButton,
          saveForLater: saveForLaterButton,
        }),
        userCase: request.session.userCase,
        sessionErrors: undefined,
      })
    );

    // Verify the label generation for individual type
    const renderMock = response.render as jest.Mock;
    const form = renderMock.mock.calls[0][1].form;
    const typeOfOrgValues = form.fields.typeOfOrg.values;

    expect(typeOfOrgValues[0].label(translationMock)).toBe(TypeOfOrganisation.INDIVIDUAL);
    expect(typeOfOrgValues[1].label(translationMock)).toBe(TypeOfOrganisation.LIMITED_COMPANY);
    expect(typeOfOrgValues[2].label(translationMock)).toBe(TypeOfOrganisation.PARTNERSHIP);
    expect(typeOfOrgValues[3].label(translationMock)).toBe(TypeOfOrganisation.UNINCORPORATED_ASSOCIATION);
    expect(typeOfOrgValues[4].label(translationMock)).toBe(TypeOfOrganisation.OTHER);

    // Verify the label generation of sub-fields for individual and limited company
    const individualSubFieldLabelFunction = form.fields.typeOfOrg.values[0].subFields.typeOfOrgDetail.label;
    expect(individualSubFieldLabelFunction(translationMock)).toBe('Please provide the individual’s name');

    const limitedCompanySubFieldLabelFunction = form.fields.typeOfOrg.values[1].subFields.typeOfOrgDetail.label;
    expect(limitedCompanySubFieldLabelFunction(translationMock)).toBe('Please provide the company registration number');
  });

  it('should handle the post method with valid data', async () => {
    request.body = {
      typeOfOrg: TypeOfOrganisation.LIMITED_COMPANY,
      typeOfOrgLimitedCompanyTxt: '12345678',
    };

    await controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_ADDRESS);
  });

  it('should use the correct translation keys', async () => {
    await controller.get(request, response);

    expect(request.t).toHaveBeenCalledWith(TranslationKeys.COMMON, { returnObjects: true });
    expect(request.t).toHaveBeenCalledWith(TranslationKeys.TYPE_OF_ORGANISATION, { returnObjects: true });
    expect(request.t).toHaveBeenCalledWith(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true });
  });
});
