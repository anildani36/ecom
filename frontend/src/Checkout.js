import React, { useState, useEffect } from 'react';
import './Checkout.css';
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import { Link, useHistory } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import axios from './axios';
import { db } from "./firebase";

// function loadScript(src) {
//     return new Promise((resolve) => {
//         const script = document.createElement('script')
//         script.src
//         document.body.appendChild(script)
//         script.onload = () => {
//             resolve(true)
//         }
//         script.onerror = () => {
//             resolve(false)
//         }
//     })
// }

function Checkout() {
    const [{ basket, user }, dispatch] = useStateValue();
    const history = useHistory();

    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() => {
        // generate the special stripe secret which allows us to charge a customer
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                // Stripe expects the total in a currencies subunits
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });
            setClientSecret(response.data.clientSecret)
        }

        getClientSecret();
    }, [basket])

    console.log('THE SECRET IS >>>', clientSecret)
    console.log('👱', user)

    const handleSubmit = async (event) => {
        // do all the fancy stripe stuff...
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {
            // paymentIntent = payment confirmation

            db
              .collection('users')
              .doc(user?.uid)
              .collection('orders')
              .doc(paymentIntent.id)
              .set({
                  basket: basket,
                  amount: paymentIntent.amount,
                  created: paymentIntent.created
              })

            setSucceeded(true);
            setError(null)
            setProcessing(false)

            dispatch({
                type: 'EMPTY_BASKET'
            })

            history.replace('/orders')
        })

    }

    const handleChange = event => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }

    // async function displayRazorpay() {

    //     const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    //     if(!res) {
    //         alert('Razorpay SDK failed to load. Something went Wrong !!')
    //         return
    //     }

    //     const options = {
    //         "key": "YOUR_KEY_ID", // Enter the Key
    //         "amount": "100", // Amount is in currency subunits
    //         "currency": "USD",
    //         "name": "Ecommerse Site",
    //         "description": "Thank You for the Purchase",
    //         "image": "https://example.com/your_logo",
    //         "order_id": "order_9A33XWu170gUtm", //Order ID FROM DB
    //         "handler": function (response){
    //             alert(response.razorpay_payment_id);
    //             alert(response.razorpay_order_id);
    //             alert(response.razorpay_signature)
    //         },
    //         "prefill": {
    //             "name": "Gaurav Kumar",
    //             "email": "gaurav.kumar@example.com",
    //             "contact": "9999999999"
    //         },
    //         "notes": {
    //             "address": "Razorpay Corporate Office"
    //         },
    //         "theme": {
    //             "color": "#3399cc"
    //         }
    //     };
    //     var rzp1 = new Razorpay(options);
    // }

    return (
        <div className='payment'>
            <div className='payment__container'>
                <h1>
                    Checkout (
                        <Link to="/user/cart">{basket?.length} items</Link>
                        )
                </h1>


                {/* Payment section - delivery address */}
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Delivery Address</h3>
                    </div>
                    <div className='payment__address'>
                        <p>{user?.email}</p>
                        <p>123 React Lane</p>
                        <p>Los Angeles, CA</p>
                    </div>
                </div>

                {/* Payment section - Review Items */}
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className='payment__items'>
                        {basket.map(item => (
                            <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}
                    </div>
                </div>
            

                {/* Payment section - Payment method */}
                <div className='payment__section'>
                    <div className="payment__details">
                        <button>Proceed to Payment</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
