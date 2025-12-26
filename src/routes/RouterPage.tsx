import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Auth/login/Login";
import Signup from "../pages/Auth/signup/Signup";
import Home from "../pages/Home/Home";
import ForgetPassword from "../pages/Auth/forget/ForgetPassword";
import ResetPassword from "../pages/Auth/reset/ResetPassword";
import { AuthProvider } from "../context/AuthContext";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Profile from "../pages/Profile/Profile";

const RouterPage = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to={"/login"} replace />} />

          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
          </Route>

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default RouterPage;
