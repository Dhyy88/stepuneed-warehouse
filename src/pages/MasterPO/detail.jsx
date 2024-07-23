import React, { useEffect, useState, Fragment, useRef } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../API/Api_EndPoint";
import axios from "../../API/Axios";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import JsBarcode from "jsbarcode";
import ReactToPrint from "react-to-print";
import image1 from "@/assets/images/all-img/widget-bg-1.png";

const DetailPONumber = () => {
  let { uid } = useParams();
  const printRef = useRef();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDataById = () => {
    setIsLoading(true);
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.RECEIVE_PO}/${uid}`).then((response) => {
          setData(response?.data?.data);
          setIsLoading(false);
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDataById();
  }, [uid]);

  // useEffect(() => {
  //   if (data) {
  //     data.serial_numbers.forEach((item, index) => {
  //       item.serial_numbers.forEach((serial, i) => {
  //         JsBarcode(`#barcode-${index}-${i}`, serial, {
  //           format: "CODE128",
  //           displayValue: true,
  //         });
  //       });
  //     });
  //   }
  // }, [data]);

  return (
    <div>
      <div className="space-y-5 profile-page">
        <div className="grid grid-cols-12">
          <div className="lg:col-span-12 col-span-12">
            <div className="print:hidden flex justify-end">
              <ReactToPrint
                trigger={() => (
                  <button
                    type="button"
                    className="invocie-btn inline-flex btn btn-md whitespace-nowrap space-x-2 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
                  >
                    <span className="text-lg">
                      <Icon icon="heroicons:printer" />
                    </span>
                    <span>Print</span>
                  </button>
                )}
                content={() => printRef.current}
              />
            </div>
            {/* <Card title="Cetak Barcode" className="mb-4">
              <div className="mb-4" ref={printRef}>
                <div className="py-2 px-2 print:py-1 print:px-1">
                  {isLoading ? (
                    <Loading />
                  ) : (
                    data?.map((item, index) => (
                      <Fragment key={item.uid}>
                        <div
                          className="bg-no-repeat bg-cover bg-center p-4 rounded-[6px] relative print:hidden"
                          style={{
                            backgroundImage: `url(${image1})`,
                          }}
                        >
                          <div className="w-full">
                            <div className="text-xl font-medium text-neutral-50 mb-2">
                              SKU Produk : {item?.sku}
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    ))
                  )}
                </div>
              </div>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPONumber;
