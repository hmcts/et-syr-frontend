import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getApplicationsAccordionItems } from '../helpers/controller/ContactTribunalHelper';

export default class ContactTribunalController {
  public get(req: AppRequest, res: Response): void {
    res.render(TranslationKeys.CONTACT_TRIBUNAL, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      applicationsAccordionItems: getApplicationsAccordionItems(req.url, {
        ...req.t(TranslationKeys.CONTACT_TRIBUNAL, { returnObjects: true }),
      }),
    });
  }
}
