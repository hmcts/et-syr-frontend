import { CaseFlags } from '../../../../main/definitions/case';
import { buildCuiFlagDetails, mergeRespondentExternalFlags } from '../../../../main/helpers/controller/CuiFlagHelper';
import { CUIFlagDetails, mergeCUIFlagItems } from '../../../../main/services/CuiService';

jest.mock('../../../../main/services/CuiService', () => ({
  mergeCUIFlagItems: jest.fn((existingFlags = [], replacementFlags = []) => [...existingFlags, ...replacementFlags]),
}));

describe('CuiFlagHelper', () => {
  const cuiYes = 'Yes' as CUIFlagDetails['details'][number]['value']['availableExternally'];
  const cuiNo = 'No' as CUIFlagDetails['details'][number]['value']['hearingRelevant'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should build default CUI flag details when respondent flags are missing', () => {
    expect(buildCuiFlagDetails(undefined, 'Fallback Party', 'Respondent')).toEqual({
      partyName: 'Fallback Party',
      roleOnCase: 'Respondent',
      details: [],
    });
  });

  it('should normalise existing flag details for the CUI service', () => {
    const respondentExternalFlags: CaseFlags = {
      partyName: 'Existing Party',
      roleOnCase: 'Existing Role',
      details: [
        {
          id: 'flag-1',
          value: {
            name: 'Support',
            name_cy: 'Cymorth',
            dateTimeCreated: '2026-08-18T10:00:00',
            path: [
              { id: 'path-1', value: 'Parent' },
              { id: 'path-2', value: { name: 'Child' } as never },
              { id: 'path-3', name: 'Named path' } as never,
              { id: 'path-4', value: {} as never },
            ],
            flagCode: 'RA0001',
            subTypeValue: 'Step free access',
            otherDescription: 'Other support',
            flagComment: 'Initial comment',
            status: 'Active',
          },
        },
      ],
    };

    expect(buildCuiFlagDetails(respondentExternalFlags, 'Fallback Party', 'Respondent')).toEqual({
      partyName: 'Fallback Party',
      roleOnCase: 'Existing Role',
      details: [
        {
          id: 'flag-1',
          value: {
            name: 'Support',
            name_cy: 'Cymorth',
            dateTimeCreated: '2026-08-18T10:00:00',
            path: [
              { id: 'path-1', name: 'Parent' },
              { id: 'path-2', name: 'Child' },
              { id: 'path-3', name: 'Named path' },
            ],
            hearingRelevant: 'No',
            flagCode: 'RA0001',
            availableExternally: 'Yes',
            subTypeValue: 'Step free access',
            otherDescription: 'Other support',
            flagComment: 'Initial comment',
            status: 'Active',
          },
        },
      ],
    });
  });

  it('should default missing existing flag values', () => {
    const respondentExternalFlags: CaseFlags = {
      details: [
        {
          id: 'flag-with-defaults',
          value: {
            path: 'not-a-path-array' as never,
          },
        },
      ],
    };

    expect(buildCuiFlagDetails(respondentExternalFlags, 'Fallback Party', 'Respondent').details[0].value).toEqual({
      name: '',
      name_cy: '',
      dateTimeCreated: '',
      path: [],
      hearingRelevant: 'No',
      flagCode: '',
      availableExternally: 'Yes',
    });
  });

  it('should merge replacement flags while preserving existing metadata', () => {
    const existingFlags: CaseFlags = {
      groupId: 'group-1',
      roleOnCase: 'Existing Role',
      details: [
        {
          id: 'existing-flag',
          value: { name: 'Existing flag' },
        },
      ],
    };
    const replacementFlags: CUIFlagDetails = {
      partyName: '',
      roleOnCase: '',
      details: [
        {
          id: 'replacement-flag',
          value: {
            name: 'Replacement flag',
            name_cy: 'Replacement flag',
            dateTimeCreated: '2026-08-18T10:00:00',
            path: [],
            hearingRelevant: cuiNo,
            flagCode: 'RA0001',
            availableExternally: cuiYes,
          },
        },
      ],
    };

    expect(mergeRespondentExternalFlags(existingFlags, replacementFlags, 'Fallback Party', 'Respondent')).toEqual({
      groupId: 'group-1',
      partyName: 'Fallback Party',
      roleOnCase: 'Existing Role',
      details: [
        {
          id: 'existing-flag',
          value: { name: 'Existing flag' },
        },
        {
          id: 'replacement-flag',
          value: {
            name: 'Replacement flag',
            name_cy: 'Replacement flag',
            dateTimeCreated: '2026-08-18T10:00:00',
            path: [],
            hearingRelevant: cuiNo,
            flagCode: 'RA0001',
            availableExternally: cuiYes,
          },
        },
      ],
    });
    expect(mergeCUIFlagItems).toHaveBeenCalledWith(existingFlags.details, replacementFlags.details);
  });
});
