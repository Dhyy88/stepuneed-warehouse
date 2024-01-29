import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import LoadingButton from "../../../components/LoadingButton";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";

const schema = yup
  .object({
    email: yup.string().email("Email tidak valid").required("Email is Required"),
    password: yup.string().required("Kata sandi wajib di isi"),
  })
  .required();

const LoginForm = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    setIsLoadingButton(true);
    e.preventDefault();
  
    const formData = new FormData();
  
    formData.append("email", email);
    formData.append("password", password);
  
    try {
      const response = await axios.post(ApiEndpoint.LOGIN, formData);
      localStorage.setItem("token", response?.data?.data?.token);
      localStorage.setItem("is_spv", response?.data?.data?.is_spv);
      setIsLoadingButton(false);
      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message,
      });
      setIsLoadingButton(false);
    }
    setIsLoadingButton(false)
  };  

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);
  
  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  return (
    <form onSubmit={loginHandler} className="space-y-4 ">
      <Textinput
        name="email"
        label="email"
        type="email"
        register={register}
        error={errors.email}
        className="h-[48px]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Masukkan email anda"
      />
      <Textinput
        name="password"
        label="Kata Sandi"
        type="password"
        register={register}
        error={errors.password}
        className="h-[48px]"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="****************"
      />

      <Button
        text={isLoadingButton ? <LoadingButton /> : "Masuk"}
        className="btn btn-dark block w-full text-center"
        type="submit"
        disabled={isLoadingButton}
      />
    </form>
  );
};

export default LoginForm;
