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
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState({
    search: "",
    province: "",
    city: "",
    type: "",
  });

  async function getDataSite(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.SITES, {
        search: query?.search,
        province: query?.province,
        city: query?.city,
        type: query?.type,
      });
      setData(response.data.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

  async function onDelete(uid) {
    try {
      const result = await Swal.fire({
        title: "Apakah anda yakin menghapus cabang ini?",
        text: "Anda tidak akan dapat mengembalikannya!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await axios.delete(`${ApiEndpoint.SITES}/${uid}`);
        Swal.fire(
          "Berhasil!",
          "Anda berhasil menghapus data cabang ini.",
          "success"
        );
        getDataSite(query);
      } else {
        Swal.fire("Batal", "Hapus data cabang dibatalkan.", "info");
      }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  }

  useEffect(() => {
    getDataSite(query);
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
                    className="btn-primary dark w-full "
                    onClick={() => navigate(`/tambahProduk`)}
                  />
                </div>
              </div>
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4">
                  <select
                    className="form-control py-2 w-max"
                    value={query.type}
                    onChange={(event) =>
                      setQuery({ ...query, type: event.target.value })
                    }
                  >
                    <option value="">Semua Tipe</option>
                    <option value="store">Toko</option>
                    <option value="warehouse">Gudang</option>
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
                              Kode Cabang
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Cabang
                            </th>
                            <th scope="col" className=" table-th ">
                              Tipe Cabang
                            </th>
                            <th scope="col" className=" table-th ">
                              Alamat
                            </th>
                            <th scope="col" className=" table-th ">
                              Provinsi
                            </th>
                            <th scope="col" className=" table-th ">
                              Kota
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
                  ) : data?.length === 0 ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Kode Cabang
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Cabang
                            </th>
                            <th scope="col" className=" table-th ">
                              Tipe Cabang
                            </th>
                            <th scope="col" className=" table-th ">
                              Alamat
                            </th>
                            <th scope="col" className=" table-th ">
                              Provinsi
                            </th>
                            <th scope="col" className=" table-th ">
                              Kota
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
                            Cabang belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            Kode Cabang
                          </th>
                          <th scope="col" className=" table-th ">
                            Nama Cabang
                          </th>
                          <th scope="col" className=" table-th ">
                            Tipe Cabang
                          </th>
                          <th scope="col" className=" table-th ">
                            Alamat
                          </th>
                          <th scope="col" className=" table-th ">
                            Provinsi
                          </th>
                          <th scope="col" className=" table-th ">
                            Kota
                          </th>
                          <th scope="col" className=" table-th ">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">{item.code}</td>
                            <td className="table-td">{item?.name} </td>
                            <td className="table-td">
                              {item?.type === "store"
                                ? "Toko"
                                : item?.type === "warehouse"
                                ? "Gudang"
                                : ""}
                            </td>
                            <td className="table-td">{item?.address} </td>
                            <td className="table-td">
                              {item?.province?.name}{" "}
                            </td>
                            <td className="table-td">{item?.city?.name} </td>

                            <td className="table-td">
                              <div className="flex space-x-3 rtl:space-x-reverse">
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
                                      navigate(`/ubahCabang/${item.uid}`)
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
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Products;
