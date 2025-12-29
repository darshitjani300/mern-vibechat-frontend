import { useEffect, useRef, useState } from "react";
import NavIcon from "../../components/icons/NavIcon";
import styles from "./profile.module.scss";
import { getProfileApi, profileApi } from "../../api/profile";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { toastMessage } from "../../utils/toastMessage";
import InputComp from "../../components/input/InputComp";
import { useAppDispatch } from "../../types/reduxHooks";
import { userProfile } from "../../redux/features/chat/chat.slice";
import LogoutConfirmation from "../../components/confirmation/LogoutConfirmation";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    about: "",
    picture: null as File | null,
    pictureUrl: "",
  });
  const userString = localStorage.getItem("user");
  const [user, _] = useState(userString ? JSON.parse(userString) : "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const originalProfileRef = useRef<{
    name: string;
    about: string;
  }>({
    name: "",
    about: "",
  });
  const isNameChanged =
    profileData?.name?.trim() !== originalProfileRef.current.name;
  const isAboutChanged =
    profileData?.about?.trim() !== originalProfileRef.current.about;
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLogout, setIsLogout] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function copyText() {
    navigator.clipboard
      .writeText(user.email)
      .then(() => {
        alert("Copied the text: " + user.email);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }

  const imageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("picture", file);

    setUploading(true);
    try {
      const result = await profileApi(formData);
      dispatch(userProfile(result?.profile ?? {}));

      const pictureUrl = result?.profile?.picture?.url;
      setProfileData((prev) => ({ ...prev, pictureUrl: pictureUrl }));
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = profileData?.name?.trim();
    const about = profileData?.about?.trim();

    // ✅ validation
    if (!name || !about) {
      toast.error("Name and About are required");
      return;
    }

    // 🚫 nothing changed → don't call API
    if (!isNameChanged && !isAboutChanged && !profileData.picture) {
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("about", about);

      const result = await profileApi(formData);
      dispatch(userProfile(result?.profile ?? {}));

      toastMessage("success", "Profile has been updated");
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi();
        const profile = res?.data?.profile;

        if (!profile) {
          return;
        }

        setProfileData((prev) => ({
          ...prev,
          name: profile?.name || "",
          about: profile?.about || "",
          pictureUrl: profile?.picture?.url || "",
        }));

        originalProfileRef.current = {
          name: profile?.name || "",
          about: profile?.about || "",
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.headerContainer}>
          <h1>VibeChat</h1>

          <div className={styles.menuIcon}>
            <button onClick={toggleSideBar}>
              {isOpen ? (
                <NavIcon name="IoMdClose" size={26} />
              ) : (
                <NavIcon name="RxHamburgerMenu" size={26} />
              )}
            </button>

            {isOpen ? (
              <div className={styles.menuCont}>
                <div className={styles.menuItemCont}>
                  <Link to={"/home"} className={styles.menuItems}>
                    <NavIcon name="FaRegCircleUser" size={20} />
                    Chat
                  </Link>

                  <button
                    className={styles.menuItems}
                    onClick={() => {
                      setIsLogout(true);
                    }}
                  >
                    <NavIcon name="IoMdLogOut" size={22} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className={styles.profileHeader}>
          <h1>Profile</h1>
          <p>
            Please fill out all the details to unlock all the features of
            VibeChat.
          </p>
        </div>

        <form className={styles.leftContainer} onSubmit={handleSubmit}>
          <div className={styles.leftContainerWrapper}>
            <Link to={"/home"} className={styles.btnBack}>
              <NavIcon name="IoArrowBackOutline" />
            </Link>

            <div className={styles.imageContainer}>
              <img
                src={
                  profileData?.pictureUrl ? profileData?.pictureUrl : "user.png"
                }
                alt="profile"
                className={`${!profileData?.pictureUrl && styles.imagePadding}`}
              />
            </div>

            <div className={styles.fileInputContainer}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (file.size > 2 * 1000000) {
                    toast.error(
                      "Fize Size if too large, please upload an image smaller than 2 MB."
                    );
                    return;
                  }

                  await imageUpload(file);
                }}
                className={styles.fileInput}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={styles.fileBtn}
                disabled={uploading}
              >
                <NavIcon name="MdOutlineFileUpload" />
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </div>

            <div className={styles.inputContainer}>
              <InputComp
                inputType="text"
                name="name"
                label="Name"
                value={profileData.name}
                onChange={handleChange}
                placeholder="Enter your name..."
                icon="BiRename"
                maxLength={30}
              />

              <InputComp
                inputType="text"
                label="About"
                value={profileData.about}
                onChange={handleChange}
                placeholder="Enter about yourself..."
                name="about"
                icon="TiMessage"
                maxLength={120}
              />

              <div className={styles.inputWrapper}>
                <div className={styles.input}>
                  <InputComp
                    inputType="text"
                    label="About"
                    name="about"
                    icon="MdOutlineMailOutline"
                    disabled={true}
                    value={user?.email || ""}
                  />
                </div>
                <button
                  onClick={copyText}
                  type="button"
                  className={styles.btnCont}
                >
                  <NavIcon name="FaRegCopy" size={20} />
                </button>
              </div>
            </div>
            <div className={styles.saveBtn}>
              <button
                type="submit"
                className={`${styles.btn} ${styles.danger}`}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
      {isLogout && <LogoutConfirmation onClose={() => setIsLogout(false)} />}
    </>
  );
};

export default Profile;
