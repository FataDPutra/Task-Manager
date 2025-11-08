import { ERROR_MESSAGES, HTTP_STATUS } from "../constants/apiConstants";

/**
 * Handle error response dari API
 *
 * @param {Error} error
 * @returns {Object}
 */
export const handleApiError = (error) => {
  if (!error.response) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      errors: null,
    };
  }

  const { status, data } = error.response;

  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
      return {
        message: ERROR_MESSAGES.UNAUTHORIZED,
        errors: null,
      };
    case HTTP_STATUS.NOT_FOUND:
      return {
        message: data?.message || ERROR_MESSAGES.NOT_FOUND,
        errors: null,
      };
    case HTTP_STATUS.BAD_REQUEST:
      return {
        message: data?.message || "Validasi gagal",
        errors: data?.errors || null,
      };
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return {
        message: "Terlalu banyak request. Silakan coba lagi nanti.",
        errors: null,
      };
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return {
        message: ERROR_MESSAGES.SERVER_ERROR,
        errors: null,
      };
    default:
      return {
        message: data?.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        errors: data?.errors || null,
      };
  }
};

/**
 * Format error messages dari validation errors
 *
 * @param {Object} errors
 * @returns {string}
 */
export const formatValidationErrors = (errors) => {
  if (!errors || typeof errors !== "object") {
    return "";
  }

  return Object.values(errors).flat().join(", ");
};
