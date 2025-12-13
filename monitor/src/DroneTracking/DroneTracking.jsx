import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import config from '../api/config.json'

const { SERVER_API } = config;

// --- ICONS (Giữ nguyên) ---
const droneIconUrl = '/Drone.png';
const restIconUrl = 'https://cdn-icons-png.flaticon.com/512/4287/4287725.png';
const userIconUrl = 'https://cdn-icons-png.flaticon.com/512/9131/9131546.png';

const createIcon = (url, size) => L.icon({
    iconUrl: url,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
});

const generateRandomPoint = (center, radiusInKm) => {
    const r = radiusInKm / 111.3;
    const u = Math.random();
    const v = Math.random();
    const w = r * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
    const newX = x / Math.cos(center.lat * (Math.PI / 180));

    return { lat: center.lat + y, lng: center.lng + newX };
};

const FlyingDrone = ({ waypoints, onFinish, droneId }) => {
    // 1. GUARD CLAUSE
    if (!waypoints || waypoints.length < 2 || !waypoints[0]) {
        return null;
    }

    const [position, setPosition] = useState(waypoints[0]);
    const [currentLeg, setCurrentLeg] = useState(0);

    const progressRef = useRef(0);
    const requestRef = useRef();
    const lastUpdateRef = useRef(Date.now()); // Biến để kiểm soát thời gian gọi API

    // Hàm gọi API cập nhật vị trí (định nghĩa bên trong hoặc ngoài đều được)
    const syncLocationToBackend = async (lat, lng) => {

        if (!droneId) return;
        try {
            // Giả sử API update của bạn như này
            const url = `${SERVER_API}/api/drones/${droneId}/location/${lat}/${lng}`;

            await fetch(url, {
                method: 'PUT', // Hoặc PATCH
                // Không cần body hay headers Content-Type nữa vì dữ liệu nằm trên URL rồi
            });
            console.log(`📡 Synced Drone ${droneId}: [${lat.toFixed(4)}, ${lng.toFixed(4)}]`);
        } catch (err) {
            console.error("Lỗi sync location:", err);
        }
    };

    useEffect(() => {
        const animate = () => {
            progressRef.current += 0.003; // Tốc độ bay

            // --- XỬ LÝ CHUYỂN CHẶNG ---
            if (progressRef.current >= 1) {
                progressRef.current = 1;

                // Nếu còn chặng tiếp theo (Chặng 1: Quán -> Khách)
                if (currentLeg < waypoints.length - 2) {
                    setTimeout(() => {
                        progressRef.current = 0;
                        setCurrentLeg(prev => prev + 1);
                    }, 500); // Nghỉ 0.5s tại quán

                    // Update vị trí chốt trạm (Điểm dừng) ngay lập tức
                    const stopPoint = waypoints[currentLeg + 1];
                    syncLocationToBackend(stopPoint[0], stopPoint[1]);

                    return;
                } else {
                    // Update vị trí cuối cùng (Khách hàng)
                    const endPoint = waypoints[waypoints.length - 1];
                    syncLocationToBackend(endPoint[0], endPoint[1]);

                    if (onFinish) onFinish();
                    return;
                }
            }

            // Nếu đang bay
            if (progressRef.current < 1 || currentLeg < waypoints.length - 2) {
                requestRef.current = requestAnimationFrame(animate);
            }

            // TÍNH TOÁN TỌA ĐỘ MỚI
            const start = waypoints[currentLeg];
            const end = waypoints[currentLeg + 1];

            if (start && end) {
                const newLat = start[0] + (end[0] - start[0]) * progressRef.current;
                const newLng = start[1] + (end[1] - start[1]) * progressRef.current;
                setPosition([newLat, newLng]);

                // --- LOGIC GỌI API (THROTTLE) ---
                // Chỉ gọi API nếu đã qua 3 giây (3000ms) kể từ lần gọi trước
                const now = Date.now();
                if (now - lastUpdateRef.current > 3000) {
                    syncLocationToBackend(newLat, newLng);
                    lastUpdateRef.current = now; // Reset đồng hồ
                }
            }
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [currentLeg, waypoints, onFinish, droneId]);

    return (
        <Marker position={position} icon={createIcon(droneIconUrl, [50, 50])} zIndexOffset={1000}>
            <Popup>
                <strong>🚁 {currentLeg === 0 ? "Đang đến quán..." : "Đang giao hàng..."}</strong> <br />
                Tiến độ: {(progressRef.current * 100).toFixed(0)}%
            </Popup>
        </Marker>
    );
};

// --- COMPONENT CHÍNH ---
const DroneDispatchSystem = () => {
    // 1. STATE THAY CHO MOCK DATA
    const [drones, setDrones] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedDrone, setSelectedDrone] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [flightPath, setFlightPath] = useState(null);
    const [isFlying, setIsFlying] = useState(false);
    const [flyingDroneId, setFlyingDroneId] = useState(null);

    const hubLat = Number(localStorage.getItem('ResLatitude')) || 10.762622;
    const hubLng = Number(localStorage.getItem('ResLongitude')) || 10.660172;
    const hubName = localStorage.getItem('my_restaurant_name') || "Trạm Điều Phối";


    // 2. GỌI API LẤY DỮ LIỆU THẬT
    const fetchData = async () => {
        try {
            // Gọi song song 2 API: Lấy list Drone và list Order (đang chờ xử lý)
            const [resDrones, resOrders] = await Promise.all([
                fetch(`${SERVER_API}/api/drones`),
                fetch(`${SERVER_API}/api/restaurants/${Number(localStorage.getItem('restaurantId'))}/orders`) // Backend nên có filter status='PENDING' hoặc 'PAID'
            ]);

            if (resDrones.ok && resOrders.ok) {
                const dronesData = await resDrones.json();
                const ordersData = await resOrders.json();

                // Lọc đơn hàng: Chỉ lấy đơn 'Pending' hoặc 'Processing' và chưa có Drone
                // Giả sử backend trả về list all, ta lọc ở đây
                const pendingOrders = ordersData.filter(o =>
                    o.status === 'Delivering'
                );

                setDrones(dronesData);
                setOrders(pendingOrders);
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            toast.error("Không kết nối được với Server!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Có thể thêm setInterval ở đây để auto-refresh nếu muốn
    }, []);

    const handleSelectOrder = (order) => {
        // Tạo bản sao của order để không sửa trực tiếp vào state gốc (orders)
        const orderWithLocation = { ...order };

        // Kiểm tra: Nếu order chưa có tọa độ -> Random ngay lập tức
        if (!orderWithLocation.latitude || !orderWithLocation.longitude) {

            // Lấy tọa độ gốc (Nhà hàng) để random xung quanh
            const hubLat = Number(localStorage.getItem('ResLatitude')) || 10.762622;
            const hubLng = Number(localStorage.getItem('ResLongitude')) || 106.660172;

            console.log(`🎲 Đơn #${order.orderId} chưa có tọa độ. Đang random quanh quán...`);

            // Random trong bán kính 2km
            const rand = generateRandomPoint({ lat: hubLat, lng: hubLng }, 2.0);

            // Gán tọa độ fake vào object
            orderWithLocation.latitude = rand.lat;
            orderWithLocation.longitude = rand.lng;
        }

        // Cập nhật vào state selectedOrder
        setSelectedOrder(orderWithLocation);
    };

    // 3. XỬ LÝ GÁN DRONE & CẬP NHẬT BACKEND
    // --- SỬA HÀM handleDispatch ---
    const handleDispatch = async () => {
        if (!selectedDrone || !selectedOrder) return;

        // 1. LẤY TỌA ĐỘ A: VỊ TRÍ HIỆN TẠI CỦA DRONE
        const droneLat = selectedDrone.currentLatitude || selectedDrone.latitude;
        const droneLng = selectedDrone.currentLongitude || selectedDrone.longitude;

        // 2. LẤY TỌA ĐỘ B: NHÀ HÀNG (SỬA LOGIC TẠI ĐÂY)
        let restLat = 0;
        let restLng = 0;

        try {
            // Vì selectedOrder chỉ có restaurantId, ta phải gọi API để lấy tọa độ quán
            if (selectedOrder.restaurantId) {
                console.log(`🔍 Đang tìm tọa độ cho quán ID: ${selectedOrder.restaurantId}...`);

                const res = await fetch(`http://localhost:8080/api/restaurants/${selectedOrder.restaurantId}`);
                if (res.ok) {
                    const restData = await res.json();
                    restLat = restData.latitude;
                    restLng = restData.longitude;
                    console.log("✅ Đã tìm thấy tọa độ quán:", restLat, restLng);
                }
            }
        } catch (e) {
            console.error("Lỗi khi lấy thông tin quán:", e);
        }

        // Fallback: Nếu API lỗi hoặc không có ID, dùng tọa độ mặc định (để không crash app)
        if (!restLat) restLat = 10.762622; // Mặc định HCM
        if (!restLng) restLng = 106.660172;

        // 3. LẤY TỌA ĐỘ C: KHÁCH HÀNG (DELIVERY)
        // Nếu Order chưa có tọa độ, dùng tạm tọa độ fake quanh khu vực quán để demo
        const custLat = selectedOrder.latitude || (restLat + 0.01);
        const custLng = selectedOrder.longitude || (restLng + 0.01);

        // --- CÁC BƯỚC TIẾP THEO GIỮ NGUYÊN ---

        // Validate
        if (!droneLat) {
            toast.error("Drone chưa có tín hiệu GPS!");
            return;
        }

        try {
            // Gọi API Dispatch
            const response = await fetch(`${SERVER_API}/api/deliveries/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: selectedOrder.orderId,
                    droneId: selectedDrone.droneId || selectedDrone.id,
                    deliveryStatus: 'In Transit'
                })
            });
            const rawStartLat = selectedDrone.currentLatitude || selectedDrone.latitude;
            const rawStartLng = selectedDrone.currentLongitude || selectedDrone.longitude;

            const rawRestLat = selectedOrder.restaurant?.latitude || localStorage.getItem('ResLatitude');
            const rawRestLng = selectedOrder.restaurant?.longitude || localStorage.getItem('ResLongitude');

            const rawEndLat = selectedOrder.latitude || selectedOrder.dropOffLatitude;
            const rawEndLng = selectedOrder.longitude || selectedOrder.dropOffLongitude;

            // B. HÀM CHECK AN TOÀN (Helper)
            const safeCoord = (val, defaultVal) => {
                const num = Number(val);
                // Nếu num là NaN hoặc 0 thì lấy giá trị mặc định
                return (isNaN(num) || num === 0) ? defaultVal : num;
            };

            // C. TÍNH TOÁN TỌA ĐỘ CHUẨN (Có giá trị mặc định TP.HCM để không bao giờ Crash)
            // Điểm A: Vị trí Drone
            const startLat = safeCoord(rawStartLat, 10.762622);
            const startLng = safeCoord(rawStartLng, 106.660172);

            // Điểm B: Nhà hàng
            const restLat = safeCoord(rawRestLat, 10.762622);
            const restLng = safeCoord(rawRestLng, 106.660172);

            // Điểm C: Khách
            const endLat = safeCoord(rawEndLat, 10.776530);
            const endLng = safeCoord(rawEndLng, 106.600980);

            // Validate lần cuối (Chặn nếu toàn bộ đều là mặc định hoặc sai)
            if (!selectedDrone || !selectedOrder) return;

            // ... (Phần gọi API giữ nguyên) ...

            // ... (Phần setFlightPath)
            if (response.ok) {
                // Đảm bảo setFlightPath nhận số chuẩn
                const path = [
                    [startLat, startLng],
                    [restLat, restLng],
                    [endLat, endLng]
                ];

                console.log("✈️ Flight Path Validated:", path); // Check log xem có số nào là NaN không
                const activeId = selectedDrone.droneId || selectedDrone.id;
                setFlightPath(path);
                setFlyingDroneId(activeId);
                setIsFlying(true);

                // Cập nhật UI
                setOrders(prev => prev.filter(o => o.orderId !== selectedOrder.orderId));
                setDrones(prev => prev.map(d =>
                    (d.id === selectedDrone.id || d.droneId === selectedDrone.droneId)
                        ? { ...d, status: 'BUSY' } : d
                ));

                setSelectedDrone(null);
                setSelectedOrder(null);
            } else {
                toast.error("Lỗi Server!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi kết nối");
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <Container fluid className="mt-3">
            <Row>
                {/* --- CỘT TRÁI: BẢN ĐỒ --- */}
                <Col md={8}>
                    <div style={{ height: "85vh", border: "2px solid #ccc", borderRadius: "10px", overflow: "hidden" }}>
                        <MapContainer center={[10.762, 106.660]} zoom={13} style={{ height: "100%", width: "100%" }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {/* --- 2. MARKER NHÀ HÀNG (LUÔN HIỆN) --- */}
                            {/* Đặt ở đây, không nằm trong điều kiện if nào cả */}
                            <Marker position={[hubLat, hubLng]} icon={createIcon(restIconUrl, [45, 45])}>
                                <Popup>
                                    <strong>🏠 {hubName}</strong> <br />
                                    (Điểm xuất phát)
                                </Popup>
                            </Marker>

                            {/* 1. HIỂN THỊ LIST DRONE TỪ API */}
                            {!isFlying && drones.map(drone => {
                                // Mapping tên biến từ Backend -> Frontend
                                const lat = drone.currentLatitude || drone.latitude;
                                const lng = drone.currentLongitude || drone.longitude;
                                const status = drone.state || drone.status || 'Idle'; // Lấy state

                                if (!lat || !lng) return null;

                                return (
                                    <Marker
                                        key={drone.id || drone.droneId}
                                        position={[lat, lng]}
                                        icon={createIcon(droneIconUrl, [40, 40])}
                                        opacity={status === 'Idle' ? 1 : 0.5}
                                    >
                                        <Popup>
                                            <strong>Drone ID: {drone.droneId || drone.name}</strong><br />
                                            Pin: 67%<br />
                                            TT: {status}
                                        </Popup>
                                    </Marker>
                                )
                            })}

                            {/* 2. HIỂN THỊ TUYẾN ĐƯỜNG DỰ KIẾN KHI CHỌN ĐƠN */}
                            {selectedOrder && (() => {
                                // --- TÍNH TOÁN TỌA ĐỘ KHÁCH HÀNG ---
                                const custLat = selectedOrder.latitude || selectedOrder.dropOffLatitude || 10.776530;
                                const custLng = selectedOrder.longitude || selectedOrder.dropOffLongitude || 106.600980;

                                // Log ra để kiểm tra xem có tọa độ không (F12)
                                console.log("📍 Vẽ Marker Khách tại:", custLat, custLng);

                                return (
                                    <>
                                        {/* Marker Khách hàng */}
                                        <Marker position={[custLat, custLng]} icon={createIcon(userIconUrl, [40, 40])}>
                                            <Popup>
                                                <strong>Khách: {selectedOrder.recipientName}</strong> <br />
                                                Địa chỉ: {selectedOrder.deliveryAddress}
                                            </Popup>
                                        </Marker>

                                        <Polyline
                                            positions={[
                                                [hubLat, hubLng],
                                                [custLat, custLng]
                                            ]}
                                            pathOptions={{ color: 'blue', dashArray: '10, 10', opacity: 0.5 }}
                                        />
                                    </>
                                );
                            })()}

                            {/* 3. ANIMATION BAY */}
                            {isFlying && flightPath && flightPath.length >= 2 && (
                                <>
                                    <FlyingDrone
                                        // QUAN TRỌNG: Thêm key dựa trên flightPath. 
                                        // Khi tọa độ thay đổi, React sẽ hủy component cũ và tạo mới -> Reset animation từ đầu.
                                        key={JSON.stringify(flightPath)}

                                        waypoints={flightPath}

                                        droneId={flyingDroneId}

                                        onFinish={() => {
                                            toast.info("Giao hàng hoàn tất!");
                                            setIsFlying(false);
                                            setFlightPath(null);
                                            setSelectedDrone(null);
                                            setSelectedOrder(null);
                                            fetchData(); // Load lại dữ liệu mới nhất nếu cần
                                        }}
                                    />

                                    {/* Vẽ đường nối đỏ A->B->C */}
                                    <Polyline
                                        positions={flightPath}
                                        pathOptions={{ color: 'red', dashArray: '5, 10', weight: 3, opacity: 0.6 }}
                                    />
                                </>
                            )}
                        </MapContainer>
                    </div>
                </Col>

                {/* --- CỘT PHẢI: DANH SÁCH --- */}
                <Col md={4}>
                    <Card className="shadow-sm h-100">
                        <Card.Header className="bg-primary text-white text-center fw-bold">
                            TRẠM ĐIỀU PHỐI
                        </Card.Header>
                        <Card.Body className="d-flex flex-column gap-3" style={{ overflowY: 'auto', maxHeight: '85vh' }}>

                            {/* LIST ORDERS */}
                            <div>
                                <h6>1. Đơn chờ xử lý ({orders.length}):</h6>
                                <ListGroup>
                                    {orders.length === 0 && <p className="text-muted small">Không có đơn hàng mới.</p>}
                                    {orders.map(order => (
                                        <ListGroup.Item
                                            key={order.orderId}
                                            action
                                            active={selectedOrder?.orderId === order.orderId}
                                            onClick={() => handleSelectOrder(order)}
                                        >
                                            <div className="d-flex justify-content-between">
                                                <strong>#{order.orderId}</strong>
                                                <span>{order.totalPrice?.toLocaleString()}đ</span>
                                            </div>
                                            <small className="text-muted">
                                                {order.restaurant?.name || "Nhà hàng"} ➡ {order.recipientName}
                                            </small>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>

                            {/* LIST DRONES */}
                            <div>
                                <h6>2. Drone khả dụng:</h6>
                                <ListGroup>
                                    {drones.filter(d => (d.state || d.status) === 'Idle').map(drone => (
                                        <ListGroup.Item
                                            key={drone.id || drone.droneId}
                                            action
                                            active={(selectedDrone?.id || selectedDrone?.droneId) === (drone.id || drone.droneId)}
                                            onClick={() => setSelectedDrone(drone)}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>🚀 Drone ID: {drone.droneId || drone.name}</span>
                                                <Badge bg="success">{drone.batteryLevel}% Pin</Badge>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>

                            <div className="mt-auto pt-3 border-top">
                                <Button
                                    variant="warning"
                                    size="lg"
                                    className="w-100 fw-bold"
                                    disabled={!selectedDrone || !selectedOrder || isFlying}
                                    onClick={handleDispatch}
                                >
                                    {isFlying ? " Đang bay..." : " GÁN & BAY NGAY"}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DroneDispatchSystem;
