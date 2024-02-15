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

  async function onDelete(uid) {
    try {
      const result = await Swal.fire({
        icon: "question",
        title: "Apakah Anda yakin ingin menghapus bundle ini?",
        text: "Anda tidak akan dapat mengembalikannya!",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        const { value: input } = await Swal.fire({
          icon: "warning",
          title: "Verifikasi",
          text: `Silahkan ketik "hapusdata" untuk melanjutkan verifikasi hapus data !`,
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Konfirmasi",
          cancelButtonText: "Batal",
          inputValidator: (value) => {
            if (!value || value.trim().toLowerCase() !== "hapusdata") {
              return 'Anda harus memasukkan kata "hapusdata" untuk melanjutkan verifikasi hapus data!';
            }
          },
        });

        if (input && input.trim().toLowerCase() === "hapusdata") {
          await axios.delete(`${ApiEndpoint.BUNDLES}/${uid}`);
          Swal.fire(
            "Berhasil!",
            "Anda berhasil menghapus data bundle ini.",
            "success"
          );
          navigate(`/bundles`);
        } else {
          Swal.fire("Batal", "Hapus data bundle dibatalkan.", "info");
        }
      }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  }

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
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg mb-5"></div>
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
        </div>

        <div className="grid grid-cols-12 gap-6 ">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info Bundle" className="mb-4">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-1">
                    <div className="uppercase font-3xl text-slate-500 dark:text-slate-300 mb-1 leading-[12px] mb-3">
                      Total Produk
                    </div>
                    {data?.item_count} Produk
                  </div>
                  <div className="flex-1">
                    <div className="uppercase font-3xl text-slate-500 dark:text-slate-300 mb-1 leading-[12px] mb-3">
                      Total Harga
                    </div>
                    Rp {data?.total_price.toLocaleString("id-ID")}
                  </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-1">
                    <div className="uppercase font-3xl text-slate-500 dark:text-slate-300 mb-1 leading-[12px] mb-3">
                      Status Bundle
                    </div>
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
                  <div className="flex-1">
                    <div className="uppercase font-3xl text-slate-500 dark:text-slate-300 mb-1 leading-[12px] mb-3">
                      Status Konten
                    </div>
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
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-1">
                    <div className="uppercase font-3xl text-slate-500 dark:text-slate-300 mb-1 leading-[12px] mb-3">
                      Deskripsi Bundle
                    </div>
                    {data?.description}
                  </div>
                </li>
              </ul>
            </Card>

            <Card bodyClass="p-0" noborder>
              <header
                className={`border-b px-4 pt-4 pb-3 flex items-center  border-danger-500`}
              >
                <h6 className={`card-title mb-0  text-danger-500`}>
                  Danger Zone
                </h6>
              </header>
              <div className="py-3 px-5">
                <div className="card-title2 mb-2">Perbaharui Bundle</div>
                <div className="flex row justfiy-between gap-2">
                  <div className="flex-1">
                    <div className="text-sm">
                      Harap memperhatikan kembali data dari bundle yang ingin
                      diperbaharui.
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="">
                      <Button
                        text="Perbaharui Bundle"
                        className="btn-warning dark w-full btn-sm "
                        onClick={() => navigate(`/bundles/update/${uid}`)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-3 px-5">
                <div className="card-title2 mb-2">Hapus Bundle</div>
                <div className="flex row justfiy-between gap-2">
                  <div className="flex-1">
                    <div className="text-sm">
                      Setelah Anda menghapus bundle, tidak ada akses untuk
                      mengembalikan data. Harap mempertimbangkannya kembali.
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="">
                      <Button
                        text="Hapus Bundle"
                        className="btn-danger dark w-full btn-sm "
                        onClick={() => onDelete(uid)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 col-span-12">
            <Card bodyClass="p-0" noborder>
              <header
                className={`border-b px-6 pt-6 pb-5 flex items-center  border-slate-800`}
              >
                <div className="flex w-full justify-between">
                  <h6 className={`card-title mb-0  text-slate-800`}>
                    Produk Bundle
                  </h6>
                  <Button
                    text="Tambah Produk"
                    className=" btn-primary btn-sm"
                    onClick={() => handleOpenModalCars()}
                  />
                </div>
              </header>

              <div className="py-4 px-6">
                <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 card-height-auto">
                  {data?.bundle_items.map((item, index) => (
                    <Card noborder bodyClass="p-0" key={index}>
                      <div className="image-box">
                        {item?.variant?.image?.url ? (
                          <img
                            src={item?.variant?.image?.url}
                            alt=""
                            className="rounded-t-md w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={item?.variant?.product?.primary_image?.url}
                            alt=""
                            className="rounded-t-md w-full h-full object-cover"
                          />
                        )}
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
                                Rp {item?.bundle_price.toLocaleString("id-ID")}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex row justify-between mb-2">
                          <div className="">
                            <div className="text-sm">Harga Dasar</div>
                          </div>
                          <div className="">
                            <div className="text-sm ">
                              Rp {item?.base_price.toLocaleString("id-ID")}
                            </div>
                          </div>
                        </div>

                        <div className="flex row justify-between mb-2">
                          <div className="">
                            <div className="text-sm">Total Harga</div>
                          </div>
                          <div className="">
                            <div className="text-sm ">
                              Rp{" "}
                              {item?.total_bundle_price.toLocaleString("id-ID")}
                            </div>
                          </div>
                        </div>

                        <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mt-10 mb-4">
                          <Button
                            text={
                              isLoading ? <LoadingButton /> : "Hapus Produk"
                            }
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
