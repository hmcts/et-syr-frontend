import { AxiosError } from 'axios';

// Get details from an axios error
export const axiosErrorDetails = (
  axiosError: AxiosError<{ error: string; message: string; trace: string }>
): string => {
  let errorMessage = axiosError.message;
  if (axiosError.response?.data?.error) {
    const errorDetail: string = axiosError.response.data.message
      ? axiosError.response.data.message
      : axiosError.response.data.trace;
    errorMessage += `, ${errorDetail}`;
  }
  return errorMessage;
};
