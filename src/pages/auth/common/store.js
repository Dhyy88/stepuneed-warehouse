import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";

// save users in local storage
const initialIsAuth = async () => {
  const token = window.localStorage.getItem("token");
  return token ? true : false;
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    // users: initialUsers(),
    isAuth: initialIsAuth(),
  },
  reducers: {
    handleRegister: (state, action) => {
      const { name, email, password } = action.payload;
      const user = state.users.find((user) => user.email === email);
      if (user) {
        toast.error("User already exists", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        state.users.push({
          id: uuidv4(),
          name,
          email,
          password,
        });
        window.localStorage.setItem("users", JSON.stringify(state.users));
        toast.success("User registered successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    },
    
    handleLogout: async (state, action) => {
      try {
        // await axios.get(ApiEndpoint.LOGOUT);
        
        state.isAuth = action.payload;

        window.localStorage.removeItem("token");
        window.localStorage.removeItem("is_spv");
        window.location.href = '/';
        
        toast.success("User logged out successfully", {
          position: "top-right",
        });
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
  },
});

export const { handleRegister, handleLogin, handleLogout } = authSlice.actions;
export default authSlice.reducer;
