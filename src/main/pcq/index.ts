import axios from 'axios';
import config from 'config';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { AppRequest } from '../definitions/appRequest';
import { Applicant, ErrorPages } from '../definitions/constants';
import { handleUpdateDraftCase } from '../helpers/CaseHelpers';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { returnValidUrl } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';

import { createToken } from './createToken';

export interface HealthResponse {
  status: string;
}

export interface PCQRequest {
  serviceId?: string;
  actor?: string;
  pcqId?: string;
  ccdCaseId?: string;
  partyId?: string;
  returnUrl?: string;
  language?: string;
  token?: string;
}

const logger = getLogger('pcq');

const isEnabled = (): boolean => {
  return process.env.PCQ_ENABLED === 'true' || config.get('services.pcq.enabled') === 'true';
};

export const invokePCQ = async (req: AppRequest, res: Response): Promise<void> => {
  if (isEnabled()) {
    const healthResp = await callPCQHealth();
    logger.info(`PCQ status is ${healthResp}`);

    const pcqUrl: string = process.env.PCQ_URL ?? config.get('services.pcq.url');
    const pcqId = req.session.userCase?.ClaimantPcqId;

    if (!pcqId && healthResp === 'UP') {
      //call pcq
      logger.info('Calling the PCQ Service');
      const returnurl = getHost(res) + ErrorPages.NOT_FOUND;

      //Generate pcq id
      const claimantPcqId: string = uuidv4();

      const params: PCQRequest = {
        serviceId: 'ET',
        actor: Applicant.CLAIMANT,
        pcqId: claimantPcqId,
        ccdCaseId: req.session.userCase.id,
        partyId: req.session.user?.email ? req.session.user.email : 'anonymous',
        returnUrl: returnurl,
        language: req.language || 'en',
      };

      params.token = createToken(params);
      params.partyId = encodeURIComponent(params.partyId);

      const qs: string = Object.keys(params)
        .map((key: keyof typeof params) => `${key}=${params[key]}`)
        .join('&');

      req.session.userCase.ClaimantPcqId = claimantPcqId;
      req.session.save();
      await handleUpdateDraftCase(req, logger);
      res.redirect(`${pcqUrl}?${qs}`);
    } else {
      //skip pcq
      logger.info(`PCQ status is ${healthResp} and PCQ ID is ${pcqId}`);
      res.redirect(returnValidUrl(setUrlLanguage(req, ErrorPages.NOT_FOUND)));
    }
  } else {
    //skip pcq
    logger.info(`PCQ enabled: ${isEnabled().toString()}`);
    res.redirect(returnValidUrl(setUrlLanguage(req, ErrorPages.NOT_FOUND)));
  }
};

export const getHost = (res: Response): string => {
  return res.locals.host === 'localhost' ? `${res.locals.host}:3003` : res.locals.host;
};

export const callPCQHealth = (): Promise<string> => {
  const url: string = process.env.PCQ_HEALTH_URL ?? config.get('services.pcq.health');
  logger.info(`PCQ health ${url}`);

  return axios
    .get(url)
    .then(resp => {
      return resp.data.status;
    })
    .catch(error => {
      if (error.response) {
        logger.info(`PCQ health error status: ${error.response.status}`);
      } else if (error.request) {
        logger.info(`PCQ health error request: ${error.request}`);
      } else {
        logger.info(`PCQ health error message: ${error.message}`);
      }
      return 'DOWN';
    });
};
