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
