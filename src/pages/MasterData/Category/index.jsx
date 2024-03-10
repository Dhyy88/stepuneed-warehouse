import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import axios from "../../../API/Axios";
import ApiEndpoint from "../../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Loading from "../../../components/Loading";
import LoadingButton from "../../../components/LoadingButton";
import Alert from "@/components/ui/Alert";

const Categories = () => {
  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({
    search: "",
    paginate: 1,
    with_child: 1,
    level: 1,
  });
  const [name, setName] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [parentOptions, setParentOptions] = useState([]);
  const [categorySelect, setCategorySelect] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);

  const [select, setSelect] = useState("");

  async function getCategory(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.CATEGORY, {
        page: query?.page,
        search: query?.search,
        paginate: 8,
        with_child: 1,
        level: 1,
      });
      setData(response.data.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

  const flattenCategories = (categories, level = 1, parentId = null) => {
    let flatArray = [];

    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        const isExpanded = expandedCategories.includes(category.uid);

        flatArray.push(
          <React.Fragment key={category.uid}>
            <tr>
              <td className="table-td flex row">
                {category.sub_categories &&
                  category.sub_categories.length > 0 && (
                    <button
                      className="action-btn"
                      onClick={() =>
                        toggleCategoryExpansion(category.uid, isExpanded)
                      }
                    >
                      {isExpanded ? (
                        <Icon icon="heroicons:chevron-up" />
                      ) : (
                        <Icon icon="heroicons:chevron-down" />
                      )}
                    </button>
                  )}
                {level > 1 &&
                  [...Array(level)].map((_, index) => (
                    <span key={index}>&nbsp;-&nbsp;</span>
                  ))}
              </td>

              <td className="table-td">{category.name}</td>
              <td className="table-td">{category.slug}</td>
              <td className="table-td">
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <Tooltip
                    content="Edit"
                    placement="top"
                    arrow
                    animation="shift-away"
                  >
                    <button
                      className="action-btn"
                      type="button"
                      onClick={() => onEdit(category.uid)}
                    >
                      <Icon icon="heroicons:pencil-square" />
                    </button>
                  </Tooltip>
                  <Tooltip
                    content="Hapus"
                    placement="top"
                    arrow
                    animation="shift-away"
                    theme="danger"
                  >
                    <button
                      className="action-btn"
                      type="button"
                      onClick={() => onDelete(category.uid)}
                    >
                      <Icon icon="heroicons:trash" />
                    </button>
                  </Tooltip>
                </div>
              </td>
            </tr>
            {isExpanded &&
              category.sub_categories.length > 0 &&
              flattenCategories(category.sub_categories, level + 1)}
          </React.Fragment>
        );
      });
    }

    return flatArray;
  };

  const toggleCategoryExpansion = (categoryId, isExpanded) => {
    setExpandedCategories((prevExpanded) =>
      isExpanded
        ? prevExpanded.filter((id) => id !== categoryId)
        : [...prevExpanded, categoryId]
    );
  };

  const onSubmit = async (e) => {
    setIsLoadingButton(true);
    e.preventDefault();
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menyimpan data?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    });
    setIsLoadingButton(true);
    if (result.isConfirmed) {
      const formData = new FormData();
      formData.append("category_parent", select);
      formData.append("name", name);

      try {
        await axios.post(ApiEndpoint.CREATE_CATEGORY, formData);

        setName("");
        setSelect("");

        Swal.fire({
          icon: "success",
          text: "Data kategori berhasil diterbitkan!",
        });
        getCategory(query);
        setIsLoadingButton(false);
      } catch (error) {
        Swal.fire("Gagal", error.response.data.message, "error");
        setIsLoadingButton(false);
      }
    } else {
      setIsLoadingButton(false);
    }
  };

  async function onDelete(uid) {
    try {
      const result = await Swal.fire({
        icon: "question",
        title: "Apakah Anda yakin ingin menghapus kategori ini?",
        text: "Anda tidak akan dapat mengembalikannya!",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        const { value: input } = await Swal.fire({
          icon: "warning",
          title: "Verifikasi",
          text: `Silahkan ketik "hapus" untuk melanjutkan verifikasi hapus data !`,
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Konfirmasi",
          cancelButtonText: "Batal",
          inputValidator: (value) => {
            if (!value || value.trim().toLowerCase() !== "hapus") {
              return 'Anda harus memasukkan kata "hapus" untuk melanjutkan verifikasi hapus data!';
            }
          },
        });

        if (input && input.trim().toLowerCase() === "hapus") {
          await axios.delete(`${ApiEndpoint.CATEGORY}/${uid}`);
          Swal.fire(
            "Berhasil!",
            "Anda berhasil menghapus data kategori ini.",
            "success"
          );
          getCategory(query);
        } else {
          Swal.fire("Batal", "Hapus data kategori dibatalkan.", "info");
        }
      }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  }

  const onEdit = async (uid) => {
    try {
      const response = await axios.get(`${ApiEndpoint.CATEGORY}/${uid}`);
      const editedCategory = response.data.data;

      setName(editedCategory.name);
      setSelect(editedCategory.category_uid);

      setData({ ...data, uid: editedCategory.uid });
      setError("");
      setEditMode(true);
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  };

  const onUpdate = async (e) => {
    setIsLoadingButton(true);
    e.preventDefault();

    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin data yang diubah sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Ubah",
      cancelButtonText: "Batal",
    });
    setIsLoadingButton(true);
    if (result.isConfirmed) {
      const formData = new FormData();
      formData.append("category_parent", select);
      formData.append("name", name);

      try {
        await axios.post(`${ApiEndpoint.CATEGORY}/${data.uid}`, formData);

        setName("");
        setSelect("");

        Swal.fire({
          icon: "success",
          text: "Selamat data kategori berhasil diperbaharui!",
        });
        getCategory(query);
        resetForm();
        setEditMode(false);
        setIsLoadingButton(false);
      } catch (error) {
        Swal.fire("Gagal", error.response.data.message, "error");
        setIsLoadingButton(false);
      }
    } else {
      setIsLoadingButton(false);
    }
  };

  const handlePrevPagination = () => {
    if (data.prev_page_url) {
      setQuery({ ...query, page: data.current_page - 1 });
    }
  };

  const handleNextPagination = () => {
    if (data.next_page_url) {
      setQuery({ ...query, page: data.current_page + 1 });
    }
  };

  const handleFirstPagination = () => {
    setQuery({ ...query, page: 1 });
  };

  const handleLastPagination = () => {
    setQuery({ ...query, page: data.last_page });
  };

  const generatePageNumbers = () => {
    const totalPages = data.last_page;
    const maxPageNumbers = 5;
    const currentPage = data.current_page;
    const middlePage = Math.floor(maxPageNumbers / 2);
    const startPage = Math.max(currentPage - middlePage, 1);
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    const pageNumbers = [];
    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push({ page, active: page === currentPage });
    }

    return pageNumbers;
  };

  useEffect(() => {
    getCategory(query);
  }, [query]);

  const resetForm = () => {
    setName("");
    setSelect(null);
    setEditMode(false);
  };

  useEffect(() => {
    const level1Categories = data.data
      ? data.data.filter((category) => category.level === 1)
      : [];
    const options = flattenCategories(level1Categories);
    setParentOptions(options);
  }, [data, expandedCategories]);

  const flattenCategoriesSelect = (categories, level = 1) => {
    let flatArray = [];

    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        flatArray.push({
          value: category.uid,
          label: category.name,
        });

        if (category.sub_categories && category.sub_categories.length > 0) {
          flatArray = [
            ...flatArray,
            ...flattenCategoriesSelect(category.sub_categories, level + 1),
          ];
        }
      });
    }

    return flatArray;
  };

  useEffect(() => {
    const level1Categories = data.data
      ? data.data.filter((category) => category.level === 1)
      : [];

    const options = flattenCategoriesSelect(level1Categories);
    setCategorySelect(options);
  }, [data]);

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-9 col-span-12">
          <Card title="Data Kategori">
            <div className="md:flex justify-end items-center mb-4">
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4">
                  <Textinput
                    // value={query || ""}
                    onChange={(event) =>
                      setQuery({ ...query, search: event.target.value })
                    }
                    placeholder="Cari kategori..."
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden ">
                  {isLoading ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th "></th>
                            <th scope="col" className=" table-th ">
                              Nama Kategori
                            </th>
                            <th scope="col" className=" table-th ">
                              Slug Kategori
                            </th>
                            <th scope="col" className=" table-th ">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                      </table>

                      <div className="w-full flex justify-center text-secondary p-10">
                        <Loading />
                      </div>
                    </>
                  ) : data?.data?.length === 0 ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th "></th>
                            <th scope="col" className=" table-th ">
                              Nama Kategori
                            </th>
                            <th scope="col" className=" table-th ">
                              Slug Kategori
                            </th>
                            <th scope="col" className=" table-th ">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                      </table>

                      <div className="w-full flex flex-col justify-center text-secondary p-10">
                        <div className="w-full flex justify-center mb-3">
                          <span className="text-slate-900 dark:text-white text-[100px] transition-all duration-300">
                            <Icon icon="heroicons:information-circle" />
                          </span>
                        </div>
                        <div className="w-full flex justify-center text-secondary">
                          <span className="text-slate-900 dark:text-white text-[20px] transition-all duration-300">
                            Kategori belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th "></th>
                          <th scope="col" className=" table-th ">
                              Nama Kategori
                            </th>
                          <th scope="col" className=" table-th ">
                            Slug Kategori
                          </th>
                          <th scope="col" className=" table-th ">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {parentOptions}
                      </tbody>
                    </table>
                  )}
                  <div className="custom-class flex justify-end mt-4">
                    <ul className="pagination">
                      <li>
                        <button
                          className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                          onClick={handleFirstPagination}
                        >
                          <Icon icon="heroicons-outline:chevron-double-left" />
                        </button>
                      </li>
                      <li>
                        <button
                          className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                          onClick={handlePrevPagination}
                        >
                          <Icon icon="heroicons-outline:chevron-left" />
                        </button>
                      </li>

                      {generatePageNumbers().map((pageNumber) => (
                        <li key={pageNumber.page}>
                          <button
                            className={`${
                              pageNumber.active ? "active" : ""
                            } page-link`}
                            onClick={() =>
                              setQuery({ ...query, page: pageNumber.page })
                            }
                          >
                            {pageNumber.page}
                          </button>
                        </li>
                      ))}

                      <li>
                        <button
                          className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                          onClick={handleNextPagination}
                        >
                          <Icon icon="heroicons-outline:chevron-right" />
                        </button>
                      </li>
                      <li>
                        <button
                          className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                          onClick={handleLastPagination}
                        >
                          <Icon icon="heroicons-outline:chevron-double-right" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/*end*/}
          </Card>
        </div>
        <div className="lg:col-span-3 col-span-12">
          <Card title={editMode ? "Ubah Kategori" : "Tambah Kategori"}>
            <div className="text-sm text-slate-600 font-normal bg-white dark:bg-slate-900 dark:text-slate-300 rounded p-5">
              <Alert
                // dismissible
                icon="heroicons-outline:exclamation"
                className="light-mode alert-warning mb-5"
              >
                <p>
                  Form parent kategori dikhususkan untuk kategori yang memiliki
                  sub kategori !
                </p>
              </Alert>
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <label htmlFor=" hh" className="form-label ">
                  Parent Kategori *
                </label>
                <Select
                  className="react-select mt-2"
                  classNamePrefix="select"
                  placeholder="Pilih parent..."
                  options={categorySelect}
                  onChange={(selectedOption) =>
                    setSelect(selectedOption?.value || "")
                  }
                  value={
                    categorySelect.find((option) => option.value === select) ||
                    null
                  }
                  isClearable
                />
              </div>
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <Textinput
                  label="Nama Kategori *"
                  type="text"
                  placeholder="Masukkan nama kategori"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error?.errors?.name}
                  </span>
                )}
              </div>

              <div className="text-base text-end text-slate-600 dark:text-slate-300">
                {editMode ? (
                  <Button
                    text={isLoadingButton ? <LoadingButton /> : "Ubah"}
                    className="btn-primary dark w-full mr-2 mb-2 "
                    onClick={onUpdate}
                    disabled={isLoadingButton}
                  />
                ) : (
                  <Button
                    text={isLoadingButton ? <LoadingButton /> : "Simpan"}
                    className="btn-primary dark w-full mr-2 mb-2 "
                    onClick={onSubmit}
                    disabled={isLoadingButton}
                  />
                )}
                {editMode ? (
                  <Button
                    text="Batal"
                    className="btn-primary light w-full"
                    onClick={resetForm}
                  />
                ) : (
                  <Button
                    text="Reset"
                    className="btn-primary light w-full"
                    onClick={resetForm}
                  />
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Categories;
