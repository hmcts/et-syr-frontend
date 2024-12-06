import { RespondentET3Model } from '../../../main/definitions/case';

export const mockRespondentET3Model: RespondentET3Model = {
  respondentName: 'Test Company',
  respondentAddressLine1: '48, Tithe Barn Drive',
  respondentAddressPostTown: 'Maidenhead',
  respondentAddressCountry: 'England',
  respondentAddressPostCode: 'SL6 2DE',
  respondentEnterPostcode: 'SL6 2DE',
  acasCertNum: 'R123456/78/90',
  respondentAddress: {
    Country: 'England',
    PostCode: 'SL6 2DE',
    PostTown: 'Maidenhead',
    AddressLine1: '48, Tithe Barn Drive',
  },
  respondentACAS: 'R123456/78/90',
  ccdId: '180d5b45-7925-420a-9bb4-3f6d501ca7a8',
  et3Status: 'inProgress',
};

export const mockRespondentET3ModelWithoutAddress: RespondentET3Model = {
  respondentName: 'Test Company',
  respondentEnterPostcode: 'SL6 2DE',
  acasCertNum: 'R123456/78/90',
  respondentACAS: 'R123456/78/90',
  ccdId: '180d5b45-7925-420a-9bb4-3f6d501ca7a8',
  et3Status: 'inProgress',
};

export const mockRespondentET3ModelWithResponseRespondentAddress: RespondentET3Model = {
  respondentName: 'Test Company',
  responseRespondentAddress: {
    Country: 'England',
    PostCode: 'SL6 2DE',
    PostTown: 'Maidenhead',
    County: 'Berkshire',
    AddressLine1: '48, Tithe Barn Drive',
    AddressLine2: '49, Tithe Barn Drive',
    AddressLine3: '50, Tithe Barn Drive',
  },
  respondentACAS: 'R123456/78/90',
  ccdId: '180d5b45-7925-420a-9bb4-3f6d501ca7a8',
  et3Status: 'inProgress',
};

export const mockRespondentET3ModelWithResponseRespondentAddressFields: RespondentET3Model = {
  respondentName: 'Test Company',
  responseRespondentAddressLine1: '48, Tithe Barn Drive',
  responseRespondentAddressLine2: '49, Tithe Barn Drive',
  responseRespondentAddressLine3: '50, Tithe Barn Drive',
  responseRespondentAddressPostTown: 'Maidenhead',
  responseRespondentAddressCountry: 'England',
  responseRespondentAddressCounty: 'Berkshire',
  responseRespondentAddressPostCode: 'SL6 2DE',
  respondentEnterPostcode: 'SL6 2DE',
  respondentACAS: 'R123456/78/90',
  ccdId: '180d5b45-7925-420a-9bb4-3f6d501ca7a8',
  et3Status: 'inProgress',
};

export const mockRespondentET3ModelWithRespondentAddress: RespondentET3Model = {
  respondentName: 'Test Company',
  acasCertNum: 'R123456/78/90',
  respondentAddress: {
    Country: 'England',
    PostCode: 'SL6 2DE',
    PostTown: 'Maidenhead',
    County: 'Berkshire',
    AddressLine1: '48, Tithe Barn Drive',
    AddressLine2: '49, Tithe Barn Drive',
    AddressLine3: '50, Tithe Barn Drive',
  },
  respondentACAS: 'R123456/78/90',
  ccdId: '180d5b45-7925-420a-9bb4-3f6d501ca7a8',
  et3Status: 'inProgress',
};

export const mockRespondentET3ModelWithRespondentAddressFields: RespondentET3Model = {
  respondentName: 'Test Company',
  respondentAddressLine1: '48, Tithe Barn Drive',
  respondentAddressLine2: '49, Tithe Barn Drive',
  respondentAddressLine3: '50, Tithe Barn Drive',
  respondentAddressPostTown: 'Maidenhead',
  respondentAddressCountry: 'England',
  respondentAddressCounty: 'Berkshire',
  respondentAddressPostCode: 'SL6 2DE',
  respondentEnterPostcode: 'SL6 2DE',
  acasCertNum: 'R123456/78/90',
  respondentAddress: undefined,
  respondentACAS: 'R123456/78/90',
  ccdId: '180d5b45-7925-420a-9bb4-3f6d501ca7a8',
  et3Status: 'inProgress',
};
