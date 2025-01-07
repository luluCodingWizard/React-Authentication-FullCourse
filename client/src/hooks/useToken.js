import { useState } from "react";

export const useToken = () => {
  // step 1: create token state to linked to localstorage
  const [token, setTokenInternal] = useState(() => {
    return localStorage.getItem("token");
  });

  // step 2:  function that updates the token in my state and local storage
  const setToken = (newToken) => {
    console.log("setToken");
    console.log(newToken);
    localStorage.setItem("token", newToken);
    setTokenInternal(newToken);
  };

  // step 3: function to clear my token
  const clearToken = () => {
    localStorage.removeItem("token");
    setTokenInternal(null);
  };

  // step 3: return teh token and teh updater function
  return { token, setToken, clearToken };
};
