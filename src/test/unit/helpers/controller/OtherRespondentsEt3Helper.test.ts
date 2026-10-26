import { YesOrNo } from '../../../../main/definitions/case';
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
    req.session.userCase.documentCollection = [];
    expect(getOtherRespondentEt3LinkStatus(req, LinkStatus.NOT_YET_AVAILABLE)).toBe(LinkStatus.NOT_YET_AVAILABLE);
  });

  it('stays not available yet when a single respondent has their own acceptance letter in the document list', () => {
    req.session.userCase.respondents = [req.session.userCase.respondents[0]];
    expect(getOtherRespondentEt3LinkStatus(req, LinkStatus.NOT_YET_AVAILABLE)).toBe(LinkStatus.NOT_YET_AVAILABLE);
    expect(getOtherRespondentEt3TableRows(req, labels)).toHaveLength(0);
  });

  it('stays not available yet when no respondent is selected', () => {
    req.session.selectedRespondentIndex = undefined;
    expect(getOtherRespondentEt3LinkStatus(req, LinkStatus.NOT_YET_AVAILABLE)).toBe(LinkStatus.NOT_YET_AVAILABLE);
    expect(getOtherRespondentEt3TableRows(req, labels)).toHaveLength(0);
  });

  it('stays not available yet when the co-respondent has not submitted an ET3', () => {
    req.session.userCase.respondents[1].responseStatus = undefined;
    req.session.userCase.respondents[1].responseReceived = YesOrNo.NO;
    req.session.userCase.respondents[1].et3Form = undefined;
    req.session.userCase.respondents[1].et3ResponseEmployerClaimDocument = undefined;
    req.session.userCase.documentCollection = [];
    expect(getOtherRespondentEt3LinkStatus(req, LinkStatus.NOT_YET_AVAILABLE)).toBe(LinkStatus.NOT_YET_AVAILABLE);
  });

  it('stays not available yet when a co-respondent has not submitted but the document list has an acceptance letter', () => {
    req.session.userCase.respondents[1].responseStatus = undefined;
    req.session.userCase.respondents[1].responseReceived = YesOrNo.NO;
    expect(getOtherRespondentEt3LinkStatus(req, LinkStatus.NOT_YET_AVAILABLE)).toBe(LinkStatus.NOT_YET_AVAILABLE);
    expect(getOtherRespondentEt3TableRows(req, labels)).toHaveLength(0);
  });

  it('stays not available yet when the ET3 is received but there is no document to open', () => {
    req.session.userCase.respondents[1].responseStatus = undefined;
    req.session.userCase.respondents[1].responseReceived = YesOrNo.YES;
    req.session.userCase.respondents[1].et3Form = undefined;
    req.session.userCase.respondents[1].et3ResponseEmployerClaimDocument = undefined;
    req.session.userCase.documentCollection = [];
    expect(getOtherRespondentEt3LinkStatus(req, LinkStatus.NOT_YET_AVAILABLE)).toBe(LinkStatus.NOT_YET_AVAILABLE);
    expect(getOtherRespondentEt3TableRows(req, labels)).toHaveLength(0);
  });

  it('is ready to view when another respondent ET3 has been accepted', () => {
    expect(getOtherRespondentEt3LinkStatus(req, LinkStatus.NOT_YET_AVAILABLE)).toBe(LinkStatus.READY_TO_VIEW);
  });

  it('is ready to view when a represented co-respondent has submitted their ET3', () => {
    req.session.userCase.respondents[1].responseStatus = undefined;
    req.session.userCase.respondents[1].responseReceived = YesOrNo.YES;
    expect(getOtherRespondentEt3LinkStatus(req, LinkStatus.NOT_YET_AVAILABLE)).toBe(LinkStatus.READY_TO_VIEW);

    const rows = getOtherRespondentEt3TableRows(req, labels);
    expect(rows.map(row => row[2].html).join(' ')).toContain('Magic Roundabout Partnership-ET3_Response.pdf');
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
    expect(rows[0][2].html).toContain('rel="noreferrer noopener"');
    expect(rows[1][1].text).toBe('ET3 Form');
    expect(rows[1][2].html).toContain('Magic Roundabout Partnership-ET3_Response.pdf');
    expect(rows[1][2].html).toContain('/getCaseDocument/collection-et3');
    expect(rows[2][1].text).toBe('ET3 attachment');
    expect(rows[2][2].html).toContain('GoR.docx');
    expect(rows.map(row => row[2].html).join(' ')).not.toContain('Current respondent ET3.pdf');
  });

  it('lists accepted ET3 documents from the case document list when the respondent record has no form', () => {
    req.session.userCase.respondents[1] = {
      responseStatus: Et3ResponseStatus.ET3_RESPONSE_STATUS_ACCEPTED,
    };
    req.session.userCase.documentCollection = [
      {
        id: 'collection-et3',
        value: {
          typeOfDocument: 'ET3',
          dateOfCorrespondence: '2026-02-25',
          uploadedDocument: {
            document_url: 'http://dm-store/documents/represented-et3',
            document_filename: 'ET3 - Ermintrude Cow.pdf',
            document_binary_url: 'http://dm-store/documents/represented-et3/binary',
          },
        },
      },
      {
        id: 'collection-attachment',
        value: {
          typeOfDocument: 'ET3 Attachment',
          dateOfCorrespondence: '2026-02-24',
          uploadedDocument: {
            document_url: 'http://dm-store/documents/represented-attachment',
            document_filename: 'GoR.docx',
            document_binary_url: 'http://dm-store/documents/represented-attachment/binary',
          },
        },
      },
      {
        id: 'current-collection-et3',
        value: {
          typeOfDocument: 'ET3',
          dateOfCorrespondence: '2026-02-20',
          uploadedDocument: {
            document_url: 'http://dm-store/documents/current-et3',
            document_filename: 'Current respondent ET3.pdf',
            document_binary_url: 'http://dm-store/documents/current-et3/binary',
          },
        },
      },
    ];

    const rows = getOtherRespondentEt3TableRows(req, labels);

    expect(rows.map(row => row[2].html).join(' ')).toContain('ET3 - Ermintrude Cow.pdf');
    expect(rows.map(row => row[2].html).join(' ')).toContain('GoR.docx');
    expect(rows.map(row => row[2].html).join(' ')).not.toContain('Current respondent ET3.pdf');
  });

  it('does not list a co-respondent reasonable adjustments support document', () => {
    req.session.userCase.respondents[1].et3ResponseRespondentSupportDocument = {
      document_url: 'http://dm-store/documents/support-doc',
      document_filename: 'Reasonable adjustment.pdf',
      document_binary_url: 'http://dm-store/documents/support-doc/binary',
      category_id: 'ET3 Attachment',
      upload_timestamp: '2026-02-24T12:00:00.000Z',
    };
    req.session.userCase.documentCollection.push({
      id: 'collection-support-doc',
      value: {
        typeOfDocument: 'ET3 Attachment',
        dateOfCorrespondence: '2026-02-24',
        uploadedDocument: {
          document_url: 'http://dm-store/documents/support-doc',
          document_filename: 'Reasonable adjustment.pdf',
          document_binary_url: 'http://dm-store/documents/support-doc/binary',
        },
      },
    });

    const rows = getOtherRespondentEt3TableRows(req, labels);
    const rowHtml = rows.map(row => row[2].html).join(' ');

    expect(rowHtml).not.toContain('Reasonable adjustment.pdf');
    expect(rowHtml).not.toContain('support-doc');
    expect(rowHtml).toContain('GoR.docx');
  });

  it('does not list ET1 documents from the case document list', () => {
    req.session.userCase.documentCollection.push(
      {
        id: 'et1-form',
        value: {
          typeOfDocument: 'ET1',
          dateOfCorrespondence: '2026-02-27',
          uploadedDocument: {
            document_url: 'http://dm-store/documents/et1-form',
            document_filename: 'ET1 - claimant.pdf',
            document_binary_url: 'http://dm-store/documents/et1-form/binary',
          },
        },
      },
      {
        id: 'et1-attachment',
        value: {
          typeOfDocument: 'ET1 Attachment',
          dateOfCorrespondence: '2026-02-27',
          uploadedDocument: {
            document_url: 'http://dm-store/documents/et1-attachment',
            document_filename: 'Schedule of loss.pdf',
            document_binary_url: 'http://dm-store/documents/et1-attachment/binary',
          },
        },
      }
    );

    const rowHtml = getOtherRespondentEt3TableRows(req, labels)
      .map(row => row[2].html)
      .join(' ');

    expect(rowHtml).not.toContain('ET1 - claimant.pdf');
    expect(rowHtml).not.toContain('Schedule of loss.pdf');
    expect(rowHtml).toContain('Magic Roundabout Partnership-ET3_Response.pdf');
  });

  it('does not list an unsubmitted co-respondent draft from the case document list', () => {
    req.session.userCase.respondents[2] = {
      responseReceived: YesOrNo.NO,
      et3Form: {
        document_url: 'http://dm-store/documents/draft-et3',
        document_filename: 'Draft ET3.pdf',
        document_binary_url: 'http://dm-store/documents/draft-et3/binary',
        category_id: 'ET3',
        upload_timestamp: '2026-02-27T10:00:00.000Z',
      },
    };
    req.session.userCase.documentCollection.push({
      id: 'collection-draft-et3',
      value: {
        typeOfDocument: 'ET3',
        dateOfCorrespondence: '2026-02-27',
        uploadedDocument: {
          document_url: 'http://dm-store/documents/draft-et3',
          document_filename: 'Draft ET3.pdf',
          document_binary_url: 'http://dm-store/documents/draft-et3/binary',
        },
      },
    });

    const rowHtml = getOtherRespondentEt3TableRows(req, labels)
      .map(row => row[2].html)
      .join(' ');

    expect(rowHtml).not.toContain('Draft ET3.pdf');
    expect(rowHtml).toContain('Magic Roundabout Partnership-ET3_Response.pdf');
    expect(rowHtml).toContain('GoR.docx');
  });
});
