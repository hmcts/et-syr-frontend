import YourSupportController from '../../../main/controllers/YourSupportController';
import { TranslationKeys, languages } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('YourSupportController', () => {
  it('should render submitted confirmation with a resolved case overview link', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      userCase: {
        id: '1782812031617616',
        ccdId: '1782812031617616',
        state: CaseState.ACCEPTED,
        respondents: [
          {
            respondentName: 'Test Respondent',
            ccdId: 'respondent-ccd-id',
          },
        ],
      },
      session: {
        selectedRespondentIndex: 0,
      },
    });
    req.url = `${TranslationKeys.YOUR_SUPPORT_SUBMITTED_CONFIRMATION}${languages.ENGLISH_URL_PARAMETER}`;
    (req.t as any) = jest.fn().mockReturnValue({});
    const res = mockResponse();

    await controller.submittedConfirmation(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.YOUR_SUPPORT_SUBMITTED_CONFIRMATION,
      expect.objectContaining({
        link: `/case-details/1782812031617616/respondent-ccd-id${languages.ENGLISH_URL_PARAMETER}`,
      })
    );
    expect((res.render as jest.Mock).mock.calls[0][1].link).not.toContain(':ccdId');
  });
});
