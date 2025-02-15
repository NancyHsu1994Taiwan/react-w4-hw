import PropTypes from "prop-types";

function Pagination({ pageInfo, getProductList }) {
  return (
    <div className="d-flex justify-content-center">
      <nav aria-label="Page navigation example d-flex justify-content-center">
        <ul className="pagination">
          <li className={pageInfo.has_pre ? "page-item" : "page-item disabled"}>
            <a
              className="page-link"
              onClick={() => getProductList(pageInfo.current_page - 1)}
            >
              Previous
            </a>
          </li>

          {Array.from({ length: pageInfo.total_pages }).map((page, index) => {
            return (
              <li className="page-item" key={index}>
                <a
                  className={
                    pageInfo.current_page === index + 1
                      ? "page-link active"
                      : "page-link"
                  }
                  onClick={() => getProductList(index + 1)}
                >
                  {index + 1}
                </a>
              </li>
            );
          })}

          <li
            className={pageInfo.has_next ? "page-item" : "page-item disabled"}
          >
            <a
              className="page-link"
              onClick={() => getProductList(pageInfo.current_page + 1)}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
export default Pagination;
Pagination.prototype = {
  pageInfo: PropTypes.shape({
    total_pages: PropTypes.number,
    current_page: PropTypes.number,
    has_pre: PropTypes.bool,
    has_next: PropTypes.bool,
    category: PropTypes.string,
  }),
  getProductList: PropTypes.func,
};
