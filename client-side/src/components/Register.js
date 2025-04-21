import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Register({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch("https://web-toy-shop-server.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        alert("Đăng ký và đăng nhập thành công!");
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
      <h3 className="text-center mb-4">Đăng ký</h3>
      <input className="form-control mb-2" placeholder="Tên người dùng" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input className="form-control mb-3" type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-primary w-100 mb-2" onClick={handleRegister}>Đăng ký</button>
      <p className="text-center">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}