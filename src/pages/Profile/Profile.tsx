import { useEffect, useRef, useState } from "react";
import NavIcon from "../../components/icons/NavIcon";
import styles from "./profile.module.scss";
import { getProfileApi, profileApi } from "../../api/profile";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
  const [saving, setSaving] = useState(false);
  const originalProfileRef = useRef<{
    name: string;
    about: string;
  }>({
    name: "",
    about: "",
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

    const name = profileData.name.trim();
    const about = profileData.about.trim();

    // ✅ validation
    if (!name || !about) {
      toast.error("Name and About are required");
      return;
    }

    const isNameChanged = name !== originalProfileRef.current.name;
    const isAboutChanged = about !== originalProfileRef.current.about;

    // 🚫 nothing changed → don't call API
    if (!isNameChanged && !isAboutChanged && !profileData.picture) {
      toastMessage("error", "No changes to save");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("about", about);

      if (profileData.picture) formData.append("picture", profileData.picture);
      await profileApi(formData);

      toastMessage("success", "Profile has been updated");


      setSaving(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
    } finally {
      setSaving(false);
    }
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
    <div className={styles.wrapper}>
      <form className={styles.leftContainer} onSubmit={handleSubmit}>
        <button onClick={() => navigate(-1)} className={styles.btnBack}>
          <NavIcon name="IoArrowBackOutline" />
        </button>

        <div className={styles.imageContainer}>
          <img
            src={profileData?.pictureUrl ? profileData?.pictureUrl : "user.png"}
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
            />
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
            />
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
          type="submit"
          className={`${styles.btn} ${styles.danger}`}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>

      <div className={styles.rightContainer}>
        <img src="/favicon.svg" alt="Profile" className={styles.image} />
        <h2>Profile</h2>
        <p className={styles.impChat}>
          Finish setting up your profile to start chatting.
        </p>
      </div>
    </div>
  );
};

export default Profile;
