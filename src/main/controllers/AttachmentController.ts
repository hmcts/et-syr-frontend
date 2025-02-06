import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getDocId } from '../helpers/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('AttachmentController');

export default class AttachmentController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const docId = req.params.docId;
    const userCase = req.session?.userCase;

    if (!docId) {
      logger.warn('no docId provided');
      return res.redirect(PageUrls.NOT_FOUND);
    }

    if (docId !== getDocId(userCase.contactApplicationFile?.document_url)) {
      logger.warn('bad request parameter');
      return res.redirect(PageUrls.NOT_FOUND);
    }

    try {
      const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId);
      res.setHeader('Content-Type', document?.headers['content-type']);
      res.status(200).send(Buffer.from(document?.data, 'binary'));
    } catch (err) {
      logger.error(err.message);
      return res.redirect(PageUrls.NOT_FOUND);
    }
  }
}
