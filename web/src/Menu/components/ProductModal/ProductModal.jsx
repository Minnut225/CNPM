import React, { useState, useEffect, useContext } from 'react'
import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import './ProductModal.css'
import { CartContext } from '../../../context/CartContext';
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from '../../../context/AuthenticationContext';

/* Notify Message */
const notifyMessage = (foodName, quantity) => (
    <div>
        <div>
            Đã thêm <span style={{ color: '#00b700ff' }}>{quantity} phần</span> <span style={{ color: '#ff8c09' }}>{foodName}</span> vào giỏ hàng
        </div>
        <Button as={NavLink} to="/cart"
            style={{ marginTop: '0.7rem' }}
            onClick={() => window.scrollTo(0, 0)}
        >Đến giỏ hảng</Button>
    </div>
);

/* Notify when add to cart success */
const addToCartNotify = (food, quantity) => {
    toast.success(notifyMessage(food.name, quantity), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
};

// 1. Thêm tham số restaurantId vào props
function ProductModal({ show, handleCloseModal, food, restaurantId }) {

    const { auth } = useContext(AuthContext)

    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(CartContext);

    const handleAdd = async () => {
        if (auth.userId !== '') {
            // 2. Truyền thêm restaurantId vào hàm addToCart
            // Context sẽ dùng ID này để check xem có trùng quán với giỏ hàng hiện tại không
            addToCart(food, quantity, restaurantId); 
            
            addToCartNotify(food, quantity);
            
            // (Tùy chọn) Đóng modal sau khi thêm thành công
            handleCloseModal(); 
        }
        else {
            toast.warning('Hãy đăng nhập vào tài khoản để có thể đặt hàng nhé!')
        }
    };

    // to reset quantity to 1 when closing modal
    useEffect(() => {
        if (!show) {
            setQuantity(1);
        }
    }, [show]);

    return (
        <Modal
            show={show}
            onHide={handleCloseModal}
            centered
            backdrop={true}
            keyboard={false}
            scrollable
            size="xl"
        >
            <Row>
                <Col md={6}>
                    <img className='productModal-img'
                        src={`/${food.imageUrl}`}
                        alt={food.productName}
                    />
                </Col>
                <Col md={6} className='modal-infomation'>
                    <Modal.Header closeButton>
                        <Modal.Title
                            style={{ color: "#b40600ff", fontSize: "3.5rem" }}>
                            {food.name || food.productName} {/* Support cả 2 tên biến */}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{ paddingBlock: "0" }}>
                        <span
                            className='price-label'
                            style={{ fontSize: "1.8rem" }}>
                            Giá bán: </span>
                        <span
                            className='item-price'
                            style={{ fontSize: "3rem", fontWeight: "bold", color: "#ff8c09" }}>
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(food.price)}
                        </span>
                    </Modal.Body>
                    <Modal.Body>
                        {food.description}
                    </Modal.Body>

                    <Modal.Body style={{ paddingBlock: "0rem" }}>
                        <Form.Group controlId="formQuantity">
                            <Form.Label style={{ color: "#d87300ff" }}>Số lượng:</Form.Label>
                            <div
                                className='set-quantity-zone'
                                style={{ display: "flex", alignItems: "center" }}>
                                <Button
                                    style={{ background: "#ff8c09", border: "1px solid #ff8c09", width: "3rem" }}
                                    size='md'
                                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                >
                                    -
                                </Button>
                                <Form.Control
                                    className='quantity-txtbox'
                                    type="text"
                                    readOnly
                                    value={quantity}
                                    style={{ fontSize: "large", textAlign: "center" }}
                                />
                                <Button
                                    style={{ background: "#ff8c09", border: "1px solid #ff8c09", width: "3rem" }}
                                    size='md'
                                    onClick={() => setQuantity((prev) => prev + 1)}
                                >
                                    +
                                </Button>
                            </div>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            onClick={handleAdd}
                            style={{ background: "#ff8c09", border: "1px solid #ff8c09", fontSize: "larger" }}>
                            Thêm vào giỏ hàng
                        </Button>
                    </Modal.Footer>
                </Col>
            </Row>
        </Modal>
    )
}

export default ProductModal