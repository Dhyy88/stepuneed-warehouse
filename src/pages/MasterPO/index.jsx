import React, { useState } from "react";
import Card from "@/components/ui/Card";
import axios from "../../API/Axios";
import ApiEndpoint from "../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton";

const ReceivePO = () => {
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [document_number, setDocumentNumber] = useState("");
  const [receive_code, setReceiveCode] = useState("");
  const [purchaseOrderProducts, setPurchaseOrderProducts] = useState([]);
  const [formVisible, setFormVisible] = useState(false);

  const previousPage = () => {
    navigate(-1);
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const confirmation = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menerima PO ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      reverseButtons: true,
    });
  
    if (confirmation.isConfirmed) {
      try {
        const formData = {
          purchase_order: document_number,
          delivery_order: receive_code,
          purchase_order_products: purchaseOrderProducts.map((product, index) => ({
            uid: product.uid,
            quantity: quantity[index],
          })),
        };
  
        await axios.post(`${ApiEndpoint.RECEIVE_PO}`, formData);
        Swal.fire("Berhasil!", "PO berhasil diterima.", "success").then(() => {
          window.location.reload();
        });
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          Swal.fire("Error!", error.response.data.message, "error");
          setError(error.response.data.errors);
        } else {
          setError("Terjadi kesalahan saat menerima PO.");
        }
      }
    }
    setIsLoading(false);
  };

  const handleGenerateClick = async () => {
    const poNumber = document_number;

    if (poNumber) {
      try {
        setIsLoading(true);
        const response = await axios.post(`${ApiEndpoint.PO_NUMBER}`, { purchase_order: poNumber });
        const data = response.data.data;

        if (data && data.purchase_order_products && data.purchase_order_products.length > 0) {
          setPurchaseOrderProducts(data.purchase_order_products);
          setQuantity(new Array(data.purchase_order_products.length).fill(""));
          setFormVisible(true);
        } else {
          setPurchaseOrderProducts([]);
          setFormVisible(false);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        Swal.fire("Error!", "Gagal mengambil data PO.", "error");
        setFormVisible(false);
      }
    } else {
      setPurchaseOrderProducts([]);
      setFormVisible(false);
    }
  };

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantity];
    newQuantities[index] = value;
    setQuantity(newQuantities);
  };

  return (
    <div className="lg:col-span-12 col-span-12">
      <Card title={"Penerimaan PO"}>
        <Card className="mb-4">
          <div className="flex flex-row gap-5 mb-5">
            <div className="w-full">
              <Textinput
                label="Nomor PO*"
                type="number"
                placeholder="Masukkan nomor PO"
                value={document_number}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
              {error && (
                <span className="text-danger-600 text-xs py-2">
                  {error.document_number}
                </span>
              )}
            </div>
            <div className="w-40">
              <div className="flex justify-end items-end pt-8">
                <Button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleGenerateClick}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Cari Berkas"}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {formVisible && (
          <>
            <Card className="mb-4">
              <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
                <div className="">
                  <Textinput
                    label="Kode Pengiriman*"
                    type="text"
                    placeholder="Masukkan kode pengiriman PO"
                    value={receive_code}
                    onChange={(e) => setReceiveCode(e.target.value)}
                  />
                  {error && (
                    <span className="text-danger-600 text-xs py-2">
                      {error.receive_code}
                    </span>
                  )}
                </div>
              </div>
            </Card>

            <Card className="mb-4">
              {purchaseOrderProducts.map((product, index) => (
                <div key={product.uid} className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-5">
                  <div className="">
                    <Textinput
                      label="Nama Produk*"
                      type="text"
                      value={product.item_description}
                      disabled
                    />
                  </div>
                  <div className="">
                    <Textinput
                      label="Jumlah Barang*"
                      type="number"
                      placeholder="Masukkan Jumlah barang"
                      value={quantity[index]}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                    />
                    {error && (
                      <span className="text-danger-600 text-xs py-2">
                        {error.quantity}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </Card>

            <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
              <Button
                text="Batal"
                className="btn-secondary light w-full"
                onClick={previousPage}
              />
              <Button
                text={isLoading ? <LoadingButton /> : "Simpan"}
                className="btn-primary dark w-full"
                type="submit"
                onClick={onSubmit}
                disabled={isLoading}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ReceivePO;
