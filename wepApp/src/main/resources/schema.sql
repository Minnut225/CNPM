-- Bảng users
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    address VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'USER'
);

-- Bảng products
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    price DOUBLE,
    category VARCHAR(100),
    imageUrl VARCHAR(255)
);

-- Bảng orders
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PENDING',
    totalAmount DOUBLE,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Bảng order_items
CREATE TABLE OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT,
    productId INT,
    quantity INT,
    price DOUBLE,
    FOREIGN KEY (orderId) REFERENCES Orders(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
);

-- Bảng cart
CREATE TABLE Cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Bảng cart_items
CREATE TABLE CartItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cartId INT,
    productId INT,
    quantity INT,
    FOREIGN KEY (cartId) REFERENCES Cart(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
);