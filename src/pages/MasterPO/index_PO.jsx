import React, { useState } from "react";
import Card from "@/components/ui/Card";
import axios from "../../API/Axios";
import ApiEndpoint from "../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import Loading from "../../components/Loading";

const PurchaseOrderDetail = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [document_number, setDocumentNumber] = useState("");
  const [purchaseOrderProducts, setPurchaseOrderProducts] = useState([]);
  const [formVisible, setFormVisible] = useState(false);

  const [receive, setReceive] = useState([]);

  const handleGenerateClick = async () => {
    const poNumber = document_number;

    if (poNumber) {
      try {
        setIsLoading(true);
        const response = await axios.post(`${ApiEndpoint.PO_NUMBER}`, {
          purchase_order: poNumber,
        });
        setReceive(response.data.data);
        setFormVisible(true);
        // console.log(response?.data?.data?.receives);

        // if (data && data.purchase_order_products && data.purchase_order_products.length > 0) {
        //   setPurchaseOrderProducts(data.purchase_order_products);
        //   setQuantity(new Array(data.purchase_order_products.length).fill(""));
        //   setFormVisible(true);
        // } else {
        //   setPurchaseOrderProducts([]);
        //   setFormVisible(false);
        // }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        Swal.fire("Error!", "Gagal mengambil data PO.", "error");
        setFormVisible(false);
      }
    } else {
      setPurchaseOrderProducts([]);
      setFormVisible(false);
    }
  };

  return (
    <div className="lg:col-span-12 col-span-12">
      <Card title={"Data PO"}>
        <Card className="mb-4">
          <div className="flex flex-row gap-5 mb-5">
            <div className="w-full">
              <Textinput
                label="Nomor PO*"
                type="number"
                placeholder="Masukkan nomor PO untuk mencari berkas"
                value={document_number}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
              {error && (
                <span className="text-danger-600 text-xs py-2">
                  {error.document_number}
                </span>
              )}
            </div>
            <div className="w-40">
              <div className="flex justify-end items-end pt-8">
                <Button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleGenerateClick}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Cari Berkas"}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {formVisible && (
          <>
            <Card className="mb-4">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden ">
                    {isLoading ? (
                      <>
                        <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                          <thead className="bg-slate-200 dark:bg-slate-700">
                            <tr>
                              <th scope="col" className=" table-th ">
                                Tanggal Penerimaan
                              </th>
                              <th scope="col" className=" table-th ">
                                Kode Pesanan
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
                    ) : receive?.receives?.length === 0 ? (
                      <>
                        <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                          <thead className="bg-slate-200 dark:bg-slate-700">
                            <tr>
                              <th scope="col" className=" table-th ">
                                Tanggal Penerimaan
                              </th>
                              <th scope="col" className=" table-th ">
                                Kode Pesanan
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
                              Data penerimaan belum ada !
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Tanggal Penerimaan
                            </th>
                            <th scope="col" className=" table-th ">
                              Kode Pesanan
                            </th>
                            <th scope="col" className=" table-th ">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                          {receive?.receives?.map((item, index) => (
                            <tr key={index}>
                              <td className="table-td">{item?.receive_at} </td>
                              <td className="table-td">{item?.delivery_order}</td>

                              <td className="table-td">
                                <div className="flex space-x-3 rtl:space-x-reverse">
                                  <Tooltip
                                    content="Cetak"
                                    placement="top"
                                    arrow
                                    animation="shift-away"
                                  >
                                    <button
                                      className="action-btn"
                                      type="button"
                                      onClick={() =>
                                        navigate(`/po/detail/${item.uid}`)
                                      }
                                    >
                                      <Icon icon="heroicons:printer" />
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
          </>
        )}
      </Card>
    </div>
  );
};

export default PurchaseOrderDetail;
