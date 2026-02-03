import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import Header from "../../components/Header";
import { logoutUser } from "../../services/auth";

import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const Navigate = useNavigate();
  const [userInitial, setUserInitial] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const email = user.email || "U";
        setUserInitial(email.charAt(0).toUpperCase());
      }
    };

    fetchUser();
  }, []);

  const onLogout = async () => {
      console.log("I am logging out");
      await logoutUser();
      Navigate("/login")
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>

      {/* Header */}
      <Header userIntial={userInitial} onLogout={onLogout}/>

      {/* page body */}
      <div style={{ display: "flex", flex: 1 }}>

        <main style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
