import { useEffect, useRef, useState } from "react";
import NavIcon from "../../components/icons/NavIcon";
import styles from "./profile.module.scss";
import { getProfileApi, profileApi } from "../../api/profile";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../../api/authApi";
import { toastMessage } from "../../utils/toastMessage";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    about: "",
    picture: null as File | null,
    pictureUrl: "",
  });

  const userString = localStorage.getItem("user");
  const [user, _] = useState(userString ? JSON.parse(userString) : "");
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editMode, setEditMode] = useState({
    name: true,
    about: true,
  });

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

    try {
      const result = await profileApi(formData);
      const pictureUrl = result?.profile?.picture?.url;
      setProfileData((prev) => ({ ...prev, pictureUrl: pictureUrl }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (profileData.name && editMode.name == false)
        formData.append("name", profileData.name);
      if (profileData.about && editMode.about == false)
        formData.append("about", profileData.about);
      if (profileData.picture) formData.append("picture", profileData.picture);

      setEditMode((prev) => ({ ...prev, name: true, about: true }));

      await profileApi(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout();

      if (response.status === true) {
        toastMessage("success", "Sign-out");
        window.location.reload();
      }
    } catch (error) {
      toastMessage("error", "Error signing out");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi();
        const profile = res.data.profile;

        if (!profile) {
          return;
        }

        setProfileData((prev) => ({
          ...prev,
          name: profile.name || "",
          about: profile.about || "",
          pictureUrl: profile?.picture?.url || "",
        }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    setEditMode({ name: true, about: true });
  }, []);

  return (
    <div className={styles.wrapper}>
      <form className={styles.leftContainer} onSubmit={handleSubmit}>
        <button onClick={() => navigate(-1)} className={styles.btnBack}>
          <NavIcon name="IoArrowBackOutline" />
        </button>
        <div className={styles.imageContainer}>
          <img
            src={
              profileData?.pictureUrl
                ? profileData?.pictureUrl
                : "/default-avatar.png"
            }
            alt="profile"
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
          >
            <NavIcon name="MdOutlineFileUpload" />
            Upload Image
          </button>
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your name..."
              name="name"
              value={profileData.name}
              onChange={handleChange}
              disabled={editMode.name}
            />
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();

                if (editMode.name == false) {
                  await handleSubmit(e as any);
                  setEditMode((prev) => ({ ...prev, name: true }));
                } else {
                  setEditMode((prev) => ({ ...prev, name: false }));
                }
              }}
              className={styles.btnCont}
            >
              <NavIcon
                name={`${
                  editMode.name == true ? "MdOutlineEdit" : "TiTickOutline"
                }`}
                className={styles.icon}
              />
            </button>
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="about" className={styles.label}>
            About
          </label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter about yourself..."
              name="about"
              value={profileData.about}
              onChange={handleChange}
              disabled={editMode.about}
            />
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();

                if (editMode.about == false) {
                  await handleSubmit(e as any);
                  setEditMode((prev) => ({ ...prev, about: true }));
                } else {
                  setEditMode((prev) => ({ ...prev, about: false }));
                }
              }}
              className={styles.btnCont}
            >
              <NavIcon
                name={`${
                  editMode.about == true ? "MdOutlineEdit" : "TiTickOutline"
                }`}
                className={styles.icon}
              />
            </button>
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={`${styles.input} ${styles.disabledInput}`}
              placeholder="Enter your Email..."
              disabled={true}
              value={user?.email || ""}
            />
            <button onClick={copyText} className={styles.btnCont}>
              <NavIcon name="FaRegCopy" size={20} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={styles.signOutBtn}
        >
          <NavIcon name="IoMdLogOut" />
          Logout
        </button>
      </form>

      <div className={styles.rightContainer}>
        <img src="/favicon.svg" alt="Profile" className={styles.image} />
        <h2>Profile</h2>
      </div>
    </div>
  );
};

export default Profile;
