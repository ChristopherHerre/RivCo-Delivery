import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'

export default function ShowMenu(props) {
    const restaurant = props.restaurant;
    const menuItem = props.menuItem;
    const setMenuItem = props.setMenuItem;
    const restaurantName = props.restaurantName;
    const [menu, setMenu] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (props.restaurant < 0)
            navigate("/");
        axios.get('http://localhost:3000/api/menu', { params: { restaurant: restaurant } }).then(res => {
            console.log(res.data);
            setMenu(res.data);
        });
    }, []);
    function changeMenuItem(m) {
        setMenuItem(m.id);
        console.log("menu = " + menuItem);
    }
    return (
        <div>
            <Link to="/">
                <button className="btn btn-secondary btn-lg m-1">
                    <i className="bi bi-arrow-return-left"></i> Back
                </button>
            </Link>

            <h2 className="m-1">{restaurantName} Menu</h2>
            {
                menu.map((m, key) =>
                    <Link key={key} to="/menu/item">
                        <button
                            className="btn btn-primary m-1"
                            onClick={(e) => changeMenuItem(m)}>
                            {m.name}
                        </button>
                    </Link>
                )
            }
        </div>
    )
}
