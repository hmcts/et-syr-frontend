import RespondentResponseTaskListController from '../../../main/controllers/RespondentResponseTaskListController';
import { CLAIM_TYPES, DefaultValues, PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCaseComplete from '../mocks/mockUserCaseComplete';
import {
  expectedRespondentHubTestLinkTextsWithBreachOfContract,
  expectedRespondentHubTestLinkTextsWithoutBreachOfContract,
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
  });

  it('should render the Respondent Response Task List with sections for ET3 with employer contract claim section when type of claims include breach of contract', async () => {
    mockWelshFlag.mockResolvedValue(true);
    const controller = new RespondentResponseTaskListController();
    const response = mockResponse();
    const request = mockRequest({ session: { userCase: mockUserCaseComplete, user: mockUserDetails } });
    request.session.userCase.typeOfClaim.push(CLAIM_TYPES.BREACH_OF_CONTRACT);
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
      expect(section.links).toHaveLength(expectedRespondentHubTestLinkTextsWithBreachOfContract[index].length);
      section.links.forEach((link, linkIndex) => {
        // checking links
        expect(link.linkTxt).toBeInstanceOf(Function);
        expect(link.linkTxt(request.t(subSectionTitleTranslationKeys[index][linkIndex]))).toBe(
          expectedRespondentHubTestLinkTextsWithBreachOfContract[index][linkIndex]
        );
        // checking statuses
        expect(link.status).toBeInstanceOf(Function);
        expect(link.status(request.t(DefaultValues.STRING_EMPTY))).toBe(expectedRespondentHubTestStatuses[index]);
      });
    });
  });

  it('should render the Respondent Response Task List with sections for ET3 without employer contract claim section when type of claims not include breach of contract', async () => {
    mockWelshFlag.mockResolvedValue(true);
    const controller = new RespondentResponseTaskListController();
    const response = mockResponse();
    const request = mockRequest({ session: { userCase: mockUserCaseComplete, user: mockUserDetails } });
    request.session.userCase.typeOfClaim = [TypesOfClaim.DISCRIMINATION];
    request.session.selectedRespondentIndex = 0;
    // Mock the translation function to return valid section data
    (request.t as unknown as jest.Mock).mockReturnValue(mockRespondentHubTranslations);
    await controller.get(request, response);
    const renderMock = response.render as jest.Mock;
    const sections: Section[] = renderMock.mock.calls[0][1].sections;
    expect(sections).toHaveLength(4);
    sections.forEach((section, index) => {
      // Checking titles
      expect(section.title).toBeInstanceOf(Function);
      expect(section.title(request.t(sectionTitleTranslationKeys[index]))).toBe(
        expectedRespondentHubTestTaskList.sectionTitles[index]
      );
      expect(section.links).toHaveLength(expectedRespondentHubTestLinkTextsWithoutBreachOfContract[index].length);
      section.links.forEach((link, linkIndex) => {
        // checking links
        expect(link.linkTxt).toBeInstanceOf(Function);
        expect(link.linkTxt(request.t(subSectionTitleTranslationKeys[index][linkIndex]))).toBe(
          expectedRespondentHubTestLinkTextsWithoutBreachOfContract[index][linkIndex]
        );
        // checking statuses
        expect(link.status).toBeInstanceOf(Function);
        expect(link.status(request.t(DefaultValues.STRING_EMPTY))).toBe(expectedRespondentHubTestStatuses[index]);
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
});
