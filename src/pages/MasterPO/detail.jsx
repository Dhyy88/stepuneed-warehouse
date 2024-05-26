import React, { useEffect, useState, Fragment } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../API/Api_EndPoint";
import axios from "../../API/Axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import LoadingButton from "../../components/LoadingButton";
import Button from "@/components/ui/Button";
import userDarkMode from "@/hooks/useDarkMode";

import MainLogo from "@/assets/images/logo/logo.svg";
import LogoWhite from "@/assets/images/logo/logo-white.svg";

const DetailPurchaseOrder = () => {
  let { uid } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);

  const printPage = () => {
    setIsLoading(true);
    axios
      .get(`${ApiEndpoint.PO}/${uid}`)
      .then((response) => {
        setData(response?.data?.data);
        setIsLoading(false);
        const documentUrl = response?.data?.data?.document;
        if (documentUrl) {
          window.open(documentUrl, "_blank");
        } else {
          console.error("Document URL not found");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      });
  };
  // const [isDark] = userDarkMode();

  const getDataById = () => {
    setIsLoading(true);
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.PO}/${uid}`).then((response) => {
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
        title: "Apakah Anda yakin ingin menghapus PO ini?",
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
          await axios.delete(`${ApiEndpoint.PO}/${uid}`);
          Swal.fire(
            "Berhasil!",
            "Anda berhasil menghapus data PO ini.",
            "success"
          );
          navigate(`/pobyme`);
        } else {
          Swal.fire("Batal", "Hapus data PO dibatalkan.", "info");
        }
      }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  }

  const onApproved = async () => {
    setIsApproveLoading(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin menyetujui penerbitan PO ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Setujui",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.get(`${ApiEndpoint.PO}/${uid}/approve`);
        getDataById();
        Swal.fire("Sukses", "Dokumen PO berhasil disetujui.", "success");
        setIsApproveLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          Swal.fire("Gagal", error.response.data.message, "error");
          setIsApproveLoading(false);
        } else {
          Swal.fire("Gagal", "Terjadi kesalahan saat menyetujui PO.", "error");
          setIsApproveLoading(false);
        }
      }
    } else {
      setIsApproveLoading(false);
    }
  };

  const onReject = async () => {
    setIsRejectLoading(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin menolak penerbitan PO ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Setujui",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.get(`${ApiEndpoint.PO}/${uid}/reject`);
        getDataById();
        Swal.fire("Sukses", "Dokumen PO berhasil ditolak.", "success");
        setIsRejectLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          Swal.fire("Gagal", error.response.data.message, "error");
          setIsRejectLoading(false);
        } else {
          Swal.fire("Gagal", "Terjadi kesalahan saat menolak PO.", "error");
          setIsRejectLoading(false);
        }
      }
    } else {
      setIsRejectLoading(false);
    }
  };

  useEffect(() => {
    getDataById();
  }, [uid]);

  return (
    <div>
      <div className="space-y-5 profile-page">
        <div className="print:hidden flex justify-end">
          <button
            type="button"
            disabled={!data || !data.document}
            onClick={printPage}
            className="invocie-btn inline-flex btn btn-md whitespace-nowrap space-x-2 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
          >
            <span className="text-lg">
              <Icon icon="heroicons:printer" />
            </span>
            <span>Print</span>
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6 ">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info PO" className="mb-4">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:paper-clip" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      No Berkas
                    </div>
                    {data?.document_number ? (
                      <>{data?.document_number}</>
                    ) : (
                      <span>-</span>
                    )}
                  </div>

                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:calendar-days" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Tanggal Terbit
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.document_date ? (
                        <>{data?.document_date}</>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:calendar-days" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Tanggal Penerimaan
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.delivery_date ? (
                        <>{data?.delivery_date}</>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:building-office" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Penerima
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.delivery_to_site_name ? (
                        <>{data?.delivery_to_site_name}</>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:user-circle" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Dibuat Oleh
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.request_by?.profile?.first_name ? (
                        <>
                          {data?.request_by?.profile?.first_name}{" "}
                          {data?.request_by?.profile?.last_name}
                        </>
                      ) : (
                        <>{data?.request_by?.email}</>
                      )}
                    </div>
                  </div>
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:user" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Disetujui Oleh
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.approve_by?.profile?.first_name ? (
                        <>
                          {data?.approve_by?.profile?.first_name}{" "}
                          {data?.approve_by?.profile?.last_name}
                        </>
                      ) : (
                        <>{data?.approve_by?.email}</>
                      )}
                    </div>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:currency-dollar" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Biaya
                    </div>
                    {data?.cost ? (
                      <>Rp {data?.cost.toLocaleString("id-ID")}</>
                    ) : (
                      <span>- </span>
                    )}
                  </div>
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:check-badge" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Status Berkas
                    </div>
                    {data?.status === "draft" && (
                      <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-blue-500 bg-blue-500">
                        Diarsipkan
                      </span>
                    )}
                    {data?.status === "pending" && (
                      <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-warning-500 bg-warning-300">
                        Menunggu Persetujuan
                      </span>
                    )}
                    {data?.status === "open" && (
                      <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                        Disetujui
                      </span>
                    )}
                    {data?.status === "close" && (
                      <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-pink-500 bg-pink-500">
                        Selesai
                      </span>
                    )}
                    {data?.status === "cancel" && (
                      <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-amber-500 bg-amber-500">
                        Dibatalkan
                      </span>
                    )}
                    {data?.status === "reject" && (
                      <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                        Ditolak
                      </span>
                    )}
                  </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:check-circle" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Status Ketersediaan
                    </div>
                    {data?.is_partial_receive ? (
                      <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-300">
                        Tersedia
                      </span>
                    ) : (
                      <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                        Tidak Tersedia
                      </span>
                    )}
                  </div>
                </li>
              </ul>
            </Card>

            <Card title="Aksi" className="mb-4">
              <div className="py-4 px-6">
                <div className="grid justify-items-center">
                  <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
                    {data?.status === "open" && (
                      <>
                        <Button
                          text="Selesaikan PO"
                          className="btn-success light shadow-base2"
                          onClick={() => completePO()}
                        />
                        <Button
                          text="Batalkan PO"
                          className="btn-danger light shadow-base2"
                          onClick={() => cancelPO()}
                        />
                      </>
                    )}
                  </div>
                  <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
                    {data?.status === "pending" && (
                      <>
                        <Button
                          text={
                            isApproveLoading ? <LoadingButton /> : "Setujui PO"
                          }
                          className="btn-success light shadow-base2"
                          onClick={() => onApproved()}
                        />
                        <Button
                          text={
                            isRejectLoading ? <LoadingButton /> : "Tolak PO"
                          }
                          className="btn-danger light shadow-base2"
                          onClick={() => onReject()}
                        />
                      </>
                    )}
                  </div>
                  <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1">
                    {data?.status === "draft" && (
                      <>
                        <Button
                          text="PO Terarsip"
                          className="btn-primary light shadow-base2"
                          onClick={() => completePO()}
                          disabled
                        />
                      </>
                    )}
                  </div>
                  <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1">
                    {data?.status === "reject" && (
                      <>
                        <Button
                          text="PO Ditolak"
                          className="btn-danger light shadow-base2"
                          onClick={() => completePO()}
                          disabled
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
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
                <div className="card-title2 mb-2">Perbaharui PO</div>
                <div className="flex row justfiy-between gap-2">
                  <div className="flex-1">
                    <div className="text-sm">
                      Harap memperhatikan kembali data dari PO yang ingin
                      diperbaharui.
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="">
                      <Button
                        text="Perbaharui PO"
                        className="btn-warning dark w-full btn-sm "
                        onClick={() => navigate(`/po/update/${uid}`)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-3 px-5">
                <div className="card-title2 mb-2">Hapus PO</div>
                <div className="flex row justfiy-between gap-2">
                  <div className="flex-1">
                    <div className="text-sm">
                      Setelah anda menghapus PO, tidak ada akses untuk
                      mengembalikan data. Harap mempertimbangkannya kembali.
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="">
                      <Button
                        text="Hapus PO"
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
            <Card title="Info Produk" className="mb-4">
              <div className="py-4 px-6">
                <div className="">
                  {isLoading ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Nama Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Harga Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah Keseluruhan Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Sisa Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Harga
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
                              Nama Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Harga Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah Keseluruhan Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Sisa Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Harga
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
                            Nama Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Harga Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Jumlah Keseluruhan Stok
                          </th>
                          <th scope="col" className=" table-th ">
                            Sisa Stok
                          </th>
                          <th scope="col" className=" table-th ">
                            Total Harga
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.purchase_order_products?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">
                              {item?.item_description}
                            </td>
                            <td className="table-td">
                              Rp {item?.price.toLocaleString("id-ID")}
                            </td>
                            <td className="table-td">{item?.quantity}</td>
                            <td className="table-td">{item?.qty_remaining}</td>
                            <td className="table-td">
                              Rp {item?.total_price.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </Card>
            <Card title="Penerimaan PO" className="mb-4">
              <div className="py-4 px-6">
                <div className="">
                  {isLoading ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Tanggal Terima
                            </th>
                            <th scope="col" className=" table-th ">
                              Kode Pengiriman
                            </th>
                          </tr>
                        </thead>
                      </table>

                      <div className="w-full flex justify-center text-secondary p-10">
                        <Loading />
                      </div>
                    </>
                  ) : data?.receives?.length === 0 ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Tanggal Terima
                            </th>
                            <th scope="col" className=" table-th ">
                              Kode Pengiriman
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
                            Belum tersedia penerima PO
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            Tanggal Terima
                          </th>
                          <th scope="col" className=" table-th ">
                            Kode Pengiriman
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.receives?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">{item?.receive_at}</td>

                            <td className="table-td">{item?.delivery_order}</td>
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

export default DetailPurchaseOrder;
