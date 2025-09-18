-- =========================
-- USERS (20 users)
-- =========================
INSERT INTO Users (name, password, email, address, phone, role) VALUES 
('user1', 'pass1', 'user1@example.com', 'Address 1', '0123456781', 'ADMIN'),
('user2', 'pass2', 'user2@example.com', 'Address 2', '0123456782', 'USER'),
('user3', 'pass3', 'user3@example.com', 'Address 3', '0123456783', 'USER'),
('user4', 'pass4', 'user4@example.com', 'Address 4', '0123456784', 'USER'),
('user5', 'pass5', 'user5@example.com', 'Address 5', '0123456785', 'ADMIN'),
('user6', 'pass6', 'user6@example.com', 'Address 6', '0123456786', 'USER'),
('user7', 'pass7', 'user7@example.com', 'Address 7', '0123456787', 'USER'),
('user8', 'pass8', 'user8@example.com', 'Address 8', '0123456788', 'USER'),
('user9', 'pass9', 'user9@example.com', 'Address 9', '0123456789', 'USER'),
('user10', 'pass10', 'user10@example.com', 'Address 10', '0123456790', 'USER'),
('user11', 'pass11', 'user11@example.com', 'Address 11', '0123456791', 'USER'),
('user12', 'pass12', 'user12@example.com', 'Address 12', '0123456792', 'USER'),
('user13', 'pass13', 'user13@example.com', 'Address 13', '0123456793', 'USER'),
('user14', 'pass14', 'user14@example.com', 'Address 14', '0123456794', 'USER'),
('user15', 'pass15', 'user15@example.com', 'Address 15', '0123456795', 'USER'),
('user16', 'pass16', 'user16@example.com', 'Address 16', '0123456796', 'USER'),
('user17', 'pass17', 'user17@example.com', 'Address 17', '0123456797', 'USER'),
('user18', 'pass18', 'user18@example.com', 'Address 18', '0123456798', 'USER'),
('user19', 'pass19', 'user19@example.com', 'Address 19', '0123456799', 'USER'),
('user20', 'pass20', 'user20@example.com', 'Address 20', '0123456700', 'USER');

-- =========================
-- PRODUCTS (20 products)
-- =========================
INSERT INTO Products (name, description, price, category, imageUrl) VALUES
('Laptop 1', 'High performance laptop', 1500.0, 'Electronics', 'laptop1.jpg'),
('Laptop 2', 'Business laptop', 1200.0, 'Electronics', 'laptop2.jpg'),
('Phone 1', 'Smartphone with great camera', 800.0, 'Electronics', 'phone1.jpg'),
('Phone 2', 'Budget smartphone', 400.0, 'Electronics', 'phone2.jpg'),
('Tablet 1', '10-inch tablet', 600.0, 'Electronics', 'tablet1.jpg'),
('Tablet 2', '8-inch tablet', 450.0, 'Electronics', 'tablet2.jpg'),
('Headphones 1', 'Noise cancelling headphones', 200.0, 'Accessories', 'headphones1.jpg'),
('Headphones 2', 'Wireless headphones', 150.0, 'Accessories', 'headphones2.jpg'),
('Keyboard 1', 'Mechanical keyboard', 100.0, 'Accessories', 'keyboard1.jpg'),
('Keyboard 2', 'Wireless keyboard', 80.0, 'Accessories', 'keyboard2.jpg'),
('Mouse 1', 'Gaming mouse', 70.0, 'Accessories', 'mouse1.jpg'),
('Mouse 2', 'Wireless mouse', 50.0, 'Accessories', 'mouse2.jpg'),
('Monitor 1', '4K monitor', 400.0, 'Electronics', 'monitor1.jpg'),
('Monitor 2', 'Full HD monitor', 200.0, 'Electronics', 'monitor2.jpg'),
('Smartwatch 1', 'Fitness smartwatch', 250.0, 'Wearables', 'watch1.jpg'),
('Smartwatch 2', 'Luxury smartwatch', 500.0, 'Wearables', 'watch2.jpg'),
('Camera 1', 'DSLR Camera', 1000.0, 'Electronics', 'camera1.jpg'),
('Camera 2', 'Compact camera', 600.0, 'Electronics', 'camera2.jpg'),
('Printer 1', 'Laser printer', 300.0, 'Office', 'printer1.jpg'),
('Printer 2', 'Inkjet printer', 150.0, 'Office', 'printer2.jpg');

