import InterruptionCardController from '../../../main/controllers/InterruptionCardController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');

describe('Interruption card controller', () => {
  const t = {
    common: {},
  };

  it('should render check list page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    new InterruptionCardController().get(request, response);

    expect(response.render).toHaveBeenCalledWith('interruption-card', expect.anything());
  });
});
