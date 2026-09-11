import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import {
  getMandatoryQuestionErrorSummaryItems,
  getUnansweredMandatoryQuestions,
  isSectionComplete,
} from '../helpers/ET3MandatoryQuestionHelper';
import { conditionalRedirect } from '../helpers/RouterHelpers';
import CollectionUtils from '../utils/CollectionUtils';
import ErrorUtils from '../utils/ErrorUtils';
import { isOptionSelected } from '../validators/validator';

export default abstract class BaseCYAController {
  protected readonly form: Form;
  protected readonly formContent: FormContent;
  protected readonly sectionName: string;

  constructor(sectionName: string) {
    this.sectionName = sectionName;
    this.formContent = {
      fields: {
        [sectionName]: {
          classes: 'govuk-radios',
          id: sectionName,
          type: 'radios',
          label: (l: AnyRecord): string => l.cya.label,
          hint: (l: AnyRecord): string => l.cya.hint,
          labelHidden: false,
          values: [
            {
              name: sectionName,
              label: (l: AnyRecord): string => l.cya.yes,
              value: YesOrNo.YES,
            },
            {
              name: sectionName,
              label: (l: AnyRecord): string => l.cya.no,
              value: YesOrNo.NO,
            },
          ],
          validator: isOptionSelected,
        },
      },
      submit: saveAndContinueButton,
      saveForLater: saveForLaterButton,
    } as never;

    this.form = new Form(<FormFields>this.formContent.fields);
  }

  /**
   * Status for this submission: yes only completes the section once its mandatory questions have been
   * answered, otherwise it stays in progress. Undefined means the respondent must be sent back to the
   * check your answers page to answer them.
   */
  protected getSectionLinkStatus(req: AppRequest, et3HubLinkName: string): string {
    if (!conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)) {
      return LinkStatus.IN_PROGRESS_CYA;
    }
    if (isSectionComplete(req.session.userCase, et3HubLinkName)) {
      return LinkStatus.COMPLETED;
    }
    // saving for later never stops the respondent, the section is simply left incomplete
    if (req.body?.saveForLater) {
      return LinkStatus.IN_PROGRESS_CYA;
    }
    ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
      req,
      ValidationErrors.MANDATORY_QUESTIONS_NOT_ANSWERED,
      this.sectionName
    );
    return undefined;
  }

  /**
   * Error summary entries for the section's unanswered mandatory questions, each linking to the page it
   * is answered on. Empty until the respondent has tried to mark the section as completed, so the page
   * is not pre-populated with errors.
   */
  protected getMandatoryQuestionErrors(
    req: AppRequest,
    et3HubLinkName: string,
    translations: AnyRecord,
    interceptPath: string
  ): { text: string; href: string }[] {
    const sectionCompletionAttempted = req.session.errors?.some(
      error => error.errorType === ValidationErrors.MANDATORY_QUESTIONS_NOT_ANSWERED
    );
    if (!sectionCompletionAttempted) {
      return [];
    }
    const unansweredQuestions = getUnansweredMandatoryQuestions(req.session.userCase, et3HubLinkName);
    if (CollectionUtils.isEmpty(unansweredQuestions)) {
      // the outstanding questions have been answered since, so the error no longer applies
      req.session.errors = req.session.errors.filter(
        error => error.errorType !== ValidationErrors.MANDATORY_QUESTIONS_NOT_ANSWERED
      );
      return [];
    }
    return getMandatoryQuestionErrorSummaryItems(unansweredQuestions, translations, interceptPath);
  }
}
