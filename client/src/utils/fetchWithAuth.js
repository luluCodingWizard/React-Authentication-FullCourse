// src/utils/fetchWithAuth.js

export const fetchWithAuth = async (url, options = {}, callback) => {
  let accessToken = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    console.warn("Access token expired. Attempting refresh...");
    console.log(refreshToken);
    const refreshResponse = await fetch(
      `http://localhost:5000/api/auth/refresh-token`,
      {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify({ token: refreshToken }),
      }
    );

    if (refreshResponse.ok) {
      const { token: newAccessToken } = await refreshResponse.json();
      localStorage.setItem("token", newAccessToken);

      // Retry the original request with the new token
      fetchOptions.headers.Authorization = `Bearer ${newAccessToken}`;
      return fetch(url, fetchOptions);
    } else {
      console.error("Refresh token expired or invalid. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      // Trigger the logout warning
      if (callback) {
        callback();
      }
    }
  }

  return response;
};
