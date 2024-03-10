import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import axios from "../../../API/Axios";
import ApiEndpoint from "../../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Loading from "../../../components/Loading";
import LoadingButton from "../../../components/LoadingButton";

const Dealers = () => {
  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({ search: "", paginate: 1 });
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [editMode, setEditMode] = useState(false);

  async function getDataDealer(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.DEALER, {
        page: query?.page,
        search: query?.search,
        paginate: 8,
      });
      setData(response.data.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

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
        await axios.post(ApiEndpoint.CREATE_DEALER, {
          name: name,
          address: address,
        });
        Swal.fire("Sukses", "Dealer berhasil ditambahkan", "success");
        getDataDealer(query);
        resetForm();
        setIsLoadingButton(false);
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
        icon: "question",
        title: "Apakah Anda yakin ingin menghapus dealer ini?",
        text: "Anda tidak akan dapat mengembalikannya!",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        const { value: input } = await Swal.fire({
          icon: "warning",
          title: "Verifikasi",
          text: `Silahkan ketik "hapus" untuk melanjutkan verifikasi hapus data !`,
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Konfirmasi",
          cancelButtonText: "Batal",
          inputValidator: (value) => {
            if (!value || value.trim().toLowerCase() !== "hapus") {
              return 'Anda harus memasukkan kata "hapus" untuk melanjutkan verifikasi hapus data!';
            }
          },
        });

        if (input && input.trim().toLowerCase() === "hapus") {
          await axios.delete(`${ApiEndpoint.DEALER}/${uid}`);
          Swal.fire(
            "Berhasil!",
            "Anda berhasil menghapus data dealer ini.",
            "success"
          );
          getDataDealer(query);
        } else {
          Swal.fire("Batal", "Hapus data dealer dibatalkan.", "info");
        }
      }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  }

  const onEdit = async (uid) => {
    try {
      const response = await axios.get(`${ApiEndpoint.DEALER}/${uid}`);
      const dealerData = response.data.data;

      setName(dealerData.name);
      setAddress(dealerData.address);
      setData({ ...data, uid: dealerData.uid });
      setError("");
      setEditMode(true);
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  };

  const onUpdate = async () => {
    setIsLoadingButton(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin data yang diubah sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Ubah",
      cancelButtonText: "Batal",
    });
    setIsLoadingButton(true);
    if (confirmResult.isConfirmed) {
      try {
        await axios.post(`${ApiEndpoint.DEALER}/${data.uid}`, {
          name: name,
          address: address,
        });

        Swal.fire("Berhasil", "Dealer berhasil diubah", "success");
        getDataDealer(query);
        resetForm();
        setEditMode(false);
        setIsLoadingButton(false);
      } catch (err) {
        Swal.fire("Gagal", err.response.data.message, "error");
        setIsLoadingButton(false);
      }
    } else {
      setIsLoadingButton(false);
    }
  };

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
    getDataDealer(query);
  }, [query]);

  const resetForm = () => {
    setName("");
    setAddress("");
    setEditMode(false);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-8 col-span-12">
          <Card title="Data Dealer">
            <div className="md:flex justify-between items-center mb-4">
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4">
                  <Textinput
                    // value={query || ""}
                    onChange={(event) =>
                      setQuery({ ...query, search: event.target.value })
                    }
                    placeholder="Cari dealer..."
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
                              ID Dealer
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama
                            </th>
                            <th scope="col" className=" table-th ">
                              Alamat
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Army
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
                              ID Dealer
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama
                            </th>
                            <th scope="col" className=" table-th ">
                              Alamat
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Army
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
                            Dealer belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            ID Dealer
                          </th>
                          <th scope="col" className=" table-th ">
                            Nama
                          </th>
                          <th scope="col" className=" table-th ">
                            Alamat
                          </th>
                          <th scope="col" className=" table-th ">
                            Total Army
                          </th>
                          <th scope="col" className=" table-th ">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.data?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">{item.uid}</td>
                            <td className="table-td">{item?.name} </td>
                            <td className="table-td">{item?.address}</td>
                            <td className="table-td">{item?.army_count}</td>

                            <td className="table-td">
                              <div className="flex space-x-3 rtl:space-x-reverse">
                                {/* <Tooltip
                                  content="Detail Dealer"
                                  placement="top"
                                  arrow
                                  animation="shift-away"
                                >
                                  <button
                                    className="action-btn"
                                    type="button"
                                    onClick={() =>
                                      navigate(
                                        `/detail-sales-external/${item.uid}`
                                      )
                                    }
                                  >
                                    <Icon icon="heroicons:eye" />
                                  </button>
                                </Tooltip> */}
                                <Tooltip
                                  content="Edit"
                                  placement="top"
                                  arrow
                                  animation="shift-away"
                                >
                                  <button
                                    className="action-btn"
                                    type="button"
                                    onClick={() => onEdit(item.uid)}
                                  >
                                    <Icon icon="heroicons:pencil-square" />
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
            {/*end*/}
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title={editMode ? "Ubah Dealer" : "Tambah Dealer"}>
            <div className="text-sm text-slate-600 font-normal bg-white dark:bg-slate-900 dark:text-slate-300 rounded p-5">
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <Textinput
                  label="Nama Dealer *"
                  type="text"
                  placeholder="Masukkan nama dealer yang valid"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.name}
                  </span>
                )}
              </div>
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <Textarea
                  label="Alamat Dealer"
                  id="pn4"
                  rows="4"
                  placeholder="Masukkan alamat dealer"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="text-base text-end text-slate-600 dark:text-slate-300">
                {editMode ? (
                  <Button
                    text={isLoadingButton ? <LoadingButton /> : "Ubah"}
                    className="btn-primary dark w-full mr-2 mb-2 "
                    onClick={onUpdate}
                    disabled={isLoadingButton}
                  />
                ) : (
                  <Button
                    text={isLoadingButton ? <LoadingButton /> : "Simpan"}
                    className="btn-primary dark w-full mr-2 mb-2 "
                    onClick={onSubmit}
                    disabled={isLoadingButton}
                  />
                )}
                {editMode ? (
                  <Button
                    text="Batal"
                    className="btn-primary light w-full"
                    onClick={resetForm}
                  />
                ) : (
                  <Button
                    text="Reset"
                    className="btn-primary light w-full"
                    onClick={resetForm}
                  />
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dealers;
