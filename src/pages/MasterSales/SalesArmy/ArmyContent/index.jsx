import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Select from "react-select";
import ApiEndpoint from "../../../../API/Api_EndPoint";
import axios from "../../../../API/Axios";
import Loading from "../../../../components/Loading";
import LoadingButton from "../../../../components/LoadingButton";
import Alert from "@/components/ui/Alert";

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, color: "#626262", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  option: (provided, state) => ({
    ...provided,
    fontSize: "12px",
  }),
};

const ArmyContents = () => {
  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [data_bundles, setDataBundles] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [data_products, setDataProducts] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [query, setQuery] = useState({
    search: "",
    paginate: 5,
    content_type: "",
    is_active: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [error, setError] = useState(null);

  const [content_type, setContentType] = useState(null);
  const [content_uid, setContentUID] = useState(null);
  const [selected_uid, setSelectedUid] = useState(null);

  async function getDataContent(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.ARMY_CONTENT, {
        page: query?.page,
        search: query?.search,
        paginate: 5,
        content_type: query?.content_type,
      });
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

  async function getDataBundle(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.BUNDLES, {
        page: query?.page,
        search: query?.search,
        paginate: 5,
      });
      setDataBundles(response?.data?.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  async function getDataProducts(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.PRODUCTS, {
        page: query?.page,
        search: query?.search,
        is_active: query?.is_active,
        paginate: 999999,
      });
      setDataProducts(response?.data?.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      Swal.fire("Gagal", err?.response?.data?.message, "error");
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  const onSubmit = async () => {
    setIsLoadingButton(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin menambahkan data konten ini ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.post(ApiEndpoint.CREATE_ARMY_CONTENT, {
          content_type: content_type?.value,
          content_uid: selected_uid?.value,
        });
        Swal.fire("Sukses", "Data konten berhasil ditambahkan.", "success");
        getDataContent(query);
        resetForm();
        getDataBundle(query);
        getDataProducts(query);
        setIsLoadingButton(false);
      } catch (err) {
        setError(err.response.data.errors);
        // Swal.fire("Gagal", err.response.data.message, "error");
        Swal.fire(
          "Gagal",
          "Mohon periksa kembali tipe dan data yang di input",
          "error"
        );
        setIsLoadingButton(false);
      }
    } else {
      setIsLoadingButton(false);
    }
  };

  async function onDelete(uid) {
    try {
      const result = await Swal.fire({
        title: "Apakah anda yakin menghapus konten ini?",
        text: "Anda tidak akan dapat mengembalikannya!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await axios.delete(`${ApiEndpoint.ARMY_CONTENT}/${uid}`);
        Swal.fire(
          "Berhasil!",
          "Anda berhasil menghapus data konten ini.",
          "success"
        );
        getDataContent(query);
        resetForm();
        getDataBundle(query);
        getDataProducts(query);
      } else {
        Swal.fire("Batal", "Hapus data konten dibatalkan.", "info");
      }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  }

  const handlePrevPagination = () => {
    if (data.prev_page_url) {
      setQuery({ ...query, page: data.current_page - 1 });
    }
  };

  const handleNextPagination = () => {
    if (data.next_page_url) {
      setQuery({ ...query, page: data.current_page + 1 });
    }
  };

  const handleFirstPagination = () => {
    setQuery({ ...query, page: 1 });
  };

  const handleLastPagination = () => {
    setQuery({ ...query, page: data.last_page });
  };

  const generatePageNumbers = () => {
    const totalPages = data.last_page;
    const maxPageNumbers = 5;
    const currentPage = data.current_page;
    const middlePage = Math.floor(maxPageNumbers / 2);
    const startPage = Math.max(currentPage - middlePage, 1);
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    const pageNumbers = [];
    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push({ page, active: page === currentPage });
    }

    return pageNumbers;
  };

  const resetForm = () => {
    setContentType(null);
    setContentUID(null);
    setSelectedUid(null);
    setError(null);
  };

  const bundleOptions = data_bundles.data.map((bundle) => ({
    value: bundle.uid,
    label: bundle.name,
  }));

  const productOptions = data_products.data.map((product) => ({
    value: product.uid,
    label: product.name,
  }));

  const typeContent = [
    { value: "bundle", label: "Bundle" },
    { value: "product", label: "Produk" },
  ];

  const getContentOptions = () => {
    if (content_type && content_type.value === "bundle") {
      return [{ label: "", options: bundleOptions }];
    } else if (content_type && content_type.value === "product") {
      return [{ label: "", options: productOptions }];
    } else {
      return [];
    }
  };

  const contentOptionsToShow = getContentOptions();

  useEffect(() => {
    getDataContent(query);
    getDataBundle(query);
    getDataProducts(query);
  }, [query]);

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-9 col-span-12">
          <Card title="Data Konten Army">
            {" "}
            <div className="md:flex justify-between items-center mb-4">
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4 mb-2">
                  <select
                    className="form-control py-2 w-max"
                    value={query.content_type}
                    onChange={(event) =>
                      setQuery({ ...query, content_type: event.target.value })
                    }
                  >
                    <option value="">Semua Tipe</option>
                    <option value="product">Produk</option>
                    <option value="bundle">Bundle</option>
                  </select>
                </div>
              </div>
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4 mb-2">
                  <Textinput
                    type="text"
                    // value={query || ""}
                    onChange={(event) =>
                      setQuery({ ...query, search: event.target.value })
                    }
                    placeholder="Cari konten army..."
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden ">
                  {isLoading ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Nama Konten
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Harga
                            </th>
                            <th scope="col" className=" table-th ">
                              Tipe
                            </th>
                            <th scope="col" className=" table-th ">
                              Status
                            </th>
                            <th scope="col" className=" table-th ">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                      </table>

                      <div className="w-full flex justify-center text-secondary p-10">
                        <Loading />
                      </div>
                    </>
                  ) : data?.data?.length === 0 ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Nama Konten
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Harga
                            </th>
                            <th scope="col" className=" table-th ">
                              Tipe
                            </th>
                            <th scope="col" className=" table-th ">
                              Status
                            </th>
                            <th scope="col" className=" table-th ">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                      </table>
                      <div className="w-full flex flex-col justify-center text-secondary p-10">
                        <div className="w-full flex justify-center mb-3">
                          <span className="text-slate-900 dark:text-white text-[100px] transition-all duration-300">
                            <Icon icon="heroicons:information-circle" />
                          </span>
                        </div>
                        <div className="w-full flex justify-center text-secondary">
                          <span className="text-slate-900 dark:text-white text-[20px] transition-all duration-300">
                            Konten army belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            Nama Konten
                          </th>
                          <th scope="col" className=" table-th ">
                            Total Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Total Harga
                          </th>
                          <th scope="col" className=" table-th ">
                            Tipe
                          </th>
                          <th scope="col" className=" table-th ">
                            Status
                          </th>
                          <th scope="col" className=" table-th ">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.data?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">{item?.content?.name}</td>

                            {item?.content?.item_count ? (
                              <td className="table-td">
                                {item?.content?.item_count} Produk
                              </td>
                            ) : (
                              <td className="table-td">1 Produk</td>
                            )}

                            {item?.content?.total_price ? (
                              <td className="table-td">
                                Rp {item?.content?.total_price}
                              </td>
                            ) : (
                              <td className="table-td">
                                Rp {item?.content?.primary_variant?.price}
                              </td>
                            )}

                            <td className="table-td">
                              {item?.type === "product" ? (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                                  Produk
                                </span>
                              ) : (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-info-700 bg-info-500">
                                  Bundle
                                </span>
                              )}
                            </td>

                            <td className="table-td">
                              {item?.content?.is_active === true ? (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                                  Aktif
                                </span>
                              ) : (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                                  Nonaktif
                                </span>
                              )}
                            </td>

                            <td className="table-td">
                              <div className="flex space-x-3 rtl:space-x-reverse">
                                <Tooltip
                                  content="Hapus"
                                  placement="top"
                                  arrow
                                  animation="shift-away"
                                  theme="danger"
                                >
                                  <button
                                    className="action-btn"
                                    type="button"
                                    onClick={() => onDelete(item.uid)}
                                  >
                                    <Icon icon="heroicons:trash" />
                                  </button>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div className="custom-class flex justify-end mt-4">
                    <ul className="pagination">
                      <li>
                        <button
                          className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                          onClick={handleFirstPagination}
                        >
                          <Icon icon="heroicons-outline:chevron-double-left" />
                        </button>
                      </li>
                      <li>
                        <button
                          className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                          onClick={handlePrevPagination}
                        >
                          <Icon icon="heroicons-outline:chevron-left" />
                        </button>
                      </li>

                      {generatePageNumbers().map((pageNumber) => (
                        <li key={pageNumber.page}>
                          <button
                            className={`${
                              pageNumber.active ? "active" : ""
                            } page-link`}
                            onClick={() =>
                              setQuery({ ...query, page: pageNumber.page })
                            }
                          >
                            {pageNumber.page}
                          </button>
                        </li>
                      ))}

                      <li>
                        <button
                          className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                          onClick={handleNextPagination}
                        >
                          <Icon icon="heroicons-outline:chevron-right" />
                        </button>
                      </li>
                      <li>
                        <button
                          className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                          onClick={handleLastPagination}
                        >
                          <Icon icon="heroicons-outline:chevron-double-right" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-3 col-span-12">
          <Card title={"Tambah Konten"}>
            <Alert
              //   icon="heroicons-outline:exclamation"
              className="light-mode alert-success mb-5"
            >
              Mohon sesuaikan inputan Tipe dan pemilihan produk atau bundle
            </Alert>
            <div className="text-sm text-slate-600 font-normal bg-white dark:bg-slate-900 dark:text-slate-300 rounded p-5">
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <label htmlFor=" hh" className="form-label ">
                  Tipe Konten *
                </label>
                <Select
                  className="react-select mt-2"
                  classNamePrefix="select"
                  placeholder="Pilih Tipe..."
                  options={typeContent}
                  value={content_type}
                  onChange={(selectedOption) => setContentType(selectedOption)}
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.content_type}
                  </span>
                )}
              </div>
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <label htmlFor=" hh" className="form-label ">
                  Pilih Produk / Bundle *
                </label>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Pilih data..."
                  options={contentOptionsToShow}
                  value={selected_uid}
                  onChange={(selectedOption) => setSelectedUid(selectedOption)}
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.content_uid}
                  </span>
                )}
              </div>
              <div className="grid justify-items-end">
                <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3 ">
                  <Button
                    text="Reset"
                    className="btn-primary light"
                    onClick={resetForm}
                  />
                  <Button
                    text={isLoadingButton ? <LoadingButton /> : "Simpan"}
                    className="btn-primary dark "
                    type="submit"
                    onClick={onSubmit}
                    disabled={isLoadingButton}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ArmyContents;
