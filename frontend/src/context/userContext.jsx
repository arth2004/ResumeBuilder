import React, { createContext, useEffect, useRef, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const didFetchRef = useRef(false);

  useEffect(() => {
  if (didFetchRef.current) return;
  didFetchRef.current = true;

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.Auth.GET_PROFILE);
      setUser(res.data.user ?? res.data);
    } catch (err) {
      // if 401 — normal for anonymous user, so just clear context
      if (err?.response?.status === 401) {
        setUser(null);
      } else {
        console.warn("profile fetch failed:", err);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

  const updateUser = (userData) => {
    setUser(userData);
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
