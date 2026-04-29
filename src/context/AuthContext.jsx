import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

const mergeAuthAndProfile = (authUser, profile) => {
  if (!authUser) return null;
  return {
    id: authUser.id,
    email: authUser.email,
    firstName: profile?.first_name ?? authUser.user_metadata?.first_name ?? "",
    lastName: profile?.last_name ?? authUser.user_metadata?.last_name ?? "",
    name: [
      profile?.first_name ?? authUser.user_metadata?.first_name,
      profile?.last_name ?? authUser.user_metadata?.last_name,
    ]
      .filter(Boolean)
      .join(" "),
    address: profile?.address ?? "",
    country: profile?.country ?? "",
    state: profile?.state ?? "",
    city: profile?.city ?? "",
    zip: profile?.zip ?? "",
    role: profile?.role ?? "user",
    createdAt: profile?.created_at,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authUser) => {
    if (!authUser) return null;
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();
      if (error) console.error("Profile fetch error:", error);
      return mergeAuthAndProfile(authUser, profile);
    } catch (err) {
      console.error("Profile fetch threw:", err);
      return mergeAuthAndProfile(authUser, null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          setUser(mergeAuthAndProfile(session.user, null));
          setLoading(false);
          const merged = await fetchProfile(session.user);
          if (mounted) setUser(merged);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        // Show auth user immediately, then upgrade with profile.
        setUser((prev) => prev ?? mergeAuthAndProfile(session.user, null));
        const merged = await fetchProfile(session.user);
        if (mounted) setUser(merged);
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    const merged = await fetchProfile(authUser);
    setUser(merged);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, logout, setUser, refreshProfile }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
