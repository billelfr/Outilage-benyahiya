"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchAdminMe, getErrorMessage } from "@/lib/adminApi";
import {
  clearAdminToken,
  getAdminToken,
  getDevOnlyAdminUser,
  isDevOnlyAuthBypassEnabled,
} from "@/lib/auth";
import { normalizeAdminUser } from "@/lib/normalize";

const AdminSessionContext = createContext(null);

export function AdminSessionProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function logout() {
    clearAdminToken();
    if (isDevOnlyAuthBypassEnabled()) { // DEV ONLY
      setAdmin(getDevOnlyAdminUser()); // DEV ONLY
      setError(""); // DEV ONLY
      return; // DEV ONLY
    }
    setAdmin(null);
  }

  useEffect(() => {
    let active = true;

    Promise.resolve().then(async () => {
      if (isDevOnlyAuthBypassEnabled()) { // DEV ONLY
        if (active) {
          setAdmin(normalizeAdminUser(getDevOnlyAdminUser())); // DEV ONLY
          setError(""); // DEV ONLY
          setLoading(false); // DEV ONLY
        }
        return; // DEV ONLY
      }

      const token = getAdminToken();

      if (!token) {
        if (active) {
          setAdmin(null);
          setLoading(false);
        }

        return;
      }

      try {
        if (active) {
          setLoading(true);
        }

        const currentAdmin = await fetchAdminMe();

        if (!active) {
          return;
        }

        setAdmin(normalizeAdminUser(currentAdmin));
        setError("");
      } catch (sessionError) {
        clearAdminToken();

        if (!active) {
          return;
        }

        setAdmin(null);
        setError(getErrorMessage(sessionError, "Your admin session has expired."));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
    };
  }, []);

  async function refreshSession() {
    if (isDevOnlyAuthBypassEnabled()) { // DEV ONLY
      setAdmin(normalizeAdminUser(getDevOnlyAdminUser())); // DEV ONLY
      setError(""); // DEV ONLY
      setLoading(false); // DEV ONLY
      return; // DEV ONLY
    }

    const token = getAdminToken();

    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const currentAdmin = await fetchAdminMe();
      setAdmin(normalizeAdminUser(currentAdmin));
      setError("");
    } catch (sessionError) {
      clearAdminToken();
      setAdmin(null);
      setError(getErrorMessage(sessionError, "Your admin session has expired."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminSessionContext.Provider
      value={{
        admin,
        error,
        loading,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);

  if (!context) {
    throw new Error("useAdminSession must be used within an AdminSessionProvider.");
  }

  return context;
}
