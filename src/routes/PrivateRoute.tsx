import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavMenu from "../components/navbar/NavMenu";
import { useAppSelector } from "../types/reduxHooks";
import { useDispatch } from "react-redux";
import { getProfileApi } from "../api/profile";
import { userProfile } from "../redux/features/chat/chat.slice";
import { useEffect, useState } from "react";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const profile = useAppSelector((state) => state.userSlice.userProfile);
  const profileFetched = useAppSelector(
    (state) => state.userSlice.profileFetched
  );
  const dispatch = useDispatch();
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!user || profileFetched) return;

    const fetchProfile = async () => {
      setProfileLoading(true);

      try {
        const res = await getProfileApi();
        dispatch(userProfile(res.data?.profile ?? {}));
      } catch (error) {
        console.log(error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [user, profile, dispatch]);

  if (loading || profileLoading) {
    return <div>Loading...</div>;
  }

  // Not authenticated !!
  if (!user) return <Navigate to="/login" replace />;

  // Root redirect
  if (location.pathname === "/") {
    return <Navigate to="/home" replace />;
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
