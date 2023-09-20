/** @format */

import axios from "../api/Axios";
import useAuth from "./UseAuth";

const useLogout = () => {
  const { auth, setAuth } = useAuth();

  const logout = async () => {
    try {
      const response = await axios.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        }
      );
      setAuth({});
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
