import { useState } from "react";
import axios from "axios";
import LoginPage from "./pages/LoginPgae";
import ProductPage from "./pages/ProductPage";

function App() {
  const { VITE_BASE_URL: BASE_URL, VITE_API_BASE: API_BASE } = import.meta.env;
  // 登入相關 -----------------------------
  const [isAuth, setIsAuth] = useState(false);

  // 產品相關 --------------------------------
  const [productList, setProductList] = useState([]);

  const getProductList = async () => {
    const result = await axios.get(
      `${BASE_URL}/api/${API_BASE}/admin/products`
    );
    const products = result.data.products;

    setProductList(products);
  };

  return (
    <>
      {isAuth ? (
        <ProductPage
          getProductList={getProductList}
          productList={productList}
        />
      ) : (
        <LoginPage setIsAuth={setIsAuth} getProductList={getProductList} />
      )}
    </>
  );
}

export default App;
