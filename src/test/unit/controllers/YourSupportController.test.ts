import YourSupportController from '../../../main/controllers/YourSupportController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { handleUpdateDraftCase, handleUpdateSubmittedCaseFlags } from '../../../main/helpers/CaseHelpers';
import * as CuiYourSupportFeatureModule from '../../../main/modules/featureFlag/CuiYourSupportFeature';
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
  mergeCUIFlagItems: jest.fn((existingFlags = [], replacementFlags = []) => {
    const mergedFlags = [...existingFlags];
    for (const replacementFlag of replacementFlags) {
      if (replacementFlag.id === undefined) {
        mergedFlags.push(replacementFlag);
        continue;
      }

      const existingIndex = mergedFlags.findIndex(existingFlag => existingFlag.id === replacementFlag.id);
      if (existingIndex === -1) {
        mergedFlags.push(replacementFlag);
      } else {
        mergedFlags[existingIndex] = replacementFlag;
      }
    }

    return mergedFlags;
  }),
}));

describe('YourSupportController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature').mockReturnValue({
      isEnabled: jest.fn().mockReturnValue(true),
      getSupportPageUrl: jest.fn().mockReturnValue(PageUrls.YOUR_SUPPORT),
    } as unknown as CuiYourSupportFeatureModule.CuiYourSupportFeature);
  });

  const setRequestRuntime = (req: ReturnType<typeof mockRequest>): void => {
    req.url = `${PageUrls.YOUR_SUPPORT}${languages.ENGLISH_URL_PARAMETER}`;
    Object.assign(req, { hostname: 'et-syr.example' });
    req.app = { locals: { developmentMode: false } } as never;
  };

  const getExistingFlags = () => ({
    partyName: 'Test Respondent',
    roleOnCase: 'Respondent',
    details: [
      {
        id: 'flag-1',
        value: {
          name: 'Support',
          name_cy: 'Support',
          dateTimeCreated: '2026-07-14T00:00:00',
          path: [] as never[],
          hearingRelevant: 'No',
          flagCode: 'RA0001',
          availableExternally: 'Yes',
          status: 'Active',
        },
      },
    ],
  });

  it('should render your support page when the case can access the CUI journey', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      userCase: {
        id: '1234',
        responseReceived: YesOrNo.NO,
        respondents: [
          {
            ccdId: 'respondent-ccd-id',
            responseReceived: YesOrNo.NO,
          },
        ],
      },
      session: {
        selectedRespondentIndex: 0,
      },
    });
    setRequestRuntime(req);
    req.session.errors = [{ propertyName: 'reasonableAdjustments', errorType: 'required' }];
    (req.t as unknown as jest.Mock).mockReturnValue({ legend: 'Support legend' });
    const res = mockResponse();

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      'your-support',
      expect.objectContaining({
        cancelLink: `${PageUrls.RESPONDENT_RESPONSE_TASK_LIST}${languages.ENGLISH_URL_PARAMETER}`,
        sessionErrors: [{ propertyName: 'reasonableAdjustments', errorType: 'required' }],
        showNoSupport: true,
        supportNo: YesOrNo.NO,
        supportYes: YesOrNo.YES,
      })
    );
    expect(req.session.errors).toEqual([]);
  });

  it('should redirect from your support page when the case cannot access the CUI journey', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      userCase: {
        id: undefined,
      },
    });
    setRequestRuntime(req);
    const res = mockResponse();

    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      `${PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER}${languages.ENGLISH_URL_PARAMETER}`
    );
  });

  it('should redirect disabled draft cases to the legacy reasonable adjustments page', async () => {
    jest.spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature').mockReturnValue({
      isEnabled: jest.fn().mockReturnValue(false),
      getSupportPageUrl: jest.fn().mockReturnValue(PageUrls.REASONABLE_ADJUSTMENTS),
    } as unknown as CuiYourSupportFeatureModule.CuiYourSupportFeature);
    const controller = new YourSupportController();
    const req = mockRequest({
      userCase: {
        id: '1234',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      },
    });
    setRequestRuntime(req);
    const res = mockResponse();

    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.REASONABLE_ADJUSTMENTS}${languages.ENGLISH_URL_PARAMETER}`);
  });

  it('should redirect disabled submitted cases to case details fallback', async () => {
    jest.spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature').mockReturnValue({
      isEnabled: jest.fn().mockReturnValue(false),
      getSupportPageUrl: jest.fn().mockReturnValue(PageUrls.REASONABLE_ADJUSTMENTS),
    } as unknown as CuiYourSupportFeatureModule.CuiYourSupportFeature);
    const controller = new YourSupportController();
    const req = mockRequest({
      userCase: {
        id: '1234',
        respondents: [
          {
            ccdId: 'respondent-ccd-id',
          },
        ],
      },
      session: {
        selectedRespondentIndex: 0,
      },
    });
    setRequestRuntime(req);
    const res = mockResponse();

    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      `${PageUrls.CASE_DETAILS_WITH_CASE_ID_RESPONDENT_CCD_ID_PARAMETERS.replace(
        ':caseSubmissionReference',
        '1234'
      ).replace(':ccdId', 'respondent-ccd-id')}${languages.ENGLISH_URL_PARAMETER}`
    );
  });

  it('should redirect to CUI when yes is selected', async () => {
    const startJourneyMock = jest.fn().mockResolvedValue({ url: 'https://cui.example/start' });
    (getCuiService as jest.Mock).mockReturnValue({ startJourney: startJourneyMock });
    const controller = new YourSupportController({
      getToken: jest.fn().mockResolvedValue('service-token'),
    } as never);
    const req = mockRequest({
      body: {
        reasonableAdjustments: YesOrNo.YES,
      },
      userCase: {
        id: '1234',
        respondentRepresented: {
          nameOfOrganisation: 'Representative Org',
        },
      },
      session: {
        user: {
          accessToken: 'idam-token',
          givenName: 'Alex',
          familyName: 'Smith',
        },
      },
    });
    setRequestRuntime(req);
    const res = mockResponse();

    await controller.post(req, res);

    expect(startJourneyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        callbackUrl: `https://et-syr.example${PageUrls.YOUR_SUPPORT_CALLBACK}`,
        correlationId: '1234',
        existingFlags: expect.objectContaining({
          partyName: 'Alex Smith',
          roleOnCase: 'Representative',
        }),
        language: languages.ENGLISH,
        masterFlagCode: 'RA0001',
      }),
      {
        serviceToken: 'service-token',
        idamToken: 'idam-token',
      }
    );
    expect(res.redirect).toHaveBeenCalledWith('https://cui.example/start');
  });

  it('should update a draft case and exit when no support is selected', async () => {
    (handleUpdateDraftCase as jest.Mock).mockResolvedValue(undefined);
    const controller = new YourSupportController();
    const req = mockRequest({
      body: {
        reasonableAdjustments: YesOrNo.NO,
      },
      userCase: {
        id: '1234',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      },
      session: {
        returnUrl: PageUrls.CHECK_YOUR_ANSWERS_ET3,
      },
    });
    setRequestRuntime(req);
    const res = mockResponse();

    await controller.post(req, res);

    expect(handleUpdateDraftCase).toHaveBeenCalledWith(req, expect.anything());
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CHECK_YOUR_ANSWERS_ET3);
    expect(req.session.returnUrl).toBe('');
  });

  it('should redirect with a required error when no option is selected', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      body: {},
      userCase: {
        id: '1234',
      },
    });
    setRequestRuntime(req);
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.errors).toEqual([{ propertyName: 'reasonableAdjustments', errorType: 'required' }]);
    expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.YOUR_SUPPORT}${languages.ENGLISH_URL_PARAMETER}`);
  });

  it('should redirect with an error when CUI does not return a start URL', async () => {
    (getCuiService as jest.Mock).mockReturnValue({ startJourney: jest.fn().mockResolvedValue({}) });
    const controller = new YourSupportController({
      getToken: jest.fn().mockResolvedValue('service-token'),
    } as never);
    const req = mockRequest({
      userCase: {
        id: '1234',
      },
      session: {
        user: { accessToken: 'idam-token' },
      },
    });
    setRequestRuntime(req);
    const res = mockResponse();

    await controller.redirectToCuiJourney(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER);
  });

  it('should return to your support when starting CUI throws', async () => {
    (getCuiService as jest.Mock).mockReturnValue({
      startJourney: jest.fn().mockRejectedValue(new Error('CUI unavailable')),
    });
    const controller = new YourSupportController({
      getToken: jest.fn().mockResolvedValue('service-token'),
    } as never);
    const req = mockRequest({
      userCase: {
        id: '1234',
      },
      session: {
        user: { accessToken: 'idam-token' },
      },
    });
    setRequestRuntime(req);
    const res = mockResponse();

    await controller.redirectToCuiJourney(req, res);

    expect(req.session.errors).toEqual([{ propertyName: 'yourSupportRedirect', errorType: 'required' }]);
    expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.YOUR_SUPPORT}${languages.ENGLISH_URL_PARAMETER}`);
  });

  it('should redirect back without saving when CUI journey is cancelled', async () => {
    const getJourneyDataMock = jest.fn().mockResolvedValue({
      action: CUIActions.CANCEL,
      correlationId: '1234',
    });
    (getCuiService as jest.Mock).mockReturnValue({ getJourneyData: getJourneyDataMock });
    const controller = new YourSupportController({
      getToken: jest.fn().mockResolvedValue('service-token'),
    } as never);
    const req = mockRequest({
      userCase: {
        id: '1234',
        responseReceived: YesOrNo.NO,
      },
      session: {
        returnUrl: PageUrls.CASE_LIST,
      },
    });
    req.params = {
      ...req.params,
      id: 'journey-id',
    };
    setRequestRuntime(req);
    const res = mockResponse();

    await controller.callback(req, res);

    expect(getJourneyDataMock).toHaveBeenCalledWith('journey-id', { serviceToken: 'service-token' });
    expect(handleUpdateDraftCase).not.toHaveBeenCalled();
    expect(handleUpdateSubmittedCaseFlags).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST);
    expect(req.session.returnUrl).toBe('');
  });

  it('should redirect to case details when CUI callback correlation does not match', async () => {
    (getCuiService as jest.Mock).mockReturnValue({
      getJourneyData: jest.fn().mockResolvedValue({
        action: CUIActions.SUBMIT,
        correlationId: 'different-case',
        replacementFlags: { partyName: 'Party', roleOnCase: 'Respondent', details: [] },
      }),
    });
    const controller = new YourSupportController({
      getToken: jest.fn().mockResolvedValue('service-token'),
    } as never);
    const req = mockRequest({
      userCase: {
        id: '1234',
      },
    });
    Object.assign(req.params, {
      id: ['journey-id'],
    });
    setRequestRuntime(req);
    const res = mockResponse();

    await controller.callback(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER);
  });

  it('should redirect back without saving when submitted CUI callback has no flag data', async () => {
    const getJourneyDataMock = jest.fn().mockResolvedValue({
      action: CUIActions.SUBMIT,
      correlationId: '1234',
    });
    (getCuiService as jest.Mock).mockReturnValue({ getJourneyData: getJourneyDataMock });
    const controller = new YourSupportController({
      getToken: jest.fn().mockResolvedValue('service-token'),
    } as never);
    const req = mockRequest({
      userCase: {
        id: '1234',
        responseReceived: YesOrNo.NO,
      },
      session: {
        returnUrl: PageUrls.CHECK_YOUR_ANSWERS_ET3,
      },
    });
    req.params = {
      ...req.params,
      id: 'journey-id',
    };
    setRequestRuntime(req);
    const res = mockResponse();

    await controller.callback(req, res);

    expect(getJourneyDataMock).toHaveBeenCalledWith('journey-id', { serviceToken: 'service-token' });
    expect(handleUpdateDraftCase).not.toHaveBeenCalled();
    expect(handleUpdateSubmittedCaseFlags).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CHECK_YOUR_ANSWERS_ET3);
    expect(req.session.returnUrl).toBe('');
  });

  it('should save when only flags as supplied has details', async () => {
    const existingFlags = getExistingFlags();
    const modifiedExistingFlag = {
      ...existingFlags.details[0],
      value: {
        ...existingFlags.details[0].value,
        status: 'Inactive',
        flagUpdateComment: 'Updated by CUI',
      },
    };
    const getJourneyDataMock = jest.fn().mockResolvedValue({
      action: CUIActions.SUBMIT,
      correlationId: '1234',
      replacementFlags: { partyName: 'Test Respondent', roleOnCase: 'Respondent', details: [] },
      flagsAsSupplied: {
        ...existingFlags,
        details: [modifiedExistingFlag],
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
        respondentExternalFlags: existingFlags,
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
    Object.assign(req, { hostname: 'localhost' });
    req.app = { locals: { developmentMode: false } } as never;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(getJourneyDataMock).toHaveBeenCalledWith('journey-id', { serviceToken: 'service-token' });
    expect(handleUpdateDraftCase).toHaveBeenCalledWith(req, expect.anything());
    expect(req.session.userCase.respondentExternalFlags.details).toEqual([modifiedExistingFlag]);
    expect(res.redirect).toHaveBeenCalledWith(
      `${PageUrls.YOUR_SUPPORT_CONFIRMATION}${languages.ENGLISH_URL_PARAMETER}`
    );
  });

  it('should save supplied flag changes with replacement flags', async () => {
    const existingFlags = getExistingFlags();
    const modifiedExistingFlag = {
      ...existingFlags.details[0],
      value: {
        ...existingFlags.details[0].value,
        status: 'Inactive',
        flagUpdateComment: 'Updated by CUI',
      },
    };
    const newFlag = {
      value: {
        name: 'New support',
        name_cy: 'New support',
        dateTimeCreated: '2026-07-15T00:00:00',
        path: [] as never[],
        hearingRelevant: 'No',
        flagCode: 'RA0002',
        availableExternally: 'Yes',
      },
    };
    const getJourneyDataMock = jest.fn().mockResolvedValue({
      action: CUIActions.SUBMIT,
      correlationId: '1234',
      replacementFlags: { partyName: 'Test Respondent', roleOnCase: 'Respondent', details: [newFlag] },
      flagsAsSupplied: {
        ...existingFlags,
        details: [modifiedExistingFlag],
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
        respondentExternalFlags: existingFlags,
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
    Object.assign(req, { hostname: 'localhost' });
    req.app = { locals: { developmentMode: false } } as never;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(getJourneyDataMock).toHaveBeenCalledWith('journey-id', { serviceToken: 'service-token' });
    expect(handleUpdateDraftCase).toHaveBeenCalledWith(req, expect.anything());
    expect(req.session.userCase.respondentExternalFlags.details).toEqual([modifiedExistingFlag, newFlag]);
    expect(res.redirect).toHaveBeenCalledWith(
      `${PageUrls.YOUR_SUPPORT_CONFIRMATION}${languages.ENGLISH_URL_PARAMETER}`
    );
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
    (req.t as unknown as jest.Mock).mockReturnValue({});
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

  it('should render submitted confirmation with return url and consume it', async () => {
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
        returnUrl: `${PageUrls.CASE_LIST}${languages.WELSH_URL_PARAMETER}`,
      },
    });
    req.url = `${TranslationKeys.YOUR_SUPPORT_SUBMITTED_CONFIRMATION}${languages.WELSH_URL_PARAMETER}`;
    (req.t as unknown as jest.Mock).mockReturnValue({});
    const res = mockResponse();

    await controller.submittedConfirmation(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.YOUR_SUPPORT_SUBMITTED_CONFIRMATION,
      expect.objectContaining({
        link: `${PageUrls.CASE_LIST}${languages.WELSH_URL_PARAMETER}`,
      })
    );
    expect(req.session.returnUrl).toBe('');
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
    Object.assign(req, { hostname: 'localhost' });
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
    Object.assign(req, { hostname: 'localhost' });
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
    (req.t as unknown as jest.Mock).mockReturnValue({});
    const res = mockResponse();

    await controller.confirmation(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.YOUR_SUPPORT_CONFIRMATION,
      expect.objectContaining({
        link: `${PageUrls.RESPONDENT_RESPONSE_TASK_LIST}${languages.ENGLISH_URL_PARAMETER}`,
      })
    );
  });

  it('should render pre-submitted confirmation with return url and consume it', async () => {
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
        returnUrl: `${PageUrls.CHECK_YOUR_ANSWERS_ET3}${languages.ENGLISH_URL_PARAMETER}`,
      },
    });
    req.url = `${PageUrls.YOUR_SUPPORT_CONFIRMATION}${languages.ENGLISH_URL_PARAMETER}`;
    (req.t as unknown as jest.Mock).mockReturnValue({});
    const res = mockResponse();

    await controller.confirmation(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.YOUR_SUPPORT_CONFIRMATION,
      expect.objectContaining({
        link: `${PageUrls.CHECK_YOUR_ANSWERS_ET3}${languages.ENGLISH_URL_PARAMETER}`,
      })
    );
    expect(req.session.returnUrl).toBe('');
  });
});
