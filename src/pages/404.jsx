import React from "react";
import { Link } from "react-router-dom";

import ErrorImage from "@/assets/images/all-img/404-2.svg";
function Error() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center py-20 dark:bg-slate-900">
      <img src={ErrorImage} alt="" />
      <div className="max-w-[546px] mx-auto w-full mt-12">
        <h4 className="text-slate-900 mb-4">Halaman belum tersedia</h4>
        <div className="dark:text-white text-base font-normal mb-10">
          Halaman yang Anda cari mungkin telah dihapus karena namanya diubah
          atau untuk sementara tidak tersedia.
        </div>
      </div>
      <div className="max-w-[300px] mx-auto w-full">
        <Link
          to="/"
          className="btn btn-dark dark:bg-slate-800 block text-center"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Error;
