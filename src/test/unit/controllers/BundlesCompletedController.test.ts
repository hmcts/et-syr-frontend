import BundlesCompletedController from '../../../main/controllers/BundlesCompletedController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Bundles completed controller', () => {
  it('should render the success page with return to case overview link', () => {
    const controller = new BundlesCompletedController();
    const response = mockResponse();
    const request = mockRequest({});

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.BUNDLES_COMPLETED,
      expect.objectContaining({
        redirectUrl: expect.any(String),
        hideContactUs: true,
      })
    );
  });
});
