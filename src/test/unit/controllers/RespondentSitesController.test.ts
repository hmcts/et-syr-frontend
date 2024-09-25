import RespondentSitesController from '../../../main/controllers/RespondentSitesController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');

describe('RespondentSitesController', () => {
  let controller: RespondentSitesController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;

  beforeEach(() => {
    controller = new RespondentSitesController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {},
      },
    });
  });

  describe('GET method', () => {
    it('should render the Respondent Sites page with the correct form content', () => {
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_SITES,
        expect.objectContaining({
          PageUrls: expect.any(Object),
          redirectUrl: expect.any(String),
          hideContactUs: true,
          form: expect.objectContaining({
            fields: expect.objectContaining({
              respondentSites: expect.objectContaining({
                classes: 'govuk-radios',
                id: 'respondentSites',
                type: 'radios',
                hint: expect.any(Function), // Account for hint function
                labelHidden: true, // Include labelHidden: true
                values: expect.arrayContaining([
                  expect.objectContaining({
                    name: 'respondentSites',
                    label: expect.any(Function), // Check for label function
                    value: 'Yes',
                  }),
                  expect.objectContaining({
                    name: 'respondentSites',
                    label: expect.any(Function), // Check for label function
                    value: 'No',
                  }),
                  expect.objectContaining({
                    name: 'respondentSites',
                    label: expect.any(Function), // Check for label function
                    value: 'Not Sure',
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
          userCase: request.session.userCase,
          sessionErrors: expect.any(Array),
        })
      );

      const mockLabels = {
        yes: 'Yes', // expected label for 'Yes' option
        no: 'No', // expected label for 'No' option
        notSure: 'Not Sure', // expected label for 'Not Sure' option
        hint: 'This is the hint', // expected hint text
      };

      // Verify that the main label function returns the correct value
      const renderMock = response.render as jest.Mock;
      const form = renderMock.mock.calls[0][1].form;

      // Extract the label and hint functions from the form fields
      const respondentSitesField = form.fields.respondentSites;

      // Test the labels
      expect(respondentSitesField.values[0].label(mockLabels)).toBe('Yes');
      expect(respondentSitesField.values[1].label(mockLabels)).toBe('No');
      expect(respondentSitesField.values[2].label(mockLabels)).toBe('Not Sure');

      // Test the hint
      expect(respondentSitesField.hint(mockLabels)).toBe('This is the hint');
    });
  });

  describe('POST method', () => {
    it('should call postLogic with the correct parameters', async () => {
      await controller.post(request, response);

      expect(postLogic).toHaveBeenCalledWith(
        request,
        response,
        controller['form'],
        expect.anything(),
        PageUrls.RESPONDENT_SITE_EMPLOYEES
      );
    });
  });
});
