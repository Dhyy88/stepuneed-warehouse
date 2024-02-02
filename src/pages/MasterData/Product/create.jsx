import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import "swiper/swiper-bundle.min.css";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Fileinput from "@/components/ui/Fileinput";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Swal from "sweetalert2";
import { Modal } from "antd";

const CreateProduct = () => {
  // START STATE GET DATA
  const [data_cars, setDataCars] = useState({
    data_cars: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [query_cars, setQueryCars] = useState({ search: "", paginate: 1 });
  // END STATE GET DATA

  const [primary_image, setPrimaryImage] = useState(null);
  const [images, setImages] = useState([]);
  const [variant_images, setVariantImages] = useState([]);

  // START STATE SWITCH AREA
  const [checked, setChecked] = useState(false);
  const [check_is_active, setCheckIsActive] = useState(false);
  const [check_is_cars, setCheckCars] = useState(false);
  const [check_is_variant, setCheckIsVariant] = useState(false); // VARIANT SET STATE
  const [check_is_primary_variant, setCheckPrimaryVariant] = useState(false); // STATE VARIANT PRIMARY
  const [checkIsVariantInput, setCheckIsVariantInput] = useState(false); //STATE VARIANT FORM CARS
  const [variantCarStatus, setVariantCarStatus] = useState(true);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [type_variation_disabled, setTypeVariationDisabled] = useState("");

  // END STATE SWITCH AREA

  const [all_price, setAllPrice] = useState(""); // STATE ALL PRICE SET VARIANT
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpenCars, setIsModalOpenCars] = useState(false);

  const handleFileChangePrimary = (e) => {
    setPrimaryImage(e.target.files[0]);
  };

  const handleFileChangeVariantImages = (e) => {
    setVariantImages(e.target.file[0]);
  };

  const handleFileChangeImages = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files).map((file) => file);
    setImages(filesArray);
  };

  // START VARIANT CONDITION AREA

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const newTag = { label: event.target.value, value: event.target.value };
      setSelectedOptions([...selectedOptions, newTag]);
      event.target.value = "";
      event.preventDefault();
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
    const initialStatus = selected.reduce((acc, option) => {
      acc[option.value] = true;
      return acc;
    }, {});
    setVariantCarStatus(initialStatus);
  };

  const handleVariantCarStatusChange = (optionValue) => {
    setVariantCarStatus((prevStatus) => ({
      ...prevStatus,
      [optionValue]: !prevStatus[optionValue],
    }));
  };

  const handlePrimaryVariantChange = (optionValue) => {
    setCheckPrimaryVariant(optionValue);
    setSelectedOptions((prevOptions) =>
      prevOptions.map((option) => ({
        ...option,
        isPrimary: option.value === optionValue,
      }))
    );
  };

  // END VARIANT CONDITION AREA

  // START REST API AREA

  async function getDataCars(query_cars) {
    try {
      const result = await Swal.fire({
        title: "Informasi model mobil",
        text: "Jika mengaktifkan mode ini, maka memilih model mobil tertentu. Jika tidak diaktifkan, maka produk ini berlaku untuk semua tipe mobil!",
        icon: "info",
        showCancelButton: true,
        cancelButtonText: "Batal",
        confirmButtonText: "Pilih model mobil",
      });

      if (result.isConfirmed) {
        try {
          const response = await axios.post(ApiEndpoint.CARS, {
            page: query_cars?.page,
            paginate: query_cars?.paginate,
            search: query_cars?.search,
          });
          setDataCars(response?.data);
          setIsModalOpenCars(true);
        } catch (error) {
          Swal.fire(
            "Error",
            error?.response?.data?.message || "An error occurred",
            "error"
          );
        }
      } else {
        setCheckCars(false);
        setIsModalOpenCars(false);
      }
    } catch (error) {
      console.error("Swal error:", error);
    }
  }

  const handleCancelModalCars = () => {
    setCheckCars(false);
    setIsModalOpenCars(false);
  };

  // END REST API AREA

  // START USE EFFECT AREA

  // START USE EFFECT AREA

  return (
    <div className="lg:col-span-12 col-span-12">
      <Card title={"Tambah Produk"}>
        <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
          <div className="">
            <label htmlFor=" hh" className="form-label ">
              Kategori *
            </label>
            <Select
              className="react-select mt-2"
              classNamePrefix="select"
              placeholder="Pilih Kategori..."
              isClearable
            />
          </div>
        </div>
        <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
          <div className="">
            <Textinput
              type="text"
              label="Nama Produk *"
              placeholder="Masukkan nama produk"
            />
          </div>
          <div className="">
            <Textinput
              type="number"
              label="Minimal Pesanan *"
              placeholder="Masukkan minimal pesanan"
            />
          </div>
          <div className="">
            <Textinput
              type="number"
              label="Garansi produk (optional) "
              placeholder="Garansi produk terhitung bulan"
            />
          </div>
        </div>
        <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
          <div className="">
            <ReactQuill
              theme="snow"
              placeholder="Masukkan deskripsi produk..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["clean"],
                ],
              }}
            />
          </div>
        </div>
        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-5">
          <div className="">
            <label htmlFor=" hh" className="form-label ">
              Gambar Utama *
            </label>
            <Fileinput
              selectedFile={primary_image}
              onChange={handleFileChangePrimary}
              preview
              isClearable={true}
            />
          </div>
          <div className="">
            <label htmlFor=" hh" className="form-label ">
              Gambar Pendukung
            </label>
            <Fileinput
              name="basic"
              selectedFiles={images}
              onChange={handleFileChangeImages}
              multiple
              preview
            />
          </div>
        </div>

        <Card title="Opsi Produk" className="mb-5">
          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 ">
            <div className="flex row gap-20">
              <Switch
                label="Status Produk"
                activeClass="bg-success-500"
                value={check_is_active}
                onChange={() => setCheckIsActive(!check_is_active)}
                badge
                prevIcon="heroicons-outline:check"
                nextIcon="heroicons-outline:x"
              />
              <Switch
                label="Variasi Produk"
                activeClass="bg-success-500"
                value={check_is_variant}
                onChange={() => setCheckIsVariant(!check_is_variant)}
                badge
                prevIcon="heroicons-outline:check"
                nextIcon="heroicons-outline:x"
              />
              <Switch
                label="Model Mobil"
                activeClass="bg-success-500"
                value={check_is_cars}
                onChange={() => {
                  setCheckCars(!check_is_cars);
                  if (!check_is_cars) {
                    getDataCars();
                  }
                }}
                badge
                prevIcon="heroicons-outline:check"
                nextIcon="heroicons-outline:x"
              />
              <Modal title="Model Mobil" open={isModalOpenCars} centered footer>
                <div className="row-span-3 md:row-span-4">
                  <Textinput
                    // value={query || ""}
                    className="mb-2"
                    onChange={(event) =>
                      setQueryCars({
                        ...query_cars,
                        search: event.target.value,
                      })
                    }
                    placeholder="Cari model mobil..."
                  />
                </div>
                <Card className="mt-3">
                  <div className="flex row">
                    <ul>
                      <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
                        {data_cars?.data?.map((car) => (
                          <li key={car.uid} className="flex row">
                            <Checkbox
                              value={checked}
                              onChange={() => setChecked(!checked)}
                            />
                            {`${car?.full_name}`}
                          </li>
                        ))}
                      </div>
                    </ul>
                  </div>
                </Card>
                <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mt-10">
                  <Button
                    text="Batal"
                    className="btn-primary light w-full"
                    onClick={handleCancelModalCars}
                  />
                  <Button
                    text="Konfirmasi"
                    className="btn-primary dark w-full "
                  />
                </div>
              </Modal>
            </div>
          </div>
        </Card>

        {check_is_variant ? (
          <>
            <Card title="Variasi Produk" className="mb-5">
              <div className="flex row gap-5 mb-5">
                <div className="w-96">
                  <Textinput
                    type="text"
                    label="Tipe Variasi"
                    placeholder=""
                    value={type_variation_disabled}
                    onChange={(e) => setTypeVariationDisabled(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <label htmlFor=" hh" className="form-label ">
                    Nama Variasi
                  </label>
                  <Select
                    isClearable={true}
                    isMulti
                    isSearchable={true}
                    name="variants"
                    className="react-select"
                    classNamePrefix="select"
                    placeholder=""
                    id="mul_1"
                    options={selectedOptions}
                    onKeyDown={handleKeyDown}
                    onChange={handleSelectChange}
                    isDisabled={type_variation_disabled.trim() === ""}
                  />
                </div>
              </div>
            </Card>
            {selectedOptions.length > 0 && (
              <Card
                title={`Variasi (${selectedOptions.length})`}
                className="mt-5"
              >
                <Card className="mb-5">
                  <div className="flex justify-between">
                    <div className="">
                      <span className="text-success-500">
                        Terapkan harga untuk semua variasi
                      </span>
                    </div>
                    <div className="">
                      <Button text="Terapkan" className="btn-outline-success" />
                    </div>
                  </div>
                  <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
                    <div className="">
                      <Textinput
                        type="number"
                        label="Harga Produk"
                        placeholder=""
                      />
                    </div>
                  </div>
                </Card>

                {selectedOptions.map((option, index) => (
                  <Card key={index} className="mt-5">
                    <div className="flex justify-between mb-5">
                      <div className="">
                        <span className="text-success-500">
                          Variasi: {option.label}
                        </span>
                      </div>
                      <div className="flex row justify-end gap-10">
                        <div className="">
                          <Switch
                            label="Status"
                            activeClass="bg-success-500"
                            value={variantCarStatus[option.value]}
                            onChange={() =>
                              handleVariantCarStatusChange(option.value)
                            }
                            badge
                            prevIcon="heroicons-outline:check"
                            nextIcon="heroicons-outline:x"
                          />
                        </div>
                        <div className="">
                          <Switch
                            label="Utama"
                            activeClass="bg-success-500"
                            value={option.value === check_is_primary_variant}
                            onChange={() =>
                              handlePrimaryVariantChange(option.value)
                            }
                            badge
                            prevIcon="heroicons-outline:check"
                            nextIcon="heroicons-outline:x"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
                      <div className="">
                        <Textinput
                          type="text"
                          label="SKU Produk"
                          placeholder=""
                          disabled={!variantCarStatus[option.value]}
                        />
                      </div>
                      <div className="">
                        <Textinput
                          type="number"
                          label="Harga Produk"
                          placeholder=""
                          disabled={!variantCarStatus[option.value]}
                        />
                      </div>
                      <div className="">
                        <label htmlFor=" hh" className="form-label ">
                          Gambar Variasi
                        </label>
                        <Fileinput
                          selectedFile={variant_images}
                          onChange={handleFileChangeVariantImages}
                          isClearable={true}
                          disabled={!variantCarStatus[option.value]}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </Card>
            )}
          </>
        ) : (
          <>
            <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
              <div className="">
                <Textinput
                  type="text"
                  label="SKU Produk"
                  placeholder="Masukkan sku produk"
                />
              </div>
              <div className="">
                <Textinput
                  type="text"
                  label="Harga Produk"
                  placeholder="Masukkan harga produk"
                />
              </div>
            </div>
          </>
        )}
        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mt-10">
          <Button text="Batal" className="btn-primary light w-full" />
          <Button text="Simpan" className="btn-primary dark w-full " />
        </div>
      </Card>
    </div>
  );
};

export default CreateProduct;
