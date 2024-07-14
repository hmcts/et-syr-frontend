// Used in API formatter
export const combineDocuments = <T>(...arrays: T[][]): T[] =>
  [].concat(...arrays.filter(Array.isArray)).filter(doc => doc !== undefined);
