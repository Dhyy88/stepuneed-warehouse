import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import axios from "../../../API/Axios";
import ApiEndpoint from "../../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Loading from "../../../components/Loading";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/ui/Modal";

const Permissions = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemData, setSelectedItemData] = useState(null);

  const [query, setQuery] = useState({
    search: "",
    paginate: 8,
  });

  async function getDataRole(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.ROLE, {
        search: query?.search,
        page: query?.page,
        paginate: 8,
      });
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

  const getDataById = async (uid) => {
    try {
      const response = await axios.get(`${ApiEndpoint.ROLE}/${uid}`);
      setSelectedItemData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function onDelete(uid) {
    try {
      const result = await Swal.fire({
        icon: "question",
        title: "Apakah Anda yakin ingin menghapus cabang ini?",
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
          await axios.delete(`${ApiEndpoint.ROLE}/${uid}`);
          Swal.fire(
            "Berhasil!",
            "Anda berhasil menghapus data role ini.",
            "success"
          );
          getDataRole(query);
        } else {
          Swal.fire("Batal", "Hapus data role dibatalkan.", "info");
        }
      }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  }

  useEffect(() => {
    getDataRole(query);
  }, [query]);

  //   useEffect(() => {
  //     getDataById();
  //   }, [uid]);

  const handleDetailButtonClick = (itemId) => {
    setSelectedItemId(itemId);
    getDataById(itemId);
  };

  const handlePrevPagination = () => {
    if (data?.prev_page_url) {
      setQuery({ ...query, page: data?.current_page - 1 });
    }
  };

  const handleNextPagination = () => {
    if (data?.next_page_url) {
      setQuery({ ...query, page: data?.current_page + 1 });
    }
  };

  const handleFirstPagination = () => {
    setQuery({ ...query, page: 1 });
  };

  const handleLastPagination = () => {
    setQuery({ ...query, page: data?.last_page });
  };

  const generatePageNumbers = () => {
    const totalPages = data?.last_page;
    const maxPageNumbers = 5;
    const currentPage = data?.current_page;
    const middlePage = Math.floor(maxPageNumbers / 2);
    const startPage = Math.max(currentPage - middlePage, 1);
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    const pageNumbers = [];
    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push({ page, active: page === currentPage });
    }

    return pageNumbers;
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-12 col-span-12">
          <Card title="Data Role Admin SJM">
            <div className="md:flex justify-between items-center mb-4">
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4">
                  <Button
                    text="Tambah Role Admin SJM"
                    className="btn-primary dark w-full btn-sm "
                    onClick={() => navigate(`/permission/create`)}
                  />
                </div>
              </div>
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4">
                  <Textinput
                    onChange={(event) =>
                      setQuery({ ...query, search: event.target.value })
                    }
                    placeholder="Cari role SJM..."
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
                              Nama Role
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Admin
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
                              Nama Role
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Admin
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
                            Role admin SJM belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            Nama Role
                          </th>
                          <th scope="col" className=" table-th ">
                            Total Admin
                          </th>
                          <th scope="col" className=" table-th ">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.data?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">{item?.name} </td>
                            <td className="table-td">
                              {item?.user_ho_count} admin
                            </td>

                            <td className="table-td">
                              <div className="flex space-x-3 rtl:space-x-reverse">
                                <Modal
                                  title="Detail Role"
                                  label={
                                    <Tooltip
                                      content="Detail"
                                      placement="top"
                                      arrow
                                      animation="shift-away"
                                    >
                                      <button
                                        className="action-btn"
                                        type="button"
                                        onClick={() =>
                                          handleDetailButtonClick(item?.uid)
                                        }
                                      >
                                        <Icon icon="heroicons:eye" />
                                      </button>
                                    </Tooltip>
                                  }
                                  labelClass="action-btn p-0"
                                  themeClass="bg-warning-500"
                                  uncontrol
                                  visible={selectedItemId !== null}
                                  onClose={() => setSelectedItemId(null)}
                                >
                                  {selectedItemData && (
                                    <>
                                      <h4 className="font-medium text-lg mb-3 text-slate-900 text-center">
                                        - {selectedItemData.name} -
                                      </h4>
                                      <div className="text-base text-slate-600 dark:text-slate-300 grid grid-cols-2 ">
                                        {selectedItemData.permissions.map(
                                          (permission, index) => (
                                            <div className="mb-3" key={index}>
                                              - {permission?.name}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </>
                                  )}
                                </Modal>

                                <Tooltip
                                  content="Edit"
                                  placement="top"
                                  arrow
                                  animation="shift-away"
                                >
                                  <button
                                    className="action-btn"
                                    type="button"
                                    onClick={() =>
                                      navigate(`/permission/update/${item.uid}`)
                                    }
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
                </div>
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
          </Card>
        </div>
      </div>
    </>
  );
};

export default Permissions;
