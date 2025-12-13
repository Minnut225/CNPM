import { useState } from 'react'
import './Product_Card.css'
import { Card } from 'react-bootstrap'
import './My_Product_Card.css'
import ProductModal from '../ProductModal/ProductModal'

// 1. Nhận thêm prop restaurantId
function My_Product_Card({ food, restaurantId }) {

    const [open, setOpen] = useState(false)

    return (
        <>
            <Card className='customed-card' style={{ width: "100%", height: "100%", cursor: "pointer" }}
                onClick={() => setOpen(true)}>
                <div className='image-wrapper'>
                    <Card.Img variant='top' src={`/${food.imageUrl}`} alt={food.productName} />
                </div>
                <div className='body-wrapper'>
                    <Card.Body>
                        <Card.Title className='card-title'>{food.productName}</Card.Title>
                        <Card.Text className='card-text'>
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(food.price)}
                        </Card.Text>
                        {food.discount !== 0 && (
                            <h3>Discount: {food.discount}%</h3>
                        )}
                    </Card.Body>
                </div>
            </Card>

            {/* 2. Truyền restaurantId xuống Modal để xử lý thêm vào giỏ */}
            <ProductModal
                show={open}
                handleCloseModal={setOpen}
                food={food}
                restaurantId={restaurantId} // <--- QUAN TRỌNG
            ></ProductModal>
        </>
    )
}

export default My_Product_Card