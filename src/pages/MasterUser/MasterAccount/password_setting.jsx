import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import Alert from "@/components/ui/Alert";
import Textinput from "@/components/ui/Textinput";
import LoadingButton from "../../../components/LoadingButton";
import Icon from "@/components/ui/Icon";

const PasswordSetting = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [new_password_confirmation, setNewPasswordConfirmation] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPassword, setIsNewPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toogleNewPassword = () => {
    setIsNewPassword(!isNewPassword);
  };

  const tooglePasswordConfirmation = () => {
    setIsPasswordConfirm(!isPasswordConfirm);
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin memperbaharui kata sandi akun anda?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Perbaharui",
      cancelButtonText: "Batal",
    });
    if (confirmResult.isConfirmed) {
      try {
        await axios.post(ApiEndpoint.CHANGE_PASSWORD, {
          current_password: current_password,
          new_password: new_password,
          new_password_confirmation: new_password_confirmation,
          do_logout_from_all_devices: 1,
        });
        Swal.fire(
          "Berhasil",
          "Kata sandi berhasil dipebaharui, silahkan login kembali",
          "success"
        );

        localStorage.removeItem("token");
        setIsLoading(false);
        navigate("/");
      } catch (error) {
        setError(error.response.data.errors);
        Swal.fire("Gagal", error.response.data.message, "error");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirmation("");
  };

  const previousPage = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="lg:col-span-12 col-span-12">
        {error && (
          <Alert
            // icon="heroicons-outline:exclamation"
            className="light-mode alert-danger mb-2"
          >
            {error.current_password && <div> - {error.current_password}</div>}
            {error.new_password && <div> - {error.new_password}</div>}
            {error.new_password_confirmation && (
              <div> - {error.new_password_confirmation}</div>
            )}
          </Alert>
        )}

        <Card title={"Perbaharui kata sandi"}>
          <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-3">
            <div className="fromGroup">
              <label htmlFor="hh" className="form-label">
                Kata Sandi Lama *
              </label>
              <div className="flex items-center mb-2">
                <div className="w-full relative">
                  <input
                    className="form-control py-2 pr-10"
                    placeholder="************************"
                    type={isPasswordVisible ? "text" : "password"}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    value={current_password}
                  />

                  <div className="absolute top-0 right-0 h-full flex items-center pr-2">
                    <button
                      type="button"
                      className="action-btn flex"
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? (
                        <Icon icon="heroicons:eye-slash" />
                      ) : (
                        <Icon icon="heroicons:eye" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="fromGroup">
              <label htmlFor="hh" className="form-label">
                Kata Sandi Baru *
              </label>
              <div className="flex items-center mb-2">
                <div className="w-full relative">
                  <input
                    className="form-control py-2 pr-10"
                    placeholder="************************"
                    type={isNewPassword ? "text" : "password"}
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={new_password}
                  />
                  <div className="absolute top-0 right-0 h-full flex items-center pr-2">
                    <button
                      type="button"
                      className="action-btn"
                      onClick={toogleNewPassword}
                    >
                      {isNewPassword ? (
                        <Icon icon="heroicons:eye-slash" />
                      ) : (
                        <Icon icon="heroicons:eye" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="fromGroup">
              <label htmlFor="hh" className="form-label">
                Konfirmasi Kata Sandi *
              </label>
              <div className="flex items-center mb-2">
                <div className="w-full relative">
                  <input
                    className="form-control py-2 pr-10"
                    placeholder="************************"
                    type={isPasswordConfirm ? "text" : "password"}
                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                    value={new_password_confirmation}
                  />
                  {error && (
                    <span className="text-danger-600 text-xs py-2">
                      {error.new_password_confirmation}
                    </span>
                  )}
                  <div className="absolute top-0 right-0 h-full flex items-center pr-2">
                    <button
                      type="button"
                      className="action-btn flex"
                      onClick={tooglePasswordConfirmation}
                    >
                      {isPasswordConfirm ? (
                        <Icon icon="heroicons:eye-slash" />
                      ) : (
                        <Icon icon="heroicons:eye" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
            <Button
              text="Reset"
              className="btn-primary light w-full"
              onClick={resetForm}
            />
            <Button
              text={isLoading ? <LoadingButton /> : "Simpan"}
              className="btn-primary dark w-full "
              type="submit"
              onClick={onSubmit}
            />
          </div>
          <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mt-5">
            <Button
              text="Batal"
              className="btn-secondary light w-full "
              onClick={previousPage}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default PasswordSetting;
