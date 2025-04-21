import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("https://web-toy-shop-server.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setToken(data.token); // cập nhật state để Navbar hiện
        alert("Đăng nhập thành công!");
        navigate("/");
      } else {
        alert("Lỗi đã xảy ra: " + data.error);
      }
    } catch (err) {
      alert("Lỗi hệ thống: " + err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Đăng nhập</h3>
      <input className="form-control mb-2" placeholder="Tên người dùng" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input className="form-control mb-3" type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-success w-100 mb-2" onClick={handleLogin}>Đăng nhập</button>
      <p className="text-center">
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </div>
  );
}