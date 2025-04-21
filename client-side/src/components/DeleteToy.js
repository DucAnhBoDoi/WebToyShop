import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export function DeleteToy({ toyId }) {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm(`Bạn có muốn xoá sản phẩm ${toyId} hay không?`)) {
      fetch(`https://web-toy-shop-server.onrender.com/product/delete/${toyId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          navigate("/list");
        })
        .catch((err) => {
          alert("Lỗi khi xóa sản phẩm: " + err.message);
        });
    }
  };

  return (
    <Button
      variant="danger"
      style={{ flex: 1, marginLeft: '5px' }}
      onClick={handleDelete}
    >
      Xóa
    </Button>
  );
}
