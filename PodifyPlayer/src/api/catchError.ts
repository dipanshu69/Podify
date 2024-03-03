import {isAxiosError} from 'axios';

export const catchAsyncError = (error: any): string => {
  let errorMessage = error.message;
  if (isAxiosError(error)) {
    const errorRes = error.response?.data;
    if (errorRes) {
      errorMessage = errorRes.error;
    }
  }

  return errorMessage;
};
