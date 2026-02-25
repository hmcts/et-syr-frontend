import MakingResponseAsLegalRepController from '../../../main/controllers/MakingResponseAsLegalRepController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('MakingResponseAsLegalRepController', () => {
  let controller: MakingResponseAsLegalRepController;

  beforeEach(() => {
    controller = new MakingResponseAsLegalRepController();
    jest.clearAllMocks();
  });

  it('should render the Making Response as Legal Representative page with correct data', () => {
    const t = {
      common: {},
      'making-response-as-legal-representative': {
        title: 'Making a response as a legal representative',
        p1: {
          start: 'You will need to ',
          link: 'create a My HMCTS account',
          end: ' first if you do not have one.',
        },
        p2: {
          start: 'If you have one already, ',
          link: 'sign in to MyHMCTS',
          end: ' to start a response.',
        },
      },
    };

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.MAKING_RESPONSE_AS_LEGAL_REPRESENTATIVE,
      expect.objectContaining({
        createLink: expect.any(String),
        signInLink: expect.any(String),
      })
    );
  });

  it('should include MyHMCTS links in the rendered content', () => {
    const t = {
      common: {},
      'making-response-as-legal-representative': {},
    };

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalled();
    const renderCall = (response.render as jest.Mock).mock.calls[0];
    const renderedData = renderCall[1];

    expect(renderedData.createLink).toContain('/register-org-new/register');
    expect(renderedData.signInLink).toBeDefined();
  });
});
