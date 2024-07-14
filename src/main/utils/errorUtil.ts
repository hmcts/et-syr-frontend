export default class ErrorUtil {
  public static throwError(err: Error, errorName: string): void {
    const error = new Error(err.message);
    error.name = errorName;
    if (err.stack) {
      error.stack = err.stack;
    }
    throw error;
  }
  public static throwManuelError(message: string, name: string): void {
    const err = new Error(message);
    err.name = name;
    throw err;
  }
}
