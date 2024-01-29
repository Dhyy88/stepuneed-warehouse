import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Select from "react-select";

import { useNavigate } from "react-router-dom";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import Loading from "../../../components/Loading";
import LoadingButton from "../../../components/LoadingButton";

import ProfileImageMen from "@/assets/images/avatar/13.png";

const SalesInternal = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [email, setEmail] = useState("");
  const [dealer, setDealer] = useState("");
  const [site, setSite] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({
    status: "",
    search: "",
    gender: "",
    paginate: 5,
    dealer: "",
    site: "",
    is_active: "",
  });
  const [queryDealer, setQueryDealer] = useState({ search: "" });
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  async function getDataSalesExternal(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.SALES_EXTERNAL, {
        page: query?.page,
        search: query?.search,
        status: query?.status,
        gender: query?.gender,
        paginate: 5,
        dealer: query?.dealer,
        site: query?.site,
        is_active: query?.is_active,
      });
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

  async function getDataDealer(queryDealer) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.DEALER, {
        page: queryDealer?.page,
        search: queryDealer?.search,
        paginate: 5,
      });
      setDealer(response.data.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

  const getSite = async () => {
    try {
      const response = await axios.get(ApiEndpoint.STORE_LIST);
      setSite(response?.data);
    } catch (error) {
      Swal.fire("Gagal", error.response.data.message, "error");
    }
  };

  const onSubmit = async () => {
    setIsLoadingButton(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin menambahkan data sales?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.post(ApiEndpoint.CREATE_SALES_EXTERNAL, {
          email: email,
          dealer: selectedDealer?.value,
          site: selectedSite?.value,
        });
        Swal.fire("Sukses", "Data sales berhasil ditambahkan.", "success");
        getDataSalesExternal(query);
        resetForm()
        setIsLoadingButton(false)
      } catch (err) {
        setError(err.response.data.errors);
        Swal.fire("Gagal", err.response.data.message, "error");
        setIsLoadingButton(false);
      }
    } else {
      setIsLoadingButton(false);
    }
  };

  async function onDelete(uid) {
    try {
      const result = await Swal.fire({
        title: "Apakah anda yakin menghapus sales ini?",
        text: "Anda tidak akan dapat mengembalikannya!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await axios.delete(`${ApiEndpoint.SALES_EXTERNAL}/${uid}`);
        Swal.fire(
          "Berhasil!",
          "Anda berhasil menghapus data sales ini.",
          "success"
        );
        getDataSalesExternal(query);
      } else {
        Swal.fire("Batal", "Hapus data sales dibatalkan.", "info");
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

  useEffect(() => {
    getDataSalesExternal(query);
    getDataDealer(queryDealer);
  }, [query, queryDealer]);

  useEffect(() => {
    getSite();
  }, []);

  const resetForm = () => {
    setEmail("");
    setSelectedSite(null);
    setSelectedDealer(null);
    setError(null);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-9 col-span-12">
          <Card title="Data Army">
            <div className="md:flex justify-end items-center mb-4">
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4 mb-2">
                  <select
                    className="form-control py-2 w-max"
                    value={query.dealer}
                    onChange={(event) =>
                      setQuery({ ...query, dealer: event.target.value })
                    }
                  >
                    <option value="">Semua Dealer</option>
                    {dealer?.data?.map((dealer) => (
                      <option key={dealer.uid} value={dealer.uid}>
                        {dealer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row-span-3 md:row-span-4 mb-2">
                  <select
                    className="form-control py-2 w-max"
                    value={query.site}
                    onChange={(event) =>
                      setQuery({ ...query, site: event.target.value })
                    }
                  >
                    <option value="">Semua Cabang</option>
                    {site?.data?.map((site) => (
                      <option key={site.uid} value={site.uid}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row-span-3 md:row-span-4 mb-2">
                  <select
                    className="form-control py-2 w-max"
                    value={query.status}
                    onChange={(event) =>
                      setQuery({ ...query, status: event.target.value })
                    }
                  >
                    <option value="">Semua Status Data</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                    <option value="review">Review</option>
                    <option value="incomplete">Belum Registrasi</option>
                  </select>
                </div>
                <div className="row-span-3 md:row-span-4 mb-2">
                  <select
                    className="form-control py-2 w-max"
                    value={query.is_active}
                    onChange={(event) =>
                      setQuery({ ...query, is_active: event.target.value })
                    }
                  >
                    <option value="">Semua Status Akun</option>
                    <option value="1">Aktif</option>
                    <option value="0">Nonaktif</option>
                  </select>
                </div>
                <div className="row-span-3 md:row-span-4 mb-2">
                  <select
                    className="form-control py-2 w-max"
                    value={query.gender}
                    onChange={(event) =>
                      setQuery({ ...query, gender: event.target.value })
                    }
                  >
                    <option value="">Semua Gender</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="row-span-3 md:row-span-4 mb-2">
                  <Textinput
                    type="text"
                    // value={query || ""}
                    onChange={(event) =>
                      setQuery({ ...query, search: event.target.value })
                    }
                    placeholder="Cari sales..."
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
                              Email
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama
                            </th>
                            <th scope="col" className=" table-th ">
                              No Telepon
                            </th>
                            <th scope="col" className=" table-th ">
                              Status Data
                            </th>
                            <th scope="col" className=" table-th ">
                              Status Akun
                            </th>
                            <th scope="col" className=" table-th ">
                              Foto Profil
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
                              Email
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama
                            </th>
                            <th scope="col" className=" table-th ">
                              Status Data
                            </th>
                            <th scope="col" className=" table-th ">
                              Status Akun
                            </th>
                            <th scope="col" className=" table-th ">
                              Foto Profil
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
                            Sales external belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            Email
                          </th>
                          <th scope="col" className=" table-th ">
                            Nama
                          </th>
                          <th scope="col" className=" table-th ">
                            No Telepon
                          </th>
                          <th scope="col" className=" table-th ">
                            Status Data
                          </th>
                          <th scope="col" className=" table-th ">
                            Status Akun
                          </th>
                          <th scope="col" className=" table-th ">
                            Foto Profil
                          </th>
                          <th scope="col" className=" table-th ">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.data?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">{item.email}</td>

                            {item?.army_profile?.first_name ? (
                              <td className="table-td">
                                {item?.army_profile?.first_name}{" "}
                                {item.army_profile?.last_name}
                              </td>
                            ) : (
                              <td className="table-td">-</td>
                            )}
                            
                            {item?.army_profile?.phone_number ? (
                              <td className="table-td">
                                {item?.army_profile?.phone_number}
                              </td>
                            ) : (
                              <td className="table-td">-</td>
                            )}

                            <td className="table-td">
                              {item?.army_profile?.approve_status ===
                                "incomplete" && (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-blue-500 bg-blue-500">
                                  Belum Registrasi
                                </span>
                              )}
                              {item?.army_profile?.approve_status ===
                                "approved" && (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                                  Verifikasi
                                </span>
                              )}
                              {item?.army_profile?.approve_status ===
                                "review" && (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-warning-500 bg-warning-500">
                                  Review
                                </span>
                              )}
                              {item?.army_profile?.approve_status ===
                                "rejected" && (
                                <Tooltip
                                  // content={item?.army_profile?.reject_note}
                                  placement="top"
                                  arrow
                                  animation="shift-away"
                                >
                                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                                    Ditolak
                                  </span>
                                </Tooltip>
                              )}
                            </td>
                            <td className="table-td">
                              {item?.is_active === true ? (
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
                              {item?.army_profile?.profile_picture?.url ? (
                                <img
                                  src={item?.army_profile?.profile_picture?.url}
                                  alt=""
                                  className="w-16 h-16 object-cover rounded-full"
                                />
                              ) : (
                                <img
                                  src={ProfileImageMen}
                                  alt=""
                                  className="w-16 h-16 object-cover rounded-full"
                                />
                              )}
                            </td>
                            <td className="table-td">
                              <div className="flex space-x-3 rtl:space-x-reverse">
                                <Tooltip
                                  content="Detail Sales"
                                  placement="top"
                                  arrow
                                  animation="shift-away"
                                >
                                  <button
                                    className="action-btn"
                                    type="button"
                                    onClick={() =>
                                      navigate(`/detailSalesArmy/${item.uid}`)
                                    }
                                  >
                                    <Icon icon="heroicons:eye" />
                                  </button>
                                </Tooltip>
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
          <Card title={"Tambah Army"}>
            <div className="text-sm text-slate-600 font-normal bg-white dark:bg-slate-900 dark:text-slate-300 rounded p-5">
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <Textinput
                  label="Email Sales *"
                  type="email"
                  placeholder="email_name@domain.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.email}
                  </span>
                )}
              </div>
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <label htmlFor=" hh" className="form-label ">
                  Cabang Sales *
                </label>
                <Select
                  className="react-select mt-2"
                  classNamePrefix="select"
                  placeholder="Pilih cabang..."
                  options={site?.data?.map((site) => ({
                    value: site.uid,
                    label: site.name,
                  }))}
                  onChange={(selectedOption) => setSelectedSite(selectedOption)}
                  value={selectedSite}
                  isClearable
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.site}
                  </span>
                )}
              </div>
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <label htmlFor=" hh" className="form-label ">
                  Dealer Sales *
                </label>
                <Select
                  className="react-select mt-2"
                  classNamePrefix="select"
                  placeholder="Pilih dealer..."
                  options={dealer?.data?.map((dealer) => ({
                    value: dealer.uid,
                    label: dealer.name,
                  }))}
                  onChange={(selectedOption) =>
                    setSelectedDealer(selectedOption)
                  }
                  value={selectedDealer}
                  isClearable
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.dealer}
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

export default SalesInternal;
