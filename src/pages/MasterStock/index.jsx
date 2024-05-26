import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import axios from "../../API/Axios";
import ApiEndpoint from "../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";

const Stock = () => {
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
  const [location, setLocation] = useState([]);

  const [query, setQuery] = useState({
    search: "",
    paginate: 8,
    location: "",
  });

  async function getDataStock(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.STOCK, {
        page: query?.page,
        search: query?.search,
        paginate: 8,
        location: query?.location,
      });
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

  const getLocation = () => {
    axios.get(ApiEndpoint.LOCATION_STOCK).then((response) => {
      setLocation(response?.data);
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    getDataStock(query);
  }, [query]);

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

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-12 col-span-12">
          <Card title="Data Stok SJM">
            <div className="md:flex justify-end items-center mb-4">
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4">
                  <select
                    className="form-control py-2 "
                    value={query.location}
                    onChange={(event) =>
                      setQuery({ ...query, location: event.target.value })
                    }
                  >
                    <option value="">Status Produk</option>
                    {location?.map((item) => (
                      <option key={item.uid} value={item.uid}>
                        {item.description}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <div className="row-span-3 md:row-span-4">
                  <Textinput
                    // value={query || ""}
                    onChange={(event) =>
                      setQuery({ ...query, search: event.target.value })
                    }
                    placeholder="Cari cabang SJM..."
                  />
                </div> */}
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
                              SKU
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Harga Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Stok
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
                              SKU
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Harga Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Stok
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
                            Stok SJM belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            SKU
                          </th>
                          <th scope="col" className=" table-th ">
                            Nama Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Harga Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Total Stok
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.data?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">{item.sku}</td>
                            <td className="table-td">{item?.product?.name} </td>
                            <td className="table-td">Rp {item?.price.toLocaleString("id-ID")}</td>
                            <td className="table-td">{item?.stocks_count} </td>
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

export default Stock;
