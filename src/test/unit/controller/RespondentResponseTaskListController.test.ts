import RespondentResponseTaskListController from '../../../main/controllers/RespondentResponseTaskListController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { sectionStatus } from '../../../main/definitions/definition';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

// Define interfaces for sections and links
interface Link {
  url: () => string;
  linkTxt: (l: never) => string;
  status: () => string;
}

interface Section {
  title: (l: never) => string;
  links: Link[];
}

describe('Respondent Response Task List controller', () => {
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
    const request = mockRequest({});

    // Mock the translation function to return valid section data
    (request.t as unknown as jest.Mock).mockReturnValue({
      section1: { title: 'Section 1 Title', link1Text: 'Link 1 Text', link2Text: 'Link 2 Text' },
      section2: { title: 'Section 2 Title', link1Text: 'Link 3 Text', link2Text: 'Link 4 Text' },
      section3: { title: 'Section 3 Title', link1Text: 'Link 5 Text' },
      section4: { title: 'Section 4 Title', link1Text: 'Link 6 Text' },
    });

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

    // Assert the sections length, 4 sections within the screen
    expect(sections).toHaveLength(4);

    // Test each section and its data
    const expectedTitles = ['Section 1 Title', 'Section 2 Title', 'Section 3 Title', 'Section 4 Title'];

    const expectedLinkTexts = [
      ['Link 1 Text', 'Link 2 Text'],
      ['Link 3 Text', 'Link 4 Text'],
      ['Link 5 Text'],
      ['Link 6 Text'],
    ];

    // only test first 3 sections as the final has a different status on initial set up (cannotStartYet)
    sections.slice(0, 3).forEach((section, index) => {
      // Check section title
      expect(section.title).toBeInstanceOf(Function);
      expect(section.title(request.t('respondentResponseTaskList'))).toBe(expectedTitles[index]);

      // Check links
      expect(section.links).toHaveLength(expectedLinkTexts[index].length);

      section.links.forEach((link, linkIndex) => {
        expect(link.linkTxt).toBeInstanceOf(Function);
        expect(link.linkTxt(request.t('respondentResponseTaskList'))).toBe(expectedLinkTexts[index][linkIndex]);
        expect(link.status).toBeInstanceOf(Function);
        expect(link.status()).toBe(sectionStatus.notStarted);
      });
    });

    /** Handle last section separately (section 4) as this is 'cannotStartYet' until others are complete,
     *  this will need to be tested under the future call */
    const lastSectionIndex = 3;
    expect(sections[lastSectionIndex].title).toBeInstanceOf(Function);
    expect(sections[lastSectionIndex].title(request.t('respondentResponseTaskList'))).toBe(
      expectedTitles[lastSectionIndex]
    );
    expect(sections[lastSectionIndex].links).toHaveLength(expectedLinkTexts[lastSectionIndex].length);

    const lastLink = sections[lastSectionIndex].links[0];
    expect(lastLink.linkTxt).toBeInstanceOf(Function);
    expect(lastLink.linkTxt(request.t('respondentResponseTaskList'))).toBe(expectedLinkTexts[lastSectionIndex][0]);
    expect(lastLink.status()).toBe(sectionStatus.cannotStartYet);
  });

  it('should handle when Welsh language feature flag is disabled', async () => {
    mockWelshFlag.mockResolvedValue(false);
    const controller = new RespondentResponseTaskListController();
    const response = mockResponse();
    const request = mockRequest({});

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
    const request = mockRequest({});

    await controller.get(request, response);

    expect(request.t).toHaveBeenCalledWith(TranslationKeys.COMMON, { returnObjects: true });
    expect(request.t).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST, { returnObjects: true });
    expect(request.t).toHaveBeenCalledWith(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true });
  });
});