-- =========================
-- ORDERS (20 orders, each belongs to userId 1..20)
-- =========================
INSERT INTO Orders (userId, orderDate, status, totalPrice, payment, shipping_address) VALUES
(1, CURRENT_TIMESTAMP, 'PENDING', 2300.0, 'CREDIT_CARD', 'Address 1'),
(2, CURRENT_TIMESTAMP, 'SHIPPED', 1600.0, 'PAYPAL', 'Address 2'),
(3, CURRENT_TIMESTAMP, 'DELIVERED', 1500.0, 'BANK_TRANSFER', 'Address 3'),
(4, CURRENT_TIMESTAMP, 'PENDING', 1200.0, 'CREDIT_CARD', 'Address 4'),
(5, CURRENT_TIMESTAMP, 'SHIPPED', 400.0, 'PAYPAL', 'Address 5'),
(6, CURRENT_TIMESTAMP, 'DELIVERED', 1700.0, 'BANK_TRANSFER', 'Address 6'),
(7, CURRENT_TIMESTAMP, 'PENDING', 650.0, 'CREDIT_CARD', 'Address 7'),
(8, CURRENT_TIMESTAMP, 'SHIPPED', 900.0, 'PAYPAL', 'Address 8'),
(9, CURRENT_TIMESTAMP, 'DELIVERED', 300.0, 'BANK_TRANSFER', 'Address 9'),
(10, CURRENT_TIMESTAMP, 'PENDING', 750.0, 'CREDIT_CARD', 'Address 10'),
(11, CURRENT_TIMESTAMP, 'SHIPPED', 1100.0, 'PAYPAL', 'Address 11'),
(12, CURRENT_TIMESTAMP, 'DELIVERED', 1600.0, 'BANK_TRANSFER', 'Address 12'),
(13, CURRENT_TIMESTAMP, 'PENDING', 900.0, 'CREDIT_CARD', 'Address 13'),
(14, CURRENT_TIMESTAMP, 'SHIPPED', 1980.0, 'PAYPAL', 'Address 14'),
(15, CURRENT_TIMESTAMP, 'DELIVERED', 1250.0, 'BANK_TRANSFER', 'Address 15'),
(16, CURRENT_TIMESTAMP, 'PENDING', 330.0, 'CREDIT_CARD', 'Address 16'),
(17, CURRENT_TIMESTAMP, 'SHIPPED', 960.0, 'PAYPAL', 'Address 17'),
(18, CURRENT_TIMESTAMP, 'PENDING', 720.0, 'CREDIT_CARD', 'Address 18'),
(19, CURRENT_TIMESTAMP, 'SHIPPED', 1300.0, 'PAYPAL', 'Address 19'),
(20, CURRENT_TIMESTAMP, 'PENDING', 2100.0, 'BANK_TRANSFER', 'Address 20');

-- =========================
-- ORDER ITEMS (2–3 items per order)
-- =========================
INSERT INTO OrderItems (orderId, productId, quantity, price) VALUES
(1, 1, 1, 1500.0), (1, 3, 1, 800.0),
(2, 3, 2, 800.0),
(3, 1, 1, 1500.0),
(4, 2, 1, 1200.0),
(5, 4, 1, 400.0),
(6, 5, 2, 1200.0), (6, 7, 1, 500.0),
(7, 8, 1, 150.0), (7, 9, 1, 500.0),
(8, 10, 1, 400.0), (8, 11, 1, 500.0),
(9, 12, 1, 300.0),
(10, 13, 1, 400.0), (10, 14, 1, 350.0),
(11, 15, 1, 250.0), (11, 16, 1, 850.0),
(12, 17, 1, 1000.0), (12, 18, 1, 600.0),
(13, 19, 2, 450.0),
(14, 20, 2, 990.0),
(15, 2, 1, 1200.0), (15, 9, 1, 50.0),
(16, 4, 1, 330.0),
(17, 6, 2, 480.0),
(18, 7, 1, 200.0), (18, 8, 1, 520.0),
(19, 13, 1, 400.0), (19, 15, 1, 900.0),
(20, 1, 1, 1500.0), (20, 11, 1, 600.0);

-- =========================
-- CARTS (20 carts, each belongs to userId 1..20)
-- =========================
INSERT INTO Carts (userId) VALUES
(1),(2),(3),(4),(5),(6),(7),(8),(9),(10),
(11),(12),(13),(14),(15),(16),(17),(18),(19),(20);

-- =========================
-- CART ITEMS (2–3 per cart)
-- =========================
INSERT INTO CartItems (cartId, productId, quantity) VALUES
(1, 1, 1), (1, 2, 2),
(2, 3, 1), (2, 5, 1),
(3, 4, 2), (3, 6, 1),
(4, 7, 1), (4, 8, 2),
(5, 9, 1), (5, 10, 1),
(6, 11, 2), (6, 12, 1),
(7, 13, 1), (7, 14, 2),
(8, 15, 1), (8, 16, 1),
(9, 17, 1), (9, 18, 1),
(10, 19, 2), (10, 20, 1),
(11, 1, 1), (11, 3, 1),
(12, 5, 1), (12, 7, 1),
(13, 9, 2), (13, 11, 1),
(14, 13, 1), (14, 15, 1),
(15, 17, 1), (15, 19, 1),
(16, 2, 2), (16, 4, 1),
(17, 6, 1), (17, 8, 2),
(18, 10, 1), (18, 12, 1),
(19, 14, 1), (19, 16, 1),
(20, 18, 2), (20, 20, 1);
