import RespondentAddressController from '../../../main/controllers/RespondentAddressController';
import { YesOrNo } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/modules/featureFlag/launchDarkly');

describe('RespondentAddressController', () => {
  let controller: RespondentAddressController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  const mockWelshFlag = jest.spyOn(LaunchDarkly, 'getFlagValue');

  beforeEach(() => {
    controller = new RespondentAddressController();
    response = mockResponse();
    request = mockRequest({});
    mockWelshFlag.mockClear();
  });

  it('should render the Respondent Address page with the correct content', async () => {
    // Mock the LaunchDarkly flag for Welsh language
    mockWelshFlag.mockResolvedValue(true);

    // Mock the translation function
    const translationMock = {
      correctAddressQuestion: 'Is this the correct address?',
      yes: 'Yes',
      no: 'No',
    } as const;

    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_ADDRESS,
      expect.objectContaining({
        form: expect.objectContaining({
          fields: expect.objectContaining({
            respondentAddress: expect.objectContaining({
              label: expect.any(Function),
              values: expect.arrayContaining([
                expect.objectContaining({
                  label: expect.any(Function),
                  value: YesOrNo.YES,
                }),
                expect.objectContaining({
                  label: expect.any(Function),
                  value: YesOrNo.NO,
                }),
              ]),
            }),
          }),
        }),
        PageUrls: expect.any(Object),
        hideContactUs: true,
        userCase: request.session.userCase,
        redirectUrl: expect.any(String),
        languageParam: expect.any(String),
        welshEnabled: true,
      })
    );

    // Explicitly invoke each label function and check their outputs
    const form = (response.render as jest.Mock).mock.calls[0][1].form;
    const respondentAddressField = form.fields.respondentAddress;

    expect(respondentAddressField.label(translationMock)).toBe('Is this the correct address?');

    // Explicitly invoke each label function for the radio button values
    const respondentAddressValues = respondentAddressField.values;

    expect(respondentAddressValues[0].label(translationMock)).toBe(YesOrNo.YES);
    expect(respondentAddressValues[1].label(translationMock)).toBe(YesOrNo.NO);
  });

  it('should call the LaunchDarkly flag for Welsh language', async () => {
    // Mock the LaunchDarkly flag for Welsh language
    mockWelshFlag.mockResolvedValue(true);

    await controller.get(request, response);

    expect(getFlagValue).toHaveBeenCalledWith('welsh-language', null);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_ADDRESS,
      expect.objectContaining({
        welshEnabled: true,
      })
    );
  });
});
