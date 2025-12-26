import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavMenu from "../components/navbar/NavMenu";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div style={{ display: "flex" }}>
      <NavMenu />
      <Outlet />
    </div>
  );
};

export default PrivateRoute;
