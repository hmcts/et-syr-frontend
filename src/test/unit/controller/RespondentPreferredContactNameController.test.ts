import RespondentPreferredContactNameController from '../../../main/controllers/RespondentPreferredContactNameController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton } from '../../../main/definitions/radios';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { isNameValid } from '../../../main/validators/validator';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');

describe('RespondentPreferredContactNameController', () => {
  let controller: RespondentPreferredContactNameController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let translationMock: Record<string, string>;

  beforeEach(() => {
    controller = new RespondentPreferredContactNameController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {},
      },
    });

    translationMock = {
      respondentPreferredContactName: 'Preferred Contact Name',
      findAddress: 'Find Address',
    };

    // Mock translation function
    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);
  });

  describe('GET method', () => {
    it('should render the Respondent Preferred Contact Name page with the correct form content', async () => {
      await controller.get(request, response);

      const renderMock = response.render as jest.Mock;
      const [renderedView, renderData] = renderMock.mock.calls[0];

      expect(renderedView).toBe(TranslationKeys.RESPONDENT_PREFERRED_CONTACT_NAME);

      expect(renderData).toMatchObject({
        PageUrls: expect.any(Object), // Allows for flexible checking of the PageUrls object
        redirectUrl: expect.any(String), // Matches any redirect URL
        hideContactUs: true,
        form: {
          fields: {
            respondentPreferredContactName: {
              id: 'respondentPreferredContactName',
              name: 'respondentPreferredContactName',
              type: 'text',
              hint: expect.any(Function),
              classes: 'govuk-text',
              attributes: { maxLength: 100 },
              validator: isNameValid,
            },
          },
          submit: {
            classes: 'govuk-!-margin-right-2',
            text: expect.any(Function),
          },
          saveForLater: saveForLaterButton,
        },
        userCase: request.session.userCase,
        sessionErrors: expect.any(Array),
      });

      // Verify that the hint function returns the correct value
      expect(renderData.form.fields.respondentPreferredContactName.hint(translationMock)).toBe(
        'Preferred Contact Name'
      );
    });
  });

  describe('POST method', () => {
    it('should handle the post method with valid data', async () => {
      request.body = {
        respondentPreferredContactName: 'John Doe',
      };

      await controller.post(request, response);

      // Ensure postLogic is called correctly
      expect(postLogic).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        expect.anything(),
        PageUrls.RESPONDENT_DX_ADDRESS
      );
    });
  });
});
