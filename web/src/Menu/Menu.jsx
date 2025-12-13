import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Alert, Container, Modal, Button, Row, Col, Form} from 'react-bootstrap'; // Import thêm Alert
import { motion, AnimatePresence } from "framer-motion";
import My_Product_Card from './components/Product_Card/My_Product_Card';
import './Menu.css';
import config from '../api/config.json'

const { SERVER_API } = config;

// ... (Giữ nguyên phần import Icons) ...
import spaghettiIcon from '../assets/icons/spaghetti.png';
import fastFoodIcon from '../assets/icons/fast-food.png';
import friedChicken from '../assets/icons/fried-chicken.png';
import sodaIcon from '../assets/icons/soda.png';

function Menu() {
    const { id } = useParams(); 
    const [products, setProducts] = useState([]);
    const [restaurantInfo, setRestaurantInfo] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Thêm state lỗi

    const [category, setCategory] = useState('');
    const [filterLabel, setFilterLabel] = useState('Tất cả món ăn');

    const filters = [
        { icon: fastFoodIcon, category: "", label: "Tất cả món ăn" },
        { icon: friedChicken, category: "Fried_Chicken", label: "Gà Giòn" },
        { icon: spaghettiIcon, category: "Spaghetti", label: "Mì Ý" },
        { icon: sodaIcon, category: "Drink", label: "Nước / tráng miệng" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log("Bắt đầu gọi API cho Restaurant ID:", id);

                // Check 1: Nếu id undefined -> Lỗi Router
                if (!id) throw new Error("Không tìm thấy ID nhà hàng trên URL!");

                const [resRest, resMenu] = await Promise.all([
                    fetch(`${SERVER_API}/api/restaurants/${id}`),
                    fetch(`${SERVER_API}/api/restaurants/${id}/products`)
                ]);

                // Check 2: Lỗi HTTP
                if (!resRest.ok) throw new Error(`Lỗi tải thông tin quán: ${resRest.status}`);
                if (!resMenu.ok) throw new Error(`Lỗi tải menu: ${resMenu.status}`);

                const restaurantData = await resRest.json();
                const menuData = await resMenu.json();

                console.log("Dữ liệu quán:", restaurantData);
                console.log("Dữ liệu menu:", menuData);

                setRestaurantInfo(restaurantData);
                setProducts(menuData);

            } catch (err) {
                console.error("LỖI:", err);
                setError(err.message); // Hiển thị lỗi ra màn hình
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" variant="danger" />
        </div>
    );

    // HIỂN THỊ LỖI NẾU CÓ
    if (error) return (
        <Container className="mt-5">
            <Alert variant="danger">
                <Alert.Heading>Có lỗi xảy ra!</Alert.Heading>
                <p>{error}</p>
                <hr />
                <p className="mb-0">
                    Hãy kiểm tra lại: 
                    1. Server Spring Boot đã chạy chưa? <br/>
                    2. Đã thêm @CrossOrigin chưa? <br/>
                    3. Đường dẫn URL có đúng /restaurant/{id} không?
                </p>
            </Alert>
        </Container>
    );

    return (
        <div className='menu container' style={{ paddingBlock: '100px', textAlign: 'center' }}>
            
            {restaurantInfo && (
                <div className="mb-5 text-start border-bottom pb-4">
                    <h1 style={{ color: '#b42100', fontWeight: 'bold', paddingBlock: '3rem' }}>{restaurantInfo.name || restaurantInfo.restaurantName}</h1>
                    <p>{restaurantInfo.address}</p>
                </div>
            )}

            {/* Filter Section
            <div className='menu-filter'>
                {filters.map((filter, index) => (
                    <div className='filter-button' key={index} onClick={() => { setCategory(filter.category); setFilterLabel(filter.label); }}>
                        <img className={`filter-icon ${category === filter.category ? 'active' : ''}`} src={filter.icon} alt={filter.label} />
                        <h4>{filter.label}</h4>
                    </div>
                ))}
            </div> */}

            <h2 className="mt-4">{filterLabel}</h2>

            <div className='menu-wrapper row mt-4'>
                <Row xs={2} md={3} lg={4} xl={5} className="g-2">
                {products && products.length > 0 ? (
                    products
                    .filter(food => {
                        // Logic filter an toàn hơn (tránh lỗi null)
                        if (!category) return true;
                        // Kiểm tra nếu category là object (Spring Boot trả về) hay string
                        const foodCat = food.category?.categoryName || food.category;
                        return foodCat === category;
                    })
                    .map((food) => (
                        <div className="col-md-4 mb-4" key={food.productId}>
                            {/* Truyền food vào Card */}
                            <My_Product_Card food={food} restaurantId={id} />
                        </div>
                    ))
                ) : (
                    <p>Không có món ăn nào.</p>
                )}
                </Row>
            </div>
        </div>
    )
}

export default Menu;