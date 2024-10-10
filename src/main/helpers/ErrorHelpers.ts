import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, HearingPreference } from '../definitions/case';
import { PageUrls } from '../definitions/constants';
import { FormError } from '../definitions/form';
import { isFieldFilledIn } from '../validators/validator';

export const returnSessionErrors = <T>(req: AppRequest, form: Form): FormError[] => {
  const formData = form.getParsedBody<T>(req.body, form.getFormFields());
  return getSessionErrors(req, form, formData);
};

const getSessionErrors = (req: AppRequest, form: Form, formData: Partial<CaseWithId>): FormError[] => {
  let sessionErrors = form.getValidatorErrors(formData);
  const hearingPreferenceErrors = getHearingPreferenceReasonError(formData);

  if (hearingPreferenceErrors) {
    sessionErrors = [...sessionErrors, hearingPreferenceErrors];
  }

  return sessionErrors;
};

export const getHearingPreferenceReasonError = (formData: Partial<CaseWithId>): FormError => {
  const hearingPreferenceCheckbox = formData.hearingPreferences;
  const hearingPreferenceNeitherTextarea = formData.hearingAssistance;

  if (
    (hearingPreferenceCheckbox as string[])?.includes(HearingPreference.NEITHER) &&
    (!hearingPreferenceNeitherTextarea || hearingPreferenceNeitherTextarea.trim().length === 0)
  ) {
    const errorType = isFieldFilledIn(hearingPreferenceNeitherTextarea);
    if (errorType) {
      return { errorType, propertyName: 'hearingAssistance' };
    }
  }
};

export const handleErrors = (req: AppRequest, res: Response, sessionErrors: FormError[]): void => {
  req.session.errors = sessionErrors;
  const { saveForLater } = req.body;
  const requiredErrExists = sessionErrors.some(err => err.errorType === 'required');

  if (saveForLater && (requiredErrExists || !sessionErrors.length)) {
    req.session.errors = [];
    return res.redirect(PageUrls.NOT_IMPLEMENTED);
  } else {
    if (sessionErrors.length) {
      req.session.save(err => {
        if (err) {
          throw err;
        }
        return res.redirect(req.url);
      });
    }
  }
};
