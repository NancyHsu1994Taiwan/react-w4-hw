import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

function LoginPage({ setIsAuth, getProductList }) {
  const { VITE_BASE_URL: BASE_URL } = import.meta.env;

  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/admin/signin`, {
        username: user.username,
        password: user.password,
      });
      setIsAuth(true);
      const { token, expired } = res.data;
      document.cookie = `yunlinToken=${token}; expires=${new Date(
        expired
      )}; SameSite=None; Secure`;
      axios.defaults.headers.common["Authorization"] = token;
      // const result = await axios.get(
      //   `${BASE_URL}/api/${API_BASE}/admin/products`
      // );
      // const products = result.data.products;

      // setProductList(products);
      getProductList();
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <>
      <div className="container">
        <h1 className="text-center">請先登入</h1>
        <form>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="username"
              value={user.username}
              onChange={handleInput}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              value={user.password}
              onChange={handleInput}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleLogin}
          >
            login
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginPage;

LoginPage.propTypes = {
  setIsAuth: PropTypes.func.isRequired,
  getProductList: PropTypes.func.isRequired,
};
