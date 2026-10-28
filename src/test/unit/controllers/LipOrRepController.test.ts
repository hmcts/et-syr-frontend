import { Response } from 'express';

import LipOrRepController from '../../../main/controllers/LipOrRepController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { RespondentRepresented } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('LipOrRepController', () => {
  let controller: LipOrRepController;
  let req: AppRequest;
  let res: Response;

  beforeEach(() => {
    controller = new LipOrRepController();
    req = mockRequest({});
    res = mockResponse();
  });

  describe('POST method', () => {
    it('redirects to CASE_NUMBER_CHECK when RespondentRepresented MYSELF', () => {
      req.body = { respondentRepresentedQuestion: RespondentRepresented.MYSELF };
      controller.post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_NUMBER_CHECK + '?lng=en');
    });

    it('redirects to CASE_NUMBER_CHECK when RespondentRepresented SOMEONE_ELSE', () => {
      req.body = { respondentRepresentedQuestion: RespondentRepresented.SOMEONE_ELSE };
      controller.post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_NUMBER_CHECK + '?lng=en');
    });

    it('redirects to MANAGE_CASE_URL when RespondentRepresented LEGAL_REP', () => {
      req.body = { respondentRepresentedQuestion: RespondentRepresented.LEGAL_REP };
      controller.post(req, res);
      expect(res.redirect).toHaveBeenCalledWith('RET-6806'); // ToDo
    });

    it('redirects to LIP_OR_REPRESENTATIVE when empty', () => {
      req.body = {};
      controller.post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.LIP_OR_REPRESENTATIVE + '?lng=en');
    });
  });

  describe('get', () => {
    it('renders the lip-or-representative page with form content', async () => {
      controller.get(req, res);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.LIP_OR_REPRESENTATIVE, expect.anything());
    });
  });
});
