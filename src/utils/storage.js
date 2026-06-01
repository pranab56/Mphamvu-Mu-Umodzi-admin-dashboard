export const saveToken = (token) => {
  localStorage.setItem("umudzi-admin-dashboard", token);
  // Set cookie so Next.js middleware can read it for route protection
  document.cookie = `umudzi-admin-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

export const getToken = () => {
  return localStorage.getItem("umudzi-admin-dashboard");
};

export const removeToken = () => {
  localStorage.removeItem("umudzi-admin-dashboard");
  // Remove cookie
  document.cookie = "umudzi-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
