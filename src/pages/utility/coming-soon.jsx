import React from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";

import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import SvgImage from "@/assets/images/svg/img-1.svg";

import { useNavigate } from "react-router-dom";

const ComingSoonPage = () => {
  const [isDark] = useDarkMode();

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen">
      <div className="xl:absolute left-0 top-0 w-full">
        <div className="flex flex-wrap justify-between items-center py-6 container">
          <div>
            <Link to="#" onClick={goBack}>
              <img src={isDark ? LogoWhite : Logo} alt="" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="flex justify-between flex-wrap items-center min-h-screen">
          <div className="max-w-[500px] space-y-4">
            <div className="relative flex space-x-3 items-center text-2xl text-slate-900 dark:text-white">
              <span className="inline-block w-[25px] bg-secondary-500 h-[1px]"></span>
              <span>Coming soon</span>
            </div>
            <div className="xl:text-[70px] xl:leading-[70px] text-4xl font-semibold text-slate-900 dark:text-white">
              Halaman ini masih dalam tahap proses pengembangan
            </div>
            <div>
            <Button
              text="Kembali"
              className=" btn-primary dark mt-5 "
              onClick={goBack}
            />
          </div>
          </div>
          <div>
            <img src={SvgImage} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
