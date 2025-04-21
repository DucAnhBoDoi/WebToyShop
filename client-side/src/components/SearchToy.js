import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import "../styles/pagination.css";

export function SearchToy() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allToys, setAllToys] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 15;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi khi lấy dữ liệu sản phẩm");
        }
        return res.json();
      })
      .then((data) => {
        setAllToys(data);
        setLoading(false);
        const savedQuery = localStorage.getItem("searchQuery");
        const savedResults = localStorage.getItem("searchResults");

        if (savedQuery && savedResults) {
          setQuery(savedQuery);
          setResults(JSON.parse(savedResults));
          setSearched(true);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (query.trim() === "") {
      alert("Vui lòng nhập tên sản phẩm!");
      return;
    }

    const filtered = allToys.filter((toy) =>
      toy.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setCurrentPage(0);
    setSearched(true);
    localStorage.setItem("searchQuery", query);
    localStorage.setItem("searchResults", JSON.stringify(filtered));
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = results.slice(offset, offset + itemsPerPage);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải dữ liệu sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <h4 className="text-center mt-5 text-danger">Lỗi: {error}</h4>
    );
  }

  return (
    <Container style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }} className="mt-5">
      <h2 className="text-center mb-4">Tìm kiếm sản phẩm theo tên</h2>

      <Form onKeyDown={handleKeyDown} className="mb-3">
        <Row className="g-2">
          <Col xs={12} sm={8}>
            <Form.Control
              type="text"
              placeholder="Nhập tên sản phẩm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Col>
          <Col xs={6} sm={2}>
            <Button variant="primary" onClick={handleSearch} className="w-100">
              Tìm kiếm
            </Button>
          </Col>
          <Col xs={6} sm={2}>
            <Button variant="secondary" onClick={() => {
              setQuery("");
              setResults([]);
              setSearched(false);
              localStorage.removeItem("searchQuery");
              localStorage.removeItem("searchResults");
            }} className="w-100">
              Làm mới kết quả
            </Button>
          </Col>
        </Row>
      </Form>

      {searched && results.length > 0 && (
        <p className="text-center text-muted">
          Đã tìm thấy {results.length} sản phẩm.
        </p>
      )}

      {results.length > 0 ? (
        <>
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
                      <strong>ID:</strong> {toy.id}<br />
                      <strong>Danh mục:</strong> {toy.category}<br />
                      <strong>Hãng:</strong> {toy.brand}<br />
                      <strong>Giá:</strong> {toy.price.toLocaleString()} VND<br />
                      <strong>Đánh giá:</strong> ⭐ {toy.rating}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={Math.ceil(results.length / itemsPerPage)}
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
      ) : (
        searched && (
          <p className="text-center text-muted">Không tìm thấy sản phẩm nào.</p>
        )
      )}
    </Container>
  );
}
