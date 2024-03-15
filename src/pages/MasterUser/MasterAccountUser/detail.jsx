import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import { useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Swal from "sweetalert2";
import { Modal } from "antd";
import Checkbox from "@/components/ui/Checkbox";
import LoadingButton from "../../../components/LoadingButton";

// import images
import ProfileImageMen from "@/assets/images/avatar/13.png";

const DetailUser = () => {
  let { uid } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedRoles, setCheckedRoles] = useState({});
  const [error, setError] = useState("");
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const [isModal, setIsModal] = useState(false);

  const [data_role, setDataRole] = useState({
    role: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });

  const [query, setQuery] = useState({
    search: "",
    paginate: 8,
  });

  const handleOpenModal = () => {
    setIsModal(true);
  };

  const handleCancelModal = () => {
    setIsModal(false);
  };

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

  async function getDataRole(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.ROLE, {
        search: query?.search,
        page: query?.page,
        paginate: 8,
      });
      setDataRole(response?.data?.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

  const onSubmitRoles = async () => {
    setIsLoadingButton(true);
    try {
      const selectedRoles = [];
      Object.keys(checkedRoles).forEach((roleUid) => {
        if (checkedRoles[roleUid]) {
          selectedRoles.push(roleUid);
        }
      });

      const confirmationResult = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda yakin ingin menyimpan perubahan?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Simpan!",
        cancelButtonText: "Batal",
      });

      if (confirmationResult.isConfirmed) {
        await axios.post(`${ApiEndpoint.POST_ROLES}/${uid}/assign-roles`, {
          roles: selectedRoles,
        });
        setIsLoadingButton(false);
        getDataById();
        setIsModal(false);
        Swal.fire("Sukses", "Perijinan berhasil diperbaharui", "success");
      } else {
        setIsLoadingButton(false);
      }
    } catch (err) {
      Swal.fire("Gagal", err?.response?.data?.message, "error");
      setIsLoadingButton(false);
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

  const handleRoleCheckboxChange = (roleUid) => {
    const updatedCheckedRoles = { ...checkedRoles };
    updatedCheckedRoles[roleUid] = !updatedCheckedRoles[roleUid];
    setCheckedRoles(updatedCheckedRoles);
  };

  const markCheckboxBySubRoleUID = () => {
    if (!data || !data.profile || !data.profile.sub_role) return;

    const updatedCheckedRoles = { ...checkedRoles };
    data.profile.sub_role.forEach((subRole) => {
      updatedCheckedRoles[subRole.uid] = true;
    });

    setCheckedRoles(updatedCheckedRoles);
  };

  useEffect(() => {
    getDataById();
  }, [uid]);

  useEffect(() => {
    getDataRole(query);
  }, [query]);

  useEffect(() => {
    markCheckboxBySubRoleUID();
  }, [data]);

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
                  {data?.email}
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
        <div className="grid grid-cols-12 gap-5">
          <div className="lg:col-span-9 col-span-9">
            <Card bodyClass="p-2" noborder>
              <header
                className={`border-b px-4 pt-4 pb-3 flex items-center  border-slate-500`}
              >
                <h6 className={`card-title mb-0  text-slate-500`}>Info Akun</h6>
              </header>
              <div className="py-5 px-5">
                <ul className="list space-y-8">
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
                  <li className="flex space-x-3 rtl:space-x-reverse">
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
                </ul>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-3 col-span-3">
            <Card bodyClass="p-2" noborder>
              <header
                className={`border-b px-4 pt-4 pb-3 flex items-center justify-between border-slate-500`}
              >
                <div className="flex-1 ">
                  <h6 className={`card-title mb-0 text-slate-500`}>
                    Perijinan Akun
                  </h6>
                </div>
                <div className="flex-1 flex justify-end">
                  <Button
                    text="Perbaharui Role"
                    className=" btn-warning btn-sm"
                    onClick={() => handleOpenModal()}
                  />
                  <Modal
                    open={isModal}
                    centered
                    footer
                    onCancel={handleCancelModal}
                  >
                    <Card>
                      <h6 className="text-base text-center mb-3 text-slate-900">
                        Silahkan tentukan akses perijinan agar admin dapat
                        mengakses fitur tertentu !
                      </h6>
                      <div className="text-base text-slate-600 dark:text-slate-300">
                        {data_role &&
                        data_role.data &&
                        data_role.data.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {data_role.data.map((role) => (
                              <Card key={role.uid} bodyClass="p-2" noborder>
                                <Checkbox
                                  label={role.name}
                                  value={checkedRoles[role.uid] || false}
                                  onChange={() =>
                                    handleRoleCheckboxChange(role.uid)
                                  }
                                />
                                <ul className="list-disc list-inside pl-7">
                                  {role.permissions.map((permission) => (
                                    <li
                                      key={permission.access}
                                      className="text-slate-600 text-sm dark:text-slate-300"
                                    >
                                      {permission.name}
                                    </li>
                                  ))}
                                </ul>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-base text-slate-600 dark:text-slate-300">
                            Role belum tersedia
                          </div>
                        )}
                      </div>
                    </Card>
                    <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mt-10">
                      <Button
                        text={isLoadingButton ? <LoadingButton /> : "Simpan"}
                        className="btn-success dark w-full "
                        type="submit"
                        onClick={onSubmitRoles}
                        disabled={isLoadingButton}
                      />
                    </div>
                  </Modal>
                </div>
              </header>

              <div className="py-5 px-5">
                <div className="flex-1 row grid grid-cols-2">
                  {data?.profile?.sub_role.length === 0 ? (
                    <div className="col-span-5">Role belum diatur</div>
                  ) : (
                    data?.profile?.sub_role.map((role) => (
                      <div key={role?.uid} className="row col-span-1 mb-2">
                        <div>- {role?.name}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
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
