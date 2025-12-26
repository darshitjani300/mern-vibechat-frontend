export const saveCachedUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getCachedUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const removeCachedUser = () => {
  localStorage.removeItem("user");
};
