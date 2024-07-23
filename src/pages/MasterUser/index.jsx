import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { Link } from "react-router-dom";
import ApiEndpoint from "../../API/Api_EndPoint";
import axios from "../../API/Axios";

import ProfileImage from "@/assets/images/avatar/13.png";

const Profiles = () => {
  const [data, setData] = useState("");

  const getAccount = () => {
    axios.get(ApiEndpoint.DETAIL).then((response) => {
      setData(response.data.data);
    });
  };

  useEffect(() => {
    getAccount();
  }, []);

  return (
    <>
      <div>
        <div className="space-y-5 profile-page">
          <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
            <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
            <div className="profile-box flex-none md:text-start text-center">
              <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
                <div className="flex-none">
                  <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                    <img
                      src={ProfileImage}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                    {data?.profile?.first_name ? (
                      <>
                        {data?.profile?.first_name} {data?.profile?.last_name}
                      </>
                    ) : (
                      <span>SPV Head Office</span>
                    )}
                  </div>
                  <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                    {data?.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[316px] md:space-y-0 space-y-4">
              <div className="flex-1">
                <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                  Posisi
                </div>
                <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                  {data?.profile === null ? (
                    <span>SPV HO</span>
                  ) : (
                    <span>HO</span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                  Status Akun
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
            </div>
          </div>
          <div className="grid grid-cols-12 ">
            <div className="lg:col-span-12 col-span-12">
              <Card title="Info Akun" className="mb-4">
                <ul className="list space-y-8">
                  <li className="flex space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                      <Icon icon="heroicons:phone-arrow-up-right" />
                    </div>

                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                        No Telepon
                      </div>
                      {data?.profile?.phone_number ? (
                        <>{data?.profile?.phone_number}</>
                      ) : (
                        <span>-</span>
                      )}
                    </div>

                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                      <Icon icon="heroicons:calendar" />
                    </div>
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                        Tanggal Lahir
                      </div>
                      <div className="text-base text-slate-600 dark:text-slate-50">
                        {data?.profile?.birth ? (
                          <>{data?.profile?.birth}</>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    </div>
                  </li>
                  <li className="flex space-x-3 rtl:space-x-reverse">
                    {/* <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                      <Icon icon="heroicons:envelope" />
                    </div>
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                        Email
                      </div>
                      {data?.email}
                    </div> */}

                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                      <Icon icon="heroicons:face-smile" />
                    </div>

                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                        Jenis Kelamin
                      </div>
                      <div className="text-base text-slate-600 dark:text-slate-50">
                        {data?.profile?.gender ? (
                          <>
                            {data?.profile?.gender === "L" && (
                              <span>Laki-laki</span>
                            )}
                            {data?.profile?.gender === "P" && (
                              <span>Perempuan</span>
                            )}
                          </>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">
        <Card>
          <div className="space-y-6">
            <div className="flex space-x-3 rtl:space-x-reverse items-center">
              <div className="flex-none h-8 w-8 rounded-full bg-success-500 text-white flex flex-col items-center justify-center text-lg">
                <Icon icon="heroicons:cog-6-tooth" />
              </div>
              <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
                Pengaturan akun
              </div>
            </div>
            <Link
              to="/profile/setting"
              className="inline-flex items-center space-x-3 rtl:space-x-reverse text-sm capitalize font-medium text-blue-500 dark:text-slate-300"
            >
              <span>Klik disini untuk memperbaharui data akun</span>{" "}
              <Icon icon="heroicons:arrow-right" />
            </Link>
          </div>
        </Card>
        <Card>
          <div className="space-y-6">
            <div className="flex space-x-3 items-center rtl:space-x-reverse">
              <div className="flex-none h-8 w-8 rounded-full bg-primary-500 text-slate-300 flex flex-col items-center justify-center text-lg">
                <Icon icon="heroicons:lock-closed" />
              </div>
              <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
                Pengaturan Keamanan Akun
              </div>
            </div>
            <Link
              to="/profile/setting/password"
              className="inline-flex items-center space-x-3 rtl:space-x-reverse text-sm capitalize font-medium text-blue-500 dark:text-slate-300"
            >
              <span>Klik disini untuk memperbaharui kata sandi</span>{" "}
              <Icon icon="heroicons:arrow-right" />
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Profiles;
