import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import axios from "../../../API/Axios";
import ApiEndpoint from "../../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/TextInput";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const CreateStockOpname = () => {
  const navigate = useNavigate();
  let { uid } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [variant, setVariants] = useState([]);
  const [qty, setQty] = useState("");
  const [description, setDescription] = useState("");

  const getVariants = () => {
    axios.get(ApiEndpoint.VARIANTS).then((response) => {
      setVariants(response?.data?.data);
    });
  };

  const onSubmit = async () => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin catatan stock opname yang dimasukkan sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) { 
      try {
        const requestData = {
          note: note,
          variants: variant.map((item, index) => ({
            uid: item.uid,
            qty: qty[index],
            description: description[index]
          })),
        };
        await axios.post(
          `${ApiEndpoint.STOCKOPNAME}/create`,
          requestData
        );

        Swal.fire("Sukses", "Stock Opname berhasil diterbitkan", "success").then(
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
    getVariants()
  }, [])

  const resetForm = () => {
    setNote("");
  };

  const previousPage = () => {
    navigate(-1);
  };

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...qty];
    newQuantities[index] = value;
    setQty(newQuantities);
  };

  const handleDescriptionChange = (index, value) => {
    const neDescription = [...description];
    neDescription[index] = value;
    setDescription(neDescription);
  };

  return (
    <>
      <div className="lg:col-span-12 col-span-12">
        <Card title={"Penerbitan Stock Opname"}>
          <div className="text-base text-slate-600 dark:text-slate-300 mb-5">
            <Textarea
              label="Catatan (Optional)"
              id="pn4"
              rows="6"
              placeholder=""
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <Card className="mb-4">
            {variant.map((item, index) => (
              <div
                key={item.uid}
                className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-5"
              >
                <div className="">
                  <Textinput
                    label="Nama Produk*"
                    type="text"
                    value={item?.product?.name}
                    disabled
                  />
                </div>
                <div className="">
                  <Textinput
                    label="Jumlah Barang*"
                    type="number"
                    placeholder="Masukkan Jumlah barang"
                    value={qty[index]}
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                  />
                  {error && (
                    <span className="text-danger-600 text-xs py-2">
                      {error.qty}
                    </span>
                  )}
                </div>
                <div className="">
                  <Textinput
                    label="Deskripsi*"
                    type="text"
                    placeholder="Masukkan deskripsi laporan"
                    value={description[index]}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                  />
                  {error && (
                    <span className="text-danger-600 text-xs py-2">
                      {error.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </Card>

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

export default CreateStockOpname;
