export const mockValidMulterFile: Express.Multer.File = {
  buffer: Buffer.from('./et3Request.json'),
  destination: '',
  encoding: '',
  fieldname: '',
  filename: '',
  mimetype: '',
  originalname: 'testFile.pdf',
  path: '',
  size: 0,
  stream: undefined,
};
export const mockInvalidMulterFileWithEmptyFileName: Express.Multer.File = {
  buffer: Buffer.from('./et3Request.json'),
  destination: '',
  encoding: '',
  fieldname: '',
  filename: '',
  mimetype: '',
  originalname: '   ',
  path: '',
  size: 0,
  stream: undefined,
};
export const mockInvalidMulterFileWithInvalidName: Express.Multer.File = {
  buffer: Buffer.from('./et3Request.json'),
  destination: '',
  encoding: '',
  fieldname: '',
  filename: '',
  mimetype: '',
  originalname: 'testFil?e.pdf',
  path: '',
  size: 0,
  stream: undefined,
};
export const mockInvalidMulterFileWithInvalidFormat: Express.Multer.File = {
  buffer: Buffer.from('./et3Request.json'),
  destination: '',
  encoding: '',
  fieldname: '',
  filename: '',
  mimetype: '',
  originalname: 'testFile.test',
  path: '',
  size: 0,
  stream: undefined,
};
export const mockInvalidMulterFileWithInvalidBuffer: Express.Multer.File = {
  buffer: undefined,
  destination: '',
  encoding: '',
  fieldname: '',
  filename: '',
  mimetype: '',
  originalname: 'testFile.pdf',
  path: '',
  size: 0,
  stream: undefined,
};