import React, { useEffect, useState } from 'react';
import { addToDatabaseCart, getDatabaseCart } from '../../databaseManager';
import spinner from '../../images/JcsQ.gif'
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link } from 'react-router-dom';


const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([])
    const [search, setSearch] = useState('')

    const handleSearch = event => setSearch(event.target.value);

    useEffect(() => {
        fetch('http://localhost:5000/products?search='+search)
        .then(res => res.json())
        .then(data =>{
            setProducts(data)
        })
    }, [search])

    useEffect(() => {
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart)
        fetch('https://polar-spire-94448.herokuapp.com/productsByKeys', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(productKeys)
        }).then(res => res.json()).then(data => {
            setCart(data)
        })
    }, [products])

    const handleAddProduct = (product) => {
        const toBeAddedKey = product.key;
        const sameProduct = cart.find(product => product.key === toBeAddedKey);
        let count = 1;
        let newCart;
        if(sameProduct){
            count = sameProduct.quantity + 1;
            sameProduct.quantity =  sameProduct.quantity + 1;
            const others = cart.filter(product => product.key !== toBeAddedKey)
            newCart = [...others, sameProduct];
        }
        else {
            product.quantity = 1;
            newCart = [...cart, product];
        }
        setCart(newCart)

        addToDatabaseCart(product.key, count)
    }
    return (
        <>
            <input type="search" onBlur={handleSearch} id=""/>
            <div className="shop-container">
                {products.length === 0 && <img src={spinner} alt=""/>}
                <div className="product-container">
                    {
                        products.map(product => <Product handleAddProduct={handleAddProduct} key={product.key} product={product}
                        showAddToCart={true}
                        ></Product>)
                    }
                </div>
                <div className="cart-container">
                    <Cart cart={cart}>
                        <Link to="/review">
                            <button className="main-btn">Review Order</button>
                        </Link>
                    </Cart>
                </div>
            </div>
        </>
    );
};

export default Shop;