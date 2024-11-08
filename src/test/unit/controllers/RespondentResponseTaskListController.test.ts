import RespondentResponseTaskListController from '../../../main/controllers/RespondentResponseTaskListController';
import { DefaultValues, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
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

  it('should render the Respondent Response Task List with sections for ET3', async () => {
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
      expect(section.title(request.t(DefaultValues.STRING_EMPTY))).toBe(
        expectedRespondentHubTestTaskList.sectionTitles[index]
      );
      expect(section.links).toHaveLength(expectedRespondentHubTestLinkTexts[index].length);
      section.links.forEach((link, linkIndex) => {
        // checking links
        expect(link.linkTxt).toBeInstanceOf(Function);
        expect(link.linkTxt(request.t(DefaultValues.STRING_EMPTY))).toBe(
          expectedRespondentHubTestLinkTexts[index][linkIndex]
        );
        // checking statuses
        expect(link.status).toBeInstanceOf(Function);
        expect(link.status(request.t(DefaultValues.STRING_EMPTY))).toBe(expectedRespondentHubTestStatuses[index]);
      });
    });
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
