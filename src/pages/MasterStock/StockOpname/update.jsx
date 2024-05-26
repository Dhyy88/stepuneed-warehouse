import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import axios from "../../../API/Axios";
import ApiEndpoint from "../../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const UpdateNoteStockOpname = () => {
  const navigate = useNavigate();
  let { uid } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const getDataById = () => {
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.STOCKOPNAME}/${uid}`).then((response) => {
          setData(response?.data?.data);
          setNote(response?.data?.data?.note);
        });
      }
    } catch (error) {
      setError(err.response.data.errors);
      console.error("Error fetching data:", error);
    }
  };

  const onSubmit = async () => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin catatan yang dimasukkan sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        const requestData = {
          note: note,
        };
        await axios.post(`${ApiEndpoint.STOCKOPNAME}/${uid}/update-note`, requestData);

        Swal.fire("Sukses", "Catatan berhasil diperbaharui", "success").then(
          () => {
            resetForm();
            navigate("/stockopname");
          }
        );
      } catch (err) {
        setError(err.response.data.errors);
        Swal.fire("Gagal", err.response.data.message, "error");
      }
    }
  };

  useEffect(() => {
    getDataById();
  }, [uid]);

  const resetForm = () => {
    setNote(data ? data.note : "");
  };  

  const previousPage = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="lg:col-span-12 col-span-12">
        <Card title={"Ubah Catatan Stock Opname"}>

          <div className="text-base text-slate-600 dark:text-slate-300 mb-5">
            <Textarea
              label="Catatan"
              id="pn4"
              rows="6"
              placeholder=""
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
            <Button
              text="Reset"
              className="btn-primary light w-full"
              onClick={resetForm}
            />
            <Button
              text="Simpan"
              className="btn-primary dark w-full "
              onClick={onSubmit}
            />
          </div>
          <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mt-5">
            <Button
              text="Batal"
              className="btn-secondary light w-full "
              onClick={previousPage}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default UpdateNoteStockOpname;
