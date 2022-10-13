import { useState, useCallback } from 'react';
import axios from 'axios';

const useHttp = (method = 'GET', beginWithLoading = false) => {
  const [isLoading, setIsLoading] = useState(beginWithLoading);
  const [results, setResults] = useState();
  const [error, setError] = useState('');
  const success = !!(!isLoading && !error && results);

  const sendRequest = useCallback(
    async (url, body, headers) => {
      if (!beginWithLoading) setIsLoading(true);

      try {
        const { data } = await axios({
          url,
          method,
          data: body,
          headers,
        });

        setResults(data);
        setError('');
      } catch (err) {
        const message =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          err.toString();
        setError(message);
      }

      setIsLoading(false);
    },
    [beginWithLoading, method]
  );

  return {
    results,
    isLoading,
    error,
    success,
    sendRequest,
  };
};

export default useHttp;
