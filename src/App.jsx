import { useState } from "react";
import LoginPage from "./pages/LoginPgae";
import ProductPage from "./pages/ProductPage";

function App() {
  // 登入相關 -----------------------------
  const [isAuth, setIsAuth] = useState(false);

  // 產品相關 --------------------------------
  // const [productList, setProductList] = useState([]);

  // const getProductList = async () => {
  //   const result = await axios.get(
  //     `${BASE_URL}/api/${API_BASE}/admin/products`
  //   );
  //   const products = result.data.products;

  //   setProductList(products);
  // };

  return <>{isAuth ? <ProductPage /> : <LoginPage setIsAuth={setIsAuth} />}</>;
}

export default App;
