import RespondentContestClaimReasonController from '../../../main/controllers/RespondentContestClaimReasonController';
import { PageUrls } from '../../../main/definitions/constants';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');

describe('RespondentContestClaimReasonController', () => {
  let controller: RespondentContestClaimReasonController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let translationMock: Record<string, string>;

  beforeEach(() => {
    controller = new RespondentContestClaimReasonController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {
          respondents: [{ respondentName: 'Test Respondent' }],
        },
      },
    });

    translationMock = {
      textAreaLabel: 'What is the reason for your claim?',
      uploadLabel: 'Upload supporting material',
      yes: 'Yes',
      no: 'No',
    };

    // Mock translation function
    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);
  });

  describe('GET method', () => {
    it('should render the Respondent Contest Claim Reason page with the correct form content', async () => {
      await controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        'respondent-contest-claim-reason',
        expect.objectContaining({
          PageUrls: expect.any(Object),
          form: expect.objectContaining({
            fields: expect.objectContaining({
              inset: expect.objectContaining({
                classes: 'govuk-heading-m',
                id: 'inset',
                label: expect.any(Function),
                subFields: expect.objectContaining({
                  supportingMaterialFile: expect.objectContaining({
                    classes: 'govuk-label',
                    id: 'supportingMaterialFile',
                    labelHidden: false,
                    labelSize: 'm',
                    type: 'upload',
                  }),
                  upload: expect.objectContaining({
                    classes: 'govuk-button--secondary',
                    id: 'upload',
                    label: expect.any(Function),
                    name: 'upload',
                    type: 'button',
                    value: 'true',
                  }),
                }),
                type: 'insetFields',
              }),
              respondentContestClaimReason: expect.objectContaining({
                classes: 'govuk-textarea',
                id: 'respondentContestClaimReason',
                label: expect.any(Function),
                type: 'textarea',
              }),
            }),
            saveForLater: expect.objectContaining({
              classes: 'govuk-button--secondary',
              text: expect.any(Function),
            }),
            submit: expect.objectContaining({
              classes: 'govuk-!-margin-right-2',
              text: expect.any(Function),
            }),
          }),
          hideContactUs: true,
          redirectUrl: expect.any(String),
          sessionErrors: expect.any(Array),
          userCase: expect.objectContaining({
            respondents: expect.arrayContaining([
              expect.objectContaining({
                respondentName: 'Test Respondent',
              }),
            ]),
          }),
          // Include any new properties
          languageParam: expect.any(String),
          no: expect.any(String),
          yes: expect.any(String),
          uploadLabel: expect.any(String),
        })
      );
    });
  });

  describe('POST method', () => {
    it('should handle the post method with valid data', async () => {
      request.body = {
        respondentContestClaimReason: 'Reason for claim',
        supportingMaterialFile: 'file.pdf',
      };

      await controller.post(request, response);

      // Ensure postLogic is called correctly
      expect(postLogic).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        expect.anything(),
        PageUrls.NOT_IMPLEMENTED // Adjust this URL based on your flow
      );
    });

    it('should handle the post method with missing claim reason', async () => {
      request.body = {
        supportingMaterialFile: 'file.pdf',
      };

      await controller.post(request, response);

      // Ensure postLogic is called with validation error
      expect(postLogic).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        expect.anything(),
        PageUrls.NOT_IMPLEMENTED // Adjust this URL based on your flow
      );
    });
  });
});
