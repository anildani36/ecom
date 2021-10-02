import React, { useState } from 'react';
import './Register.css'
import { Link, useHistory } from "react-router-dom";
import { auth } from "./firebase";

function Register() {
    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = e => {
        e.preventDefault();

        auth
            .signUpWithEmailAndPassword(name, email, password)
            .then(auth => {
                history.push('/')
            })
            .catch(error => alert(error.message))
    }

    const register = e => {
        e.preventDefault();

        auth
            .createUserWithEmailAndPassword(email, password)
            .then((auth) => {
                // it successfully created a new user with email and password
                if (auth) {
                    history.push('/')
                }
            })
            .catch(error => alert(error.message))
    }


    return (
        <div className='register'>
            <Link to='/user/login'>
                <img
                    className="register__logo"
                    src='https://pngimg.com/uploads/shopping_cart/small/shopping_cart_PNG7.png' 
                />
            </Link>

            <div className='register__container'>
                <h1>Sign-up</h1>

                <form>
                    <h5>Name</h5>
                    <input type='text' value={name} onChange={e => setName(e.target.value)} />

                    <h5>E-mail</h5>
                    <input type='text' value={email} onChange={e => setEmail(e.target.value)} />

                    <h5>Password</h5>
                    <input type='password' value={password} onChange={e => setPassword(e.target.value)} />

                    <button type='submit' onClick={signIn} className='register__signupButton'>Sign up</button>
                </form>

                <p>
                    By signing-up you agree to the Ecommerce Site Conditions of Use & Sale. Please
                    see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
                </p>

                <Link to='/user/login'>
                <button className='register__loginButton'>Already have a Account</button>
                </Link>

            </div>
        </div>
    )
}

export default Register
