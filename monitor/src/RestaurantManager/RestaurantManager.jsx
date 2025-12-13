import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import config from '../api/config.json'

const { SERVER_API } = config;

export default function RestaurantManager() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State cho Modal (Thêm/Sửa)
    const [showModal, setShowModal] = useState(false);
    const [editingRes, setEditingRes] = useState(null); // Nếu null -> Thêm mới, Ngược lại -> Sửa
    
    // Form Data
    const [formData, setFormData] = useState({
        restaurantName: '',
        address: '',
        phone: '',
        latitude: '',
        longitude: '',
        ownerId: '' // ID của User làm chủ (nếu có)
    });

    // 1. FETCH DATA
    const fetchRestaurants = async () => {
        try {
            const res = await fetch(`${SERVER_API}/api/restaurants`);
            if (res.ok) {
                const data = await res.json();
                setRestaurants(data);
            } else {
                toast.error("Không thể tải danh sách nhà hàng");
            }
        } catch (error) {
            toast.error("Lỗi kết nối Server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    // 2. XỬ LÝ SUBMIT (THÊM / SỬA)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const url = editingRes 
            ? `${SERVER_API}/api/restaurants/${editingRes.restaurantId}` 
            : `${SERVER_API}/api/restaurants`;
            
        const method = editingRes ? 'PUT' : 'POST';
        console.log(formData);
        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(editingRes ? "Cập nhật thành công!" : "Thêm nhà hàng thành công!");
                fetchRestaurants(); // Load lại list
                handleClose();
            } else {
                toast.error("Lỗi khi lưu dữ liệu");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi hệ thống");
        }
    };

    // 3. XỬ LÝ XÓA
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa nhà hàng này không?")) {
            try {
                const res = await fetch(`${SERVER_API}/api/restaurants/${id}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    toast.success("Đã xóa nhà hàng!");
                    fetchRestaurants();
                } else {
                    toast.error("Không thể xóa (Có thể do ràng buộc dữ liệu)");
                }
            } catch (error) {
                toast.error("Lỗi khi xóa");
            }
        }
    };

    // --- HELPER FUNCTIONS ---
    const handleClose = () => {
        setShowModal(false);
        setEditingRes(null);
        setFormData({ restaurantName: '', address: '', phone: '', latitude: '', longitude: '', ownerId: '' });
    };

    const handleShowAdd = () => setShowModal(true);

    const handleShowEdit = (res) => {
        setEditingRes(res);
        setFormData({
            restaurantName: res.restaurantName || res.name,
            address: res.address || '',
            phone: res.phone || '',
            latitude: res.latitude || '',
            longitude: res.longitude || '',
            ownerId: res.owner?.userId || ''
        });
        setShowModal(true);
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold">Quản Lý Nhà Hàng</h2>
                <Button variant="success" onClick={handleShowAdd}>
                    <i className="bi bi-plus-lg me-2"></i>Thêm Nhà Hàng
                </Button>
            </div>

            {loading ? (
                <div className="text-center"><Spinner animation="border" variant="primary" /></div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <Table hover bordered className="mb-0 bg-white">
                        <thead className="bg-light text-secondary">
                            <tr>
                                <th>ID</th>
                                <th>Tên Nhà Hàng</th>
                                <th>Địa Chỉ</th>
                                <th>Tọa độ (Lat, Lng)</th>
                                <th>Chủ sở hữu</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {restaurants.map((res) => (
                                <tr key={res.restaurantId}>
                                    <td>#{res.restaurantId}</td>
                                    <td className="fw-bold text-dark">{res.restaurantName || res.name}</td>
                                    <td>{res.address || "Chưa cập nhật"}</td>
                                    <td>
                                        {res.latitude && res.longitude ? (
                                            <Badge bg="info" className="text-dark">
                                                {res.latitude.toFixed(4)}, {res.longitude.toFixed(4)}
                                            </Badge>
                                        ) : (
                                            <Badge bg="secondary">Chưa có GPS</Badge>
                                        )}
                                    </td>
                                    <td>
                                        {res.owner ? (
                                            <span>
                                                <i className="bi bi-person-circle me-1"></i>
                                                {res.owner.fullName || res.owner.username}
                                            </span>
                                        ) : (
                                            <span className="text-muted fst-italic">Trống</span>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => handleShowEdit(res)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleDelete(res.restaurantId)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {restaurants.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        Chưa có nhà hàng nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* --- MODAL THÊM / SỬA --- */}
            <Modal show={showModal} onHide={handleClose} backdrop="static" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingRes ? "Cập nhật Nhà Hàng" : "Thêm Nhà Hàng Mới"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Tên Nhà Hàng <span className="text-danger">*</span></Form.Label>
                                    <Form.Control 
                                        type="text" required 
                                        placeholder="VD: Cơm Tấm Cali"
                                        value={formData.restaurantName}
                                        onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Nhập địa chỉ cụ thể"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </Form.Group>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Vĩ độ (Latitude)</Form.Label>
                                    <Form.Control 
                                        type="number" step="any"
                                        placeholder="VD: 10.762622"
                                        value={formData.latitude}
                                        onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Kinh độ (Longitude)</Form.Label>
                                    <Form.Control 
                                        type="number" step="any"
                                        placeholder="VD: 106.660172"
                                        value={formData.longitude}
                                        onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>ID Chủ sở hữu (User ID)</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Nhập ID của tài khoản Admin quán"
                                value={formData.ownerId}
                                onChange={(e) => setFormData({...formData, ownerId: e.target.value})}
                            />
                            <Form.Text className="text-muted">
                                * Để trống nếu chưa muốn gán chủ.
                            </Form.Text>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                        <Button variant="primary" type="submit">
                            {editingRes ? "Lưu thay đổi" : "Tạo mới"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}