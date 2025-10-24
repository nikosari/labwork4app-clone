import { createContext, useContext, useEffect, useMemo, useState, PropsWithChildren } from "react";
import { User, onAuthStateChanged /*, setPersistence, browserLocalPersistence */ } from "firebase/auth";
import { auth } from "../firebaseConfig";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;


    const unsub = onAuthStateChanged(auth, (u) => {
      if (!mounted) return;
      setUser(u);
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const value = useMemo<AuthContextType>(() => ({ user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
