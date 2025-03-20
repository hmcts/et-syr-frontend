import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages } from '../definitions/constants';
import { isDocIdValid } from '../helpers/controller/AttachmentHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('AttachmentController');

export default class AttachmentController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const docId = req.params.docId;

    if (!docId) {
      logger.warn('no docId provided');
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    if (!isDocIdValid(docId, req)) {
      logger.warn('bad request parameter - empty or invalid document url');
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    try {
      const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId);
      res.setHeader('Content-Type', document?.headers['content-type']);
      res.status(200).send(Buffer.from(document?.data, 'binary'));
    } catch (err) {
      logger.error(err.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  }
}
