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
import { useParams } from "react-router-dom";

const UpdateCars = () => {
  const navigate = useNavigate();
  let { uid } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [yearInputs, setYearInputs] = useState([""]);

  const getDataById = () => {
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.CARS}/${uid}`).then((response) => {
          setData(response.data.data);
          setBrand(response.data.data.brand);
          setModel(response.data.data.model);
          setYearInputs(response.data.data.year);
        });
      }
    } catch (error) {
      setError(err.response.data.errors);
    }
  };

  const onSubmit = async () => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin data yang dimasukkan sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Perbaharui",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        const requestData = {
          brand: brand,
          model: model,
          year: yearInputs,
        };

        await axios.post(`${ApiEndpoint.CARS}/${uid}`, requestData);

        Swal.fire("Sukses", "Model mobil berhasil diperbaharui", "success").then(
          () => {
            resetForm();
            navigate("/cars");
          }
        );
      } catch (err) {
        setError(err.response.data.errors);
        Swal.fire("Gagal", err.response.data.message, "error");
      }
    }
  };

  useEffect(() => {
    getDataById();
  }, [uid]);

  const resetForm = () => {
    setBrand(data ? data.brand : "");
    setModel(data ? data.model : "");
    setYearInputs(data ? data.year : "");
  };

  const previousPage = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="lg:col-span-12 col-span-12">
        <Card title={"Ubah Model Mobil"}>
          <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
            <div className="">
              <Textinput
                label="Brand Mobil"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
              {error && (
                <span className="text-danger-600 text-sm py-2">
                  {error.brand}
                </span>
              )}
            </div>
            <div className="">
              <Textinput
                label="Model Mobil"
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
              {error && (
                <span className="text-danger-600 text-sm py-2">
                  {error.model}
                </span>
              )}
            </div>
            <div className="">
              <Textinput
                label="Tahun Keluaran"
                type="text"
                value={yearInputs}
                onChange={(e) => setYearInputs(e.target.value)}
              />
              {error && (
                <span className="text-danger-600 text-sm py-2">
                  {error.year}
                </span>
              )}
            </div>
          </div>

          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
            <Button
              text="Reset"
              className="btn-primary light w-full"
              onClick={resetForm}
            />
            <Button
              text="Simpan"
              className="btn-primary dark w-full "
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

export default UpdateCars;
