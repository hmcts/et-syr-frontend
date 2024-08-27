import ChecklistController from '../../../main/controllers/ChecklistController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');

describe('Check list controller', () => {
  const t = {
    common: {},
  };

  it('should render check list page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    new ChecklistController().get(request, response);

    expect(response.render).toHaveBeenCalledWith('checklist', expect.anything());
  });
});
