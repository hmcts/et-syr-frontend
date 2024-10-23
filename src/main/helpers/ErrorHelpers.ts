import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls } from '../definitions/constants';
import { FormError } from '../definitions/form';

export const returnSessionErrors = <T>(req: AppRequest, form: Form): FormError[] => {
  const formData = form.getParsedBody<T>(req.body, form.getFormFields());
  return getSessionErrors(req, form, formData);
};

const getSessionErrors = (req: AppRequest, form: Form, formData: Partial<CaseWithId>): FormError[] => {
  return form.getValidatorErrors(formData);
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
