import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import "../styles/pagination.css";
import { Filter } from "../components/Filter";

export function ToyListView() {
  const navigate = useNavigate();
  const itemsPerPage = 15;

  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [sortOrder, setSortOrder] = useState("");

  // Fetch dữ liệu từ server
  useEffect(() => {
    fetch("https://web-toy-shop-server.onrender.com/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi khi lấy dữ liệu từ server");
        }
        return res.json();
      })
      .then((data) => {
        setToys(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Lọc
  const filteredToys = toys.filter((toy) =>
    categoryFilter === "Tất cả" || toy.category === categoryFilter
  );

  // Sắp xếp
  const sortedToys = [...filteredToys].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0;
  });

  // Phân trang
  const offset = currentPage * itemsPerPage;
  const currentItems = sortedToys.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(sortedToys.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(0);
  };

  return (
    <Container style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
      <h2 className="mb-4 text-center">Danh sách sản phẩm</h2>

      {/* Loading và lỗi */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Đang tải sản phẩm...</p>
        </div>
      )}
      {error && <Alert variant="danger">Lỗi: {error}</Alert>}

      {!loading && !error && (
        <>
          {/* Bộ lọc */}
          <Filter
            categoryFilter={categoryFilter}
            sortOrder={sortOrder}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
          />

          {/* Danh sách sản phẩm */}
          <Row xs={1} sm={2} md={3} lg={5} className="g-4">
            {currentItems.map((toy) => (
              <Col key={toy.id}>
                <Card
                  className="h-100 shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/toy/${toy.id}`)}
                >
                  <Card.Img
                    variant="top"
                    src={require(`../assets/images/${toy.image}`)}
                    alt={toy.name}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{toy.name}</Card.Title>
                    <Card.Text>
                      <strong>ID:</strong> {toy.id}
                      <br />
                      <strong>Danh mục:</strong> {toy.category}
                      <br />
                      <strong>Thương hiệu:</strong> {toy.brand}
                      <br />
                      <strong>Giá:</strong> {toy.price.toLocaleString()} VND
                      <br />
                      <strong>Đánh giá:</strong> ⭐ {toy.rating}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Phân trang */}
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName="pagination justify-content-center mt-4"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeClassName="active"
          />
        </>
      )}
    </Container>
  );
}
