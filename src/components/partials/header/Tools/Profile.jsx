import React, { useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import ApiEndpoint from "../../../../API/Api_EndPoint";
import axios from "../../../../API/Axios";
import Swal from "sweetalert2";

import UserAvatar from "@/assets/images/all-img/user.png";
import ProfileImageMen from "@/assets/images/avatar/13.png";

const profileLabel = () => {
  const [data, setData] = useState("");

  const getProfile = async () => {
    await axios.get(ApiEndpoint.DETAIL).then((response) => {
      // console.log(response.data.data);
      setData(response?.data?.data);
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
          <img
            src={ProfileImageMen}
            alt=""
            className="block w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[100px] block">
          {/* Head Office */}
          {data?.profile?.first_name || "Head Office"}{" "}
          {data?.profile?.last_name || ""}
        </span>
        <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down"></Icon>
        </span>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar Akun',
      text: 'Apakah anda yakin ingin ingin keluar?',
      icon: 'question',
      showCancelButton: true,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Keluar!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.get(ApiEndpoint.LOGOUT)
          .then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('is_spv');
            navigate('/');
          })
          .catch((error) => {
            console.error('Logout failed:', error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Terjadi kesalahan saat keluar akun!',
            });
          });
      }
    });
  };
  const ProfileMenu = [
    // {
    //   label: "Profile",
    //   icon: "heroicons-outline:user",

    //   action: () => {
    //     navigate("/profile");
    //   },
    // },
    {
      label: "Pengaturan",
      icon: "heroicons-outline:cog",
      action: () => {
        navigate("/profile");
      },
    },
    {
      label: "Keluar Akun",
      icon: "heroicons-outline:login",
      action: () => {
        handleLogout();
      },
    },
  ];

  return (
    <Dropdown label={profileLabel()} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${
                active
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                  : "text-slate-600 dark:text-slate-300"
              } block     ${
                item.hasDivider
                  ? "border-t border-slate-100 dark:border-slate-700"
                  : ""
              }`}
            >
              <div className={`block cursor-pointer px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
