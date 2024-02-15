import React, { useEffect, useState, Fragment } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import { useParams } from "react-router-dom";
import Tooltip from "@/components/ui/Tooltip";
import Button from "@/components/ui/Button";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../../components/LoadingButton";
import Alert from "@/components/ui/Alert";

// import images
import ProfileImageMen from "@/assets/images/avatar/13.png";
import ProfileIdentity from "@/assets/images/avatar/selvie.jpg";

const DetailArmy = () => {
  let { uid } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);

  const getDataById = () => {
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.SALES_EXTERNAL}/${uid}`).then((response) => {
          setData(response.data.data);
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onApproved = async () => {
    setIsApproveLoading(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin menyetujui akun ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Setujui",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.get(`${ApiEndpoint.SALES_EXTERNAL}/${uid}/approve`);
        getDataById();
        Swal.fire("Sukses", "Akun sales berhasil disetujui.", "success");
        setIsApproveLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          Swal.fire("Gagal", error.response.data.message, "error");
          setIsApproveLoading(false);
        } else {
          Swal.fire(
            "Gagal",
            "Terjadi kesalahan saat menyetujui akun.",
            "error"
          );
          setIsApproveLoading(false);
        }
      }
    } else {
      setIsApproveLoading(false);
    }
  };

  const toggleAccount = async (isActive) => {
    const actionText = isActive ? "mengaktifkan" : "menonaktifkan";
    const successMessage = isActive ? "diaktifkan" : "dinonaktifkan";

    setIsLoadingButton(true);
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
        axios
          .get(`${ApiEndpoint.SALES_EXTERNAL}/${uid}/toggle-active`)
          .then(() => {
            getDataById();
            setIsLoadingButton(false);
          });
        Swal.fire(
          "Sukses",
          `Akun sales berhasil ${successMessage}.`,
          "success"
        );
        getDataById();
        setIsLoadingButton(false);
      } catch (error) {
        Swal.fire("Gagal", err.response.data.message, "error");
        setIsLoadingButton(false);
      }
    } else {
      setIsLoadingButton(false);
    }
  };

  const onSuspendAccount = () => {
    setIsLoadingButton(true);
    toggleAccount(false);
  };

  const onActiveAccount = () => {
    setIsLoadingButton(true);
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
                  {data?.army_profile?.profile_picture?.url ? (
                    <img
                      src={data?.army_profile?.profile_picture?.url}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <img
                      src={ProfileImageMen}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {data?.army_profile?.first_name ? (
                    <>
                      {data?.army_profile?.first_name}{" "}
                      {data?.army_profile?.last_name}
                    </>
                  ) : (
                    <span>Nama belum diatur</span>
                  )}
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
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                Status Data
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                {data?.army_profile?.approve_status === "incomplete" && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-blue-500 bg-blue-500">
                    Belum Registrasi
                  </span>
                )}
                {data?.army_profile?.approve_status === "approved" && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                    Verifikasi
                  </span>
                )}
                {data?.army_profile?.approve_status === "review" && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-warning-500 bg-warning-500">
                    Review
                  </span>
                )}
                {data?.army_profile?.approve_status === "rejected" && (
                  <Tooltip
                    content={data?.profile?.reject_note}
                    placement="top"
                    arrow
                    animation="shift-away"
                  >
                    <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                      Ditolak
                    </span>
                  </Tooltip>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                Tanggal Registrasi
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                {data?.registered_at}
              </div>
            </div>
          </div>
        </div>
        {data?.army_profile?.reject_note && (
          <Alert className="light-mode alert-danger mb-5">
            Riwayat pesan tolak akun army :
            {data?.army_profile?.reject_note?.first_name && (
              <>
                <br /> - {data?.army_profile?.reject_note?.first_name}
              </>
            )}
            {data?.army_profile?.reject_note?.last_name && (
              <>
                <br /> - {data?.army_profile?.reject_note?.last_name}
              </>
            )}
            {data?.army_profile?.reject_note?.gender && (
              <>
                <br /> - {data?.army_profile?.reject_note?.gender}
              </>
            )}
            {data?.army_profile?.reject_note?.phone_number && (
              <>
                <br /> - {data?.army_profile?.reject_note?.phone_number}
              </>
            )}
            {data?.army_profile?.reject_note?.birth && (
              <>
                <br /> - {data?.army_profile?.reject_note?.birth}
              </>
            )}
            {data?.army_profile?.reject_note?.nik && (
              <>
                <br /> - {data?.army_profile?.reject_note?.nik}
              </>
            )}
            {data?.army_profile?.reject_note?.payment_bank && (
              <>
                <br /> - {data?.army_profile?.reject_note?.payment_bank}
              </>
            )}
            {data?.army_profile?.reject_note?.payment_account_number && (
              <>
                <br /> -{" "}
                {data?.army_profile?.reject_note?.payment_account_number}
              </>
            )}
            {data?.army_profile?.reject_note?.selfie_with_ktp && (
              <>
                <br /> - {data?.army_profile?.reject_note?.selfie_with_ktp}
              </>
            )}
            {data?.army_profile?.reject_note?.profile_picture && (
              <>
                <br /> - {data?.army_profile?.reject_note?.profile_picture}
              </>
            )}
          </Alert>
        )}

        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-6 col-span-12">
            <Card title="Info Pribadi" className="mb-4">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:identification" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Nomor Induk Kependudukan
                    </div>
                    {data?.army_profile?.nik ? (
                      <>{data?.army_profile?.nik}</>
                    ) : (
                      <span>NIK belum diatur</span>
                    )}
                  </div>

                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:credit-card" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      No Rekening
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.army_profile?.payment_account_number ? (
                        <>
                          {data?.army_profile?.payment_account_number}{" "}
                          {data?.army_profile?.payment_bank}
                        </>
                      ) : (
                        <span>Rekening belum diatur</span>
                      )}
                    </div>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:face-smile" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Jenis Kelamin
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.army_profile?.gender ? (
                        <>
                          {data?.army_profile?.gender === "L" && (
                            <span>Laki-laki</span>
                          )}
                          {data?.army_profile?.gender === "P" && (
                            <span>Perempuan</span>
                          )}
                        </>
                      ) : (
                        <span>Jenis kelamin belum diatur</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:calendar" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Tanggal Lahir
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.army_profile?.birth ? (
                        <>{data?.army_profile?.birth}</>
                      ) : (
                        <span>Tanggal lahir belum diatur</span>
                      )}
                    </div>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:phone-arrow-up-right" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      No Telepon
                    </div>
                    {data?.army_profile?.phone_number ? (
                      <>{data?.army_profile?.phone_number}</>
                    ) : (
                      <span>No telepon belum diatur </span>
                    )}
                  </div>

                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:document" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Foto Selvi KTP
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.army_profile?.selfie_ktp?.url ? (
                        <img
                          src={data?.army_profile?.selfie_ktp?.url}
                          alt=""
                          className="object-cover rounded h-40 w-40 mt-3"
                        />
                      ) : (
                        <img
                          src={ProfileIdentity}
                          alt=""
                          className="object-cover rounded h-40 w-40 mt-3"
                        />
                      )}
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-6 col-span-12">
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
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:swatch" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Kode Referral Sales
                    </div>
                    {data?.army_profile?.referral_code?.code ? (
                      <>{data?.army_profile?.referral_code?.code}</>
                    ) : (
                      <span>Belum ada kode referral</span>
                    )}
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:truck" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Dealer
                    </div>
                    {data?.army_profile?.dealer?.name ? (
                      <>{data?.army_profile?.dealer?.name}</>
                    ) : (
                      <span>Dealer belum diatur</span>
                    )}
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:building-office-2" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Cabang
                    </div>
                    {data?.site?.name ? (
                      <>{data?.site?.name}</>
                    ) : (
                      <span>Cabang belum diatur</span>
                    )}
                  </div>
                </li>
               
              </ul>
            </Card>
            <Card className="mb-4">
              <div className="grid justify-items-center">
                {data?.is_completed === false && (
                  <>
                    <div className="row flex justify-items-center gap-5">
                      <div className="grid grid-cols-1 md:grid-cols-1 ">
                        {data?.is_active === false ? (
                          <Button
                            text={
                              isLoadingButton ? (
                                <LoadingButton />
                              ) : (
                                "Aktifkan Akun"
                              )
                            }
                            className="btn-primary shadow-base2"
                            onClick={() => onActiveAccount()}
                            disabled={isLoadingButton}
                          />
                        ) : (
                          <Button
                            text={
                              isLoadingButton ? (
                                <LoadingButton />
                              ) : (
                                "Nonaktifkan Akun"
                              )
                            }
                            className="btn-warning shadow-base2"
                            onClick={() => onSuspendAccount()}
                            disabled={isLoadingButton}
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-2 grid-cols-1">
                        {data?.army_profile?.approve_status !== "rejected" &&
                          data?.army_profile?.approve_status !==
                            "incomplete" && (
                            <>
                              <Button
                                text={
                                  isApproveLoading ? (
                                    <LoadingButton />
                                  ) : (
                                    "Setujui Akun"
                                  )
                                }
                                className="btn-success shadow-base2 mr-5"
                                onClick={() => onApproved()}
                                disabled={isApproveLoading}
                              />
                              <Button
                                text="Tolak Akun"
                                className="btn-danger shadow-base2"
                                onClick={() =>
                                  navigate(`/army/review/${data.uid}`)
                                }
                              />
                            </>
                          )}
                      </div>
                    </div>
                  </>
                )}
                <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1">
                  {data?.is_completed === true && (
                    <>
                      {data?.is_active === false ? (
                        <Button
                          text={
                            isLoadingButton ? (
                              <LoadingButton />
                            ) : (
                              "Aktifkan Akun"
                            )
                          }
                          className="btn-primary shadow-base2"
                          onClick={() => onActiveAccount()}
                          disabled={isLoadingButton}
                        />
                      ) : (
                        <Button
                          text={
                            isLoadingButton ? (
                              <LoadingButton />
                            ) : (
                              "Nonaktifkan Akun"
                            )
                          }
                          className="btn-warning shadow-base2"
                          onClick={() => onSuspendAccount()}
                          disabled={isLoadingButton}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
          {/* <div className="lg:col-span-12 col-span-12">
            <Card title="Data Keaktifan" className="mb-4">
              <BasicArea height={190} />
            </Card>
            <Card title="Data Poin">
              <BasicArea height={190} />
            </Card>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DetailArmy;
