import React, { useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';

export default function Admin(props) {
    const [arr, setArr] = useState([]);
    const [arr2, setArr2] = useState([]);
    const [restaurant, setRestaurant] = useState(1);
    function submitAddRestaurant(e) {
        const form = e.target;
        const inputs = {
            name: form.elements['name'].value,
            address: form.elements['address'].value,
            latitude: form.elements['latitude'].value,
            longitude: form.elements['longitude'].value,
        };
        dbPost(e, form, inputs, "addRestaurant");
    }
    function submitAddMenuItem(e) {
        const form = e.target;
        const inputs = {
            mi_name: form.elements['mi_name'].value,
            restaurant: form.elements['restaurant'].value,
            price: form.elements['price'].value,
            size1: form.elements['size1'].value,
            size2: form.elements['size2'].value,
            size3: form.elements['size3'].value,
            size4: form.elements['size4'].value,
        };
        dbPost(e, form, inputs, "addMenuItem");
    }
    function submitUpdateMenuItem(e) {
        console.log(99999)
        const form = e.target;
        const inputs = {
            mid: form.elements['mid'].value,
            mi_name: form.elements['mi_name'].value,
            price: form.elements['price'].value,
        };
        console.log(inputs)
        dbPost(e, form, inputs, "updateMenuItem");
    }
    useEffect(() => {
        axios.get('http://localhost:3000/api/restaurants')
            .then(res => {
                console.log(res.data);
                setArr2(res.data);
            });
        axios.get('http://localhost:3000/api/menu', { params: { restaurant: restaurant } }).then(res => {
            console.log(res.data);
            setArr(res.data);
        });
    }, [restaurant, setRestaurant]);
    return (
        <div>
            <form onSubmit={(e) => submitAddRestaurant(e)}>
                <div className="row m-3">
                    <h2>Add Restaurant</h2>
                    <div className="col-sm-6">
                        <label>Latitude: </label>
                        <br />
                        <input
                            className="form-control"
                            name="latitude"
                            type="text" />
                    </div>
                    <div className="col-sm-6">
                        <label>Longitude: </label>
                        <br />
                        <input
                            className="form-control"
                            name="longitude"
                            type="text" />
                    </div>
                    <div className="col-sm-4">
                        <label>Name: </label>
                        <br />
                        <input
                            className="form-control"
                            name="name"
                            type="text" />
                    </div>
                    <div className="col-sm-4">
                        <label>Address: </label>
                        <br />
                        <input
                            className="form-control"
                            name="address"
                            type="text" />
                    </div>
                    <div className="col-sm-4">
                        <br />
                        <input
                            className="form-control btn btn-primary"
                            type="submit" />
                    </div>
                </div>
            </form>
            <form onSubmit={(e) => submitAddMenuItem(e)}>
                <div className="row m-3">
                    <h2>Add Menu Item</h2>
                    <div className="col-sm-6">
                        <label>Name: </label>
                        <br />
                        <input
                            className="form-control"
                            name="mi_name"
                            type="text" />
                    </div>
                    <div className="col-sm-3">
                        <label>Restaurant: </label>
                        <br />
                        <input
                            className="form-control"
                            name="restaurant"
                            type="number" />
                    </div>
                    <div className="col-sm-3">
                        <label>Price: </label>
                        <br />
                        <input
                            className="form-control"
                            name="price"
                            type="text" />
                    </div>
                    <div className="col-sm-3">
                        <label>Size1: </label>
                        <br />
                        <input
                            className="form-control"
                            name="size1"
                            type="text" />
                    </div>
                    <div className="col-sm-3">
                        <label>Size2: </label>
                        <br />
                        <input
                            className="form-control"
                            name="size2"
                            type="text" />
                    </div>
                    <div className="col-sm-3">
                        <label>Size3: </label>
                        <br />
                        <input
                            className="form-control"
                            name="size3"
                            type="text" />
                    </div>
                    <div className="col-sm-3">
                        <label>Size4: </label>
                        <br />
                        <input
                            className="form-control"
                            name="size4"
                            type="text" />
                    </div>
                    <div className="col-sm-4">
                        <br />
                        <input
                            className="form-control btn btn-primary"
                            type="submit" />
                    </div>
                </div>
            </form>
            <form>
            {
                arr2.map((r, key) => {
                    return (
                        <div className="row m-3" key={key}>
                            <h2>Update {r.name}</h2>
                            <div className="col-sm-6">
                                <label>Lat: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder={r.lat} />
                            </div>
                            <div className="col-sm-6">
                                <label>Lng: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder={r.lng} />
                            </div>
                            <div className="col-sm-4">
                                <label>Name: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder={r.name} />
                            </div>
                            <div className="col-sm-4">
                                <label>Address: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder={r.address} />
                            </div>
                            <div className="col-sm-4">
                                <br />
                                <button
                                    className="btn btn-primary form-control">
                                    <i className="bi bi-arrow-clockwise"></i> {r.name}
                                </button>
                            </div>
                        </div>
                    );
                })
            }
            </form>
        </div>
    );
}

export function dbPost(e, form, inputs, route) {
    e.preventDefault(e);
    console.log("submit " + Object.values(form));
    const url = "http://localhost:3000/api/" + route;
    const options = {
        method: 'POST',
        headers: {
            'content-type':
                'application/x-www-form-urlencoded'
        },
        data: qs.stringify(inputs),
        url,
    };
    axios(options);
    console.log(qs.stringify(inputs));
}

export function dbPost2(e, inputs, route) {
    e.preventDefault(e);
    //console.log("submit " + Object.values(form));
    const url = "http://localhost:3000/api/" + route;
    const options = {
        method: 'POST',
        headers: {
            'content-type':
                'application/x-www-form-urlencoded'
        },
        data: qs.stringify(inputs),
        url,
    };
    axios(options);
    console.log(qs.stringify(inputs));
}