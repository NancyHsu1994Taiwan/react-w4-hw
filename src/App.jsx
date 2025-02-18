import { useState } from "react";

import LoginPage from "./pages/LoginPgae";
import ProductPage from "./pages/ProductPage";

function App() {
  // 登入相關 -----------------------------
  const [isAuth, setIsAuth] = useState(false);

  // 產品相關 --------------------------------
  // const [productList, setProductList] = useState([]);
  // const [oneProduct, setOneProduct] = useState({});

  return (
    <>
      {isAuth ? (
        <>
          <ProductPage />
        </>
      ) : (
        <LoginPage setIsAuth={setIsAuth} />
      )}
    </>
  );
}

export default App;
