import EventEmitter from 'events';

import { Request } from 'express';
import { Session } from 'express-session';

import { CaseWithId } from './case';
import { ApiDocumentTypeItem } from './complexTypes/documentTypeItem';
import { FormError } from './form';
import { AnyRecord } from './util-types';

export interface AppRequest<T = Partial<AnyRecord>> extends Request {
  session: AppSession;
  body: T;
  fileTooLarge?: boolean;
  pause(): this;
  resume(): this;
  isPaused(): boolean;
  setEncoding(encoding: BufferEncoding): this;
  unpipe(destination?: WritableStream): this;
  wrap(oldStream: ReadableStream): this;
}
interface Uint8Array extends RelativeIndexable<number> {}
interface WritableStream extends EventEmitter {
  writable: boolean;
  write(buffer: Uint8Array | string, cb?: (err?: Error | null) => void): boolean;
  write(str: string, encoding?: BufferEncoding, cb?: (err?: Error | null) => void): boolean;
  end(cb?: () => void): this;
  end(data: string | Uint8Array, cb?: () => void): this;
  end(str: string, encoding?: BufferEncoding, cb?: () => void): this;
}

interface ReadableStream extends EventEmitter {
  readable: boolean;
  read(size?: number): string | Buffer;
  setEncoding(encoding: BufferEncoding): this;
  pause(): this;
  resume(): this;
  isPaused(): boolean;
  pipe<T extends WritableStream>(destination: T, options?: { end?: boolean | undefined }): T;
  unpipe(destination?: WritableStream): this;
  unshift(chunk: string | Uint8Array, encoding?: BufferEncoding): void;
  wrap(oldStream: ReadableStream): this;
  [Symbol.asyncIterator](): AsyncIterableIterator<string | Buffer>;
}

export interface AppSession extends Session {
  caseNumberChecked?: boolean;
  contactTribunalSelection?: string;
  contactType?: string;
  cookies?: string;
  documentDownloadPage?: string;
  errors: FormError[] | undefined;
  et1FormEnglish?: ApiDocumentTypeItem;
  et1FormWelsh?: ApiDocumentTypeItem;
  fileTooLarge?: boolean;
  guid: string | undefined;
  lang: string | undefined;
  respondentNameFromForm?: string;
  respondentRedirectCheckAnswer?: boolean;
  returnUrl: string;
  subSectionUrl: string;
  selectedAcasCertificate?: ApiDocumentTypeItem;
  selectedRespondentIndex?: number;
  submittedCase?: CaseWithId;
  user: UserDetails;
  userCase: CaseWithId;
  isSelfAssignment?: boolean;
}

export interface UserDetails {
  accessToken: string;
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  isCitizen: boolean;
}
