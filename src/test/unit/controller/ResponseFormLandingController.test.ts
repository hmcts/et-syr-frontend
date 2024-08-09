import ResponseFormLandingController from '../../../main/controllers/ResponseFormLandingController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const responseFormLandingController = new ResponseFormLandingController();

describe('Response Form Landing Controller', () => {
  const t = {
    'response-form-landing': {},
  };

  it('should render the response form landing page for ET3', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    responseFormLandingController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('response-form-landing', expect.anything());
  });
});
