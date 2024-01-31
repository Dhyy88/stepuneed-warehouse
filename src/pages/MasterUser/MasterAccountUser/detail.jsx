import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import { useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Swal from "sweetalert2";
import LoadingButton from "../../../components/LoadingButton";

// import images
import ProfileImageMen from "@/assets/images/avatar/13.png";

const DetailUser = () => {
  let { uid } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDataById = () => {
    setIsLoading(true);
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.HO}/${uid}`).then((response) => {
          setData(response?.data?.data);
          setIsLoading(false);
        });
      }
    } catch (error) {
      Swal.fire("Error", error.response.data.message, "error");
      setIsLoading(false);
    }
  };

  const toggleAccount = async (isActive) => {
    setIsLoading(true);
    const actionText = isActive ? "mengaktifkan" : "menonaktifkan";
    const successMessage = isActive ? "diaktifkan" : "dinonaktifkan";

    setIsLoading(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: `Anda yakin ingin ${actionText} akun ini?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Ya, ${actionText}`,
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        axios.get(`${ApiEndpoint.HO}/${uid}/toggle-active`).then(() => {
          getDataById();
          setIsLoading(false);
        });
        Swal.fire(
          "Sukses",
          `Akun pengguna berhasil ${successMessage}.`,
          "success"
        );
        getDataById();
        setIsLoading(false);
      } catch (error) {
        Swal.fire("Gagal", err.response.data.message, "error");
      }
    } else {
      setIsLoading(false);
    }
  };

  const onSuspendAccount = () => {
    toggleAccount(false);
  };

  const onActiveAccount = () => {
    toggleAccount(true);
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
                  <img
                    src={ProfileImageMen}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {data?.profile?.first_name} {data?.profile?.last_name}
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
                Tanggal Registrasi
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                {data?.registered_at}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                Posisi
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Head Office
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
                    <Icon icon="heroicons:envelope" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Email
                    </div>
                    {data?.email}
                  </div>

                  {data?.profile?.gender && (
                    <>
                      <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                        <Icon icon="heroicons:face-smile" />
                      </div>

                      <div className="flex-1">
                        <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                          Jenis Kelamin
                        </div>
                        <div className="text-base text-slate-600 dark:text-slate-50">
                          {data?.profile?.gender === "L" && (
                            <span>Laki-laki</span>
                          )}
                          {data?.profile?.gender === "P" && (
                            <span>Perempuan</span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:phone-arrow-up-right" />
                  </div>

                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      No Telepon
                    </div>
                    {data?.profile?.phone_number}
                  </div>

                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:calendar" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Tanggal Lahir
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.profile?.birth}
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-12 col-span-12">
            <Card className="mb-4">
              <div className="grid justify-items-center ">
                <div className="flex row justify-items-center gap-5 align-center w-full">
                  {data?.is_active === false ? (
                    <Button
                      text={isLoading ? <LoadingButton /> : "Aktifkan Akun"}
                      className=" btn-success shadow-base2 w-full"
                      onClick={() => onActiveAccount()}
                      disabled={isLoading}
                    />
                  ) : (
                    <Button
                      text={isLoading ? <LoadingButton /> : "Nonaktifkan Akun"}
                      className=" btn-danger shadow-base2 w-full"
                      onClick={() => onSuspendAccount()}
                      disabled={isLoading}
                    />
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

export default DetailUser;
