import React, { useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import { dbPost } from './Admin';

export default function Admin2(props) {
    const [arr, setArr] = useState([]);
    const [id, setId] = useState(1);
    const [name, setName] = useState();
    const [price, setPrice] = useState("");
    const [size1, setSize1] = useState("");
    const [size2, setSize2] = useState("");
    const [size3, setSize3] = useState("");
    const [size4, setSize4] = useState("");
    const [ingredient1, setIngredient1] = useState("");
    const [ingredient2, setIngredient2] = useState("");
    const [ingredient3, setIngredient3] = useState("");
    const [ingredient4, setIngredient4] = useState("");
    const [ingredient5, setIngredient5] = useState("");
    const [ingredient6, setIngredient6] = useState("");
    const [ingredient7, setIngredient7] = useState("");
    const [ingredient8, setIngredient8] = useState("");
    const [restaurant, setRestaurant] = useState("");

    function submitUpdateMenuItem(e) {
        const form = e.target;
        const inputs = {
            mid: form.elements['mid'].value,
            mi_name: form.elements['mi_name'].value,
            restaurant: form.elements['restaurant'].value,
            price: form.elements['price'].value,
            size1: form.elements['size1'].value,
            size2: form.elements['size2'].value,
            size3: form.elements['size3'].value,
            size4: form.elements['size4'].value,
            ingredient1: form.elements['ingredient1'].value,
            ingredient2: form.elements['ingredient2'].value,
            ingredient3: form.elements['ingredient3'].value,
            ingredient4: form.elements['ingredient4'].value,
            ingredient5: form.elements['ingredient5'].value,
            ingredient6: form.elements['ingredient6'].value,
            ingredient7: form.elements['ingredient7'].value,
            ingredient8: form.elements['ingredient8'].value
        };
        console.log(inputs)
        dbPost(e, form, inputs, "updateMenuItem");
    }
    useEffect(() => {
        console.log("Admin2 useEffecgt")
        axios.get('http://localhost:3000/api/menu/item',
                { params: { menuItem: id } }).then(res => {
            console.log(res.data);
            setArr(res.data);
            console.log("lllllllllll "+res.data[0]["name"]);
            setName(res.data[0]["name"]);
            setPrice(res.data[0]["price"]);
            setSize1(res.data[0]["size1"]);
            setSize2(res.data[0]["size2"]);
            setSize3(res.data[0]["size3"]);
            setSize4(res.data[0]["size4"]);
            setIngredient1(res.data[0]["ingredient1"]);
            setIngredient2(res.data[0]["ingredient2"]);
            setIngredient3(res.data[0]["ingredient3"]);
            setIngredient4(res.data[0]["ingredient4"]);
            setIngredient5(res.data[0]["ingredient5"]);
            setIngredient6(res.data[0]["ingredient6"]);
            setIngredient7(res.data[0]["ingredient7"]);
            setIngredient8(res.data[0]["ingredient8"]);
            setRestaurant(res.data[0]["restaurant"]);
        });
    }, [id, setId]);
    function changeId(e) {
        console.log(e.target.value);
        setId(e.target.value);
        const newArr = arr.map((m) => {
            return m;
        });
    }
    return(
        <form onSubmit={(e) => submitUpdateMenuItem(e)}>
            {
                arr.map((mi, key) => {
                    return (
                        <div className="row m-3" key={key}>
                            <h2>Update Menu Item</h2>
                            <div className="col-sm-3">
                                <label>ID: </label>
                                <input
                                    name="mid"
                                    value={mi.id}
                                    className="form-control"
                                    onChange={(e) => changeId(e)}
                                    type="number" />
                            </div>
                            <div className="col-sm-6">
                                <label>Name: </label>
                                <input
                                    name="mi_name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-3">
                                <label>Price: </label>
                                <input
                                    name="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-3">
                                <label>Size1: </label>
                                <input
                                    name="size1"
                                    value={size1}
                                    onChange={(e) => setSize1(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-3">
                                <label>Size2: </label>
                                <input
                                    name="size2"
                                    value={size2}
                                    onChange={(e) => setSize2(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-3">
                                <label>Size3: </label>
                                <input
                                    name="size3"
                                    value={size3}
                                    onChange={(e) => setSize3(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-3">
                                <label>Size4: </label>
                                <input
                                    name="size4"
                                    value={size4}
                                    onChange={(e) => setSize4(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-3">
                                <label>Restaurant: </label>
                                <input
                                    name="restaurant"
                                    value={restaurant}
                                    onChange={(e) => setRestaurant(e.target.value)}
                                    className="form-control"
                                    type="number" />
                            </div>
                            <div className="col-sm-3">
                                <label>Ingredient1: </label>
                                <input
                                    name="ingredient1"
                                    value={ingredient1}
                                    onChange={(e) => setIngredient1(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-3">
                                <label>Ingredient2: </label>
                                <input
                                    name="ingredient2"
                                    value={ingredient2}
                                    onChange={(e) => setIngredient2(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-3">
                                <label>Ingredient3: </label>
                                <input
                                    name="ingredient3"
                                    value={ingredient3}
                                    onChange={(e) => setIngredient3(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-3">
                                <label>Ingredient4: </label>
                                <input
                                    name="ingredient4"
                                    value={ingredient4}
                                    onChange={(e) => setIngredient4(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-3">
                                <label>Ingredient5: </label>
                                <input
                                    name="ingredient5"
                                    value={ingredient5}
                                    onChange={(e) => setIngredient5(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-3">
                                <label>Ingredient6: </label>
                                <input
                                    name="ingredient6"
                                    value={ingredient6}
                                    onChange={(e) => setIngredient6(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-3">
                                <label>Ingredient7: </label>
                                <input
                                    name="ingredient7"
                                    value={ingredient7}
                                    onChange={(e) => setIngredient7(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-3">
                                <label>Ingredient8: </label>
                                <input
                                    name="ingredient8"
                                    value={ingredient8}
                                    onChange={(e) => setIngredient8(e.target.value)}
                                    className="form-control"
                                    type="text" />
                            </div>
                            <div className="col-sm-4">
                                <br />
                                <input
                                    type="submit"
                                    className="btn btn-primary form-control"
                                />
                            </div>
                        </div>
                    );
                })
            }
        </form>
    )
}