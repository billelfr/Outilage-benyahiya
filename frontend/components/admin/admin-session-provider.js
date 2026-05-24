"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchAdminMe, getErrorMessage } from "@/lib/api";
import { clearAdminToken, getAdminToken } from "@/lib/auth";
import { normalizeAdminUser } from "@/lib/normalize";

const AdminSessionContext = createContext(null);

export function AdminSessionProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function logout() {
    clearAdminToken();
    setAdmin(null);
  }

  useEffect(() => {
    let active = true;

    Promise.resolve().then(async () => {
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
