import { GenericTseApplicationTypeItem } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../../main/definitions/constants';
import { application } from '../../../main/definitions/contact-tribunal-applications';
import { findSelectedGenericTseApplication } from '../../../main/helpers/GenericTseApplicationHelper';
import { mockRequest } from '../mocks/mockRequest';

describe('findSelectedGenericTseApplication', () => {
  const mockApp1: GenericTseApplicationTypeItem = {
    id: '1',
    value: {
      applicant: Applicant.RESPONDENT,
      type: application.CHANGE_PERSONAL_DETAILS.code,
    },
  };
  const mockApp2: GenericTseApplicationTypeItem = {
    id: '2',
    value: {
      applicant: Applicant.RESPONDENT,
      type: application.AMEND_RESPONSE.code,
    },
  };

  it('should return the correct application when appId matches an item in the collection', () => {
    const request = mockRequest({});
    request.session.userCase.genericTseApplicationCollection = [mockApp1, mockApp2];
    request.params.appId = '2';
    const result = findSelectedGenericTseApplication(request);
    expect(result).toEqual(request.session.userCase.genericTseApplicationCollection[1]);
  });

  it('should return undefined when appId does not match any item in the collection', () => {
    const request = mockRequest({});
    request.session.userCase.genericTseApplicationCollection = [mockApp1, mockApp2];
    request.params.appId = '3';
    const result = findSelectedGenericTseApplication(request);
    expect(result).toBeUndefined();
  });

  it('should return undefined when appId is not defined', () => {
    const request = mockRequest({});
    request.session.userCase.genericTseApplicationCollection = [mockApp1, mockApp2];
    request.params.appId = undefined;
    const result = findSelectedGenericTseApplication(request);
    expect(result).toBeUndefined();
  });

  it('should return undefined when userCase is not defined', () => {
    const request = mockRequest({});
    request.session.userCase = undefined;
    request.params.appId = '2';
    const result = findSelectedGenericTseApplication(request);
    expect(result).toBeUndefined();
  });
});
