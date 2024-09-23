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
          typeOfOrg: TypeOfOrganisation.INDIVIDUAL,
        },
      },
    });

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
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TYPE_OF_ORGANISATION,
      expect.objectContaining({
        PageUrls: expect.any(Object), // This will match any object for PageUrls
        form: expect.objectContaining({
          fields: expect.objectContaining({
            typeOfOrg: expect.objectContaining({
              classes: 'govuk-radios',
              id: 'typeOfOrg',
              labelHidden: false,
              type: 'radios',
              validator: expect.any(Function), // Match any function for the validator
              values: expect.arrayContaining([
                expect.objectContaining({
                  label: expect.any(Function), // Label function for 'Individual'
                  name: 'typeOfOrg',
                  value: 'Individual',
                  subFields: expect.objectContaining({
                    typeOfOrgIndividualDetail: expect.objectContaining({
                      attributes: { maxLength: 20 },
                      id: 'typeOfOrgIndividualDetail',
                      label: expect.any(Function), // Label function for individual detail
                      name: 'typeOfOrgIndividualDetail',
                      type: 'text',
                    }),
                  }),
                }),
                expect.objectContaining({
                  label: expect.any(Function), // Label function for 'Limited Company'
                  name: 'typeOfOrg',
                  value: 'Limited Company',
                  subFields: expect.objectContaining({
                    typeOfOrgCRNDetail: expect.objectContaining({
                      attributes: { maxLength: 8 },
                      id: 'typeOfOrgCRNDetail',
                      label: expect.any(Function), // Label function for CRN detail
                      name: 'typeOfOrgCRNDetail',
                      type: 'text',
                      validator: expect.any(Function), // Validator function for CRN
                    }),
                  }),
                }),
                expect.objectContaining({
                  label: expect.any(Function), // Label function for 'Partnership'
                  name: 'typeOfOrg',
                  value: 'Partnership',
                }),
                expect.objectContaining({
                  label: expect.any(Function), // Label function for 'Unincorporated association'
                  name: 'typeOfOrg',
                  value: 'Unincorporated association (such as a sports club)',
                }),
                expect.objectContaining({
                  label: expect.any(Function), // Label function for 'Other'
                  name: 'typeOfOrg',
                  value: 'Other',
                }),
              ]),
            }),
          }),
          submit: submitButton,
          saveForLater: saveForLaterButton,
        }),
        hideContactUs: true,
        redirectUrl: expect.any(String), // Match any string for redirectUrl
        sessionErrors: expect.any(Array), // Match any array for sessionErrors
        userCase: expect.objectContaining({
          typeOfOrg: 'Individual',
        }),
      })
    );

    // Test the labels for each option
    const renderMock = response.render as jest.Mock;
    const form = renderMock.mock.calls[0][1].form;

    // Test the main options and subfield labels
    expect(form.fields.typeOfOrg.values[0].label(translationMock)).toBe('Individual');
    expect(form.fields.typeOfOrg.values[0].subFields.typeOfOrgIndividualDetail.label(translationMock)).toBe(
      'Provide more detail for individual'
    );
    expect(form.fields.typeOfOrg.values[1].label(translationMock)).toBe('Limited company');
    expect(form.fields.typeOfOrg.values[1].subFields.typeOfOrgCRNDetail.label(translationMock)).toBe(
      'Company registration number'
    );
    expect(form.fields.typeOfOrg.values[2].label(translationMock)).toBe('Partnership');
    expect(form.fields.typeOfOrg.values[3].label(translationMock)).toBe('Unincorporated association');
    expect(form.fields.typeOfOrg.values[4].label(translationMock)).toBe('Other');
  });

  it('should handle the post method with valid data', async () => {
    request.body = {
      typeOfOrg: TypeOfOrganisation.INDIVIDUAL,
    };

    await controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_ADDRESS);
  });
});
