import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roundedToFixed } from './App';

export default function Cart(props) {
    const cart = props.cart;
    const setCart = props.setCart;
    const [subtotal, setSubtotal] = useState(0.00);
    const USDollar = props.USDollar;
    useEffect(() => {
        let newSubtotal = calcSubtotal(cart, setSubtotal);
        setSubtotal(newSubtotal);
    }, [cart]);

    function removeFromCart(ciid) {
        let newCart = cart.filter((cartItem, k) => {
            return k !== ciid;
        });
        setCart(newCart);
        calcSubtotal(cart, setSubtotal);
    }

    function CartItems(props) {
        const cart = props.cart;
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12">
                        <span className="p-3">
                            { cart.length === 0 ? "Empty." : ""}
                        </span>
                    </div>
                </div>
                {
                    cart.map((cartItem, key) => {
                        return (
                            <div className="cartitem p-3" key={key}>
                                <CartItemDetails
                                    USDollar={USDollar}
                                    cartItem={cartItem} />
                                <div className="row text-sm-end">
                                    <div className="col-sm-6">
                                        <QuantitySelector 
                                            key2={key} 
                                            cartItem={cartItem} 
                                            setCart={setCart} 
                                        />
                                    </div>
                                    <div className="col-sm-6 float-sm-right">
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={(e) => removeFromCart(key)}>
                                                Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
    return (
        <div className="m-1">
            <Link to="/menu">
                <button className="btn btn-secondary btn-lg">
                    <i className="bi bi-arrow-return-left"></i> Back
                </button>
            </Link>
            <h1>Shopping Cart</h1>
            <div className="row">
                <div className="col-sm-7">
                    <CartItems cart={cart} />
                </div>
                <div className="col-sm-5">
                    <Subtotal
                        USDollar={USDollar}
                        subtotal={subtotal} />
                    {cart.length > 0 ? <Link to="/checkout">
                        <button className="btn btn-primary form-control">
                            Checkout
                        </button>
                    </Link> : ""}
                </div>
            </div>
        </div>
    );
}

export function QuantitySelector(props) {
    const key = props.key2;
    const cartItem = props.cartItem;
    const setCart = props.setCart;
    function decrement(key, setCart) {
        setCart(cart => {
            const minQuantity = 2;
            return cart.map((cartItem, i) => {
                if (cartItem.quantity < minQuantity)
                    return cartItem;
                if (key === i) {
                    return { ...cartItem, quantity: cartItem.quantity - 1 }
                } else {
                    return cartItem;
                }
            })
        });
    }
    function increment(key, setCart) {
        setCart(cart => {
            const maxQuantity = 20;
            return cart.map((cartItem, i) => {
                if (key === i) {
                    if (cartItem.quantity >= maxQuantity) {
                        return { ...cartItem, quantity: maxQuantity }
                    }
                    return { ...cartItem, quantity: cartItem.quantity + 1 }
                } else {
                    return cartItem;
                }
            })
        });
    }
    return (
        <span className="input-group mb-1">
            <button
                type="button"
                className="btn btn-primary btn-sm btn-outline-secondary text-white"
                onClick={(e) => decrement(key, setCart)}>
                <i className="bi bi-dash-lg"></i>
            </button>
            <input
                className={"input-number text-center"}
                disabled="disabled"
                type="textparse"
                value={cartItem.quantity}
                size="2" />
            <button
                type="button"
                className="btn btn-primary btn-sm btn-outline-secondary text-white"
                onClick={(e) => increment(key, setCart)}>
                <i className="bi bi-plus-lg"></i>
            </button>
        </span>
    );
}

// Prints the name of the ingredient, half/whole, and the amount of the ingredient.
export function Ingredients(cartItem, comma = 1) {
    let ingredients = cartItem.ingredients;
    let halfer = cartItem.halfer;
    let arrs = cartItem.arrs;
    let str = "";
    for (let i = 0; i < halfer.length; i++) {
        let h = arrs[i]['halfable'] ? 
            ((comma == 1 ? ", " : ";") + halfer[i][0]) : "";
        let itemWithOptions = arrs[i]['customize'] ? 
            " ("+ ingredients[i][1] + h + ")" : "";
        str += ingredients[i][0] ? 
            ((comma == 1 ? "" : "[") + arrs[i]['ingredients_name'] + (itemWithOptions) + (comma == 1 ? ", " : "] "))  : "";
    }
    str = str.replace(/,\s*$/, "");
    return str;
}

// Prints the cart item name, price, size, and ingredients.
export function CartItemDetails(props) {
    const cartItem = props.cartItem;
    const USDollar = props.USDollar;
    return (
        <div>
            <h5>{cartItem.name}</h5>
            <b className="text-success">
                {USDollar.format(cartItem.price)} x {cartItem.quantity} = {USDollar.format(roundedToFixed(cartItem.price * cartItem.quantity, 2))}
            </b>
            <div>
                <span>{cartItem.val1 == 1 ? cartItem.size1 : ""}</span>
                <span>{cartItem.val2 == 1 ? cartItem.size2 : ""}</span>
                <span>{cartItem.val3 == 1 ? cartItem.size3 : ""}</span>
                <span>{cartItem.val4 == 1 ? cartItem.size4 : ""}</span>
            </div>
            <small>{Ingredients(cartItem)}</small>
        </div>
    );
}

// Adds up the subtotal from cart item prices.
export function calcSubtotal(c, setSubtotal) {
    let totalAmount = 0;
    for (const item in c) {
        totalAmount += c[item].quantity * c[item].price;
    }
    setSubtotal(totalAmount);
    return roundedToFixed(totalAmount, 2);
};

export function Subtotal(props) {
    const subtotal = props.subtotal;
    const USDollar = props.USDollar;
    return (
        <h3 className="text-end">Subtotal: <b className="text-success">
            {USDollar.format(subtotal)}</b>
        </h3>
    );
}