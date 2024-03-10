import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import axios from "../../../API/Axios";
import ApiEndpoint from "../../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Select from "react-select";
import Switch from "@/components/ui/Switch";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import { useNavigate } from "react-router-dom";
import Alert from "@/components/ui/Alert";
import LoadingButton from "../../../components/LoadingButton";
import { useParams } from "react-router-dom";

const UpdateBundle = () => {
  const navigate = useNavigate();
  let { uid } = useParams();
  const [data, setData] = useState(null);
  const [dataProduct, setDataProduct] = useState([]);
  const [name, setName] = useState("");
  const [is_active, setIsActive] = useState(false);
  const [description, setDescription] = useState("");
  //   const [variants, setVariants] = useState([""]);
  //   const [prices, setPrices] = useState([""]);
  //   const [quantities, setQuantities] = useState([""]);
  const [variants, setVariants] = useState([]);
  const [prices, setPrices] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [selectedVariantDetails, setSelectedVariantDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getDataById = () => {
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.BUNDLES}/${uid}`).then((response) => {
          const bundleData = response.data.data;
          setData(bundleData);
          setName(bundleData.name);
          setIsActive(bundleData.is_active);
          setDescription(bundleData.description);

          if (bundleData.bundle_items && bundleData.bundle_items.length > 0) {
            const variantsData = bundleData.bundle_items.map((item) => ({
              variant: item.variant.uid,
              price: item.bundle_price,
              quantity: item.quantity,
            }));

            const variants = variantsData.map((variant) => variant.variant);
            const prices = variantsData.map((variant) => variant.price);
            const quantities = variantsData.map((variant) => variant.quantity);

            setVariants(variants);
            setPrices(prices);
            setQuantities(quantities);
          } else {
            setVariants([]);
            setPrices([]);
            setQuantities([]);
          }
        });
      }
    } catch (error) {
      setError(error.response.data.errors);
      console.error("Error fetching data:", error);
    }
  };

  const previousPage = () => {
    navigate(-1);
  };

  const handleAddProduct = () => {
    setVariants([...variants, ""]);
    setPrices([...prices, ""]);
    setQuantities([...quantities, ""]);
    setSelectedVariantDetails([...selectedVariantDetails, null]);
  };

  const handleRemoveProduct = (index) => {
    const updatedVariants = [...variants];
    const updatedPrices = [...prices];
    const updatedQuantities = [...quantities];
    const updatedSelectedVariantDetails = [...selectedVariantDetails];

    updatedVariants.splice(index, 1);
    updatedPrices.splice(index, 1);
    updatedQuantities.splice(index, 1);
    updatedSelectedVariantDetails.splice(index, 1);

    setVariants(updatedVariants);
    setPrices(updatedPrices);
    setQuantities(updatedQuantities);
    setSelectedVariantDetails(updatedSelectedVariantDetails);
  };

  const handleVariantChange = (value, index) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = value.value;
    setVariants(updatedVariants);

    const updatedSelectedVariantDetails = [...selectedVariantDetails];
    updatedSelectedVariantDetails[index] = value;
    setSelectedVariantDetails(updatedSelectedVariantDetails);
  };

  const handlePriceChange = (value, index) => {
    const updatedPrices = [...prices];
    updatedPrices[index] = value;
    setPrices(updatedPrices);
  };

  const handleQuantityChange = (value, index) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] = value;
    setQuantities(updatedQuantities);
  };

  const fetchVariants = async () => {
    try {
      const response = await axios.post(ApiEndpoint.PRODUCTS);
      const formattedVariants = response?.data?.data
        ?.flatMap((dataProduct) => {
          if (!dataProduct.variants || dataProduct.variants.length === 0) {
            return dataProduct.primary_variant
              ? {
                  value: dataProduct.primary_variant.uid,
                  label: `${dataProduct.name} - ${dataProduct.primary_variant.sku}`,
                  extra: `Rp ${dataProduct.primary_variant.price.toLocaleString("id-ID")}`,
                }
              : null;
          } else {
            const primaryVariantUid = dataProduct.primary_variant?.uid;
            const primaryVariantExistsInVariants =
              primaryVariantUid &&
              dataProduct.variants.some(
                (variant) => variant.uid === primaryVariantUid
              );

            if (primaryVariantExistsInVariants) {
              return dataProduct.variants.map((variant) => ({
                value: variant.uid,
                label: `${dataProduct.name} - ${variant.sku}`,
                extra: `Rp. ${variant.price.toLocaleString("id-ID")}`,
              }));
            } else {
              const primaryVariant = dataProduct.primary_variant;
              const primaryVariantData = primaryVariant
                ? [
                    {
                      value: primaryVariant.uid,
                      label: `${dataProduct.name} - ${primaryVariant.sku}`,
                      extra: `Rp ${primaryVariant.price.toLocaleString("id-ID")}`,
                    },
                  ]
                : [];

              return [
                ...primaryVariantData,
                ...dataProduct.variants.map((variant) => ({
                  value: variant.uid,
                  label: `${dataProduct.name} - ${variant.sku}`,
                  extra: `Rp ${variant.price.toLocaleString("id-ID")}`,
                })),
              ];
            }
          }
        })
        .filter((variant) => variant !== null);

      setDataProduct(formattedVariants);
      // console.log(formattedVariants);
    } catch (error) {
      console.error("Error fetching product variants:", error);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  useEffect(() => {
    getDataById();
  }, [uid]);

  useEffect(() => {
    if (data) {
      const initialSelectedVariantDetails = data.bundle_items.map((item) => ({
        value: item.variant.uid,
        label: `${item.variant.product.name} - ${item.variant.sku}`,
        extra: `Rp. ${item.bundle_price}`,
      }));
      setSelectedVariantDetails(initialSelectedVariantDetails);
    }
  }, [data]);

  const renderVariantInputs = (index) => (
    <div key={index}>
      <div className="grid xl:grid-cols-3 md:grid-cols-4 grid-cols-1 gap-5 mb-4">
        <div className="">
          <label htmlFor={`variant_${index}`} className="form-label ">
            Pilih Produk *
          </label>
          <Select
            id={`variant_${index}`}
            className="react-select mt-2"
            classNamePrefix="select"
            placeholder="Pilih Produk..."
            options={dataProduct}
            value={selectedVariantDetails[index]}
            onChange={(value) => {
              handleVariantChange(value, index);
            }}
          />
        </div>
        <div className="">
          <Textinput
            label="Harga Produk Bundle *"
            type="number"
            placeholder="Tentukan nilai harga bundle"
            value={prices[index]}
            onChange={(e) => handlePriceChange(e.target.value, index)}
          />
        </div>
        <div className="flex justify-between items-end space-x-5">
          <div className="flex-1">
            <Textinput
              label="Jumlah Produk Bundle *"
              type="number"
              placeholder="Tentukan nilai jumlah bundle"
              value={quantities[index]}
              onChange={(e) => handleQuantityChange(e.target.value, index)}
            />
          </div>
          <div className="flex-none relative">
            <button
              className="inline-flex items-center justify-center h-10 w-10 bg-danger-500 text-lg border rounded border-danger-500 text-white"
              onClick={() => handleRemoveProduct(index)}
            >
              <Icon icon="heroicons:trash" />
            </button>
          </div>
        </div>
      </div>
      {selectedVariantDetails[index] && (
        <Alert
          icon="heroicons-outline:arrow-right"
          className="light-mode alert-success mb-5"
        >
          <div>
            <p>Produk: {selectedVariantDetails[index].label}</p>
            <p>Harga Produk: {selectedVariantDetails[index].extra}</p>
          </div>
        </Alert>
      )}
    </div>
  );

  const onSubmit = async () => {
    setIsLoading(true);
    const confirmation = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin memperbaharui bundle ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      reverseButtons: true,
    });
    setIsLoading(true);

    if (confirmation.isConfirmed) {
      try {
        const formData = {
          name,
          is_active,
          description,
          product_variant: variants.map((variant, index) => ({
            variant,
            price: prices[index],
            quantity: quantities[index],
          })),
        };

        await axios.post(`${ApiEndpoint.BUNDLES}/${uid}`, formData);
        Swal.fire("Berhasil!", "Bundle berhasil diperbaharui.", "success");
        setIsLoading(false);
        navigate("/bundles");
      } catch (error) {
        Swal.fire("Error!", error?.response?.data?.message, "error");
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          setError(error.response.data.errors);
        } else {
          setError("Terjadi kesalahan saat memperbaharui Bundle.");
        }
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:col-span-12 col-span-12">
      <Card title={"Tambah Bundle"}>
        {error &&
          Object.values(error).map((errMsg, i) => (
            <Alert
              icon="heroicons-outline:exclamation"
              className="light-mode alert-danger mb-5"
            >
              <span key={i} className="text-danger-600 text-xs py-2">
                {errMsg}
              </span>
            </Alert>
          ))}
        <Card className="mb-4">
          <div className="flex row gap-5 mb-4">
            <div className="w-full">
              <Textinput
                label="Nama Bundle *"
                type="text"
                placeholder="Masukkan nama bundle"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {/* {error && (
                <span className="text-danger-600 text-xs py-2">
                  {error.name}
                </span>
              )} */}
            </div>
            <div className="w-64">
              <label className="form-label ">Status Bundle</label>
              <Switch
                activeClass="bg-success-500"
                value={is_active}
                onChange={() => setIsActive(!is_active)}
                badge
                prevIcon="heroicons-outline:check"
                nextIcon="heroicons-outline:x"
              />
            </div>
          </div>
          <div className="text-base text-slate-600 dark:text-slate-300 mb-5">
            <Textarea
              label="Deskripsi Bundle *"
              id="pn4"
              rows="6"
              placeholder="Masukkan deskripsi bundle anda"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </Card>

        <Card className="mb-4">
          <div className="flex justify-end mb-2">
            <Button
              text="Tambah Produk"
              className="btn-primary light"
              onClick={handleAddProduct}
            />
          </div>
          {variants.map((item, index) => renderVariantInputs(index))}
        </Card>

        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
          <Button
            text="Batal"
            className="btn-secondary light w-full"
            onClick={previousPage}
          />
          <Button
            text={isLoading ? <LoadingButton /> : "Ubah"}
            className="btn-primary dark w-full "
            type="submit"
            onClick={onSubmit}
            disabled={isLoading}
          />
        </div>
      </Card>
    </div>
  );
};

export default UpdateBundle;
