import { Et3ResponseStatus } from '../../../../main/definitions/constants';
import { LinkStatus } from '../../../../main/definitions/links';
import {
  getOtherRespondentEt3LinkStatus,
  getOtherRespondentEt3TableRows,
} from '../../../../main/helpers/controller/OtherRespondentsEt3Helper';
import { mockRequest } from '../../mocks/mockRequest';

const labels = {
  et3FormText: 'ET3 Form',
  et3AttachmentText: 'ET3 attachment',
  acceptanceLetter: 'Response accepted',
};

describe('Other respondents ET3 helper', () => {
  const req = mockRequest({});

  beforeEach(() => {
    req.url = '/other-respondents-et3';
    req.session.selectedRespondentIndex = 0;
    req.session.userCase.respondents = [
      {
        responseStatus: 'Submitted',
        et3Form: {
          document_url: 'http://dm-store/documents/current-et3',
          document_filename: 'Current respondent ET3.pdf',
          document_binary_url: 'http://dm-store/documents/current-et3/binary',
          category_id: 'ET3',
          upload_timestamp: '2026-02-20T10:00:00.000Z',
        },
      },
      {
        responseStatus: Et3ResponseStatus.ET3_RESPONSE_STATUS_ACCEPTED,
        responseReceivedDate: '2026-02-25',
        et3Form: {
          document_url: 'http://dm-store/documents/other-et3',
          document_filename: 'Magic Roundabout Partnership-ET3_Response.pdf',
          document_binary_url: 'http://dm-store/documents/other-et3/binary',
          category_id: 'ET3',
          upload_timestamp: '2026-02-25T10:00:00.000Z',
        },
        et3ResponseEmployerClaimDocument: {
          document_url: 'http://dm-store/documents/other-attachment',
          document_filename: 'GoR.docx',
          document_binary_url: 'http://dm-store/documents/other-attachment/binary',
          category_id: 'ET3 Attachment',
          upload_timestamp: '2026-02-24T11:00:00.000Z',
        },
      },
    ];
    req.session.userCase.documentCollection = [
      {
        id: 'acceptance-doc',
        value: {
          responseClaimDocuments: 'Response accepted',
          dateOfCorrespondence: '2026-02-26',
          uploadedDocument: {
            document_url: 'http://dm-store/documents/acceptance',
            document_filename: 'Acceptance of ET3 2.11.docx',
            document_binary_url: 'http://dm-store/documents/acceptance/binary',
          },
        },
      },
      {
        id: 'collection-et3',
        value: {
          typeOfDocument: 'ET3',
          dateOfCorrespondence: '2026-02-25',
          uploadedDocument: {
            document_url: 'http://dm-store/documents/other-et3',
            document_filename: 'Magic Roundabout Partnership-ET3_Response.pdf',
            document_binary_url: 'http://dm-store/documents/other-et3/binary',
          },
        },
      },
    ];
  });

  it('stays not available yet when the case has one respondent', () => {
    req.session.userCase.respondents = [req.session.userCase.respondents[0]];
    expect(getOtherRespondentEt3LinkStatus(req, LinkStatus.NOT_YET_AVAILABLE)).toBe(LinkStatus.NOT_YET_AVAILABLE);
  });

  it('stays not available yet when the co-respondent ET3 is not accepted', () => {
    req.session.userCase.respondents[1].responseStatus = 'Submitted';
    expect(getOtherRespondentEt3LinkStatus(req, LinkStatus.NOT_YET_AVAILABLE)).toBe(LinkStatus.NOT_YET_AVAILABLE);
  });

  it('is ready to view when another respondent ET3 has been accepted', () => {
    expect(getOtherRespondentEt3LinkStatus(req, LinkStatus.NOT_YET_AVAILABLE)).toBe(LinkStatus.READY_TO_VIEW);
  });

  it('stays viewed after the co-respondent ET3s have been opened', () => {
    expect(getOtherRespondentEt3LinkStatus(req, LinkStatus.VIEWED)).toBe(LinkStatus.VIEWED);
  });

  it('lists the other respondent ET3, attachment and acceptance letter, newest first', () => {
    const rows = getOtherRespondentEt3TableRows(req, labels);

    expect(rows).toHaveLength(3);
    expect(rows[0][1].text).toBe('Response accepted');
    expect(rows[0][2].html).toContain('Acceptance of ET3 2.11.docx');
    expect(rows[0][2].html).toContain('/getCaseDocument/acceptance-doc');
    expect(rows[1][1].text).toBe('ET3 Form');
    expect(rows[1][2].html).toContain('Magic Roundabout Partnership-ET3_Response.pdf');
    expect(rows[1][2].html).toContain('/getCaseDocument/collection-et3');
    expect(rows[2][1].text).toBe('ET3 attachment');
    expect(rows[2][2].html).toContain('GoR.docx');
    expect(rows.map(row => row[2].html).join(' ')).not.toContain('Current respondent ET3.pdf');
  });
});
