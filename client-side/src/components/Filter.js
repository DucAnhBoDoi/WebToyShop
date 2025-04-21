// src/components/Filter.js
import React from "react";
import { Row, Col, Form } from "react-bootstrap";

export function Filter({ categoryFilter, sortOrder, onCategoryChange, onSortChange }) {
  return (
    <Row className="mb-4">
      <Col md={6}>
        <Form.Select value={categoryFilter} onChange={onCategoryChange}>
          <option value="Tất cả">Tất cả danh mục</option>
          <option value="Xe cộ">Xe cộ</option>
          <option value="Tàu thuyền">Tàu thuyền</option>
          <option value="Đồ chơi trẻ em">Đồ chơi trẻ em</option>
          <option value="Vũ trụ">Vũ trụ</option>
        </Form.Select>
      </Col>
      <Col md={6}>
        <Form.Select value={sortOrder} onChange={onSortChange}>
          <option value="">Sắp xếp theo giá</option>
          <option value="asc">Giá từ thấp đến cao</option>
          <option value="desc">Giá từ cao đến thấp</option>
        </Form.Select>
      </Col>
    </Row>
  );
}
