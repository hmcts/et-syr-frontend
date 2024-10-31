import ClaimSavedController from '../../../main/controllers/ClaimSavedController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');

describe('ClaimSavedController', () => {
  const t = {
    common: {},
  };

  it('should render check list page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    new ClaimSavedController().get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIM_SAVED, expect.anything());
  });
});
