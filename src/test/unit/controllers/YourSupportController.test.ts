import YourSupportController from '../../../main/controllers/YourSupportController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { handleUpdateDraftCase, handleUpdateSubmittedCaseFlags } from '../../../main/helpers/CaseHelpers';
import { CUIActions, getCuiService } from '../../../main/services/CuiService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers', () => ({
  handleUpdateDraftCase: jest.fn(),
  handleUpdateSubmittedCaseFlags: jest.fn(),
  setUserCase: jest.fn((req, formData) => {
    req.session.userCase = {
      ...req.session.userCase,
      ...formData,
    };
  }),
}));

jest.mock('../../../main/services/CuiService', () => ({
  CUIActions: {
    SUBMIT: 'submit',
    CANCEL: 'cancel',
  },
  getCuiService: jest.fn(),
  mergeCUIFlagItems: jest.fn((existingFlags = [], replacementFlags = []) => [...existingFlags, ...replacementFlags]),
}));

describe('YourSupportController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render submitted confirmation with a resolved case overview link', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      userCase: {
        id: '1782812031617616',
        ccdId: '1782812031617616',
        state: CaseState.ACCEPTED,
        responseReceived: YesOrNo.YES,
        respondents: [
          {
            respondentName: 'Test Respondent',
            ccdId: 'respondent-ccd-id',
            responseReceived: YesOrNo.YES,
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

  it('should redirect draft CUI callback to your support confirmation after saving flags', async () => {
    const getJourneyDataMock = jest.fn().mockResolvedValue({
      action: CUIActions.SUBMIT,
      correlationId: '1234',
      replacementFlags: {
        partyName: 'Test Respondent',
        roleOnCase: 'Respondent',
        details: [
          {
            id: 'flag-1',
            value: {
              name: 'Support',
              name_cy: 'Support',
              dateTimeCreated: '2026-07-14T00:00:00',
              path: [],
              hearingRelevant: 'No',
              flagCode: 'RA0001',
              availableExternally: 'Yes',
            },
          },
        ],
      },
    });
    (getCuiService as jest.Mock).mockReturnValue({ getJourneyData: getJourneyDataMock });
    (handleUpdateDraftCase as jest.Mock).mockResolvedValue(undefined);

    const controller = new YourSupportController({
      getToken: jest.fn().mockResolvedValue('service-token'),
    } as never);
    const req = mockRequest({
      userCase: {
        id: '1234',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      },
      session: {
        user: { accessToken: 'idam-token' },
      },
    });
    req.params = {
      ...req.params,
      id: 'journey-id',
    };
    req.url = `${PageUrls.YOUR_SUPPORT_CALLBACK.replace(':id', 'journey-id')}${languages.ENGLISH_URL_PARAMETER}`;
    (req as any).hostname = 'localhost';
    req.app = { locals: { developmentMode: false } } as never;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(getJourneyDataMock).toHaveBeenCalledWith('journey-id', { serviceToken: 'service-token' });
    expect(handleUpdateDraftCase).toHaveBeenCalledWith(req, expect.anything());
    expect(res.redirect).toHaveBeenCalledWith(
      `${PageUrls.YOUR_SUPPORT_CONFIRMATION}${languages.ENGLISH_URL_PARAMETER}`
    );
  });

  it('should redirect pre-submitted ET3 CUI callback to your support confirmation', async () => {
    const getJourneyDataMock = jest.fn().mockResolvedValue({
      action: CUIActions.SUBMIT,
      correlationId: '1234',
      replacementFlags: {
        partyName: 'Test Respondent',
        roleOnCase: 'Respondent',
        details: [
          {
            id: 'flag-1',
            value: {
              name: 'Support',
              name_cy: 'Support',
              dateTimeCreated: '2026-07-14T00:00:00',
              path: [],
              hearingRelevant: 'No',
              flagCode: 'RA0001',
              availableExternally: 'Yes',
            },
          },
        ],
      },
    });
    (getCuiService as jest.Mock).mockReturnValue({ getJourneyData: getJourneyDataMock });
    (handleUpdateSubmittedCaseFlags as jest.Mock).mockResolvedValue(undefined);

    const controller = new YourSupportController({
      getToken: jest.fn().mockResolvedValue('service-token'),
    } as never);
    const req = mockRequest({
      userCase: {
        id: '1234',
        state: CaseState.ACCEPTED,
        responseReceived: YesOrNo.NO,
        respondents: [
          {
            respondentName: 'Test Respondent',
            ccdId: 'respondent-ccd-id',
            responseReceived: YesOrNo.NO,
          },
        ],
      },
      session: {
        selectedRespondentIndex: 0,
        user: { accessToken: 'idam-token' },
      },
    });
    req.params = {
      ...req.params,
      id: 'journey-id',
    };
    req.url = `${PageUrls.YOUR_SUPPORT_CALLBACK.replace(':id', 'journey-id')}${languages.ENGLISH_URL_PARAMETER}`;
    (req as any).hostname = 'localhost';
    req.app = { locals: { developmentMode: false } } as never;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(getJourneyDataMock).toHaveBeenCalledWith('journey-id', { serviceToken: 'service-token' });
    expect(handleUpdateSubmittedCaseFlags).toHaveBeenCalledWith(req, expect.anything());
    expect(res.redirect).toHaveBeenCalledWith(
      `${PageUrls.YOUR_SUPPORT_CONFIRMATION}${languages.ENGLISH_URL_PARAMETER}`
    );
  });

  it('should render pre-submitted confirmation with a task list link', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      userCase: {
        id: '1234',
        state: CaseState.ACCEPTED,
        responseReceived: YesOrNo.NO,
        respondents: [
          {
            respondentName: 'Test Respondent',
            ccdId: 'respondent-ccd-id',
            responseReceived: YesOrNo.NO,
          },
        ],
      },
      session: {
        selectedRespondentIndex: 0,
      },
    });
    req.url = `${PageUrls.YOUR_SUPPORT_CONFIRMATION}${languages.ENGLISH_URL_PARAMETER}`;
    (req.t as any) = jest.fn().mockReturnValue({});
    const res = mockResponse();

    await controller.confirmation(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.YOUR_SUPPORT_CONFIRMATION,
      expect.objectContaining({
        link: `${PageUrls.RESPONDENT_RESPONSE_TASK_LIST}${languages.ENGLISH_URL_PARAMETER}`,
      })
    );
  });
});
