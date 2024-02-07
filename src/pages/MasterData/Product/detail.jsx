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

import ProfileImageMen from "@/assets/images/avatar/13.png";
import ProfileIdentity from "@/assets/images/avatar/selvie.jpg";
import Product from "@/assets/images/all-img/login-bg.png";

const DetailProducts = () => {
  let { uid } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getDataById = () => {
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.PRODUCTS}/${uid}`).then((response) => {
          setData(response?.data?.data);
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDataById();
  }, [uid]);

  return (
    <div>
      <div className="space-y-5 profile-page">
        <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                  {data?.primary_image?.url ? (
                    <img
                      src={data?.primary_image?.url}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <img
                      src={Product}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {data?.name ? <>{data?.name}</> : <span>-</span>}
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                  {data?.uid}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                Status
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                {data?.is_active === true && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                    Aktif
                  </span>
                )}
                {data?.is_active === false && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                    Nonaktif
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                SKU Utama
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                {data?.primary_variant?.sku}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                Harga Produk
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Rp {data?.primary_variant?.price}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 ">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info Produk" className="mb-4">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:currency-dollar" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Minimal pesanan
                    </div>
                    {data?.minimal_order}
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:bookmark" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Produk Konten Army
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50 mt-2">
                      {data?.is_display_in_army_content === true && (
                        <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                          Tersedia
                        </span>
                      )}
                      {data?.is_display_in_army_content === false && (
                        <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                          Belum Tersedia
                        </span>
                      )}
                    </div>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:calendar" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Garansi Produk
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.warranty ? <>{data?.warranty}</> : <span>-</span>}
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
            <div className="lg:col-span-4 col-span-12">
              <Card className="mb-4">
                <Card title="Deskripsi">
                  <ul className="list space-y-8">
                    <li className="flex space-x-3 rtl:space-x-reverse">
                      <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                        <Icon icon="heroicons:arrow-right" />
                      </div>
                      <div
                        className="flex-1"
                        dangerouslySetInnerHTML={{ __html: data?.description }}
                      />
                    </li>
                  </ul>
                </Card>
                <Card title="Gambar produk" className="mt-2">
                  <ul className="list space-y-8 ">
                    <li className="flex space-x-3 rtl:space-x-reverse">
                      {data?.images?.map((item, index) => (
                        <div className="image-box" key={index}>
                          <img
                            src={item?.url}
                            alt=""
                            className="rounded-t-md w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </li>
                  </ul>
                </Card>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-8 col-span-12">
            <Card title="Tabel Variasi" className="mb-4">
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
                                Harga
                              </th>
                              <th scope="col" className=" table-th ">
                                Atribut
                              </th>
                              <th scope="col" className=" table-th ">
                                Gambar Varian
                              </th>
                              <th scope="col" className=" table-th ">
                                Varian Utama
                              </th>
                            </tr>
                          </thead>
                        </table>

                        <div className="w-full flex justify-center text-secondary p-10">
                          <Loading />
                        </div>
                      </>
                    ) : data?.variants?.length === 0 ? (
                      <>
                        <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                          <thead className="bg-slate-200 dark:bg-slate-700">
                            <tr>
                              <th scope="col" className=" table-th ">
                                SKU
                              </th>
                              <th scope="col" className=" table-th ">
                                Harga
                              </th>
                              <th scope="col" className=" table-th ">
                                Atribut
                              </th>
                              <th scope="col" className=" table-th ">
                                Gambar Varian
                              </th>
                              <th scope="col" className=" table-th ">
                                Varian Utama
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
                              Varian produk tidak tersedia
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
                              Harga
                            </th>
                            <th scope="col" className=" table-th ">
                              Atribut
                            </th>
                            <th scope="col" className=" table-th ">
                              Gambar Varian
                            </th>
                            <th scope="col" className=" table-th ">
                              Varian Utama
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                          {data?.variants?.map((item, index) => (
                            <tr key={index}>
                              <td className="table-td">{item?.sku}</td>
                              <td className="table-td">Rp {item?.price}</td>
                              <td className="table-td">
                                {item?.variant_attribute ? (
                                  <span>{item?.variant_attribute}</span>
                                ) : (
                                  <span>-</span>
                                )}
                              </td>
                              <td className="table-td">
                                {item?.image?.url ? (
                                  <img
                                    src={item?.image?.url}
                                    alt=""
                                    className="w-16 h-16 object-cover rounded-full"
                                  />
                                ) : (
                                  <img
                                    src={Product}
                                    alt=""
                                    className="w-16 h-16 object-cover rounded-full"
                                  />
                                )}
                              </td>
                              <td className="table-td">
                                {item?.is_primary === true ? (
                                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                                    Utama
                                  </span>
                                ) : (
                                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                                    -
                                  </span>
                                )}
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
      </div>
    </div>
  );
};

export default DetailProducts;
