import React, { useEffect, useState } from 'react';

export default function QuantitySelector(props) {
    const [quantity, setQuantity] = useState(props.inputValue);
    const maximum = 20;
    function increment(e) {
        quantity < maximum ? setQuantity(quantity + 1) : setQuantity(maximum);
        quantity < maximum ? props.onInputValueChange(quantity + 1)
            : props.onInputValueChange(maximum);
    }
    function decrement(e) {
        quantity > 1 ? setQuantity(quantity - 1) : setQuantity(1);
        quantity > 1 ? props.onInputValueChange(quantity - 1)
            : props.onInputValueChange(1);
    }
    return (
        <span className="input-group">
            <button
                type="button"
                className="btn btn-primary btn-sm btn-outline-secondary text-white"
                onClick={(e) => decrement(e)}>
                <i className="bi bi-dash-lg"></i>
            </button>
            <input
                className={"input-number text-center"}
                disabled="disabled"
                type="text"
                value={quantity}
                size="2"
                min="1"
                max="10" />
            <button
                type="button"
                className="btn btn-primary btn-sm btn-outline-secondary text-white"
                onClick={(e) => increment(e)}>
                <i className="bi bi-plus-lg"></i>
            </button>
        </span>
    );
}
