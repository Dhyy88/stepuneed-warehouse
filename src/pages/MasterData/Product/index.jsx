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

const Products = () => {
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

  const [query, setQuery] = useState({
    search: "",
    is_active: "",
    paginate: 5,
  });

  async function getDataProducts(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.PRODUCTS, {
        page: query?.page,
        search: query?.search,
        is_active: query?.is_active,
        paginate: 8,
      });
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      Swal.fire("Gagal", err?.response?.data?.message, "error");
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  async function onDelete(uid) {
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
        await axios.delete(`${ApiEndpoint.PRODUCTS}/${uid}`);
        Swal.fire(
          "Berhasil!",
          "Anda berhasil menghapus data produk ini.",
          "success"
        );
        getDataProducts(query);
      } else {
        Swal.fire("Batal", "Hapus data produk dibatalkan.", "info");
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
    getDataProducts(query);
  }, [query]);

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-12 col-span-12">
          <Card title="Data Produk">
            <div className="md:flex justify-between items-center mb-4">
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4">
                  <Button
                    text="Tambah Produk"
                    className="btn-primary dark w-full btn-sm "
                    onClick={() => navigate(`/products/create`)}
                  />
                </div>
              </div>
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4">
                  <select
                    className="form-control py-2 w-max"
                    value={query.is_active}
                    onChange={(event) =>
                      setQuery({ ...query, is_active: event.target.value })
                    }
                  >
                    <option value="">Semua Status</option>
                    <option value="1">Aktif</option>
                    <option value="0">Nonaktif</option>
                  </select>
                </div>
                <div className="row-span-3 md:row-span-4">
                  <Textinput
                    // value={query || ""}
                    onChange={(event) =>
                      setQuery({ ...query, search: event.target.value })
                    }
                    placeholder="Cari produk..."
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
                              Slug Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Status
                            </th>
                            <th scope="col" className=" table-th ">
                              Thumbnail
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
                              Slug Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Status
                            </th>
                            <th scope="col" className=" table-th ">
                              Thumbnail
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
                            Produk belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            Slug Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Nama Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Status
                          </th>
                          <th scope="col" className=" table-th ">
                            Thumbnail
                          </th>
                          <th scope="col" className=" table-th ">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.data?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">{item?.slug}</td>
                            <td className="table-td">{item?.name} </td>
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
                              {item?.primary_image?.url ? (
                                <img
                                  src={item?.primary_image?.url}
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
                                  content="Detail Produk"
                                  placement="top"
                                  arrow
                                  animation="shift-away"
                                >
                                  <button
                                    className="action-btn"
                                    type="button"
                                    onClick={() =>
                                      navigate(`/products/detail/${item.uid}`)
                                    }
                                  >
                                    <Icon icon="heroicons:eye" />
                                  </button>
                                </Tooltip>
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
                                      navigate(`/products/update/${item.uid}`)
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

export default Products;
