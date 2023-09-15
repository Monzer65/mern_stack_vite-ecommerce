/** @format */

import { useState, useEffect } from "react";
import axios from "axios";

// A custom hook that accepts a url and an optional config object
// and returns an object with the response data, loading status and error
const useAxios = (url, config = {}) => {
  // Initialize the state variables
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use useEffect to perform the axios request
  useEffect(() => {
    // Set the loading state to true
    setLoading(true);

    // Create a cancel token source
    const source = axios.CancelToken.source();

    // Define the async function that will fetch the data
    const fetchData = async () => {
      try {
        // Make the request with the url, config and cancel token
        const response = await axios(url, {
          ...config,
          cancelToken: source.token,
        });

        // Set the data state to the response data
        setData(response.data);
      } catch (err) {
        // If the request was cancelled, don't update the state
        if (axios.isCancel(err)) return;

        // Otherwise, set the error state to the error message
        setError(err.message);
      } finally {
        // Set the loading state to false
        setLoading(false);
      }
    };

    // Call the async function
    fetchData();

    // Return a cleanup function that cancels the request
    return () => {
      source.cancel();
    };
  }, []); // The effect depends on the url and config

  // Return an object with data, loading and error
  return { data, loading, error };
};

export default useAxios;
