import RespondentNameController from '../../../main/controllers/RespondentNameController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');

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

  describe('GET method', () => {
    it('should render the Respondent Name page with the correct form content', async () => {
      await controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_NAME,
        expect.objectContaining({
          PageUrls: expect.any(Object), // Allows for flexible checking of the PageUrls object
          redirectUrl: expect.any(String), // Matches any redirect URL
          hideContactUs: true,
          form: expect.objectContaining({
            fields: expect.objectContaining({
              respondentName: expect.objectContaining({
                classes: 'govuk-radios',
                id: 'respondentName',
                type: 'radios',
                label: expect.any(Function), // Label is a function
                values: expect.arrayContaining([
                  expect.objectContaining({
                    name: 'respondentName',
                    label: expect.any(Function), // Function for yes/no options
                    value: YesOrNo.YES,
                  }),
                  expect.objectContaining({
                    name: 'respondentName',
                    label: expect.any(Function), // Function for yes/no options
                    value: YesOrNo.NO,
                    subFields: expect.objectContaining({
                      respondentNameDetail: expect.objectContaining({
                        id: 'respondentNameTxt',
                        name: 'respondentNameTxt',
                        type: 'text',
                        label: expect.any(Function),
                        attributes: { maxLength: 100 },
                      }),
                    }),
                  }),
                ]),
              }),
            }),
            submit: expect.objectContaining({
              classes: 'govuk-!-margin-right-2',
              text: expect.any(Function), // Text is also a function
            }),
            saveForLater: expect.objectContaining({
              classes: 'govuk-button--secondary',
              text: expect.any(Function), // Text is a function here as well
            }),
          }),
          userCase: request.session.userCase, // Match the user case
          sessionErrors: expect.any(Array), // Allows for session errors to be either undefined or an array
        })
      );

      // Verify that the main label function returns the correct value
      const renderMock = response.render as jest.Mock;
      const form = renderMock.mock.calls[0][1].form;

      expect(form.fields.respondentName.label(translationMock)).toBe('this is label1 Test Respondent this is label2');
      expect(form.fields.respondentName.values[0].label(translationMock)).toBe('Yes');
      expect(form.fields.respondentName.values[1].label(translationMock)).toBe('No');
      expect(form.fields.respondentName.values[1].subFields.respondentNameDetail.label(translationMock)).toBe(
        'is this respondentNameTextLabel'
      );
    });
  });

  describe('POST method', () => {
    it('should handle the post method with valid data (Yes selected)', async () => {
      request.body = {
        respondentName: YesOrNo.YES,
      };

      await controller.post(request, response);

      // Ensure postLogic is called correctly
      expect(postLogic).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        expect.anything(),
        PageUrls.TYPE_OF_ORGANISATION
      );
    });

    it('should handle the post method with valid data (No selected and subField filled)', async () => {
      request.body = {
        respondentName: YesOrNo.NO,
        respondentNameTxt: 'Test Respondent Name Detail',
      };

      await controller.post(request, response);

      // Ensure postLogic is called correctly
      expect(postLogic).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        expect.anything(),
        PageUrls.TYPE_OF_ORGANISATION
      );
    });
  });
});
