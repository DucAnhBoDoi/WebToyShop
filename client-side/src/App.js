import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { ToyListView } from "./components/ToyListView";
import { ToyDetail } from "./components/ToyDetail";
import { SearchToy } from "./components/SearchToy";
import { AddToy } from "./components/AddToy";
import { UpdateToy } from "./components/UpdateToy";
import { DeleteToy } from "./components/DeleteToy";
import { Filter } from "./components/Filter";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, Card, Row, Col, Button } from 'react-bootstrap';

function Header({ token, setToken }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    window.location.href = "/login";
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Toy Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {token && (
              <>
                <Nav.Link as={Link} to="/list">Sản phẩm</Nav.Link>
                <Nav.Link as={Link} to="/search">Tìm kiếm</Nav.Link>
                <Nav.Link as={Link} to="/add">Thêm sản phẩm</Nav.Link>
              </>
            )}
          </Nav>
          {token && (
            <Button variant="outline-light" onClick={handleLogout}>Đăng xuất</Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function PrivateRoute({ token, children }) {
  return token ? children : <Navigate to="/login" />;
}

function HomePage({ token }) {
  const location = useLocation();
  if (location.pathname !== "/" || !token) return null;

  return (
    <Container>
      <h2 className="text-center mb-4">Chào mừng đến với Toy Shop</h2>
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
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  return (
    <Router>
      <Header token={token} setToken={setToken} />
      <HomePage token={token} />
      <Container className="mt-4">
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route path="/" element={<PrivateRoute token={token}><div></div></PrivateRoute>} />
          <Route path="/list" element={<PrivateRoute token={token}><ToyListView /></PrivateRoute>} />
          <Route path="/toy/:id" element={<PrivateRoute token={token}><ToyDetail /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute token={token}><SearchToy /></PrivateRoute>} />
          <Route path="/add" element={<PrivateRoute token={token}><AddToy /></PrivateRoute>} />
          <Route path="/update/:id" element={<PrivateRoute token={token}><UpdateToy /></PrivateRoute>} />
          <Route path="/delete" element={<PrivateRoute token={token}><DeleteToy /></PrivateRoute>} />
          <Route path="/filter" element={<PrivateRoute token={token}><Filter /></PrivateRoute>} />
        </Routes>
      </Container>
    </Router>
  );
}