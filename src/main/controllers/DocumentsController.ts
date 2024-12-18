import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';
import { ApiDocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { AllDocumentTypes, DefaultValues, PageUrls, TranslationKeys } from '../definitions/constants';
import { DocumentRow } from '../definitions/document';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { dateInLocale } from '../helpers/dateInLocale';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import CollectionUtils from '../utils/CollectionUtils';
import DateUtils from '../utils/DateUtils';
import DocumentUtils from '../utils/DocumentUtils';
import ET3Util from '../utils/ET3Util';
import ObjectUtils from '../utils/ObjectUtils';
import RespondentUtils from '../utils/RespondentUtils';
import StringUtils from '../utils/StringUtils';

export default class DocumentsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl: string = setUrlLanguage(req, PageUrls.DOCUMENTS);
    const languageParam: string = getLanguageParam(req.url);
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    await ET3Util.refreshRequestUserCase(req);
    let documentRows: DocumentRow[] = [];
    const documentCollectionAsDocumentRows: DocumentRow[] = DocumentUtils.convertApiDocumentTypeItemListToDocumentRows(
      req,
      req.session.userCase.documentCollection as ApiDocumentTypeItem[]
    );
    if (CollectionUtils.isNotEmpty(documentCollectionAsDocumentRows)) {
      for (const documentRow of documentCollectionAsDocumentRows) {
        documentRows.push(documentRow);
      }
    }
    const selectedRespondent: RespondentET3Model = RespondentUtils.findSelectedRespondentByRequest(req);
    const et3Attachments: DocumentRow[] = DocumentUtils.convertApiDocumentTypeItemListToDocumentRows(
      req,
      selectedRespondent?.et3ResponseContestClaimDocument
    );
    if (CollectionUtils.isNotEmpty(et3Attachments)) {
      for (const documentRow of et3Attachments) {
        documentRows.push(documentRow);
      }
    }
    if (ObjectUtils.isNotEmpty(selectedRespondent?.et3ResponseEmployerClaimDocument)) {
      let documentDate: string = DefaultValues.STRING_DASH;
      if (
        StringUtils.isNotBlank(selectedRespondent?.et3ResponseEmployerClaimDocument.upload_timestamp) &&
        DateUtils.isDateStringValid(selectedRespondent?.et3ResponseEmployerClaimDocument.upload_timestamp)
      ) {
        documentDate = dateInLocale(
          DateUtils.convertStringToDate(selectedRespondent?.et3ResponseEmployerClaimDocument.upload_timestamp),
          req.url
        );
      }
      documentRows.push({
        type: AllDocumentTypes.ET3_ATTACHMENT,
        name: selectedRespondent.et3ResponseEmployerClaimDocument.document_filename,
        date: documentDate,
        id: DocumentUtils.findDocumentIdByURL(selectedRespondent.et3ResponseEmployerClaimDocument.document_url),
      });
    }
    if (CollectionUtils.isEmpty(documentRows)) {
      documentRows = undefined;
    }
    res.render(TranslationKeys.DOCUMENTS, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.DOCUMENTS as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      useCase: req.session.userCase,
      redirectUrl,
      documentRows,
      languageParam,
      welshEnabled,
    });
  };
}
