import { useState, useCallback } from "react";
import { handleApiError } from "../utils/errorHandler";

/**
 * Custom hook untuk handle API calls dengan loading dan error state
 *
 * @param {Function} apiCall
 * @returns {Object}
 */
export const useApi = (apiCall) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall(...args);
        return { success: true, data: result };
      } catch (err) {
        const errorData = handleApiError(err);
        setError(errorData);
        return { success: false, ...errorData };
      } finally {
        setLoading(false);
      }
    },
    [apiCall]
  );

  return { execute, loading, error, setError };
};
