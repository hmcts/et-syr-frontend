import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls } from '../definitions/constants';
import { FormContent, FormField, FormFields, FormInput, FormOptions } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getLanguageParam } from './RouterHelpers';

export const getPageContent = (req: AppRequest, formContent: FormContent, translations: string[] = []): AnyRecord => {
  const sessionErrors = req.session?.errors || [];
  const userCase = req.session?.userCase;

  let content = {
    form: formContent,
    sessionErrors,
    userCase,
    PageUrls,
    languageParam: getLanguageParam(req.url),
  };
  translations.forEach(t => {
    content = { ...content, ...req.t(t, { returnObjects: true }) };
  });
  return content;
};

export const assignFormData = (userCase: CaseWithId | undefined, fields: FormFields): void => {
  if (!userCase) {
    userCase = <CaseWithId>{};
    return;
  }

  Object.entries(fields).forEach(([name, field]: [string, FormOptions]) => {
    const caseName = (userCase as AnyRecord)[name];
    if (caseName) {
      field.values = field.values?.map(v => {
        Object.keys(caseName).forEach(key => {
          if (v.name === key) {
            v.value = caseName[key];
          }
        });
        return v;
      });
      for (const [, value] of Object.entries(fields)) {
        (value as FormOptions)?.values
          ?.filter((option: FormInput) => option.subFields !== undefined)
          .map((fieldWithSubFields: FormInput) => fieldWithSubFields.subFields)
          .forEach((subField: Record<string, FormField>) => assignFormData(caseName, subField));
      }
    }
  });
};

export const trimFormData = (formData: Partial<CaseWithId>): void => {
  (Object.keys(formData) as (keyof typeof formData)[]).forEach(key => {
    const value = formData[key];
    if (typeof value === 'string') {
      (formData as AnyRecord)[key] = value.trim();
    }
  });
};

export const assignAddresses = (userCase: CaseWithId | undefined, fields: FormFields): void => {
  if (!userCase) {
    userCase = <CaseWithId>{};
    return;
  }
  Object.entries(fields).forEach(([name, field]: [string, FormOptions]) => {
    const caseName = (userCase as AnyRecord)[name];
    if (caseName) {
      field.values = caseName;
    }
  });
};

/**
 * Updates the `userCase` object in the session with values from the provided form.
 *
 * This function:
 *  - Ensures a `userCase` object exists in the session (creates an empty one if missing).
 *  - Parses the request body using the given `Form` instance.
 *  - Iterates over the form fields and applies only those values whose IDs match
 *    the provided `fieldNames` array.
 *  - Updates the matching properties on the session's `userCase` object.
 *
 * @param req - The current application request containing the session and user case.
 *              If undefined or if no `userCase` exists, a new `CaseWithId` object is initialized.
 * @param form - The `Form` instance used to parse and validate the request body.
 * @param fieldNames - An array of field names (keys of `CaseWithId`) that are allowed
 *                     to be updated in the session's `userCase`.
 *
 * @remarks
 * - Only fields listed in `fieldNames` will be applied to the `userCase`.
 * - Values are taken from the parsed body (`form.getParsedBody`) to ensure they follow
 *   the form’s parsing and validation rules.
 * - This method mutates the `req.session.userCase` object directly.
 *
 * @example
 * ```ts
 * applyFormDataToUserCase(req, myForm, ['firstName', 'lastName']);
 * // Updates only 'firstName' and 'lastName' in req.session.userCase
 * // if present in the form body.
 * ```
 */
export const applyFormDataToUserCase = (req: AppRequest | undefined, form: Form, fieldNames: string[]): void => {
  if (!req?.session?.userCase) {
    req.session.userCase = <CaseWithId>{};
    return;
  }
  const formData: Partial<CaseWithId> = form.getParsedBody<CaseWithId>(req.body, form.getFormFields());
  Object.entries(form.getFormFields()).forEach(([, field]: [string, FormOptions]) => {
    if (fieldNames.includes(field.id as keyof CaseWithId)) {
      (req.session.userCase as AnyRecord)[field.id] = formData[field.id as keyof CaseWithId] as string;
    }
  });
};
