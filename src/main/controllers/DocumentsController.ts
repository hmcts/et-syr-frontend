import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DocumentRow } from '../definitions/document';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import DocumentUtils from '../utils/DocumentUtils';
import ET3Util from '../utils/ET3Util';

export default class DocumentsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl: string = setUrlLanguage(req, PageUrls.DOCUMENTS);
    const languageParam: string = getLanguageParam(req.url);
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    await ET3Util.refreshRequestUserCase(req);
    const documentRows: DocumentRow[] = DocumentUtils.generateDocumentRowsForDocumentsController(req);
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
