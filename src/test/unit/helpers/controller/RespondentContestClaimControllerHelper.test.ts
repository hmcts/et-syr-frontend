import _ from 'lodash';

import { AppRequest } from '../../../../main/definitions/appRequest';
import { CaseWithId, RespondentET3Model } from '../../../../main/definitions/case';
import { DocumentTypeItem } from '../../../../main/definitions/complexTypes/documentTypeItem';
import { DefaultValues } from '../../../../main/definitions/constants';
import RespondentContestClaimControllerHelper from '../../../../main/helpers/controller/RespondentContestClaimControllerHelper';
import { RespondentUtils } from '../../../../main/utils/RespondentUtils';
import { mockValidCaseWithId } from '../../mocks/mockCaseWithId';
import { mockValidCaseWithIdWithFullRespondentDetails } from '../../mocks/mockCaseWithIdWithFullRespondentDetails';
import { mockedAcasForm, mockedET1FormEnglish, mockedET1FormWelsh } from '../../mocks/mockDocuments';
import { mockRequest } from '../../mocks/mockRequest';

describe('RespondentContestClaimControllerHelper tests', () => {
  describe('resetRespondentContestClaimDetails', () => {
    const request: AppRequest = mockRequest({});
    const et3ResponseContestClaimDetails: string = DefaultValues.STRING_EMPTY;
    const et3ResponseContestClaimDocument: DocumentTypeItem[] = [
      mockedET1FormEnglish,
      mockedET1FormWelsh,
      mockedAcasForm,
    ];
    const expectResultsForUserCase = (userCase: CaseWithId): boolean => {
      expect(userCase.et3ResponseContestClaimDetails).toStrictEqual(DefaultValues.STRING_EMPTY);
      expect(userCase.et3ResponseContestClaimDocument).toStrictEqual([]);
      return true;
    };
    const expectResultsForSelectedRespondent = (selectedRespondent: RespondentET3Model): boolean => {
      expect(selectedRespondent.et3ResponseContestClaimDetails).toStrictEqual(DefaultValues.STRING_EMPTY);
      expect(selectedRespondent.et3ResponseContestClaimDocument).toStrictEqual([]);
      return true;
    };
    const setUserCaseEt3ResponseContestClaimDetails = (req: AppRequest): void => {
      req.session.userCase.et3ResponseContestClaimDetails = et3ResponseContestClaimDetails;
      req.session.userCase.et3ResponseContestClaimDocument = et3ResponseContestClaimDocument;
    };
    const setUserCaseSelectedRespondentEt3ResponseContestClaimDetails = (req: AppRequest): void => {
      const selectedRespondent: RespondentET3Model = RespondentUtils.findSelectedRespondentByRequest(req);
      selectedRespondent.et3ResponseContestClaimDetails = et3ResponseContestClaimDetails;
      selectedRespondent.et3ResponseContestClaimDocument = et3ResponseContestClaimDocument;
    };
    it('does not reset contest claim details when there is no user case in request', () => {
      request.session.userCase = undefined;
      RespondentContestClaimControllerHelper.resetRespondentContestClaimDetails(request);
      expect(request.session.userCase).toStrictEqual(undefined);
    });
    it('resets user case contest claim details when request has user case', () => {
      request.session.userCase = _.cloneDeep(mockValidCaseWithId);
      setUserCaseEt3ResponseContestClaimDetails(request);
      RespondentContestClaimControllerHelper.resetRespondentContestClaimDetails(request);
      expect(expectResultsForUserCase(request.session.userCase)).toStrictEqual(true);
    });
    it('resets user case contest claim details when request has user case and selected respondent', () => {
      request.session.userCase = _.cloneDeep(mockValidCaseWithIdWithFullRespondentDetails);
      request.session.selectedRespondentIndex = 0;
      setUserCaseEt3ResponseContestClaimDetails(request);
      setUserCaseSelectedRespondentEt3ResponseContestClaimDetails(request);
      RespondentContestClaimControllerHelper.resetRespondentContestClaimDetails(request);
      const selectedRespondent = RespondentUtils.findSelectedRespondentByRequest(request);
      expect(expectResultsForSelectedRespondent(selectedRespondent)).toStrictEqual(true);
      expect(expectResultsForUserCase(request.session.userCase)).toStrictEqual(true);
    });
    it('resets user case contest claim details when request has user case but user case not has any contest claim details', () => {
      request.session.userCase = _.cloneDeep(mockValidCaseWithIdWithFullRespondentDetails);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase.et3ResponseContestClaimDocument = undefined;
      setUserCaseSelectedRespondentEt3ResponseContestClaimDetails(request);
      RespondentContestClaimControllerHelper.resetRespondentContestClaimDetails(request);
      const selectedRespondent = request.session.userCase.respondents[request.session.selectedRespondentIndex];
      expect(expectResultsForSelectedRespondent(selectedRespondent)).toStrictEqual(true);
      expect(expectResultsForUserCase(request.session.userCase)).toStrictEqual(true);
    });
    it('should not remove contest claim document from document collection when there is no uploaded document', () => {
      request.session.userCase = _.cloneDeep(mockValidCaseWithIdWithFullRespondentDetails);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase.documentCollection = _.cloneDeep(et3ResponseContestClaimDocument);
      setUserCaseSelectedRespondentEt3ResponseContestClaimDetails(request);
      setUserCaseEt3ResponseContestClaimDetails(request);
      request.session.userCase.respondents[request.session.selectedRespondentIndex].et3ResponseContestClaimDocument =
        undefined;
      request.session.userCase.et3ResponseContestClaimDocument = undefined;
      RespondentContestClaimControllerHelper.resetRespondentContestClaimDetails(request);
      const selectedRespondent: RespondentET3Model =
        request.session.userCase.respondents[request.session.selectedRespondentIndex];
      expect(expectResultsForSelectedRespondent(selectedRespondent)).toStrictEqual(true);
      expect(expectResultsForUserCase(request.session.userCase)).toStrictEqual(true);
      expect(request.session.userCase.documentCollection).toEqual(et3ResponseContestClaimDocument);
    });
    it('should not remove employer contract claim document from document collection when uploaded document name not matches with the file name in the document collection', () => {
      request.session.userCase = _.cloneDeep(mockValidCaseWithIdWithFullRespondentDetails);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase.documentCollection = _.cloneDeep(et3ResponseContestClaimDocument);
      request.session.userCase.documentCollection[0].value.uploadedDocument.document_filename = 'dummy_file_name_0.pdf';
      request.session.userCase.documentCollection[1].value.uploadedDocument.document_filename = 'dummy_file_name_1.pdf';
      request.session.userCase.documentCollection[2].value.uploadedDocument.document_filename = 'dummy_file_name_2.pdf';
      const newFileCollection = _.cloneDeep(request.session.userCase.documentCollection);
      setUserCaseSelectedRespondentEt3ResponseContestClaimDetails(request);
      setUserCaseEt3ResponseContestClaimDetails(request);
      RespondentContestClaimControllerHelper.resetRespondentContestClaimDetails(request);
      const selectedRespondent = request.session.userCase.respondents[request.session.selectedRespondentIndex];
      expect(expectResultsForSelectedRespondent(selectedRespondent)).toStrictEqual(true);
      expect(request.session.userCase.documentCollection).toStrictEqual(newFileCollection);
      expect(expectResultsForUserCase(request.session.userCase)).toStrictEqual(true);
    });
    it('should remove employer contract claim document from document collection when uploaded documents names matches with the file names in the document collection', () => {
      request.session.userCase = _.cloneDeep(mockValidCaseWithIdWithFullRespondentDetails);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase.documentCollection = _.cloneDeep(et3ResponseContestClaimDocument);
      setUserCaseEt3ResponseContestClaimDetails(request);
      setUserCaseSelectedRespondentEt3ResponseContestClaimDetails(request);
      RespondentContestClaimControllerHelper.resetRespondentContestClaimDetails(request);
      const selectedRespondent = request.session.userCase.respondents[request.session.selectedRespondentIndex];
      expect(expectResultsForSelectedRespondent(selectedRespondent)).toStrictEqual(true);
      expect(request.session.userCase.documentCollection).toStrictEqual([]);
      expect(request.session.userCase.documentCollection).toHaveLength(DefaultValues.NUMBER_ZERO);
      expect(expectResultsForUserCase(request.session.userCase)).toStrictEqual(true);
    });
  });
});
