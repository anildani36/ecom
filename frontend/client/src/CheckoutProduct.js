import React from 'react';
import './Checkout.css'
import StarIcon from "@material-ui/icons/Star";

function CheckoutProduct({ image, title, price, rating }) {
    return (
        <div className="checkoutProduct">
            <img className="checkoutProduct_image" src={image} />

            <div className="checkoutProduct_info">
                <p className="checkoutProduct_title">{title}</p>
                <p className="checkoutProduct_price">
                    <small>$</small>
                    <strong>{price}</strong>
                </p>

                <div className="checkoutProduct_rating">
                    {Array(rating).fill().map((_, i) => (
                    <StarIcon /> ))}
                </div>

                

            </div>
        </div>
    )
}

export default CheckoutProduct
