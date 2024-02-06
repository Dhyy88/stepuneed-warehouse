import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import "swiper/swiper-bundle.min.css";
import Textinput from "@/components/ui/Textinput";
// import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Fileinput from "@/components/ui/Fileinput";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Swal from "sweetalert2";
import { Modal, Select } from "antd";
import { TreeSelect, Space } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import Alert from "@/components/ui/Alert";

const CreateProduct = () => {
  // START STATE GET DATA
  const [data_cars, setDataCars] = useState({
    data_cars: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [data_variant_generator, setDataVariantGenerator] = useState([]);
  const [query, setQuery] = useState({
    search: "",
    is_active: "",
    paginate: 9999,
  });

  // END STATE GET DATA

  const [category, setCategory] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [min_order, setMinOrder] = useState("");
  const [warranty, setWarranty] = useState("");
  const [is_active, setIsActive] = useState(false);
  const [primary_image, setPrimaryImage] = useState(null);
  const [images, setImages] = useState([]);
  const [variant_name, setVariantName] = useState("");
  const [variant_options, setVariantOptions] = useState([]);
  const [error, setError] = useState("");

  const [car_models, setCarModel] = useState("");
  const [price, setPrice] = useState([]);
  const [variants, setVariants] = useState([
    {
      // car_model: "",
      // variant_option: "",
      sku: "",
      price: "",
      is_primary: false,
      image: null,
    },
  ]);

  const [sku, setSku] = useState([]);

  // START STATE SWITCH AREA
  const [check_is_cars, setCheckCars] = useState(false);
  const [check_is_variant, setCheckIsVariant] = useState(false); // VARIANT SET STATE
  const [check_is_primary_variant, setCheckPrimaryVariant] = useState(false); // STATE VARIANT PRIMARY
  const [variantCarStatus, setVariantCarStatus] = useState(true);

  const [disabledForms, setDisabledForms] = useState([false]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [visibleSubCategories, setVisibleSubCategories] = useState({});
  const [treeData, setTreeData] = useState([]);

  const [isSubmitGenerator, setIsSubmitGenerator] = useState(false);
  const [variant_generator_data, setIsVariantGeneratorData] = useState(null);
  const [selected_cars_by_uid, setSelectedCarsByUid] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commonPrice, setCommonPrice] = useState("");

  // END STATE SWITCH AREA

  const [isModalOpenCars, setIsModalOpenCars] = useState(false);

  const handleOpenModalCars = () => {
    setIsModalOpenCars(true);
  };

  const handleFileChangePrimary = (e) => {
    setPrimaryImage(e.target.files[0]);
  };

  const handleFileChangeImages = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files).map((file) => file);
    setImages(filesArray);
  };

  // const handleSwitchChange = (index) => {
  //   const updatedDisabledForms = [...disabledForms];
  //   updatedDisabledForms[index] = !updatedDisabledForms[index];
  //   setDisabledForms(updatedDisabledForms);
  // };

  const mapSelectedCategoryToTreeData = (category) => {
    return category.map((item) => {
      if (item.sub_count > 0) {
        return {
          title: item.name,
          value: item.uid,
          children: mapSelectedCategoryToTreeData(item.sub_categories),
          disabled: true,
        };
      } else {
        return {
          title: item.name,
          value: item.uid,
        };
      }
    });
  };

  const handleTreeSelectChange = (value, label) => {
    if (label && label.trigger && label.trigger.dataRef) {
      const labelData = label.trigger.dataRef;
      setCategory(labelData.value);
    }
    if (Array.isArray(value) && value.length > 0) {
      const selectedUIDs = value.map((selectedValue) => {
        const selectedItem = selectedCategory.find(
          (item) => item.uid === selectedValue
        );
        return selectedItem ? selectedItem.uid : null;
      });
      setCategory(selectedUIDs.filter((uid) => uid !== null));
    }
  };

  const filterTreeNode = (input, treeNode) => {
    const title = treeNode.props?.title || "";
    return title.toLowerCase().includes(input.toLowerCase());
  };

  // START VARIANT CONDITION AREA

  const handleSkuChange = (value, index) => {
    const updatedSku = [...sku];
    updatedSku[index] = value;
    setSku(updatedSku);

    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], sku: value };
    setVariants(updatedVariants);
  };

  const handlePriceChange = (value, index) => {
    const updatedPrice = [...price];
    updatedPrice[index] = value;
    setPrice(updatedPrice);

    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], price: value };
    setVariants(updatedVariants);
  };

  const handleFileChangeVariantImages = (e, index) => {
    const files = e.target.files;
    const file = files[0];

    if (!variants[index]) {
      return;
    }

    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      image: file,
    };

    setVariants(updatedVariants);
  };

  const handlePrimaryVariantChange = (index) => {
    setCheckPrimaryVariant(index);

    const updatedVariants = variants.map((variant, i) => ({
      ...variant,
      is_primary: i === index,
    }));

    setVariants(updatedVariants);
  };

  const handleCheckboxChange = (carModelUid) => {
    const updatedCarModels = selected_cars_by_uid.includes(carModelUid)
      ? selected_cars_by_uid.filter((uid) => uid !== carModelUid)
      : [...selected_cars_by_uid, carModelUid];

    setSelectedCarsByUid(updatedCarModels);
  };

  const onSubmitCars = async () => {
    try {
      setIsModalOpenCars(false);
      if (selected_cars_by_uid.length > 0) {
        setCarModel(selected_cars_by_uid);
      }
    } catch (error) {
      Swal.fire("Error", "Gagal memilih data mobil", "error");
    }
  };

  const onResetCheckCars = async () => {
    setSelectedCarsByUid([]);
  };

  const handleCancelModalCars = () => {
    // setCheckCars(false);
    setIsModalOpenCars(false);
    // setSelectedCarsByUid([]);
  };

  const handleSelectChange = (selected) => {
    // setCheckCars(false);
    // setSelectedCarsByUid([]);
    setVariantOptions(selected);
    const initialStatus = selected.reduce((acc, option) => {
      acc[option] = true;
      return acc;
    }, {});
    setVariantCarStatus(initialStatus);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const newTag = { label: event.target.value, value: event.target.value };
      event.target.value = "";
      event.preventDefault();
    }
  };

  // const handleApplyCommonPrice = () => {
  //   const updatedVariants = variant_generator_data.map((variant, index) => ({
  //     ...variant,
  //     price: index === index ? commonPrice : variant.price,
  //   }));
  //   setVariants(updatedVariants);
  //   setCommonPrice("");
  // };

  const onSetupVariants = async () => {
    try {
      await handleVariantGenerator(selected_cars_by_uid);
      setIsSubmitGenerator(true);
      // setSelectedCarsByUid([]);
    } catch (error) {
      Swal.fire("Error", "Gagal mengatur variasi", "error");
    }
  };

  // END VARIANT CONDITION AREA

  // START REST API AREA

  async function getDataCars(query) {
    try {
      const response = await axios.post(ApiEndpoint.CARS, {
        page: query?.page,
        paginate: query?.paginate,
        search: query?.search,
      });
      setDataCars(response?.data?.data?.data);
      // setIsModalOpenCars(true);
    } catch (error) {
      Swal.fire("Gagal", "Gagal memuat data mobil", "error");
    }
  }

  useEffect(() => {
    getDataCars(query);
  }, [query]);

  async function handleVariantGenerator(selectedCars) {
    try {
      if (variant_options.length || selectedCars.length) {
        const requestData = {};
        if (variant_options.length) {
          requestData.variant_name = variant_name;

          if (variant_options.length > 0) {
            requestData.variant_options = variant_options || [];
          }
        }

        if (selectedCars.length > 0) {
          requestData.car_models = selectedCars;
        }

        const response = await axios.post(
          ApiEndpoint.VARIANT_GENERATOR,
          requestData
        );

        setDataVariantGenerator(response?.data?.data);
      } else {
        throw new Error("error");
      }
    } catch (error) {
      Swal.fire("Gagal", "Masukkan minimal 1 opsi variasi", "error");
    }
  }

  useEffect(() => {
    const getCategory = () => {
      axios.get(ApiEndpoint.CATEGORIES).then((response) => {
        setSelectedCategory(response.data.data);
      });
    };

    getCategory();
  }, []);

  // END REST API AREA

  // START USE EFFECT AREA

  useEffect(() => {
    const selectedCategoryTreeData =
      mapSelectedCategoryToTreeData(selectedCategory);
    setTreeData(selectedCategoryTreeData);
  }, [selectedCategory]);

  useEffect(() => {
    if (isSubmitGenerator && data_variant_generator) {
      setIsVariantGeneratorData(data_variant_generator);
    }
  }, [data_variant_generator, isSubmitGenerator]);

  const onSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const active = is_active ? 1 : 0;

    const formData = new FormData();
    formData.append("category", category);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("min_order", min_order);
    formData.append("warranty", warranty);
    formData.append("is_active", active);

    const updatedVariants = variants.map((variant, index) => ({
      ...variant,
      // variant_option: variant_options[index] || [],
      // car_model: car_models[index] || [],
      price: price[index] || "",
      sku: sku[index] || "",
      image: variants[index].image,
      is_primary:
        check_is_primary_variant && index === check_is_primary_variant,
    }));

    if (check_is_variant) {
      formData.append("variant_name", variant_name);

      for (let i = 0; i < variant_options.length; i++) {
        formData.append("variant_options[]", variant_options[i]);
      }

      for (let i = 0; i < car_models.length; i++) {
        formData.append("car_models[]", car_models[i]);
      }

      updatedVariants.forEach((variant, index) => {
        formData.append(`variants[${index}][sku]`, variant.sku || "");
        formData.append(`variants[${index}][price]`, variant.price || "");
        formData.append(
          `variants[${index}][is_primary]`,
          variant.is_primary ? 1 : 0
        );

        if (variant && variant.image) {
          formData.append(`variants[${index}][image]`, variant.image);
        }

        if (variant && variant_generator_data[index]?.variant?.option) {
          formData.append(
            `variants[${index}][variant_option]`,
            variant_generator_data[index]?.variant?.option || ""
          );
        }

        if (variant && variant_generator_data[index]?.car_model?.uid) {
          formData.append(
            `variants[${index}][car_model]`,
            variant_generator_data[index]?.car_model?.uid || ""
          );
        }
      });
    } else {
      formData.append(`variants[${0}][sku]`, sku || "");
      formData.append(`variants[${0}][price]`, price || "");
      // formData.append("price", price || "");
    }

    formData.append("primary_image", primary_image);

    for (let i = 0; i < images.length; i++) {
      formData.append("images[]", images[i]);
    }

    Swal.fire({
      icon: "warning",
      title: "Konfirmasi",
      text: "Anda yakin daya yang dimasukkan sudah benar?",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      setIsLoading(true);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${ApiEndpoint.CREATE_PRODUCTS}`,
            formData
          );
          if (response.status === 200) {
            Swal.fire("Berhasil", "Produk telah ditambahkan", "success");
          } else {
            setValidation("Terjadi kesalahan saat mengirim data");
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saat mengirim data",
            });
            setIsLoading(false);
          }
        } catch (error) {
          setError(error.response.data.errors);
          Swal.fire("Gagal", "Terjadi kesalahan saat mengirim data", "error");
        }
      } else {
        setIsLoading(false);
      }
    });
  };

  // START USE EFFECT AREA

  return (
    <div className="lg:col-span-12 col-span-12">
      <Card title={"Tambah Produk"}>
        <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
          <div className="">
            <label htmlFor=" hh" className="form-label ">
              Kategori Produk *
            </label>
            <TreeSelect
              treeData={treeData}
              showSearch
              style={{ width: "100%" }}
              placeholder="Pilih Kategori"
              onChange={(value, label, extra) =>
                handleTreeSelectChange(value, label, extra)
              }
              filterTreeNode={filterTreeNode}
              notFoundContent={
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    padding: 10,
                  }}
                >
                  <div className="">
                    <span className="text-slate-900 dark:text-white text-[100px]  transition-all duration-300 ">
                      <Icon icon="heroicons:exclamation-triangle" />
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-900 dark:text-white text-[30px]">
                      Tidak ada data
                    </span>
                  </div>
                </div>
              }
            />
            {error && (
              <span className="text-danger-600 text-xs py-2">
                {error.category}
              </span>
            )}
          </div>
          {selectedCategory && selectedCategory.subCount > 0 && (
            <div className="">
              <label htmlFor="subCategory" className="form-label">
                Sub Kategori Produk *
              </label>
              <TreeSelect
                treeData={visibleSubCategories}
                treeCheckable
                style={{ width: "100%" }}
                placeholder="Pilih Sub Kategori"
                treeCheckStrictly
              />
            </div>
          )}
        </div>
        <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
          <div className="">
            <Textinput
              type="text"
              label="Nama Produk *"
              placeholder="Masukkan nama produk"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && (
              <span className="text-danger-600 text-xs py-2">{error.name}</span>
            )}
          </div>
          <div className="">
            <Textinput
              type="number"
              label="Minimal Pesanan *"
              placeholder="Masukkan angka minimal pesanan"
              value={min_order}
              onChange={(e) => setMinOrder(e.target.value)}
            />
            {error && (
              <span className="text-danger-600 text-xs py-2">
                {error.min_order}
              </span>
            )}
          </div>
          <div className="">
            <Textinput
              type="number"
              label="Garansi produk (optional) "
              placeholder="Garansi produk berupa angka per bulan"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
            />
            {error && (
              <span className="text-danger-600 text-xs py-2">
                {error.warranty}
              </span>
            )}
          </div>
        </div>
        <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
          <div className="">
            <label htmlFor=" hh" className="form-label ">
              Deskripsi Produk *
            </label>
            <ReactQuill
              theme="snow"
              placeholder="Masukkan deskripsi produk..."
              value={description}
              onChange={setDescription}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["clean"],
                ],
              }}
            />
            {error && (
              <span className="text-danger-600 text-xs py-2">
                {error.description}
              </span>
            )}
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
            {error && (
              <span className="text-danger-600 text-xs py-2">
                {error.primary_image}
              </span>
            )}
          </div>
          <div className="">
            <label htmlFor=" hh" className="form-label ">
              Gambar Pendukung (optional)
            </label>
            <Fileinput
              name="basic"
              selectedFiles={images}
              onChange={handleFileChangeImages}
              multiple
              preview
            />
            {error && (
              <span className="text-danger-600 text-xs py-2">
                Format Gambar JPG / JPEG
              </span>
            )}
          </div>
        </div>

        <Card title="Opsi Produk" className="mb-5">
          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 ">
            <div className="flex row gap-20">
              <Switch
                label="Status Produk (Optional)"
                activeClass="bg-success-500"
                value={is_active}
                onChange={() => setIsActive(!is_active)}
                badge
                prevIcon="heroicons-outline:check"
                nextIcon="heroicons-outline:x"
              />
              <Switch
                label="Variasi Produk (Optional)"
                activeClass="bg-success-500"
                value={check_is_variant}
                onChange={() => setCheckIsVariant(!check_is_variant)}
                badge
                prevIcon="heroicons-outline:check"
                nextIcon="heroicons-outline:x"
              />
            </div>
          </div>
        </Card>

        {check_is_variant ? (
          <>
            <Alert
              // dismissible
              icon="heroicons-outline:exclamation"
              className="light-mode alert-success mb-5"
            >
              <p>
                Untuk fungsi memilih model mobil, anda akan menerbitkan produk
                dengan tipe mobil tertentu. Jika tidak memilih, maka produk ini
                berlaku untuk semua tipe mobil!
              </p>
            </Alert>
            <Card title="Variasi Produk" className="mb-5">
              <div className="flex row gap-5 mb-5">
                <div className="w-96">
                  <Textinput
                    type="text"
                    label="Nama Variasi *"
                    placeholder=""
                    value={variant_name}
                    onChange={(e) => setVariantName(e.target.value)}
                  />
                  {error && (
                    <span className="text-danger-600 text-xs py-2">
                      {error.varian_name}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor=" hh" className="form-label ">
                    Opsi Variasi *
                  </label>
                  <Select
                    mode="tags"
                    style={{ width: "100%", height: 40 }}
                    onChange={handleSelectChange}
                    tokenSeparators={[","]}
                    disabled={variant_name.trim() === ""}
                    onKeyDown={handleKeyDown}
                  />
                  {error && (
                    <span className="text-danger-600 text-xs py-2">
                      {error.variant_options}
                    </span>
                  )}
                </div>
                <div className="w-48">
                  <label htmlFor=" hh" className="form-label ">
                    Pilih Model Mobil ?
                  </label>
                  <button
                    className="btn-sm btn-primary"
                    type="button"
                    onClick={handleOpenModalCars}
                    style={{ height: 40, width: "100%", borderRadius: 10 }}
                  >
                    Tambah model
                  </button>
                  {/* <Button
                    text="Tambah model"
                    className=" btn-sm btn-primary light "
                    style={{ height: 40, width: 40 }}
                    onClick={handleOpenModalCars}
                  /> */}
                  {/* <Switch
                    activeClass="bg-success-500"
                    value={check_is_cars}
                    onChange={() => {
                      setCheckCars(!check_is_cars);
                      if (!check_is_cars) {
                        // getDataCars();
                        setIsModalOpenCars(false);
                      }
                      setIsModalOpenCars(true);
                    }}
                    badge
                    prevIcon="heroicons-outline:check"
                    nextIcon="heroicons-outline:x"
                  /> */}
                  <Modal
                    width={1500}
                    title="Model Mobil"
                    open={isModalOpenCars}
                    centered
                    footer
                    onCancel={handleCancelModalCars}
                    style={{ maxWidth: "5000vh", overflow: "auto" }}
                  >
                    <Card>
                      <div className="flex row w-full justify-between items-center mb-2 gap-5">
                        <div className="w-full">
                          <Textinput
                            // value={query || ""}
                            onChange={(event) =>
                              setQuery({
                                ...query,
                                search: event.target.value,
                              })
                            }
                            placeholder="Cari model mobil..."
                          />
                        </div>
                        <div className="">
                          <button
                            className="action-btn flex btn-danger"
                            type="button"
                            onClick={onResetCheckCars}
                            style={{ height: 40, width: 40 }}
                          >
                            <Icon icon="heroicons:arrow-path" />
                          </button>
                        </div>
                      </div>
                    </Card>
                    <Card>
                      <div className="flex row ">
                        <ul>
                          <div className="grid xl:grid-cols-10 md:grid-cols-10 grid-cols-1 gap-5 h-full ">
                            {data_cars?.map((car) => (
                              <li key={car.uid} className="flex row ">
                                <Checkbox
                                  value={selected_cars_by_uid.includes(car.uid)}
                                  onChange={() => handleCheckboxChange(car.uid)}
                                />
                                {`${car?.full_name}`}
                              </li>
                            ))}
                          </div>
                        </ul>
                      </div>
                    </Card>
                    <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mt-10">
                      <Button
                        text="Konfirmasi"
                        className="btn-primary dark w-full"
                        onClick={onSubmitCars}
                      />
                    </div>
                  </Modal>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <Button
                  text="Terapkan Variasi"
                  className="btn-outline-success light"
                  onClick={onSetupVariants}
                />
              </div>
            </Card>
            {variant_generator_data?.length > 0 && (
              <Card title={`Variasi`} className="mt-5">
                {/* <Card className="mb-5">
                  <div className="flex justify-between">
                    <div className="">
                      <span className="text-success-500">
                        Terapkan harga untuk semua variasi
                      </span>
                    </div>
                    <div className="">
                      <Button
                        text="Terapkan Harga"
                        className="btn-outline-success"
                        onClick={() => handleApplyCommonPrice(-1)}
                      />
                    </div>
                  </div>
                  <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
                    <div className="">
                      <Textinput
                        type="number"
                        label="Harga Produk"
                        placeholder=""
                        value={commonPrice}
                        onChange={(e) => setCommonPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </Card> */}

                {variant_generator_data?.map((item, index) => (
                  <Card key={index} className="mt-5">
                    <div className="flex justify-between mb-5">
                      <div className="">
                        <span className="text-success-500">
                          {item?.variant?.option ? (
                            `Opsi Variasi : ${item?.variant?.option}`
                          ) : (
                            <></>
                          )}
                          <br />
                          {item?.car_model?.full_name ? (
                            `Model Mobil : ${item?.car_model?.full_name}`
                          ) : (
                            <></>
                          )}
                        </span>
                      </div>
                      <div className="flex row justify-end gap-10">
                        {/* <div className="">
                          <Switch
                            label="Status"
                            activeClass="bg-success-500"
                            badge
                            prevIcon="heroicons-outline:check"
                            nextIcon="heroicons-outline:x"
                            value={!disabledForms[index]}
                            onChange={() => handleSwitchChange(index)}
                          />
                        </div> */}
                        <div className="">
                          <Switch
                            label="Utama"
                            activeClass="bg-success-500"
                            badge
                            prevIcon="heroicons-outline:check"
                            nextIcon="heroicons-outline:x"
                            value={index === check_is_primary_variant}
                            onChange={() => handlePrimaryVariantChange(index)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
                      <div className="">
                        <Textinput
                          type="text"
                          label="SKU Variasi Produk *"
                          placeholder=""
                          disabled={disabledForms[index]}
                          // value={sku[index] || ""}
                          value={variants[index] ? variants[index].sku : ""}
                          onChange={(e) =>
                            handleSkuChange(e.target.value, index)
                          }
                        />
                        {/* {error && (
                          <span className="text-danger-600 text-xs py-2">
                            Silahkan masukkan sku produk
                          </span>
                        )} */}
                      </div>
                      <div className="">
                        <Textinput
                          type="number"
                          label="Harga Variasi Produk *"
                          placeholder=""
                          disabled={disabledForms[index]}
                          value={variants[index] ? variants[index].price : ""}
                          onChange={(e) =>
                            handlePriceChange(e.target.value, index)
                          }
                        />
                        {/* {error && (
                          <span className="text-danger-600 text-xs py-2">
                            Silahkan masukkan harga produk
                          </span>
                        )} */}
                      </div>
                      <div className="">
                        <label htmlFor=" hh" className="form-label ">
                          Gambar Variasi Produk
                        </label>
                        <Fileinput
                          selectedFile={
                            variants[index] ? variants[index].image : null
                          }
                          onChange={(e) =>
                            handleFileChangeVariantImages(e, index)
                          }
                          isClearable={true}
                          disabled={disabledForms[index]}
                        />
                        {/* {error && (
                          <span className="text-danger-600 text-xs py-2">
                            Format Gambar JPG / JPEG
                          </span>
                        )} */}
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
                  label="SKU Produk *"
                  placeholder="Masukkan sku produk"
                  // value={sku[0] || ""}
                  value={variants[0] ? variants[0].sku : ""}
                  onChange={(e) => handleSkuChange(e.target.value, 0)}
                />
                {/* {error && (
                  <span className="text-danger-600 text-xs py-2">
                    Silahkan masukkan sku produk
                  </span>
                )} */}
              </div>
              <div className="">
                <Textinput
                  type="text"
                  label="Harga Produk *"
                  placeholder="Masukkan harga produk"
                  value={variants[0] ? variants[0].price : ""}
                  onChange={(e) => handlePriceChange(e.target.value, 0)}
                />
                {/* {error && (
                  <span className="text-danger-600 text-xs py-2">
                    Silahkan masukkan harga produk
                  </span>
                )} */}
              </div>
            </div>
          </>
        )}
        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mt-10">
          <Button text="Batal" className="btn-primary light w-full" />
          <Button
            text="Simpan"
            className="btn-primary dark w-full"
            onClick={onSubmit}
          />
        </div>
      </Card>
    </div>
  );
};

export default CreateProduct;
