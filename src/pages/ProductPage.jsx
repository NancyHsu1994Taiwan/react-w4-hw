import axios from "axios";
import { useState, useRef, useEffect } from "react";

import Pagination from "../components/Pagination";
import ModalComponent from "../components/ModalComponent";

function ProductPage() {
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
    rating: "",
  });
  const [productList, setProductList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});

  const getProductList = async (page = 1) => {
    const result = await axios.get(
      `${BASE_URL}/api/${API_BASE}/admin/products?page=${page}`
    );
    const products = result.data.products;
    const page_info = result.data.pagination;

    setProductList(products);
    setPageInfo(page_info);
  };
  useEffect(() => {
    getProductList();
  }, []);

  const deleteProduct = async (id) => {
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
  const myModal = useRef(null);

  const openModal = (product, status) => {
    if (status === "new") {
      setStatus("new");
    } else {
      setStatus("edit");
      setProductId(product.id);
    }
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
      <Pagination pageInfo={pageInfo} getProductList={getProductList} />

      {/* modal */}
      <ModalComponent
        getProductList={getProductList}
        closeModal={closeModal}
        myModal={myModal}
        templateProduct={templateProduct}
        setTemplateProduct={setTemplateProduct}
        productId={productId}
        status={status}
      />
    </>
  );
}

export default ProductPage;
