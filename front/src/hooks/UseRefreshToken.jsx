/** @format */

import axios from "../api/Axios";
import useAuth from "./UseAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const refresh = async () => {
    try {
      const response = await axios.post(
        "/auth/refresh-token",
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        }
      );
      const newAccessToken = response.data.accessToken;
      const userName = response.data.userName;

      setAuth((prevAuth) => ({
        ...prevAuth,
        accessToken: newAccessToken,
        userName: userName,
      }));
      console.log(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error(error);
    }
  };
  return refresh;
};

export default useRefreshToken;
