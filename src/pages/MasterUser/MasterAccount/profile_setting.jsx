import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import Alert from "@/components/ui/Alert";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";
import LoadingButton from "../../../components/LoadingButton";

const ProfileSetting = () => {
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [birth, setBirth] = useState("");

  const genderType = [
    { value: "L", label: "Laki-Laki" },
    { value: "P", label: "Perempuan" },
  ];

  const getDataProfile = () => {
    try {
      axios.get(`${ApiEndpoint.DETAIL}`).then((response) => {
        setData(response?.data?.data);
        setFirstName(response?.data?.data?.profile?.first_name);
        setLastName(response?.data?.data?.profile?.last_name);
        setGender(
          genderType.find(
            (gender) => gender.value === response?.data?.data?.profile?.gender
          )
        );
        setPhoneNumber(response?.data?.data?.profile?.phone_number);
        setBirth(response?.data?.data?.profile?.birth);
      });
    } catch (err) {
    setError(err.response.data.errors);
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin memperbaharui informasi akun anda?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Perbaharui",
      cancelButtonText: "Batal",
    });
    if (confirmResult.isConfirmed) {
      try {
        await axios.post(ApiEndpoint.DETAIL, {
          first_name: first_name,
          last_name: last_name,
          gender: gender.value,
          phone_number: phone_number,
          birth: birth,
        });
        Swal.fire("Berhasil", "Informasi akun berhasil dipebaharui", "success");
        navigate("/profile");
        setIsLoading(false);
      } catch (error) {
        setError(error.response.data.errors);
        Swal.fire("Gagal", error.response.data.message, "error");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDataProfile();
  }, []);

  const resetForm = () => {
    setFirstName(data ? data?.profile?.first_name : "");
    setLastName(data ? data?.profile?.last_name : "");
    setGender(data ? genderType.find((gender) => gender.value === data?.profile?.gender) : null);
    setPhoneNumber(data ? data?.profile?.phone_number : "");
    setBirth(data?.profile?.birth);
  };

  const previousPage = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="lg:col-span-12 col-span-12">
        <Alert
          // dismissible
          icon="heroicons-outline:exclamation"
          className="light-mode alert-info mb-5"
        >
          Perbaharui informasi akun anda sesuai dengan data diri yang valid !
        </Alert>

        <Card title={"Perbaharui informasi akun"}>
          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-5">
            <div className="fromGroup">
              <Textinput
                label="Nama Depan *"
                className="form-control py-2"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={first_name}
              />
              {error && (
                <span className="text-danger-600 text-xs py-2">
                  {error.first_name}
                </span>
              )}
            </div>
            <div className="fromGroup">
              <Textinput
                label="Nama Belakang"
                className="form-control py-2"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={last_name}
              />
            </div>
          </div>

          <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
            <div className="fromGroup">
              <label htmlFor=" hh" className="form-label ">
                Jenis Kelamin *
              </label>
              <Select
                className="react-select mt-2"
                classNamePrefix="select"
                placeholder="Pilih jenis kelamin..."
                options={genderType}
                value={gender}
                onChange={(selectedOption) => setGender(selectedOption)}
              />
              {error && (
                <span className="text-danger-600 text-xs py-2">
                  {error.gender}
                </span>
              )}
            </div>
          </div>

          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-5">
            <div className="fromGroup">
              <Textinput
                label="No Telepon"
                className="form-control py-2"
                type="number"
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phone_number}
              />
            </div>
            <div className="fromGroup">
              <div className="flex">
                <label className="form-label">Tanggal Lahir</label>
              </div>
              <div className="">
                <input
                  className="form-control py-2"
                  type="date"
                  onChange={(e) => setBirth(e.target.value)}
                  value={birth}
                />
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

export default ProfileSetting;
