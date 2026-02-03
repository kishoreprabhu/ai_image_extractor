import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        navigate("/login", { replace: true });
      } else {
        setAuthenticated(true);
      }

      setIsChecking(false);
    };

    checkUser();
  }, [navigate]);

 
  if (isChecking) return null; 

  return authenticated ? children : null;
};

export default ProtectedRoute;
