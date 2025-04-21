import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Row, Col, Container, Spinner, Alert } from "react-bootstrap";
import { DeleteToy } from "../components/DeleteToy"; 

export function ToyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toy, setToy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://web-toy-shop-server.onrender.com/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi khi lấy sản phẩm");
        }
        return res.json();
      })
      .then((data) => {
        const found = data.find((item) => item.id === id);
        setToy(found);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = () => {
    navigate(`/update/${toy.id}`);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Chi tiết sản phẩm</h2>

      {/* Loading */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Đang tải chi tiết sản phẩm...</p>
        </div>
      )}

      {/* Lỗi */}
      {error && (
        <Alert variant="danger" className="text-center">
          Lỗi: {error}
        </Alert>
      )}

      {/* Không tìm thấy sản phẩm */}
      {!loading && !error && !toy && (
        <Alert variant="warning" className="text-center">
          Không tìm thấy sản phẩm!
        </Alert>
      )}

      {/* Thông tin sản phẩm */}
      {!loading && !error && toy && (
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="shadow-sm">
              <Card.Img
                variant="top"
                src={require(`../assets/images/${toy.image}`)}
                alt={toy.name}
                style={{ height: "240px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{toy.name}</Card.Title>
                <Card.Text>
                  <strong>ID:</strong> {toy.id}<br />
                  <strong>Danh mục:</strong> {toy.category}<br />
                  <strong>Thương hiệu:</strong> {toy.brand}<br />
                  <strong>Giá:</strong> {toy.price.toLocaleString()} VND<br />
                  <strong>Đánh giá:</strong> ⭐ {toy.rating}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="primary"
                    style={{ flex: 1, marginRight: '5px' }}
                    onClick={handleUpdate}
                  >
                    Cập nhật
                  </Button>

                  <DeleteToy toyId={toy.id} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
