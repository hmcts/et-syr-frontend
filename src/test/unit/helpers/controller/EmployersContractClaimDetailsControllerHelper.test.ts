import _ from 'lodash';

import { DefaultValues, FormFieldNames, ValidationErrors } from '../../../../main/definitions/constants';
import EmployersContractClaimDetailsControllerHelper from '../../../../main/helpers/controller/EmployersContractClaimDetailsControllerHelper';
import { mockCaseWithIdWithRespondents } from '../../mocks/mockCaseWithId';
import { mockRequest } from '../../mocks/mockRequest';

describe('EmployersContractClaimDetailsControllerHelper tests', () => {
  const request = mockRequest({});
  describe('areInputValuesValid', () => {
    it('sets required error to session for hidden field when there is no file and detail entered', () => {
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase.et3ResponseEmployerClaimDocument = undefined;
      request.session.userCase.respondents[0].et3ResponseEmployerClaimDocument = undefined;
      request.session.userCase.et3ResponseEmployerClaimDetails = DefaultValues.STRING_EMPTY;
      expect(
        EmployersContractClaimDetailsControllerHelper.areInputValuesValid(request, mockCaseWithIdWithRespondents)
      ).toEqual(false);
      expect(request.session.errors).toEqual([
        {
          errorType: ValidationErrors.REQUIRED,
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        },
      ]);
    });
    it('sets too long error to session for  when employer claim detail field has more than 3000 characters', () => {
      const userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.userCase.et3ResponseEmployerClaimDocument = undefined;
      request.session.userCase.respondents[0].et3ResponseEmployerClaimDocument = undefined;
      userCase.et3ResponseEmployerClaimDetails = DefaultValues.STRING_HASH.repeat(3001);
      expect(EmployersContractClaimDetailsControllerHelper.areInputValuesValid(request, userCase)).toEqual(false);
      expect(request.session.errors).toEqual([
        {
          errorType: ValidationErrors.TOO_LONG,
          propertyName: FormFieldNames.EMPLOYERS_CONTRACT_CLAIM_DETAILS.ET3_RESPONSE_EMPLOYER_CLAIM_DETAILS,
        },
      ]);
    });
    it('removes all session errors when employer claim detail field is filled and has less than 3000 characters', () => {
      request.session.selectedRespondentIndex = 0;
      const userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.userCase.et3ResponseEmployerClaimDocument = undefined;
      request.session.userCase.respondents[0].et3ResponseEmployerClaimDocument = undefined;
      userCase.et3ResponseEmployerClaimDetails = DefaultValues.STRING_HASH.repeat(2000);
      expect(EmployersContractClaimDetailsControllerHelper.areInputValuesValid(request, userCase)).toEqual(true);
      expect(request.session.errors).toEqual(DefaultValues.COLLECTION_EMPTY);
    });
    it('removes all session errors when there is employer claim document', () => {
      request.session.selectedRespondentIndex = 0;
      const userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.userCase.et3ResponseEmployerClaimDocument = {
        document_binary_url: 'document_binary_url',
        document_filename: 'document_filename',
        document_url: 'document_url',
        category_id: 'category_id',
        upload_timestamp: 'upload_timestamp',
      };
      request.session.userCase.respondents[0].et3ResponseEmployerClaimDocument = {
        document_binary_url: 'document_binary_url',
        document_filename: 'document_filename',
        document_url: 'document_url',
        category_id: 'category_id',
        upload_timestamp: 'upload_timestamp',
      };
      userCase.et3ResponseEmployerClaimDetails = DefaultValues.STRING_HASH.repeat(2000);
      expect(EmployersContractClaimDetailsControllerHelper.areInputValuesValid(request, userCase)).toEqual(true);
      expect(request.session.errors).toEqual(DefaultValues.COLLECTION_EMPTY);
    });
  });
});
