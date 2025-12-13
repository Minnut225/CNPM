import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

import config from '../api/config.json'

const { SERVER_API } = config;

// Đăng ký các thành phần Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

export default function TotalRevenueManager() {
    const today = new Date().toISOString().slice(0, 10);
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);

    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(today);
    const [selectedResId, setSelectedResId] = useState('all');
    const [restaurants, setRestaurants] = useState([]);

    const [stats, setStats] = useState(null);
    const [restaurantContribution, setRestaurantContribution] = useState([]);
    const [multiLineData, setMultiLineData] = useState(null); 
    const [loading, setLoading] = useState(false);

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

    // Tạo màu sắc khác biệt cho từng đường
    const getLineColor = (index) => {
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', 
            '#C9CBCF', '#E7E9ED', '#767676', '#33CC33'
        ];
        return colors[index % colors.length];
    };

    // 1. FETCH DANH SÁCH NHÀ HÀNG
    const fetchRestaurantList = async () => {
        try {
            const res = await fetch(`${SERVER_API}/api/restaurants`);
            if (res.ok) {
                const data = await res.json();
                setRestaurants(data);
            }
        } catch (error) {
            console.error("Lỗi tải danh sách nhà hàng:", error);
        }
    };

    // 2. LOGIC QUAN TRỌNG: FETCH ORDERS VÀ XỬ LÝ ĐA ĐƯỜNG
    const fetchOrdersAndProcessMultiLine = async (resList) => {
        if (!resList || resList.length === 0) return null;
        
        console.log(`[DEBUG] Đang lấy đơn hàng của ${resList.length} quán để vẽ biểu đồ đường...`);
        
        // A. Fetch song song
        const promises = resList.map(async (res) => {
            const query = `restaurantId=${res.restaurantId}&start=${startDate}&end=${endDate}`; 
            const url = `${SERVER_API}/api/orders?${query}`; 

            try {
                const response = await fetch(url);
                const orders = response.ok ? await response.json() : [];
                return {
                    id: res.restaurantId,
                    name: res.restaurantName || res.name,
                    orders: Array.isArray(orders) ? orders : []
                };
            } catch (e) {
                return { id: res.restaurantId, name: res.name, orders: [] };
            }
        });

        const results = await Promise.all(promises);

        // B. Tạo danh sách TẤT CẢ các ngày có đơn hàng (Master Date List)
        const allDateSet = new Set();
        const restaurantDataMap = new Map(); 

        results.forEach(resData => {
            const dailyRevenue = {}; 

            resData.orders.forEach(order => {
                // 1. Lọc đơn thành công
                if (order.status !== 'Completed' && order.status !== 'Delivered') return;

                // --- SỬA LỖI QUAN TRỌNG: LỌC ID ---
                // Kiểm tra xem đơn hàng này có THỰC SỰ thuộc về nhà hàng đang xét không
                // (Phòng trường hợp API trả về tất cả đơn hàng bất chấp tham số lọc)
                const orderResId = order.restaurant?.restaurantId || order.restaurantId;
                
                // Chuyển về String để so sánh an toàn (tránh lỗi 1 !== "1")
                if (orderResId && String(orderResId) !== String(resData.id)) {
                    return; // Bỏ qua nếu đơn này không phải của quán này
                }
                // ----------------------------------

                const dateStr = order.orderDate ? order.orderDate.substring(0, 10) : (order.createdAt ? order.createdAt.substring(0, 10) : '');
                if (!dateStr) return;

                allDateSet.add(dateStr); 

                // Cộng dồn doanh thu (Chia 1.1 giả định VAT 10% nằm trong totalPrice)
                const revenue = (order.totalPrice || 0) / 1.1;
                dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + revenue;
            });

            restaurantDataMap.set(resData.id, dailyRevenue);
        });

        // C. Sắp xếp danh sách ngày (Trục X)
        const sortedDates = Array.from(allDateSet).sort((a, b) => new Date(a) - new Date(b));

        if (sortedDates.length === 0) return null;

        // D. Tạo Datasets
        const datasets = results.map((resData, index) => {
            const dailyRevenue = restaurantDataMap.get(resData.id) || {};
            
            // Map dữ liệu vào trục X
            const dataPoints = sortedDates.map(date => dailyRevenue[date] || 0);

            // Kiểm tra: Nếu quán này tổng doanh thu = 0 thì không vẽ đường (đỡ rối)
            const totalRevenue = dataPoints.reduce((a, b) => a + b, 0);
            if (totalRevenue === 0) return null; 

            return {
                label: resData.name,
                data: dataPoints,
                borderColor: getLineColor(index),
                backgroundColor: getLineColor(index),
                borderWidth: 2,
                tension: 0.3, 
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: false
            };
        }).filter(ds => ds !== null); 

        console.log(`[DEBUG] Vẽ biểu đồ đường với ${datasets.length} đường.`);
        return { labels: sortedDates, datasets };
    };

    // 3. Logic Fetch Contribution (Cột ngang)
    const fetchContributionData = async (resList) => {
        const promises = resList.map(async (res) => {
            try {
                const url = `${SERVER_API}/api/stats/revenue?restaurantId=${res.restaurantId}&start=${startDate}&end=${endDate}`;
                const response = await fetch(url);
                if (!response.ok) return null;
                const data = await response.json();
                const revenue = data.totalRevenueBeforeTax || (data.summary?.totalRevenueBeforeTax) || 0;
                return revenue > 0 ? { restaurantName: res.restaurantName || res.name, totalRevenueBeforeTax: revenue } : null;
            } catch { return null; }
        });
        const results = await Promise.all(promises);
        return results.filter(r => r !== null);
    };

    // 4. MAIN FETCH
    const fetchRevenue = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setStats(null);
        setRestaurantContribution([]); 
        setMultiLineData(null);

        let queryString = `start=${startDate}&end=${endDate}`;
        const isTotalRequest = selectedResId === 'all';
        queryString += isTotalRequest ? `&restaurantId=0` : `&restaurantId=${selectedResId}`;

        try {
            // A. Fetch Thẻ Tổng Hợp
            const response = await fetch(`${SERVER_API}/api/stats/revenue?${queryString}`);
            if (response.ok) {
                const data = await response.json();
                setStats(data.totalRevenueBeforeTax !== undefined ? data : data.summary);
                
                // B. Fetch Dữ Liệu Biểu Đồ (FE Only Logic)
                let targetRestaurants = [];
                if (isTotalRequest) {
                    targetRestaurants = restaurants;
                    // Lấy dữ liệu cột ngang
                    const contribution = await fetchContributionData(restaurants);
                    setRestaurantContribution(contribution);
                } else {
                    targetRestaurants = restaurants.filter(r => r.restaurantId == selectedResId);
                }

                // C. Lấy dữ liệu Biểu đồ Đa Đường (Line Chart)
                // Luôn gọi hàm này để tự tính toán từ Orders (vì API Stats thiếu dailyData)
                if (targetRestaurants.length > 0) {
                    const multiLine = await fetchOrdersAndProcessMultiLine(targetRestaurants);
                    setMultiLineData(multiLine);
                }

            } else {
                toast.error("Lỗi tải thống kê.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi kết nối.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurantList();
    }, []);

    useEffect(() => {
        if (restaurants.length > 0) fetchRevenue();
    }, [restaurants]); // Chỉ gọi lại khi danh sách nhà hàng đã load xong


    // --- OPTIONS BIỂU ĐỒ ---
    const multiLineOptions = {
        responsive: true,
        interaction: {
            mode: 'index', // Hiển thị tooltip của tất cả các đường tại điểm đó
            intersect: false,
        },
        plugins: {
            title: { display: true, text: 'Xu Hướng Doanh Thu Các Nhà Hàng' },
            legend: { position: 'bottom' },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw)}`
                }
            }
        },
        scales: {
            y: { 
                title: { display: true, text: 'Doanh Thu (VND)' },
                beginAtZero: true 
            }
        }
    };

    const contributionData = useMemo(() => {
        if (restaurantContribution.length === 0) return null;
        const sorted = [...restaurantContribution].sort((a, b) => b.totalRevenueBeforeTax - a.totalRevenueBeforeTax);
        return {
            labels: sorted.map(i => i.restaurantName),
            datasets: [{
                label: 'Tổng Doanh Thu',
                data: sorted.map(i => i.totalRevenueBeforeTax),
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }]
        };
    }, [restaurantContribution]);

    const pieData = useMemo(() => {
        if (!stats) return null;
        return {
            labels: ['Doanh thu Thuần', 'Thuế VAT'],
            datasets: [{
                data: [stats.totalRevenueBeforeTax, stats.totalTax],
                backgroundColor: ['#36A2EB', '#FF6384'],
            }]
        };
    }, [stats]);

    return (
        <Container className="mt-5">
            <h2 className="text-primary fw-bold mb-4">📊 Báo Cáo Doanh Thu Tổng Hợp</h2>
            
            <Card className="p-4 shadow-sm mb-4">
                <Form onSubmit={fetchRevenue}>
                    <Row className="g-3 align-items-end">
                        <Col md={3}>
                            <Form.Label className="fw-bold">Chọn Nhà Hàng:</Form.Label>
                            <Form.Select value={selectedResId} onChange={(e) => setSelectedResId(e.target.value)}>
                                <option value="all">-- TẤT CẢ NHÀ HÀNG --</option>
                                {restaurants.map(res => <option key={res.restaurantId} value={res.restaurantId}>{res.restaurantName || res.name}</option>)}
                            </Form.Select>
                        </Col>
                        <Col md={3}><Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></Col>
                        <Col md={3}><Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></Col>
                        <Col md={3}><Button type="submit" variant="success" className="w-100" disabled={loading}>{loading ? <Spinner size="sm"/> : "Xem Thống Kê"}</Button></Col>
                    </Row>
                </Form>
            </Card>

            {!loading && stats ? (
                <>
                    <Row className="g-4 mb-5">
                        <Col md={4}><Card className="text-white bg-primary h-100 shadow"><Card.Body className="text-center"><h6>TỔNG DOANH THU (SAU THUẾ)</h6><h3>{formatCurrency(stats.totalRevenueAfterTax)}</h3></Card.Body></Card></Col>
                        <Col md={4}><Card className="text-white bg-success h-100 shadow"><Card.Body className="text-center"><h6>DOANH THU THUẦN</h6><h3>{formatCurrency(stats.totalRevenueBeforeTax)}</h3></Card.Body></Card></Col>
                        <Col md={4}><Card className="text-white bg-danger h-100 shadow"><Card.Body className="text-center"><h6>THUẾ VAT (10%)</h6><h3>{formatCurrency(stats.totalTax)}</h3></Card.Body></Card></Col>
                    </Row>

                    {/* BIỂU ĐỒ 1: SO SÁNH DOANH THU THEO NGÀY (MULTI-LINE) */}
                    <Row className="mb-5">
                        <Col md={12}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <h5 className="text-center mb-4">📈 Xu Hướng Doanh Thu Các Nhà Hàng</h5>
                                    {multiLineData && multiLineData.datasets.length > 0 ? (
                                        <div style={{ height: '400px' }}>
                                            <Line 
                                                key={`multiline-${multiLineData.datasets.length}`} // Key quan trọng để re-render
                                                data={multiLineData} 
                                                options={multiLineOptions} 
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-center text-muted py-5">Không có dữ liệu chi tiết theo ngày.</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col md={8}><Card className="shadow-sm h-100"><Card.Body>
                            <h5 className="mb-3">🏆 Xếp Hạng Doanh Thu</h5>
                            {contributionData ? <Bar data={contributionData} options={{ indexAxis: 'y', responsive: true, plugins: { legend: { display: false } } }} /> 
                            : <p className="text-center text-muted">Không có dữ liệu.</p>}
                        </Card.Body></Card></Col>
                        <Col md={4}><Card className="shadow-sm h-100"><Card.Body className="d-flex flex-column align-items-center">
                            <h5 className="mb-3">🍰 Tỷ Lệ Thuế</h5>
                            {pieData ? <Pie data={pieData} /> : <p>Không có dữ liệu.</p>}
                        </Card.Body></Card></Col>
                    </Row>
                </>
            ) : !loading && <p className="text-center py-5">Chưa có dữ liệu.</p>}
        </Container>
    );
}