import React from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";

import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import SvgImage from "@/assets/images/svg/403.png";

import { useNavigate } from "react-router-dom";

const Error403 = () => {
  const [isDark] = useDarkMode();

  const navigate = useNavigate();

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen">
      <div className="absolute left-0 top-0 w-full">
        <div className="flex flex-wrap justify-between items-center py-6 container">
          <div>
            <Link to="/dashboard">
              <img src={isDark ? LogoWhite : Logo} alt="" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="flex justify-center flex-wrap items-center min-h-screen flex-col text-center">
          <img src={SvgImage} alt="" />
          <h4 className="text-3xl font-medium text-slate-900 dark:text-white mb-2 mt-4">
            - 403 Forbidden -
          </h4>
          <p className="font-normal text-base text-slate-500 dark:text-slate-300">
            Anda tidak dapat mengakses halaman ini,<br />
            dikarenakan perijinan akun.
          </p>
          <Button
            text="Kembali ke dashboard"
            className=" btn-primary light mt-10"
            onClick={goBack}
          />
        </div>
      </div>
    </div>
  );
};

export default Error403;
