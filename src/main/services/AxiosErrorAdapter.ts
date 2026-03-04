import { AxiosError } from 'axios';

// Get details from an axios error
export const axiosErrorDetails = (axiosError: AxiosError<{ error: string; message: string }>): string => {
  let errorMessage = axiosError.message;
  const data = axiosError.response?.data;

  if (typeof data === 'string') {
    errorMessage += `, ${data}`;
  } else if (data?.message || data?.error) {
    errorMessage += `, ${data.message || data.error}`;
  } else if (data) {
    errorMessage += `, ${JSON.stringify(data)}`;
  }
  return errorMessage;
};
