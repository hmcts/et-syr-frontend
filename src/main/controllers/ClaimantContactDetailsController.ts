import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getClaimantContactDetails } from '../helpers/controller/ClaimantContactDetailsHelper';

export default class ClaimantContactDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    res.render(TranslationKeys.CLAIMANT_CONTACT_DETAILS, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CLAIMANT_CONTACT_DETAILS as never, { returnObjects: true } as never),
      hideContactUs: true,
      claimantContactDetails: getClaimantContactDetails(req),
    });
  };
}
