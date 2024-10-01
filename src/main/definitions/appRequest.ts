import EventEmitter from 'events';

import { Request } from 'express';
import { Session } from 'express-session';

import { CaseWithId } from './case';
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
  returnUrl: string;
  lang: string | undefined;
  errors: FormError[] | undefined;
  userCase: CaseWithId;
  submittedCase?: CaseWithId;
  user: UserDetails;
  guid: string | undefined;
  fileTooLarge?: boolean;
  cookies?: string;
  respondentRedirectCheckAnswer?: boolean;
  contactType?: string;
  contactTribunalSelection?: string;
  documentDownloadPage?: string;
  respondentNameFromForm?: string;
}

export interface UserDetails {
  accessToken: string;
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  isCitizen: boolean;
}
