import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import QuantitySelector from './QuantitySelector';
import currency from 'currency.js';

export default function ShowMenuItem(props) {
    const USDollar = props.USDollar;
    const restaurantName = props.restaurantName;
    const debug = props.debug;
    const cart = props.cart;
    const setCart = props.setCart;
    const [itemConfig, setItemConfig] = useState([]);
    const [itemIngredients, setItemIngredients] = useState([]);
    const [val1, setVal1] = useState(1);
    const [val2, setVal2] = useState(0);
    const [val3, setVal3] = useState(0);
    const [val4, setVal4] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(-1);
    const result = Object.groupBy(itemIngredients, i => i.type);
    const [enabled, setEnabled] = useState([false, false, false, 
        false, false, false, false, false, false, false, false, 
        false, false, false, false, false, false, false, false, 
        false, false, false, false, false, false, false, false, 
        false, false, false, false, false, false, false, false, ]);
    const [halfables, setHalfables] = useState([]);
    const [customs, setCustoms] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (props.menuItem < 0)
            navigate("/");
        console.log("menuItem: " + props.menuItem);
        axios.get('http://localhost:3000/api/menu/item',
            { params: { menuItem: props.menuItem } })
        .then(res => {
            setItemConfig(res.data);
            if (res.data[0] != undefined)
                setPrice(res.data[0].price);
        })
        axios.get('http://localhost:3000/api/menu/item/ingredients',
            { params: { menuItem: props.menuItem } })
        .then(res => {
            setItemIngredients(res.data);
        });
    }, [cart, setCart, setPrice, setEnabled, setHalfables, setCustoms, setVal1, setVal2, setVal3, setVal4]);

    function addToCart(e, item) {
        e.preventDefault();
        let boxes = [];
        let boxes2 = [];
        const form = e.target;
        const elements = form.elements['ingredients'];
        const customizer = form.elements['customizer'];
        const halfer = form.elements['halfer'];
        for (let i = 0; i < elements.length; i++) {
            const v = elements[i];
            boxes.push([v.checked, customizer[i].value]);
            if (halfer[i] == undefined) {
                continue;
            }
            boxes2.push([halfer[i].value]);
        }
        const cartItem = {
            name: item.name,
            address: item.restaurantAddress,
            restaurant: restaurantName,
            size1: item.size1,
            val1: val1,
            size2: item.size2,
            val2: val2,
            size3: item.size3,
            val3: val3,
            size4: item.size4,
            val4: val4,
            ingredients: boxes,
            arrs: ingredientsData,
            quantity: quantity,
            price: price,
            customizer: customizer,
            halfer: boxes2,
        };
        console.log(cartItem);
        cart.push(cartItem);
        setCart(
            cart.map((m) => {
                return m
            })
        );
        navigate("/menu");
    }

    const ingredientsData = [];
    function populateIngredientData() {
        for (const j in result) {
            for (const i in result[j]) {
                ingredientsData.push(result[j][i]);
            }
        }
    }

    let lastCategory = "";
    function setLastCategoryPrinted(v) {
        lastCategory = v;
    }
    populateIngredientData();
    return (<>
        <Link to="/menu">
            <button className="btn btn-secondary btn-lg m-1">
                <i className="bi bi-arrow-return-left"></i> {restaurantName != undefined ? restaurantName : "Back"}
            </button>
        </Link>
        {
           itemConfig.map((item, key) => {
                function calcItemTotal(uu) {
                    let configPrice = currency(0);
                    ingredientsData.map((i, key) => {
                        if (enabled[key] == true) {
                            if (customs[key] == "Extra") {
                                console.log("9999 " + customs[key] + " " + i['extra_price']);
                                if (halfables[key] == "Right Half" ||  halfables[key] == "Left Half") {
                                    configPrice = configPrice.add(currency(i['extra_price']).divide(2).value);
                                    console.log("t4: " + configPrice.value);
                                } else {
                                    configPrice = configPrice.add(currency(i['extra_price']).value);
                                }
                                console.log("t1: " + configPrice.value);
                            } else if (customs[key] == "Easy") {
                                if (halfables[key] == "Right Half" ||  halfables[key] == "Left Half") {
                                    configPrice = configPrice.add(currency(i['easy_price']).divide(2).value);
                                    console.log("t4: " + configPrice.value);
                                } else {
                                    configPrice = configPrice.add(currency(i['easy_price']).value);
                                }
                                console.log("t2: " + configPrice.value);
                            } else {
                                if (halfables[key] == "Right Half" ||  halfables[key] == "Left Half") {
                                    configPrice = configPrice.add(currency(i['price']).divide(2).value);
                                    console.log("t4: " + configPrice.value);
                                } else {
                                    configPrice = configPrice.add(currency(i['price']).value);
                                }
                                console.log("t3: " + configPrice.value);
                            }
                        }
                    });
                    console.log(val1);
                    console.log(val2);
                    console.log(val3);
                    console.log(val4);
                    if (uu == 1) {
                        setPrice(configPrice.add(item['price']).value);
                    } else if (uu == 2) {
                        setPrice(configPrice.add(item['price2']).value);
                    } else if (uu == 3) {
                        setPrice(configPrice.add(item['price3']).value);
                    } else if (uu == 4) {
                        setPrice(configPrice.add(item['price4']).value);
                    }
                }
                function changeRadio1(e) {
                    setVal1(1);
                    setVal2(0);
                    setVal3(0);
                    setVal4(0);
                    calcItemTotal(1);
                }
                function changeRadio2(e) {
                    setVal1(0);
                    setVal2(1);
                    setVal3(0);
                    setVal4(0);
                    calcItemTotal(2);
                }
                function changeRadio3(e) {
                    setVal1(0);
                    setVal2(0);
                    setVal3(1);
                    setVal4(0);
                    calcItemTotal(3);
                }
                function changeRadio4(e) {
                    setVal1(0);
                    setVal2(0);
                    setVal3(0);
                    setVal4(1);
                    calcItemTotal(4);
                }
                function itemTotal() {
                    if (val1 == 1) {
                        calcItemTotal(1);
                    } else if (val2 == 1) {
                        calcItemTotal(2);
                    } else if (val3 == 1) {
                        calcItemTotal(3);
                    } else if (val4 == 1) {
                        calcItemTotal(4);
                    }
                }
                return (
                <form
                        key={key}
                        onSubmit={(e) => addToCart(e, item)}>
                    <div className="row">
                        <div className="col-sm-12 text-center">
                            <h2>{item.name}</h2>
                            <h3>
                                <p><b className="text-success">{USDollar.format(price)}</b></p>
                            </h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div>
                                <h5 className="indent"><span className="text-danger">*</span>Size</h5>
                                {(item.size1 != null && item.size1 != "") ?
                                    <div className="p-3 m-1 text-bg-dark rounded">
                                        <label>
                                            <input
                                                required
                                                type="radio"
                                                checked={val1}
                                                onChange={(e) => changeRadio1(e)}
                                                name="itemSize" />
                                            <span> </span>
                                            {item.size1} {debug ? val1 : ""}
                                        </label>
                                    </div> : ""
                                }
                                {(item.size2 != null && item.size2 != "") ?
                                    <div className="p-3 m-1 text-bg-dark rounded">
                                        <label>
                                            <input
                                                type="radio"
                                                checked={val2}
                                                onChange={(e) => changeRadio2(e)}
                                                name="itemSize" />
                                            <span> </span>
                                            {item.size2} {debug ? val2 : ""}
                                        </label>
                                    </div> : ""
                                }
                                {(item.size3 != null && item.size3 != "") ?
                                    <div className="p-3 m-1 text-bg-dark rounded">
                                        <label>
                                            <input
                                                type="radio"
                                                checked={val3}
                                                onChange={(e) => changeRadio3(e)}
                                                name="itemSize" />
                                            <span> </span>
                                            {item.size3} {debug ? val3 : ""}
                                        </label>
                                    </div> : ""
                                }
                                {(item.size4 != null && item.size4 != "") ?
                                    <div className="p-3 m-1 text-bg-dark rounded">
                                        <label>
                                            <input
                                                type="radio"
                                                checked={val4}
                                                onChange={(e) => changeRadio4(e)}
                                                name="itemSize" />
                                            <span> </span>
                                            {item.size4} {debug ? val4 : ""}
                                        </label>
                                    </div> : ""
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            {console.log(ingredientsData)}
                            {
                                ingredientsData.map((q, key) => {
                                    function changeEnabledRadio(e) {
                                        let element = e.target;
                                        // find all of the select elements for Easy, Regular, and Extra
                                        // try 10 times to find them
                                        for (let i = 0; i < 10; i++) {
                                            if (element.elements == undefined || element.elements['customizer'] == undefined) {
                                                // if not yet found, go up to the parent element
                                                element = element.parentNode;
                                            } else {
                                                // once found, break loop and use element to access all of the select elements
                                                element = element.elements['customizer'];
                                                break;
                                            }
                                        }
                                        // loop through all of the select elements
                                        for (let i = 0; i < element.length; i++) {
                                            // if the element's id attribute is equal to the ingredient's type
                                            // then it must be under the same heading because the list was sorted
                                            // by types and the same types will be grouped together
                                            if (element[i].id == q['type']) {
                                                // disable all of the select elements that are not the one
                                                // that the user has enabled
                                                if (key != i) {
                                                    element[i].disabled = "disabled";
                                                    enabled[i] = false;
                                                } else {
                                                    // enable the one that the user has enabled
                                                    element[i].disabled = null;
                                                    enabled[i] = true;
                                                }
                                            }
                                        }
                                        console.log("????? " + key + " " + enabled[key]);
                                        setEnabled(enabled.map(e => e));
                                        for (let i = 0; i < enabled.length; i++) {
                                            console.log("enabled[" + i + "]: " + enabled[i]);
                                        }
                                        itemTotal();
                                    }
                                    function changeEnabledCheckbox(e) {
                                        enabled[key] = !enabled[key];
                                        console.log(key + " " + enabled[key]);
                                        setEnabled(enabled.map(e => e));
                                        itemTotal();
                                    }
                                    function changeHalfer(e) {
                                        console.log("[[ " + e.target.value + " " + e.target.id);
                                        halfables[key] = e.target.value;
                                        console.log("]]" + halfables[key]);
                                        itemTotal();
                                    }
                                    function changeCustomizer(e) {
                                        console.log("[[ " + e.target.value + " " + e.target.id);
                                        customs[key] = e.target.value;
                                        console.log("]]" + customs[key]);
                                        itemTotal();
                                    }
                                    return (
                                        <div key={key}>
                                            {
                                                (lastCategory != q['type'] ? 
                                                    <h5 className="indent">{(q['inputType'] == 1 ? <span className="text-danger">*</span> : "")}{q['type']}</h5> : ""
                                                )
                                            }
                                            {
                                                setLastCategoryPrinted(q['type'])
                                            }
                                            <div className="p-3 m-1 text-bg-dark rounded">
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        {
                                                            (q['inputType'] == 0 ? 
                                                                (<label>
                                                                    <input
                                                                        onChange={(e) => changeEnabledCheckbox(e)}
                                                                        type="checkbox"
                                                                        id="ingredients"
                                                                        name={q['type']} />
                                                                    <span> </span>
                                                                    <span>{q['ingredients_name']}</span>
                                                                </label>)
                                                                : 
                                                                (<label>
                                                                    <input
                                                                        required
                                                                        onChange={(e) => changeEnabledRadio(e)}
                                                                        type="radio"
                                                                        id="ingredients"
                                                                        name={q['type']} />
                                                                    <span> </span>
                                                                    <span>{q['ingredients_name']}</span>
                                                                </label>)
                                                            )
                                                        }
                                                    </div>
                                                    <div className="col-lg-6 text-end">
                                                        {
                                                            <div>
                                                                <select 
                                                                        disabled={enabled[key] == false ? "disabled" : null}
                                                                        style={{visibility: q['customize'] == 0 || q['halfable'] == 0? "hidden" : "visible"}} 
                                                                        onChange={(e) => changeHalfer(e)}
                                                                        className="middle" 
                                                                        name="halfer" 
                                                                        defaultValue="Whole"
                                                                        id={key}>
                                                                    <option value="Left Half">Left half</option>
                                                                    <option value="Whole">Whole</option>
                                                                    <option value="Right Half">Right half</option>
                                                                </select>
                                                                <span> </span>
                                                                <select 
                                                                        disabled={enabled[key] == false ? "disabled" : null}
                                                                        style={{visibility: q['customize'] == 0 ? "hidden" : "visible"}}
                                                                        onChange={(e) => changeCustomizer(e)} 
                                                                        className="middle" 
                                                                        name="customizer" 
                                                                        defaultValue="Regular"
                                                                        id={q['type']}>
                                                                    <option value="Easy">Easy</option>
                                                                    <option value="Regular">Regular</option>
                                                                    <option value="Extra">Extra</option>
                                                                </select>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            <div className="row">
                                <div className="col-lg-4 m-1">
                                    <QuantitySelector
                                        className="form-control"
                                        inputValue={quantity}
                                        onInputValueChange={setQuantity} />
                                </div>
                                <div className="col-lg-8 m-1">
                                    <input
                                        type="submit"
                                        className="btn btn-primary form-control"
                                        value={"Add " + quantity + " to cart"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )
        })
    }
    </>);
}