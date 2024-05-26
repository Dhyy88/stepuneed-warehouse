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
import Loading from "../../../components/Loading";
import Tooltip from "@/components/ui/Tooltip";

import image1 from "@/assets/images/all-img/widget-bg-1.png";

const DetailStockOpname = () => {
  let { uid } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getDataById = () => {
    setIsLoading(true);
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.STOCKOPNAME}/${uid}`).then((response) => {
          setData(response?.data?.data);
          setIsLoading(false);
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  async function onDelete(uid) {
    try {
      const result = await Swal.fire({
        icon: "question",
        title: "Apakah Anda yakin ingin menghapus supplier ini?",
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
          await axios.delete(`${ApiEndpoint.SUPPLIER}/${uid}`);
          Swal.fire(
            "Berhasil!",
            "Anda berhasil menghapus data supplier ini.",
            "success"
          );
          navigate(`/suppliers`);
        } else {
          Swal.fire("Batal", "Hapus data supplier dibatalkan.", "info");
        }
      }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  }

  useEffect(() => {
    getDataById();
  }, [uid]);

  return (
    <div>
      <div className="space-y-5 profile-page">
        <div
          className="bg-no-repeat bg-cover bg-center p-4 rounded-[6px] relative"
          style={{
            backgroundImage: `url(${image1})`,
          }}
        >
          <div className="max-w-[169px]">
            <div className="text-xl font-medium text-slate-900 mb-2">
              {data?.name}
            </div>
            <p className="text-sm text-slate-800">{data?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 ">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info Stok" className="mb-4">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:calendar" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Tanggal Laporan
                    </div>
                    {data?.reported_at ? (
                      <>{data?.reported_at}</>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:document-text" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Catatan
                    </div>
                    {data?.note ? <>{data?.note}</> : <span>-</span>}
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
                <div className="card-title2 mb-2">Perbaharui Catatan</div>
                <div className="flex row justfiy-between gap-2">
                  <div className="flex-1">
                    <div className="text-sm">
                      Harap memperhatikan kembali catatan yang ingin
                      diperbaharui.
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="">
                      <Button
                        text="Perbaharui"
                        className="btn-warning dark w-full btn-sm "
                        onClick={() => navigate(`/stockopname/update/${uid}`)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 col-span-12">
            <Card title="Info Stock Opname Product" className="mb-4">
              <div className="py-4 px-6">
                <div className="">
                  {isLoading ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              SKU
                            </th>
                            <th scope="col" className=" table-th ">
                              Stock Keseluruhan
                            </th>
                            <th scope="col" className=" table-th ">
                              Laporan Jumlah Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Sisa Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Deskripsi
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Harga Produk
                            </th>
                          </tr>
                        </thead>
                      </table>

                      <div className="w-full flex justify-center text-secondary p-10">
                        <Loading />
                      </div>
                    </>
                  ) : data?.products?.length === 0 ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              SKU
                            </th>
                            <th scope="col" className=" table-th ">
                              Stock Keseluruhan
                            </th>
                            <th scope="col" className=" table-th ">
                              Laporan Jumlah Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Sisa Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Deskripsi
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Harga Produk
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
                            SKU
                          </th>
                          <th scope="col" className=" table-th ">
                            Stock Keseluruhan
                          </th>
                          <th scope="col" className=" table-th ">
                            Laporan Jumlah Stok
                          </th>
                          <th scope="col" className=" table-th ">
                            Sisa Stok
                          </th>
                          <th scope="col" className=" table-th ">
                            Deskripsi
                          </th>
                          <th scope="col" className=" table-th ">
                            Nama Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Harga Produk
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.stock_opname_details?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">{item?.variant?.sku}</td>
                            <td className="table-td">{item?.real_qty}</td>
                            <td className="table-td">{item?.report_qty}</td>
                            <td className="table-td">{item?.missing_qty}</td>
                          
                            <td className="table-td">
                              {item?.description ? (
                                <>{item?.description}</>
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                            <td className="table-td">{item?.variant?.product?.name}</td>
                            <td className="table-td">
                              Rp {item?.variant?.price.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailStockOpname;
