import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner } from "react-bootstrap";

export function UpdateToy() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [toy, setToy] = useState(null);
  const [updatedToy, setUpdatedToy] = useState({
    name: "",
    price: 0,
    category: "Xe cộ",
    brand: "Lego",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchToy = async () => {
      const response = await fetch(`http://localhost:5000/products`);
      const products = await response.json();
      const currentToy = products.find((t) => t.id === id);
      
      if (currentToy) {
        setToy(currentToy);
        setUpdatedToy({
          name: currentToy.name,
          price: currentToy.price,
          category: currentToy.category,
          brand: currentToy.brand,
        });
      } else {
        navigate("/list"); 
      }
    };

    fetchToy();
  }, [id, navigate]);

  const handleCategoryChange = (e) => {
    setUpdatedToy({ ...updatedToy, category: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpdateProduct = async () => {
    if (!updatedToy.name || !updatedToy.price) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm!");
      return;
    }
  
    setLoading(true);
  
    const imageName = image ? image.name : toy.image; 
  
    const updatedProduct = {
      ...updatedToy,
      price: parseFloat(updatedToy.price),
      image: imageName,  
    };
  
    try {
      const response = await fetch(`http://localhost:5000/product/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
  
      if (response.ok) {
        alert("Cập nhật sản phẩm thành công!");
        navigate(`/toy/${id}`);
      } else {
        const errorData = await response.json();
        alert(`Lỗi khi cập nhật sản phẩm: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Lỗi kết nối đến server: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };  

  if (!toy) return <div>Loading...</div>;

  return (
    <Container className="mt-4">
      <div className="mb-4 p-3 border rounded bg-light">
        <h5 className="text-center mb-4">Cập nhật thông tin sản phẩm</h5>
        <div className="d-flex flex-column">
          {/* Tên sản phẩm */}
          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="name" className="mr-3" style={{ width: "120px", fontWeight: "bold" }}>
              Tên sản phẩm
            </label>
            <input
              id="name"
              className="form-control"
              placeholder="Tên sản phẩm"
              value={updatedToy.name}
              onChange={(e) => setUpdatedToy({ ...updatedToy, name: e.target.value })}
              required
            />
          </div>

          {/* Giá */}
          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="price" className="mr-3" style={{ width: "120px", fontWeight: "bold" }}>
              Giá
            </label>
            <input
              id="price"
              className="form-control"
              type="number"
              placeholder="Giá"
              value={updatedToy.price}
              onChange={(e) => setUpdatedToy({ ...updatedToy, price: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          {/* Danh mục */}
          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="category" className="mr-3" style={{ width: "120px", fontWeight: "bold" }}>
              Danh mục
            </label>
            <select
              id="category"
              className="form-control"
              value={updatedToy.category}
              onChange={handleCategoryChange}
            >
              <option>Xe cộ</option>
              <option>Tàu thuyền</option>
              <option>Đồ chơi trẻ em</option>
              <option>Vũ trụ</option>
            </select>
          </div>

          {/* Thương hiệu */}
          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="brand" className="mr-3" style={{ width: "120px", fontWeight: "bold" }}>
              Thương hiệu
            </label>
            <select
              id="brand"
              className="form-control"
              value={updatedToy.brand}
              onChange={(e) => setUpdatedToy({ ...updatedToy, brand: e.target.value })}
            >
              <option>Lego</option>
              <option>Hot Wheels</option>
              <option>McLaren</option>
              <option>Porsche</option>
              <option>NASA</option>
              <option>Endurance</option>
              <option>Hasbro</option>
              <option>Steiff</option>
              <option>Jurassic</option>
            </select>
          </div>

          {/* Hình ảnh */}
          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="image" className="mr-3" style={{ width: "120px", fontWeight: "bold" }}>
              Hình ảnh
            </label>
            <input
              id="image"
              className="form-control"
              type="file"
              onChange={handleImageChange}
            />
          </div>

          {/* Nút Cập nhật */}
          <div className="d-flex justify-content-center">
            <Button variant="primary" onClick={handleUpdateProduct}>Cập nhật sản phẩm</Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
    </Container>
  );
}
