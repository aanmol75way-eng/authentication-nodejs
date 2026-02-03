export const createError = (message: string, statusCode = 500) => {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  return error;
};
