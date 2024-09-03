import RespondentNameController from '../../../main/controllers/RespondentNameController';
import { YesOrNo } from '../../../main/definitions/case';
import { NO, PageUrls, TranslationKeys, YES } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('RespondentNameController', () => {
  let controller: RespondentNameController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let translationMock: Record<string, string>;

  beforeEach(() => {
    controller = new RespondentNameController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {
          respondents: [{ respondentName: 'Test Respondent' }],
        },
      },
    });

    translationMock = {
      label1: 'this is label1 ',
      label2: ' this is label2',
      yes: 'Yes',
      no: 'No',
      respondentNameTextLabel: 'is this respondentNameTextLabel',
    };

    // Mock translation function
    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);
  });

  it('should render the Respondent Name page with the correct form content', async () => {
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_NAME,
      expect.objectContaining({
        PageUrls,
        redirectUrl: expect.any(String),
        hideContactUs: true,
        languageParam: expect.any(String),
        form: expect.objectContaining({
          fields: expect.objectContaining({
            respondentName: expect.objectContaining({
              classes: 'govuk-radios',
              id: 'respondentName',
              type: 'radios',
              label: expect.any(Function),
              labelHidden: false,
              values: expect.arrayContaining([
                {
                  name: 'respondentName',
                  label: expect.any(Function),
                  value: YesOrNo.YES,
                },
                {
                  name: 'respondentName',
                  label: expect.any(Function),
                  value: YesOrNo.NO,
                  subFields: expect.objectContaining({
                    respondentNameDetail: expect.objectContaining({
                      id: 'respondentNameTxt',
                      name: 'respondentNameTxt',
                      type: 'text',
                      labelSize: 'normal',
                      label: expect.any(Function),
                      classes: 'govuk-text',
                      attributes: { maxLength: 100 },
                    }),
                  }),
                },
              ]),
            }),
          }),
          submit: submitButton,
          saveForLater: saveForLaterButton,
        }),
        userCase: request.session.userCase,
        sessionErrors: undefined,
      })
    );

    // Check that the main label function returns the correct value
    const renderMock = response.render as jest.Mock;
    const form = renderMock.mock.calls[0][1].form;

    // Test the first label (respondentName.label) but it will have the Respondent name and 2nd label concatenated
    expect(form.fields.respondentName.label(translationMock)).toBe('this is label1 Test Respondent this is label2');

    // Test the labels for YES/NO options and the subfield label
    expect(form.fields.respondentName.values[0].label(translationMock)).toBe(YES);
    expect(form.fields.respondentName.values[1].label(translationMock)).toBe(NO);
    expect(form.fields.respondentName.values[1].subFields.respondentNameDetail.label(translationMock)).toBe(
      'is this respondentNameTextLabel'
    );
  });

  it('should handle the post method with valid data', async () => {
    request.body = {
      respondentName: YesOrNo.YES,
    };

    await controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.TYPE_OF_ORGANISATION);
  });

  it('should handle the post method with validation errors', async () => {
    request.body = {
      respondentName: '', // Empty input to trigger validation error
    };

    await controller.post(request, response);

    expect(request.session.errors).toBeDefined();
    expect(response.redirect).toHaveBeenCalledWith(request.url);
  });
});
