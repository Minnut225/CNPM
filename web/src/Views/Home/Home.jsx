import React, { useState, useEffect } from 'react'
import "./Home.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import config from '../../api/config.json';

const { SERVER_API } = config;

// Ảnh placeholder nếu nhà hàng chưa có ảnh
const DEFAULT_IMG = "https://t4.ftcdn.net/jpg/02/81/89/73/360_F_281897358_3rj9ZDY1OV8oI5daZ9jF8gW66q7i6n9e.jpg";

export default function Home() {

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách nhà hàng
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${SERVER_API}/api/restaurants`);
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data);
        } else {
          console.error("Lỗi khi tải danh sách nhà hàng");
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <>
      <div className='home'>

        {/* Hero banner section */}
        <Hero />

        {/* Home page content */}
        <div className='home-content container' style={{ paddingBottom: '50px' }}>
          
          <h1 className='content-title' style={{ marginTop: '30px', marginBottom: '30px' }}>
            Chọn Nhà hàng yêu thích của bạn
          </h1>

          {loading ? (
             <div className="d-flex justify-content-center">
                <Spinner animation="border" variant="warning" />
             </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {restaurants.map((res) => (
                <Col key={res.restaurantId || res.id}>
                  <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                    {/* Ảnh nhà hàng */}
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                        <Card.Img 
                            variant="top" 
                            src={res.imageUrl || DEFAULT_IMG} 
                            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                        />
                    </div>

                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start">
                          <Card.Title style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                              {res.name || res.restaurantName}
                          </Card.Title>
                          {/* Rating badge */}
                          <span className="badge bg-success">
                              <i className="bi bi-star-fill me-1"></i>
                              {res.rating || 5.0}
                          </span>
                      </div>
                      
                      <Card.Text className="text-muted small mb-3">
                        <i className="bi bi-geo-alt-fill me-1"></i>
                        {res.address || "Chưa cập nhật địa chỉ"}
                      </Card.Text>

                      {/* Nút Xem Menu - Dẫn đến trang chi tiết /restaurant/:id */}
                      <Button 
                        as={NavLink} 
                        to={`/restaurant/${res.restaurantId || res.id}`}
                        onClick={() => window.scrollTo(0, 0)}
                        className="mt-auto w-100"
                        style={{
                          backgroundColor: '#ff8c09',
                          border: 'none',
                          fontWeight: '600',
                          padding: '10px'
                        }}
                      >
                        Xem Menu & Đặt món
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {restaurants.length === 0 && !loading && (
             <div className="text-center mt-5">
                <h3>Hiện chưa có nhà hàng nào hoạt động.</h3>
             </div>
          )}
        </div>
      </div>
    </>
  )
}