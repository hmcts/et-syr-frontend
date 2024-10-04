import { Response } from 'express';

import { Form } from '../../../main/components/form';
import { AppRequest } from '../../../main/definitions/appRequest';
import { HearingPreference } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { getHearingPreferenceReasonError, handleErrors, returnSessionErrors } from '../../../main/helpers/ErrorHelpers';

// Create a mock Response type that includes necessary methods
class MockResponse implements Partial<Response> {
  redirect = jest.fn();
  status = jest.fn().mockReturnThis(); // Chainable
  json = jest.fn();
  send = jest.fn();
  sendStatus = jest.fn();
  // Include other methods as needed
}

describe('Session and Error Handling Functions', () => {
  let req: Partial<AppRequest>;
  let res: Response;
  let form: Form;

  beforeEach(() => {
    req = {
      body: { someField: 'someValue', saveForLater: true },
      session: { errors: [], save: jest.fn(cb => cb()) },
      url: '/some-url',
    } as unknown as AppRequest;

    res = new MockResponse() as unknown as Response;

    form = {
      getParsedBodyForCaseWithId: jest.fn().mockReturnValue({ someField: 'parsedValue' }),
      getFormFields: jest.fn().mockReturnValue({ someField: 'someValue' }),
      getValidatorErrors: jest.fn().mockReturnValue([]),
    } as unknown as Form;
  });

  describe('returnSessionErrors', () => {
    it('should call form.getParsedBodyForCaseWithId and return session errors', () => {
      const sessionErrors = returnSessionErrors(req as AppRequest, form);

      expect(form.getParsedBodyForCaseWithId).toHaveBeenCalledWith(req.body, form.getFormFields());
      expect(sessionErrors).toBeDefined();
    });
  });

  describe('getHearingPreferenceReasonError', () => {
    it('should return error when HearingPreference.NEITHER is selected but no hearingAssistance is provided', () => {
      const formData = {
        hearingPreferences: [HearingPreference.NEITHER],
        hearingAssistance: '', // Empty string
      };

      const result = getHearingPreferenceReasonError(formData);

      expect(result).toEqual({
        errorType: 'required',
        propertyName: 'hearingAssistance',
      });
    });

    it('should not return error when HearingPreference.NEITHER is selected but hearingAssistance is provided', () => {
      const formData = {
        hearingPreferences: [HearingPreference.NEITHER],
        hearingAssistance: 'Some reason',
      };

      const result = getHearingPreferenceReasonError(formData);

      expect(result).toBeUndefined();
    });
  });

  describe('handleErrors', () => {
    it('should redirect to NOT_IMPLEMENTED when saveForLater is true and there are no session errors', () => {
      handleErrors(req as AppRequest, res, []);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOT_IMPLEMENTED);
      expect(req.session.errors).toEqual([]);
    });

    it('should save session errors and redirect to the same URL when errors exist and saveForLater is false', () => {
      const sessionErrors = [{ errorType: 'required', propertyName: 'field' }];
      req.body.saveForLater = false;

      handleErrors(req as AppRequest, res, sessionErrors);

      expect(req.session.errors).toEqual(sessionErrors);
      expect(req.session.save as jest.Mock).toHaveBeenCalled();
      expect(res.redirect as jest.Mock).toHaveBeenCalledWith(req.url);
    });

    it('should handle session save errors correctly', () => {
      const sessionErrors = [{ errorType: 'required', propertyName: 'field' }];
      req.body.saveForLater = false;
      (req.session.save as jest.Mock).mockImplementation(cb => cb(new Error('Save error'))); // Simulate save error

      expect(() => handleErrors(req as AppRequest, res, sessionErrors)).toThrow('Save error');
    });
  });
});
