import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { PageUrls, ValidationErrors } from '../../definitions/constants';
import { FormError } from '../../definitions/form';
import {
  SummaryListRow,
  addSummaryHtmlRowWithAction,
  addSummaryRowWithAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { isContentCharsOrLess, isFieldFilledIn, isOptionSelected } from '../../validators/validator';
import { getLanguageParam } from '../RouterHelpers';

/**
 * Check and return errors in Respond to Tribunal page
 * @param formData form data from Contact Tribunal input
 */
export const getFormDataError = (formData: Partial<CaseWithId>): FormError => {
  const { responseText, hasSupportingMaterial } = formData;

  const isTextFilled = isFieldFilledIn(responseText) === undefined;
  const isRadioFilled = isOptionSelected(hasSupportingMaterial) === undefined;

  if (isTextFilled) {
    const tooLong = isContentCharsOrLess(2500)(responseText);
    if (tooLong) {
      return { propertyName: 'responseText', errorType: ValidationErrors.TOO_LONG };
    }

    if (!isRadioFilled) {
      return { propertyName: 'hasSupportingMaterial', errorType: ValidationErrors.REQUIRED };
    }
  } else {
    if (!isRadioFilled) {
      return { propertyName: 'responseText', errorType: ValidationErrors.REQUIRED };
    }

    if (hasSupportingMaterial === YesOrNo.NO) {
      return { propertyName: 'responseText', errorType: 'requiredFile' };
    }
  }
};

/**
 * Get Respond to Tribunal Check your answer content
 * @param req request
 * @param translations translations
 */
export const getCyaContent = (req: AppRequest, translations: AnyRecord): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  const userCase = req.session.userCase;
  const languageParam = getLanguageParam(req.url);

  rows.push(
    addSummaryRowWithAction(
      translations.legend,
      userCase.responseText,
      PageUrls.RESPOND_TO_TRIBUNAL.replace(':appId', userCase.selectedGenericTseApplication.id) + languageParam,
      translations.change,
      ''
    )
  );

  if (userCase.hasSupportingMaterial === YesOrNo.YES) {
    // TODO: Create Download Link
    const downloadLink = 'link';
    rows.push(
      addSummaryHtmlRowWithAction(
        translations.supportingMaterial,
        downloadLink,
        PageUrls.RESPOND_TO_TRIBUNAL_SUPPORTING_MATERIAL + languageParam,
        translations.change,
        ''
      )
    );
  }

  rows.push(
    addSummaryRowWithAction(
      translations.copyToOtherPartyYesOrNo,
      userCase.copyToOtherPartyYesOrNo === YesOrNo.YES ? translations.yes : translations.no,
      PageUrls.RESPOND_TO_TRIBUNAL_COPY_TO_ORDER_PARTY + languageParam,
      translations.change,
      ''
    )
  );

  if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
    rows.push(
      addSummaryRowWithAction(
        translations.copyToOtherPartyText,
        userCase.copyToOtherPartyText,
        PageUrls.RESPOND_TO_TRIBUNAL_COPY_TO_ORDER_PARTY + languageParam,
        translations.change,
        ''
      )
    );
  }

  return rows;
};

/**
 * Clear temporary fields stored in session
 * @param userCase session userCase
 */
export const clearTempFields = (userCase: CaseWithId): void => {
  userCase.responseText = undefined;
  userCase.hasSupportingMaterial = undefined;
  userCase.supportingMaterialFile = undefined;
  userCase.copyToOtherPartyYesOrNo = undefined;
  userCase.copyToOtherPartyText = undefined;
};
