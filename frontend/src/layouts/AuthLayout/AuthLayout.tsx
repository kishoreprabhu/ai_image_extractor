import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div id="auth-container">
      <div id="auth-box-wrapper">
        <div id="auth-box">
          <h2 className="txt-align-center color-white mb-25">Receipt Extractor</h2>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
