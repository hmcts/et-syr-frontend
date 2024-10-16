import { Form } from '../../components/form';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { FormError } from '../../definitions/form';

export const getDateCompareError = (req: AppRequest, form: Form): FormError[] => {
  const formData = form.getParsedBody<CaseWithId>(req.body, form.getFormFields());
  const errors: FormError[] = form.getValidatorErrors(formData);

  const startDate = new Date(formData.et3ResponseEmploymentStartDate);
  const endDate = new Date(formData.et3ResponseEmploymentEndDate);
  if (startDate > endDate) {
    errors.push({
      propertyName: 'et3ResponseEmploymentEndDate',
      errorType: 'invalidEndDateBeforeStartDate',
      fieldName: 'Day',
    });
  }

  return errors;
};
