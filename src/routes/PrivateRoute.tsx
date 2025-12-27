import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavMenu from "../components/navbar/NavMenu";
import { useAppSelector } from "../types/reduxHooks";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const data = useAppSelector((state) => state.userSlice.userProfile);
  const profileLoading = useAppSelector(
    (state) => state.userSlice.profileLoading
  );

  if (loading || (location.pathname == "home" && profileLoading))
    return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" replace />;

  if (location.pathname === "/") {
    return <Navigate to="/home" replace />;
  }

  const isProfileComplete = data?.name?.trim() && data?.about?.trim();

  if (!isProfileComplete && location.pathname !== "/profile")
    return <Navigate to={"/profile"} replace />;

  return (
    <div style={{ display: "flex" }}>
      <NavMenu />
      <Outlet />
    </div>
  );
};

export default PrivateRoute;
