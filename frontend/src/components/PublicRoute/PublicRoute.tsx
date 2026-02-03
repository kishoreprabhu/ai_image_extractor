import { User } from "@supabase/supabase-js";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

const PublicRoute = ({ children }) => {
  const [checking, setChecking] = useState<boolean>(true);
  const [user, setUser] = useState<User|null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const currentUser:User|null = data.user;
      setUser(currentUser);
      setChecking(false);
    });
  }, []);

  if (checking) return null; 

  if (user) return <Navigate to="/receipts" replace />;

  return children;
};

export default PublicRoute;
