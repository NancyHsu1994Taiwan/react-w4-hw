import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import PropTypes from "prop-types";
function ModalComponent({
  getProductList,
  closeModal,
  myModal,
  templateProduct,
  setTemplateProduct,
  productId,
  status,
}) {
  const { VITE_BASE_URL: BASE_URL, VITE_API_BASE: API_BASE } = import.meta.env;

  const modalRef = useRef(null);

  useEffect(() => {
    myModal.current = new Modal(modalRef.current);
    // modalRef.current = new Modal("#productModal");
  }, []);
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
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("form-data", file);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/${API_BASE}/admin/upload`,
        fd
      );
      console.log(res);
      setTemplateProduct({
        ...templateProduct,
        imageUrl: res.data.imageUrl,
      });
    } catch (error) {
      alert("上傳失敗", error.message);
    }
  };
  const [ratingValue, setRatingValue] = useState("");
  const handleRatingChange = (e) => {
    const ans = e.target.value;

    setRatingValue(ans);
    setTemplateProduct({
      ...templateProduct,
      rating: ans,
    });
  };
  return (
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
                <div className="mb-5">
                  <label htmlFor="fileInput" className="form-label">
                    {" "}
                    圖片上傳{" "}
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    id="fileInput"
                    onChange={handleFileChange}
                  />
                </div>
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
                <div className="mb-3">
                  <p>產品滿意度</p>
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic outlined example"
                  >
                    <input
                      type="button"
                      value="非常不滿意"
                      className={
                        ratingValue === "非常不滿意"
                          ? "btn btn-primary"
                          : "btn btn-outline-primary"
                      }
                      onClick={handleRatingChange}
                    />
                    <input
                      type="button"
                      value="不滿意"
                      className={
                        ratingValue === "不滿意"
                          ? "btn btn-primary"
                          : "btn btn-outline-primary"
                      }
                      onClick={handleRatingChange}
                    />
                    <input
                      type="button"
                      value="普通"
                      className={
                        ratingValue === "普通"
                          ? "btn btn-primary"
                          : "btn btn-outline-primary"
                      }
                      onClick={handleRatingChange}
                    />

                    <input
                      type="button"
                      value="滿意"
                      className={
                        ratingValue === "滿意"
                          ? "btn btn-primary"
                          : "btn btn-outline-primary"
                      }
                      onClick={handleRatingChange}
                    />
                    <input
                      type="button"
                      value="非常滿意"
                      className={
                        ratingValue === "非常滿意"
                          ? "btn btn-primary"
                          : "btn btn-outline-primary"
                      }
                      onClick={handleRatingChange}
                    />
                  </div>
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
  );
}

export default ModalComponent;
ModalComponent.propTypes = {
  getProductList: PropTypes.func,
  closeModal: PropTypes.func,
  myModal: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  templateProduct: PropTypes.shape({
    imagesUrl: PropTypes.arrayOf(PropTypes.string).isRequired,
    origin_price: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    is_enabled: PropTypes.bool.isRequired,
  }),
  setTemplateProduct: PropTypes.func.isRequired,
  productId: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};
