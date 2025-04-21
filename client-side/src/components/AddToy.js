import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Spinner } from "react-bootstrap";

export function AddToy() {
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    price: 0,
    category: "Xe cộ",
    brand: "Lego",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //ID theo danh mục
  const getCategoryPrefix = (category) => {
    switch (category) {
      case "Xe cộ":
        return "XCO";
      case "Tàu thuyền":
        return "TAU";
      case "Vũ trụ":
        return "VTR";
      case "Đồ chơi trẻ em":
        return "TRE";
      default:
        return "";
    }
  };

  // Tạo ID tự động khi chọn danh mục
  useEffect(() => {
    const fetchLastToyId = async () => {
      const response = await fetch(`http://localhost:5000/products`);
      const products = await response.json();
      const categoryProducts = products.filter(
        (product) => product.category === newProduct.category
      );
      const lastToy = categoryProducts.pop();
      const lastIdNumber = lastToy
        ? parseInt(lastToy.id.replace(`TOY${getCategoryPrefix(newProduct.category)}`, ""), 10)
        : 0;
      const newId = `TOY${getCategoryPrefix(newProduct.category)}${String(lastIdNumber + 1).padStart(3, "0")}`;
      setNewProduct((prev) => ({ ...prev, id: newId }));
    };

    fetchLastToyId();
  }, [newProduct.category]);

  const handleCategoryChange = (e) => {
    setNewProduct({ ...newProduct, category: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddProduct = async () => {
    if (!image) {
      alert("Vui lòng chọn hình ảnh sản phẩm!");
      return;
    }

    setLoading(true);

    // Chỉ lấy tên tệp ảnh
    const imageName = image.name;

    const newToy = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      image: imageName, // Chỉ lưu tên tệp ảnh
    };

    try {
      const response = await fetch("http://localhost:5000/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newToy),
      });

      if (response.ok) {
        alert("Sản phẩm mới đã được thêm!");
        navigate(`/toy/${newProduct.id}`);
      } else {
        const errorData = await response.json();
        alert(`Lỗi khi thêm sản phẩm: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Lỗi kết nối đến server: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <div className="mb-4 p-3 border rounded bg-light">
        <h5 className="text-center mb-4">Nhập thông tin sản phẩm mới</h5>
        <div className="d-flex flex-column">

          {/* ID sản phẩm */}
          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="id" className="mr-3" style={{ width: "120px", fontWeight: "bold" }}>ID sản phẩm</label>
            <input id="id" className="form-control" type="text" value={newProduct.id} readOnly />
          </div>

          {/* Tên sản phẩm */}
          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="name" className="mr-3" style={{ width: "120px", fontWeight: "bold" }}>Tên sản phẩm</label>
            <input
              id="name"
              className="form-control"
              placeholder="Tên sản phẩm"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
          </div>

          {/* Giá */}
          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="price" className="mr-3" style={{ width: "120px", fontWeight: "bold" }}>Giá</label>
            <input
              id="price"
              className="form-control"
              type="number"
              placeholder="Giá"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          {/* Danh mục */}
          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="category" className="mr-3" style={{ width: "120px", fontWeight: "bold" }}>Danh mục</label>
            <select
              id="category"
              className="form-control"
              value={newProduct.category}
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
            <label htmlFor="brand" className="mr-3" style={{ width: "120px", fontWeight: "bold" }}>Thương hiệu</label>
            <select
              id="brand"
              className="form-control"
              value={newProduct.brand}
              onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
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
            <label htmlFor="image" className="mr-3" style={{ width: "120px", fontWeight: "bold" }}>Hình ảnh</label>
            <input
              id="image"
              className="form-control"
              type="file"
              onChange={handleImageChange}
              required
            />
          </div>

          {/* Nút thêm */}
          <div className="d-flex justify-content-center">
            <Button variant="success" onClick={handleAddProduct}>Thêm sản phẩm</Button>
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
