import { AppRequest } from '../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';

/**
 * Return selected application
 * @param req request
 */
export const findSelectedGenericTseApplication = (req: AppRequest): GenericTseApplicationTypeItem => {
  const items = req.session.userCase?.genericTseApplicationCollection;
  const param = req.params.appId;
  return items?.find(it => it.id === param);
};
