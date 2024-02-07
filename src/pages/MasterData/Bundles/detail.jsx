import React, { useEffect, useState, Fragment } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import { useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../../components/LoadingButton";
import Alert from "@/components/ui/Alert";
import { Modal } from "antd";
import Select from "react-select";

const DetailBundles = () => {
  let { uid } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [product_price, setProductPrice] = useState("");
  const [product_quantity, setProductQuantity] = useState("");

  const [isModalProducts, setIsModalProducts] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenModalCars = () => {
    setIsModalProducts(true);
  };

  const handleCancelModalNewProduct = () => {
    setIsModalProducts(false);
    resetForm();
  };

  const getDataById = () => {
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.BUNDLES}/${uid}`).then((response) => {
          setData(response.data.data);
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function onDeleteProducts(uid, uidProduct) {
    try {
      const result = await Swal.fire({
        title: "Apakah anda yakin menghapus produk ini?",
        text: "Anda tidak akan dapat mengembalikannya!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await axios.delete(`${ApiEndpoint.BUNDLES}/${uid}/${uidProduct}`);
        Swal.fire(
          "Berhasil!",
          "Anda berhasil menghapus data produk ini.",
          "success"
        );
        getDataById();
      } else {
        Swal.fire("Batal", "Hapus data produk dibatalkan.", "info");
      }
    } catch (err) {
      Swal.fire("Gagal", "Gagal hapus data", "error");
    }
  }

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
                  extra: `Rp ${dataProduct.primary_variant.price}`,
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
                extra: `Rp. ${variant.price}`,
              }));
            } else {
              const primaryVariant = dataProduct.primary_variant;
              const primaryVariantData = primaryVariant
                ? [
                    {
                      value: primaryVariant.uid,
                      label: `${dataProduct.name} - ${primaryVariant.sku}`,
                      extra: `Rp ${primaryVariant.price}`,
                    },
                  ]
                : [];

              return [
                ...primaryVariantData,
                ...dataProduct.variants.map((variant) => ({
                  value: variant.uid,
                  label: `${dataProduct.name} - ${variant.sku}`,
                  extra: `Rp ${variant.price}`,
                })),
              ];
            }
          }
        })
        .filter((variant) => variant !== null);

      setProductOptions(formattedVariants);
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

  const onSubmit = async () => {
    setIsLoading(true);
    const confirmation = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin membuat Bundle?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      reverseButtons: true,
    });

    if (confirmation.isConfirmed) {
      try {
        const formData = {
          product_price,
          product_quantity,
          product_variant: selectedProduct.value,
        };

        await axios.post(
          `${ApiEndpoint.BUNDLES}/${uid}/assign-new-product`,
          formData
        );
        Swal.fire("Berhasil!", "Bundle berhasil dibuat.", "success");
        setIsLoading(false);
        setIsModalProducts(false);
        getDataById();
        resetForm();
      } catch (error) {
        Swal.fire(
          "Error!",
          error?.response?.data?.message ||
            "Gagal menerbitkan produk dalam bundle ini",
          "error"
        );
        setIsLoading(false);

        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          setError(error.response.data.errors);
        } else {
          setError("Terjadi kesalahan saat membuat Bundle.");
        }

        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setProductPrice("");
    setProductQuantity("");
    setSelectedProduct(null);
  };

  return (
    <div>
      <div className="space-y-5 profile-page">
        <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end  rtl:space-x-reverse">
              <div className="flex-1 mt-10">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {data?.name}
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                  {data?.uid}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                Status
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                {data?.is_active === true && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                    Aktif
                  </span>
                )}
                {data?.is_active === false && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                    Nonaktif
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                Status Content
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                {data?.is_display_in_army_content === true && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                    Tampil
                  </span>
                )}
                {data?.is_display_in_army_content === false && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                    Tidak Tampil
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                Total Produk
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                {data?.item_count} Produk
              </div>
            </div>
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                Total Harga
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Rp {data?.total_price}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 ">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info Bundle" className="mb-4">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:arrow-right" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase font-3xl text-slate-500 dark:text-slate-300 mb-1 leading-[12px] mb-3">
                      Deskripsi Bundle
                    </div>
                    {data?.description}
                  </div>
                </li>
              </ul>
            </Card>
            <Card className="mb-4">
              <div className="grid justify-items-center ">
                <div className="flex row justify-items-center gap-5 align-center w-full">
                  <Button
                    text="Tambah Produk"
                    className=" btn-outline-primary w-full"
                    onClick={() => handleOpenModalCars()}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 col-span-12">
            <Card title="Produk Bundle" className="mb-4">
              <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 card-height-auto">
                {data?.bundle_items.map((item, index) => (
                  <Card noborder bodyClass="p-0" key={index}>
                    <div className="image-box">
                      <img
                        src={item.variant.image.url}
                        alt=""
                        className="rounded-t-md w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <div className="card-title ">
                        {item.variant.product.name}
                      </div>
                      <div className="text-sm mt-2">{item.variant.sku}</div>
                      <div className="text-sm mt-2">
                        {item?.variant?.product?.is_active === true && (
                          <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                            Produk Aktif
                          </span>
                        )}
                        {item?.variant?.product?.is_active === false && (
                          <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                            Produk Nonaktif
                          </span>
                        )}
                      </div>
                    </div>

                    <Card>
                      <div className="">
                        <div className="flex row justify-between mb-2">
                          <div className="">
                            <div className="text-sm">Harga Bundle</div>
                          </div>
                          <div className="">
                            <div className="text-sm ">
                              Rp {item?.bundle_price}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex row justify-between mb-2">
                        <div className="">
                          <div className="text-sm">Harga Dasar</div>
                        </div>
                        <div className="">
                          <div className="text-sm ">Rp {item?.base_price}</div>
                        </div>
                      </div>

                      <div className="flex row justify-between mb-2">
                        <div className="">
                          <div className="text-sm">Total Harga</div>
                        </div>
                        <div className="">
                          <div className="text-sm ">
                            Rp {item?.total_bundle_price}
                          </div>
                        </div>
                      </div>

                      <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mt-10 mb-4">
                        <Button
                          text={isLoading ? <LoadingButton /> : "Hapus Produk"}
                          className="btn-danger light w-full "
                          type="submit"
                          onClick={() => onDeleteProducts(uid, item.uid)}
                          disabled={isLoading}
                        />
                      </div>
                    </Card>
                  </Card>
                ))}
              </div>
            </Card>
            <Modal
              open={isModalProducts}
              centered
              footer
              onCancel={handleCancelModalNewProduct}
            >
              <Card>
                <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-3 mb-4">
                  <div className="">
                    <label className="form-label ">Pilih Produk *</label>
                    <Select
                      options={productOptions}
                      value={selectedProduct}
                      onChange={setSelectedProduct}
                      placeholder="Pilih produk..."
                    />
                  </div>
                  <div className="">
                    <Textinput
                      label="Harga Bundle *"
                      type="number"
                      placeholder="Tentukan nilai harga bundle"
                      value={product_price}
                      onChange={(e) => setProductPrice(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between items-end space-x-5">
                    <div className="flex-1">
                      <Textinput
                        label="Jumlah Bundle *"
                        type="number"
                        placeholder="Tentukan nilai jumlah bundle"
                        value={product_quantity}
                        onChange={(e) => setProductQuantity(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
              <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mt-10">
                <Button
                  text={isLoading ? <LoadingButton /> : "Simpan"}
                  className="btn-primary dark w-full "
                  type="submit"
                  onClick={onSubmit}
                  disabled={isLoading}
                />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBundles;
