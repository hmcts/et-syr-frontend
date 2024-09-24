import RespondentContestClaimController from '../../../main/controllers/RespondentContestClaimController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { conditionalRedirect } from '../../../main/helpers/RouterHelpers';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
jest.mock('../../../main/helpers/RouterHelpers');

describe('RespondentContestClaimController', () => {
  let controller: RespondentContestClaimController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;

  beforeEach(() => {
    controller = new RespondentContestClaimController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {},
      },
    });
  });

  describe('GET method', () => {
    it('should render the Respondent Contest Claim page with the correct form content', () => {
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_CONTEST_CLAIM,
        expect.objectContaining({
          redirectUrl: expect.any(String),
          hideContactUs: true,
          form: expect.objectContaining({
            fields: expect.objectContaining({
              respondentContestClaim: expect.objectContaining({
                classes: 'govuk-radios',
                id: 'respondentContestClaim',
                type: 'radios',
                labelHidden: true,
                values: expect.arrayContaining([
                  expect.objectContaining({
                    name: 'respondentContestClaim',
                    label: expect.any(Function), // Check for label function
                    value: YesOrNo.YES,
                  }),
                  expect.objectContaining({
                    name: 'respondentContestClaim',
                    label: expect.any(Function), // Check for label function
                    value: YesOrNo.NO,
                  }),
                ]),
                validator: expect.any(Function), // Check for validator function
              }),
            }),
            submit: expect.objectContaining({
              classes: 'govuk-!-margin-right-2',
              text: expect.any(Function),
            }),
            saveForLater: expect.objectContaining({
              classes: 'govuk-button--secondary',
              text: expect.any(Function),
            }),
          }),
        })
      );

      const mockLabels = {
        yes: 'Yes', // expected label for 'Yes' option
        no: 'No', // expected label for 'No' option
      };

      // Verify that the main label function returns the correct value
      const renderMock = response.render as jest.Mock;
      const form = renderMock.mock.calls[0][1].form;

      // Extract the label functions from the form fields
      const respondentContestClaimField = form.fields.respondentContestClaim;

      // Test the labels
      expect(respondentContestClaimField.values[0].label(mockLabels)).toBe('Yes');
      expect(respondentContestClaimField.values[1].label(mockLabels)).toBe('No');
    });
  });

  describe('POST method', () => {
    it('should call postLogic with the correct parameters when Yes is selected', async () => {
      request.body = { respondentContestClaim: YesOrNo.YES };
      (conditionalRedirect as jest.Mock).mockReturnValue(true); // Simulate Yes selected

      await controller.post(request, response);

      expect(postLogic).toHaveBeenCalledWith(
        request,
        response,
        controller['form'],
        expect.anything(),
        PageUrls.RESPONDENT_CONTEST_CLAIM_REASON
      );
    });
  });
});
