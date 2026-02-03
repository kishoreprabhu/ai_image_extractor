import { useNavigate } from "react-router-dom";
import { message } from "antd";

import LoginForm from "../../components/LoginForm";
import { authenticateUser } from "../../services/auth";
import { LOGIN_SUCCESS_MSG } from "../../shared/constant";

import { type FieldType } from "../../types/login";


const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials: FieldType) => {
    const {data, error} = await authenticateUser(credentials);
    if(error) {
      message.error(error.message);
    } else {
      message.success(LOGIN_SUCCESS_MSG);
      navigate("/receipts");
    }
  }

  return (
     <>
        <LoginForm onSubmit={handleLogin}/>
     </>
  );
};

export default LoginPage;