import TypeOfOrganisationController from '../../../main/controllers/TypeOfOrganisationController';
import { TypeOfOrganisation } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
jest.mock('../../../main/modules/featureFlag/launchDarkly');

describe('TypeOfOrganisationController', () => {
  const mockWelshFlag = jest.spyOn(LaunchDarkly, 'getFlagValue');

  beforeEach(() => {
    mockWelshFlag.mockClear();
  });

  it('should render the Type of Organisation page with the correct content', async () => {
    const controller = new TypeOfOrganisationController();
    const response = mockResponse();
    const request = mockRequest({});

    // Define the expected return type for the request.t() mock, values to match those within TypeOfOrganisation
    // Two text labels to mock the inner labels of text fields
    const translationMock = {
      individual: 'Individual',
      limitedCompany: 'Limited Company',
      partnership: 'Partnership',
      unincorporatedAssociation: 'Unincorporated association (such as a sports club)',
      other: 'Other',

      // mock inner text field labels
      individualTextLabel: 'Title',
      limitedCompanyTextLabel: 'Company Registration Number',
    } as const; // 'as const' to maintain the exact shape of the object

    // Mock the translation function
    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);

    mockWelshFlag.mockResolvedValue(true);

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TYPE_OF_ORGANISATION,
      expect.objectContaining({
        form: expect.objectContaining({
          fields: expect.objectContaining({
            typeOfOrg: expect.objectContaining({
              values: expect.arrayContaining([
                expect.objectContaining({
                  label: expect.any(Function),
                  value: 'Individual',
                }),
                expect.objectContaining({
                  label: expect.any(Function),
                  value: 'Limited Company',
                }),
                expect.objectContaining({
                  label: expect.any(Function),
                  value: 'Partnership',
                }),
                expect.objectContaining({
                  label: expect.any(Function),
                  value: 'Unincorporated association (such as a sports club)',
                }),
                expect.objectContaining({
                  label: expect.any(Function),
                  value: 'Other',
                }),
              ]),
            }),
          }),
        }),
        PageUrls: expect.any(Object),
        hideContactUs: true,
        languageParam: expect.any(String),
        redirectUrl: expect.any(String),
        welshEnabled: true,
      })
    );

    // Explicitly invoking each label function and checking their outputs
    const form = (response.render as jest.Mock).mock.calls[0][1].form;

    const typeOfOrgValues = form.fields.typeOfOrg.values;

    expect(typeOfOrgValues[0].label(translationMock)).toBe(TypeOfOrganisation.INDIVIDUAL);
    expect(typeOfOrgValues[1].label(translationMock)).toBe(TypeOfOrganisation.LIMITED_COMPANY);
    expect(typeOfOrgValues[2].label(translationMock)).toBe(TypeOfOrganisation.PARTNERSHIP);
    expect(typeOfOrgValues[3].label(translationMock)).toBe(TypeOfOrganisation.UNINCORPORATED_ASSOCIATION);
    expect(typeOfOrgValues[4].label(translationMock)).toBe(TypeOfOrganisation.OTHER);

    // Inner label for Individual Title
    const individualSubFields = typeOfOrgValues[0].subFields;
    const individualSubFieldsTypeOfOrgDetail = individualSubFields.typeOfOrgDetail;
    expect(individualSubFieldsTypeOfOrgDetail.label(translationMock)).toBe('Title');

    // Inner label for Limited Company (CRN)
    const limitedCompanySubFields = typeOfOrgValues[1].subFields;
    const typeOfOrgDetail = limitedCompanySubFields.typeOfOrgDetail;
    expect(typeOfOrgDetail.label(translationMock)).toBe('Company Registration Number');
  });

  it('should render the Type of Organisation page with Welsh disabled', async () => {
    mockWelshFlag.mockResolvedValue(false);
    const controller = new TypeOfOrganisationController();
    const response = mockResponse();
    const request = mockRequest({});

    // Mock the translation function
    (request.t as unknown as jest.Mock) = jest.fn().mockReturnValue({
      individual: 'Individual',
      limitedCompany: 'Limited Company',
      partnership: 'Partnership',
      unincorporatedAssociation: 'Unincorporated Association',
      other: 'Other',
    });

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TYPE_OF_ORGANISATION,
      expect.objectContaining({
        welshEnabled: false,
      })
    );
  });

  it('should call the translation function with correct keys', async () => {
    mockWelshFlag.mockResolvedValue(true);
    const controller = new TypeOfOrganisationController();
    const response = mockResponse();
    const request = mockRequest({});

    // Mock the translation function
    (request.t as unknown as jest.Mock) = jest.fn().mockReturnValue({});

    await controller.get(request, response);

    expect(request.t).toHaveBeenCalledWith(TranslationKeys.COMMON, { returnObjects: true });
    expect(request.t).toHaveBeenCalledWith(TranslationKeys.TYPE_OF_ORGANISATION, { returnObjects: true });
    expect(request.t).toHaveBeenCalledWith(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true });
  });
});
