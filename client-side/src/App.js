import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { ToyListView } from "./components/ToyListView";
import { ToyDetail } from "./components/ToyDetail";
import { SearchToy } from "./components/SearchToy";
import { AddToy } from "./components/AddToy";
import { UpdateToy } from "./components/UpdateToy";
import { DeleteToy } from "./components/DeleteToy";
import { Filter } from "./components/Filter";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, Card, Row, Col, Button } from 'react-bootstrap';

function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Toy Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/list">Sản phẩm</Nav.Link>
            <Nav.Link as={Link} to="/search">Tìm kiếm</Nav.Link>
            <Nav.Link as={Link} to="/add">Thêm sản phẩm</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function HomePage() {
  const location = useLocation();
  if (location.pathname !== "/") return null;

  return (
    <Container>
      <h2 className="text-center mb-4">Chào mừng đến với Toy Shop</h2>
      <p className="text-center mb-5">Khám phá hàng trăm món đồ chơi thú vị, thông minh và đầy màu sắc !</p>

      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 shadow">
            <Card.Body>
              <Card.Title>Xem sản phẩm</Card.Title>
              <Card.Text>Xem danh sách tất cả đồ chơi có trong cửa hàng.</Card.Text>
              <Button as={Link} to="/list" variant="primary">Xem ngay</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow">
            <Card.Body>
              <Card.Title>Tìm kiếm</Card.Title>
              <Card.Text>Tìm đồ chơi trong cửa hàng.</Card.Text>
              <Button as={Link} to="/search" variant="success">Tìm ngay</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow">
            <Card.Body>
              <Card.Title>Thêm sản phẩm</Card.Title>
              <Card.Text>Thêm món đồ chơi mới trong cửa hàng.</Card.Text>
              <Button as={Link} to="/add" variant="warning">Thêm ngay</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export function App() {
  return (
    <Router>
      <Header />
      <HomePage />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={null} />
          <Route path="/list" element={<ToyListView />} />
          <Route path="/toy/:id" element={<ToyDetail />} />
          <Route path="/search" element={<SearchToy />} />
          <Route path="/add" element={<AddToy />} />
          <Route path="/update/:id" element={<UpdateToy />} />
          <Route path="/delete" element={<DeleteToy />} />
          <Route path="/filter" element={<Filter />} />
        </Routes>
      </Container>
    </Router>
  );
}
