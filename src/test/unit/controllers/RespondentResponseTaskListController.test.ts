import RespondentResponseTaskListController from '../../../main/controllers/RespondentResponseTaskListController';
import { CaseTypeId } from '../../../main/definitions/case';
import { DefaultValues, PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { CuiYourSupportFeature } from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCaseComplete from '../mocks/mockUserCaseComplete';
import {
  expectedRespondentHubTestLinkTexts,
  expectedRespondentHubTestStatuses,
  expectedRespondentHubTestTaskList,
  mockRespondentHubTranslations,
  sectionTitleTranslationKeys,
  subSectionTitleTranslationKeys,
} from '../test-helpers/test.constants';

// Define interfaces for sections and links
interface Link {
  url: () => string;
  linkTxt: (l: any) => string; // Change `never` to `any`
  status: (l: any) => string;
}

interface Section {
  title: (l: any) => string; // Change `never` to `any`
  links: Link[];
}

describe('Respondent response task list controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  const mockWelshFlag = jest.spyOn(LaunchDarkly, 'getFlagValue');

  beforeEach(() => {
    mockLdClient.mockClear();
    mockWelshFlag.mockClear();
    jest.spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature').mockReturnValue(new CuiYourSupportFeature([]));
  });

  it('should render the Respondent Response Task List with sections for ET3 with employer contract claim section', async () => {
    mockWelshFlag.mockResolvedValue(true);
    const controller = new RespondentResponseTaskListController();
    const response = mockResponse();
    const request = mockRequest({ session: { userCase: mockUserCaseComplete, user: mockUserDetails } });
    request.session.selectedRespondentIndex = 0;
    // Mock the translation function to return valid section data
    (request.t as unknown as jest.Mock).mockReturnValue(mockRespondentHubTranslations);
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST,
      expect.objectContaining({
        PageUrls,
        hideContactUs: true,
        sections: expect.any(Array),
        welshEnabled: true,
        languageParam: expect.any(String),
        redirectUrl: expect.any(String),
      })
    );
    const renderMock = response.render as jest.Mock;
    const sections: Section[] = renderMock.mock.calls[0][1].sections;
    expect(sections).toHaveLength(4);
    sections.forEach((section, index) => {
      // Checking titles
      expect(section.title).toBeInstanceOf(Function);
      expect(section.title(request.t(sectionTitleTranslationKeys[index]))).toBe(
        expectedRespondentHubTestTaskList.sectionTitles[index]
      );
      expect(section.links).toHaveLength(expectedRespondentHubTestLinkTexts[index].length);
      section.links.forEach((link, linkIndex) => {
        // checking links
        expect(link.linkTxt).toBeInstanceOf(Function);
        expect(link.linkTxt(request.t(subSectionTitleTranslationKeys[index][linkIndex]))).toBe(
          expectedRespondentHubTestLinkTexts[index][linkIndex]
        );
        // checking statuses
        expect(link.status).toBeInstanceOf(Function);
        expect(link.status(request.t(DefaultValues.STRING_EMPTY))).toBe(
          expectedRespondentHubTestStatuses[index][linkIndex]
        );
      });
    });
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST,
      expect.objectContaining({
        PageUrls,
        hideContactUs: true,
        sections: expect.any(Array),
        welshEnabled: true,
        languageParam: expect.any(String),
        redirectUrl: expect.any(String),
      })
    );
  });
  it('should render the Respondent Response Task List with sections for ET3 when req.url contains welsh url parameter', async () => {
    mockWelshFlag.mockResolvedValue(true);
    const controller = new RespondentResponseTaskListController();
    const response = mockResponse();
    const request = mockRequest({ session: { userCase: mockUserCaseComplete, user: mockUserDetails } });
    request.session.selectedRespondentIndex = 0;
    request.url = '/respondent-response-task-list' + languages.WELSH_URL_PARAMETER;
    // Mock the translation function to return valid section data
    (request.t as unknown as jest.Mock).mockReturnValue(mockRespondentHubTranslations);
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST, expect.anything());
  });
  it('should handle when Welsh language feature flag is disabled', async () => {
    mockWelshFlag.mockResolvedValue(false);
    const controller = new RespondentResponseTaskListController();
    const response = mockResponse();
    const request = mockRequest({ session: { userCase: mockUserCaseComplete, user: mockUserDetails } });
    request.session.selectedRespondentIndex = 0;
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST,
      expect.objectContaining({
        welshEnabled: false,
      })
    );
  });

  it('should use the correct translation keys', async () => {
    mockWelshFlag.mockResolvedValue(true);
    const controller = new RespondentResponseTaskListController();
    const response = mockResponse();
    const request = mockRequest({ session: { userCase: mockUserCaseComplete, user: mockUserDetails } });
    request.session.selectedRespondentIndex = 0;
    await controller.get(request, response);

    expect(request.t).toHaveBeenCalledWith(TranslationKeys.COMMON, { returnObjects: true });
    expect(request.t).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST, { returnObjects: true });
    expect(request.t).toHaveBeenCalledWith(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true });
  });

  it('should not show Your Support by default when CUI Your Support is disabled', async () => {
    mockWelshFlag.mockResolvedValue(true);
    const controller = new RespondentResponseTaskListController();
    const response = mockResponse();
    const request = mockRequest({ session: { userCase: mockUserCaseComplete, user: mockUserDetails } });
    request.session.selectedRespondentIndex = 0;
    (request.t as unknown as jest.Mock).mockReturnValue(mockRespondentHubTranslations);

    await controller.get(request, response);

    const renderMock = response.render as jest.Mock;
    const sections: Section[] = renderMock.mock.calls[0][1].sections;
    const yourSupportLink = sections[0].links.find(
      link => link.linkTxt(mockRespondentHubTranslations) === 'Your Support'
    );

    expect(yourSupportLink).toBeUndefined();
  });

  it('should show Your Support as submitted when respondent external flags exist and Scotland is enabled', async () => {
    jest
      .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
      .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
    mockWelshFlag.mockResolvedValue(true);
    const controller = new RespondentResponseTaskListController();
    const response = mockResponse();
    const request = mockRequest({
      session: {
        userCase: {
          ...mockUserCaseComplete,
          caseTypeId: CaseTypeId.SCOTLAND,
          respondentExternalFlags: {
            details: [
              {
                id: 'flag-1',
                value: {},
              },
            ],
          },
        },
        user: mockUserDetails,
      },
    });
    request.session.selectedRespondentIndex = 0;
    (request.t as unknown as jest.Mock).mockReturnValue(mockRespondentHubTranslations);

    await controller.get(request, response);

    const renderMock = response.render as jest.Mock;
    const sections: Section[] = renderMock.mock.calls[0][1].sections;
    const yourSupportLink = sections[0].links.find(
      link => link.linkTxt(mockRespondentHubTranslations) === 'Your Support'
    );

    expect(yourSupportLink.status(mockRespondentHubTranslations)).toBe('Submitted');
    expect(yourSupportLink.url()).toBe(PageUrls.YOUR_SUPPORT);
  });

  it('should preserve the Welsh language parameter on the Your Support task when Scotland is enabled', async () => {
    jest
      .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
      .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
    mockWelshFlag.mockResolvedValue(true);
    const controller = new RespondentResponseTaskListController();
    const response = mockResponse();
    const request = mockRequest({
      session: {
        userCase: {
          ...mockUserCaseComplete,
          caseTypeId: CaseTypeId.SCOTLAND,
        },
        user: mockUserDetails,
      },
    });
    request.session.selectedRespondentIndex = 0;
    request.url = PageUrls.RESPONDENT_RESPONSE_TASK_LIST + languages.WELSH_URL_PARAMETER;
    (request.t as unknown as jest.Mock).mockReturnValue(mockRespondentHubTranslations);

    await controller.get(request, response);

    const renderMock = response.render as jest.Mock;
    const sections: Section[] = renderMock.mock.calls[0][1].sections;
    const yourSupportLink = sections[0].links.find(
      link => link.linkTxt(mockRespondentHubTranslations) === 'Your Support'
    );

    expect(yourSupportLink.url()).toBe(PageUrls.YOUR_SUPPORT + languages.WELSH_URL_PARAMETER);
  });
});
