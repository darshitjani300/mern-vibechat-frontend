import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavMenu from "../components/navbar/NavMenu";
import { useAppSelector } from "../types/reduxHooks";
import { useDispatch } from "react-redux";
import { getProfileApi } from "../api/profile";
import { userProfile } from "../redux/features/chat/chat.slice";
import { useEffect } from "react";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const profile = useAppSelector((state) => state.userSlice.userProfile);
  const profileFetched = useAppSelector(
    (state) => state.userSlice.profileFetched
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || profileFetched) return;

    const fetchProfile = async () => {
      try {
        const res = await getProfileApi();
        dispatch(userProfile(res.data?.profile ?? {}));
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, [user, profile, dispatch]);

  // Not authenticated !!
  if (!loading && !user) return <Navigate to="/login" replace />;

  if (loading || !profileFetched) {
    return <div>Loading...</div>;
  }

  // Check
  const isProfileComplete = profile?.name?.trim() && profile?.about?.trim();

  // Only redirect from /home -> Profile
  if (profileFetched && !isProfileComplete && location.pathname === "/home")
    return <Navigate to={"/profile"} replace />;

  return (
    <div style={{ display: "flex" }}>
      <NavMenu />
      <Outlet />
    </div>
  );
};

export default PrivateRoute;
