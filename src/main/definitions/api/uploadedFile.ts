export type UploadedFile =
  | {
      [fieldname: string]: Express.Multer.File;
    }
  | Express.Multer.File;
