import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import "swiper/swiper-bundle.min.css";
import Textinput from "@/components/ui/Textinput";

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("categories/tree");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
  };

  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  return (
    <div className="lg:col-span-12 col-span-12">
      <Card title={"Tambah Produk"}>
        <Modal
          title={"Pilih Kategori"}
          label={<Textinput label="Model Mobil" type="text" />}
          className="max-w-5xl"
          uncontrol
          centered
        >
          <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
            <Card>
              <div>
                <ul>
                  {categories.map((category) => (
                    <li
                      key={category.uid}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
            <div>
              {selectedCategory && (
                <Card>
                  <React.Fragment>
                    <ul>
                      {selectedCategory.sub_categories.map((subCategory) => (
                        <li
                          key={subCategory.uid}
                          onClick={() => handleSubCategoryClick(subCategory)}
                        >
                          {subCategory.name}
                        </li>
                      ))}
                    </ul>
                  </React.Fragment>
                </Card>
              )}
            </div>
            <div>
              <div className="">
                {selectedSubCategory && (
                  <Card>
                    <React.Fragment>
                      <ul>
                        {selectedSubCategory.sub_categories.map(
                          (subSubCategory) => (
                            <li key={subSubCategory.uid}>
                              {subSubCategory.name}
                            </li>
                          )
                        )}
                      </ul>
                    </React.Fragment>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </Modal>
      </Card>
    </div>
  );
};

export default CreateProduct;
