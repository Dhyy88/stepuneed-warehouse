import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import axios from "../../../API/Axios";
import ApiEndpoint from "../../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Select from "react-select";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../../components/LoadingButton";

const CreateSite = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const [site_code, setSiteCode] = useState("");
  const [site_name, setSiteName] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  const typeSite = [
    { value: "store", label: "Toko" },
    { value: "warehouse", label: "Gudang" },
  ];

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const onSubmit = async () => {
    setIsLoadingButton(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin data yang dimasukkan sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    });
    setIsLoadingButton(true);
    if (confirmResult.isConfirmed) {
      try {
        await axios.post(ApiEndpoint.CREATE_SITES, {
          code: site_code,
          name: site_name,
          address: address,
          province: province,
          city: city,
          type: type.value,
        });
        Swal.fire("Sukses", "Cabang berhasil ditambahkan", "success").then(
          () => {
            setIsLoadingButton(false);
            resetForm();
            setSelectedProvince(null);
            setSelectedCity(null);
            setType(null);
            navigate("/cabang");
          }
        );
      } catch (err) {
        setError(err.response.data.errors);
        Swal.fire("Gagal", err.response.data.message, "error");
        setIsLoadingButton(false);
      }
    } else {
      setIsLoadingButton(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.post(ApiEndpoint.GET_PROVINCE);
      const formattedProvinces = response.data.data.map((province) => ({
        value: province.uid,
        label: province.name,
      }));
      setProvinces(formattedProvinces);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const handleCityChange = (selectedCity) => {
    setSelectedCity(selectedCity);
    setCity(selectedCity ? selectedCity.value : null);
  };

  const fetchCities = async (provinceUid) => {
    try {
      const response = await axios.post(ApiEndpoint.GET_CITIES, {
        province: provinceUid,
      });
      const formattedCities = response.data.data.map((city) => ({
        value: city.uid,
        label: city.name,
      }));
      setCities(formattedCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleProvinceChange = (selectedProvince) => {
    setSelectedProvince(selectedProvince);
    setProvince(selectedProvince ? selectedProvince.value : null);

    if (selectedProvince && selectedProvince.value) {
      fetchCities(selectedProvince.value);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince && selectedProvince.uid) {
      fetchCities(selectedProvince.uid);
    }
  }, [selectedProvince]);

  const resetForm = () => {
    setSiteCode("");
    setSiteName("");
    setAddress("");
    setCities("");
    setSelectedProvince(null);
    setSelectedCity(null);
    setType(null);
  };

  const previousPage = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="lg:col-span-12 col-span-12">
        <Card title={"Tambah Cabang"}>
          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-5">
            <div className="">
              <Textinput
                label="Kode Cabang"
                type="text"
                placeholder="Masukkan kode cabang"
                value={site_code}
                onChange={(e) => setSiteCode(e.target.value)}
              />
            </div>
            <div className="">
              <Textinput
                type="text"
                label="Nama Cabang *"
                placeholder="Masukkan nama cabang yang valid"
                value={site_name}
                onChange={(e) => setSiteName(e.target.value)}
                className={error ? "border-danger-500" : ""}
              />
              {error && (
                <span className="text-danger-600 text-sm py-2">
                  {error.name}
                </span>
              )}
            </div>
          </div>

          <div className="text-base text-slate-600 dark:text-slate-300 mb-5">
            <Textarea
              label="Alamat Cabang"
              id="pn4"
              rows="6"
              placeholder="Masukkan alamat cabang dengan lengkap"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex-1 mb-10">
            <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5">
              <div className="">
                <label htmlFor=" hh" className="form-label ">
                  Provinsi *
                </label>
                <Select
                  className="react-select mt-2"
                  classNamePrefix="select"
                  placeholder="Pilih Provinsi..."
                  options={provinces}
                  onChange={handleProvinceChange}
                  // value={provinces.find((prov) => prov.value === province)}
                  value={selectedProvince}
                  isClearable
                />
                {error && (
                  <span className="text-danger-600 text-sm py-2">
                    {error.province}
                  </span>
                )}
              </div>
              <div className="">
                <label htmlFor=" hh" className="form-label ">
                  Kota / Kabupaten *
                </label>
                <Select
                  className="react-select mt-2"
                  classNamePrefix="select"
                  placeholder="Pilih Kota/Kabupaten..."
                  options={cities}
                  onChange={handleCityChange}
                  value={selectedCity}
                  isClearable
                />
                {error && (
                  <span className="text-danger-600 text-sm py-2">
                    {error.city}
                  </span>
                )}
              </div>
              <div className="">
                <label htmlFor=" hh" className="form-label ">
                  Tipe Cabang *
                </label>
                <Select
                  className="react-select mt-2"
                  classNamePrefix="select"
                  placeholder="Pilih Tipe..."
                  options={typeSite}
                  value={type}
                  onChange={(selectedOption) => setType(selectedOption)}
                />
                {error && (
                  <span className="text-danger-600 text-sm py-2">
                    {error.type}
                  </span>
                )}
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
              text={ isLoadingButton ? (<LoadingButton />) : ("Simpan")}
              className="btn-primary dark w-full "
              type="submit"
              onClick={onSubmit}
              disabled={isLoadingButton}
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

export default CreateSite;
