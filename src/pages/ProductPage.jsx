import axios from "axios";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Modal } from "bootstrap";

function ProductPage({ getProductList, productList }) {
  const { VITE_BASE_URL: BASE_URL, VITE_API_BASE: API_BASE } = import.meta.env;
  // 登入相關 -----------------------------------------------------------
  const checkAuth = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/user/check`);
      alert("驗證成功", res);
    } catch (error) {
      alert("驗證失敗", error);
    }
  };
  // 產品相關 ------------------------------------------------------------
  const [templateProduct, setTemplateProduct] = useState({
    title: "",
    category: "",
    origin_price: 0,
    price: 0,
    unit: "",
    description: "",
    content: "",
    is_enabled: 0,
    imageUrl: "",
    imagesUrl: [],
  });
  const addNewOrEditProduct = async () => {
    const product = {
      ...templateProduct,
      origin_price: Number(templateProduct.origin_price),
      price: Number(templateProduct.price),
    };

    if (status === "new") {
      try {
        const res = await axios.post(
          `${BASE_URL}/api/${API_BASE}/admin/product`,
          {
            data: {
              ...product,
            },
          }
        );

        alert(res.data.message);
        closeModal();
        getProductList();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await axios.put(
          `${BASE_URL}/api/${API_BASE}/admin/product/${productId}`,
          {
            data: {
              ...product,
            },
          }
        );
        alert(res.data.message);
        closeModal();
        getProductList();
      } catch (error) {
        console.log(error);
      }
    }
  };
  const deleteProduct = async (id) => {
    console.log("delete", productId);
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/${API_BASE}/admin/product/${id}`
      );
      alert(res.data.message);
      closeModal();
      getProductList();
    } catch (error) {
      console.log(error);
    }
  };

  // modal 相關 -------------------------------------------------------
  const [status, setStatus] = useState("");
  const [productId, setProductId] = useState("");
  const modalRef = useRef(null);
  const myModal = useRef(null);
  // let myModal;
  useEffect(() => {
    myModal.current = new Modal(modalRef.current);
    // modalRef.current = new Modal("#productModal");
  }, []);
  const openModal = (product, status) => {
    if (status === "new") {
      setStatus("new");
    } else {
      setStatus("edit");
      setProductId(product.id);
    }
    // const modalInstance = Modal.getInstance(modalRef.current);
    // modalInstance.show();
    myModal.current.show();
    // modalRef.current.show();
    setTemplateProduct({
      title: product.title || "",
      category: product.category || "",
      origin_price: product.origin_price || 0,
      price: product.price || 0,
      unit: product.unit || "",
      description: product.description || "",
      content: product.content || "",
      is_enabled: product.is_enabled || 1,
      imageUrl: product.imageUrl || "",
      imagesUrl: product.imagesUrl || [],
    });
  };
  const closeModal = () => {
    // const modalInstance = Modal.getInstance(modalRef.current);
    // modalInstance.hide();
    // modalRef.current.hide();
    myModal.current.hide();
    // 無論我用哪種方式寫modal都會導致點選“建立新的產品”打開的modal在關閉時會遺留一層灰色的遮罩
    // 所以用此暴力手法關閉
    // ⬇️ 此段程式碼由chatGPT提供
    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.remove();
    });
    document.body.classList.remove("modal-open");
    // ⬆️
  };
  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplateProduct({
      ...templateProduct,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleModalImageChange = (e, index) => {
    const { value } = e.target;
    const newImagesUrl = [...templateProduct.imagesUrl];
    newImagesUrl[index] = value;
    setTemplateProduct({
      ...templateProduct,
      imagesUrl: newImagesUrl,
    });
  };
  const addImage = () => {
    let newImages = [...templateProduct.imagesUrl];
    newImages.push("");
    setTemplateProduct({
      ...templateProduct,
      imagesUrl: newImages,
    });
  };
  const removeImage = () => {
    let newImages = [...templateProduct.imagesUrl];
    newImages.pop();
    setTemplateProduct({
      ...templateProduct,
      imagesUrl: newImages,
    });
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <button
          type="button"
          className="btn btn-success"
          onClick={() => {
            checkAuth();
          }}
        >
          驗證登入
        </button>
        <button
          onClick={() => {
            openModal({}, "new");
          }}
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#productModal"
        >
          建立新的產品
        </button>
      </div>
      {/* table */}
      <div className="row">
        <div className="col">
          <table className="table ">
            <thead>
              <tr>
                <th scope="col">分類</th>
                <th scope="col">產品名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {productList.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.category}</td>
                    <td>{item.title}</td>
                    <td>{item.origin_price}</td>
                    <td>{item.price}</td>
                    <td>{item.is_enabled === 1 ? "是" : "否"}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            openModal(item, "edit");
                          }}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteProduct(item.id)}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* pagination */}
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item">
            <a className="page-link" href="#">
              Previous
            </a>
          </li>
          {}
          <li className="page-item">
            <a className="page-link" href="#">
              1
            </a>
          </li>

          <li className="page-item">
            <a className="page-link" href="#">
              Next
            </a>
          </li>
        </ul>
      </nav>
      {/* modal */}
      <div
        ref={modalRef}
        id="productModal"
        className="modal"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">新增產品</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        value={templateProduct.imageUrl}
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <img src="" alt="" className="img-fluid" />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {templateProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          value={image}
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                          onChange={(e) => handleModalImageChange(e, index)}
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}
                    <div className="btn-group w-100">
                      {templateProduct.imagesUrl.length < 5 &&
                        templateProduct.imagesUrl[
                          templateProduct.imagesUrl.length - 1
                        ] !== "" && (
                          <button
                            className="btn btn-outline-primary btn-sm w-100"
                            onClick={addImage}
                          >
                            新增圖片
                          </button>
                        )}
                      {templateProduct.imagesUrl.length >= 1 && (
                        <button
                          className="btn btn-outline-danger btn-sm w-100"
                          onClick={removeImage}
                        >
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      value={templateProduct.title}
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      onChange={handleModalInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      value={templateProduct.category}
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      onChange={handleModalInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      value={templateProduct.unit}
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                      onChange={handleModalInputChange}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        value={templateProduct.origin_price}
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        value={templateProduct.price}
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                        onChange={handleModalInputChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      value={templateProduct.description}
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                      onChange={handleModalInputChange}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      value={templateProduct.content}
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                      onChange={handleModalInputChange}
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      value={templateProduct.is_enabled}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                      onChange={handleModalInputChange}
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={addNewOrEditProduct}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;

ProductPage.prototype = {
  getProductList: PropTypes.func.isRequired,
  productList: PropTypes.array.isRequired,
};
