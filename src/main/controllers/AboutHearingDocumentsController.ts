import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { continueButton } from '../definitions/buttons';
import { CaseWithId, WhatAreTheHearingDocuments, WhoseHearingDocument } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields, FormInput, ValidationCheck } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { createLabelForHearing, createRadioBtnsForHearings } from '../helpers/HearingDocumentsHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import UrlUtils from '../utils/UrlUtils';
import { isFieldFilledIn } from '../validators/validator';

const logger = getLogger('AboutHearingDocumentsController');

export default class AboutHearingDocumentsController {
  private getFormContent(hearingRadios: FormInput[]): FormContent {
    return {
      fields: {
        hearingDocumentsAreFor: {
          classes: 'govuk-radios',
          id: 'about-hearing-documents1',
          type: 'radios',
          label: (l: AnyRecord): string => l.Question1,
          labelSize: 'm',
          values: hearingRadios,
          validator: isFieldFilledIn as ValidationCheck,
        },
        whoseHearingDocumentsAreYouUploading: {
          classes: 'govuk-radios',
          id: 'about-hearing-documents2',
          type: 'radios',
          label: (l: AnyRecord): string => l.Question2,
          labelSize: 'm',
          values: [
            {
              label: (l: AnyRecord): string => l.Question2Radio1,
              name: 'whoseHearingDocumentsAreYouUploading',
              value: WhoseHearingDocument.MINE,
            },
            {
              label: (l: AnyRecord): string => l.Question2Radio2,
              name: 'whoseHearingDocumentsAreYouUploading',
              value: WhoseHearingDocument.BOTH_PARTIES,
            },
          ],
          validator: isFieldFilledIn as ValidationCheck,
        },
        whatAreTheseDocuments: {
          classes: 'govuk-radios',
          id: 'about-hearing-documents3',
          type: 'radios',
          label: (l: AnyRecord): string => l.Question3,
          labelSize: 'm',
          values: [
            {
              label: (l: AnyRecord): string => l.Question3Radio1,
              name: 'whatAreTheseDocuments',
              value: WhatAreTheHearingDocuments.ALL,
            },
            {
              label: (l: AnyRecord): string => l.Question3Radio2,
              name: 'whatAreTheseDocuments',
              value: WhatAreTheHearingDocuments.SUPPLEMENTARY,
            },
            {
              label: (l: AnyRecord): string => l.Question3Radio3,
              name: 'whatAreTheseDocuments',
              value: WhatAreTheHearingDocuments.WITNESS_STATEMENTS,
            },
          ],
          validator: isFieldFilledIn as ValidationCheck,
        },
      },
      submit: continueButton,
    };
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const hearingRadios = createRadioBtnsForHearings(req.session.userCase?.hearingCollection) ?? [];
    const formContent = this.getFormContent(hearingRadios);
    const form = new Form(<FormFields>formContent.fields);
    const formData = form.getParsedBody<CaseWithId>(req.body, form.getFormFields());

    req.session.errors = form.getValidatorErrors(formData);

    const foundHearing = req.session.userCase?.hearingCollection?.find(
      hearing => hearing.id === formData.hearingDocumentsAreFor
    );
    if (!foundHearing && !req.session.errors.some(e => e.propertyName === 'hearingDocumentsAreFor')) {
      req.session.errors.push({ propertyName: 'hearingDocumentsAreFor', errorType: 'required' });
    }

    if (req.session.errors.length > 0 || !foundHearing) {
      return res.redirect(PageUrls.ABOUT_HEARING_DOCUMENTS + getLanguageParam(req.url));
    }

    req.session.userCase.hearingDocumentsAreFor = foundHearing.id;
    req.session.userCase.whoseHearingDocumentsAreYouUploading = formData.whoseHearingDocumentsAreYouUploading;
    req.session.userCase.whatAreTheseDocuments = formData.whatAreTheseDocuments;
    req.session.userCase.formattedSelectedHearing = createLabelForHearing(foundHearing);

    res.redirect(PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':hearingId', foundHearing.id) + getLanguageParam(req.url));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const caseDetailsUrl = UrlUtils.getCaseDetailsUrlByRequest(req);

    if (!req.session?.userCase?.hearingCollection?.length) {
      logger.info('no hearing collection found, redirecting to case details');
      return res.redirect(caseDetailsUrl);
    }

    const hearingRadios = createRadioBtnsForHearings(req.session.userCase.hearingCollection);
    if (!hearingRadios?.length) {
      logger.info('no unheard hearings found, redirecting to case details');
      return res.redirect(caseDetailsUrl);
    }

    const formContent = this.getFormContent(hearingRadios);
    const content = getPageContent(req, formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ABOUT_HEARING_DOCUMENTS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);

    res.render(TranslationKeys.ABOUT_HEARING_DOCUMENTS, {
      ...content,
      hideContactUs: true,
      cancelLink: caseDetailsUrl,
    });
  };
}
