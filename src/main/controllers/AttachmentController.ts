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
      res.setHeader('Content-Type', document?.headers['content-type'] as string);
      if (document?.headers['content-length']) {
        res.setHeader('Content-Length', document.headers['content-length'] as string);
      }
      res.status(200);
      (document?.data as NodeJS.ReadableStream).pipe(res);
    } catch (err) {
      logger.error(err.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  }
}
