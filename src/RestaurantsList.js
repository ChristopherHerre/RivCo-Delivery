import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const apiKey = 'AIzaSyAyg7Hqr5wUTTv2uL6PMA3-F7fcHBGzhOw';
const mapApiJs = 'https://maps.googleapis.com/maps/api/js';

export default function RestaurantsList(props) {
    const USDollar = props.USDollar;
    const debug = props.debug;
    const roundedToFixed = props.roundedToFixed;
    const setDeliveryFee = props.setDeliveryFee;
    const setRestaurant = props.setRestaurant;
    const setRestaurantName = props.setRestaurantName;
    const setRestaurantAddress = props.setRestaurantAddress;
    const address = props.address;
    const setAddress = props.setAddress;
    const setDistance = props.setDistance;
    const showGetLocation = props.showGetLocation;
    const setShowGetLocation = props.setShowGetLocation;
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantsCopy, setRestaurantsCopy] = useState([]);
    const searchInput = useRef(null);
    const [latitude, setLatitude] = useState(-1);
    const [longitude, setLongitude] = useState(-1);
    const [itemConfig, setItemConfig] = useState([]);
    const [query, setQuery] = useState("");
    const result = Object.groupBy(restaurants, r => r.category);
    
    useEffect(() => {
        axios.get('http://localhost:3000/api/restaurants')
            .then(res => {
                //console.log(res.data);
                const r = res.data.map(r => { return r });
                setRestaurants(r);
                setRestaurantsCopy(r);
            });
    }, [setRestaurants]);

    function loadAsyncScript(src) {
        return new Promise(resolve => {
            const script = document.createElement("script");
            Object.assign(script, {
                type: "text/javascript",
                async: true,
                src
            })
            script.addEventListener("load", () => resolve(script));
            document.head.appendChild(script);
        })
    }
    const extractAddress = (place) => {
        const address = {
            streetNumber: "",
            street: "",
            city: "",
            state: "",
            zip: "",
        }
        if (!Array.isArray(place?.address_components)) {
            return address;
        }
        place.address_components.forEach(component => {
            const types = component.types;
            const value = component.short_name;
            console.log(component);
            if (types.includes("street_number")) {
                address.streetNumber = value;
            }
            if (types.includes("route")) {
                address.street = value;
            }
            if (types.includes("locality")) {
                address.city = value;
            }
            if (types.includes("administrative_area_level_1")) {
                address.state = value;
            }
            if (types.includes("postal_code")) {
                address.zip = value;
            }
        });
        return address;
    }
    const initMapScript = () => {
        if (window.google) {
            return Promise.resolve();
        }
        const src = `${mapApiJs}?key=${apiKey}&libraries=places,geometry`;
        return loadAsyncScript(src);
    }
    const onChangeAddress = (autocomplete) => {
        const place = autocomplete.getPlace();
        if (place != null && place != undefined) {
            setAddress(extractAddress(place));
            console.log(place.geometry.location);
            setLatitude(place.geometry.location.lat());
            setLongitude(place.geometry.location.lng());
            setShowGetLocation(false);
        } else {
            setAddress(null);
            console.log("ERROR - Place null or undefined!");
        }
    }
    const initAutocomplete = () => {
        if (!searchInput.current) return;
        
        const autocomplete = new window.google.maps.places.Autocomplete(searchInput.current);
        const southwest = { lat: 33.833322851100824, lng: -117.46334029886367 };
        const northeast = { lat: 34.02489224499665, lng: -117.3135582245764 };
        const newBounds = new window.google.maps.LatLngBounds(southwest, northeast);
        autocomplete.setBounds(newBounds);
        autocomplete.setFields(["address_component", "geometry"]);
        autocomplete.addListener("place_changed", () => onChangeAddress(autocomplete));
        
    }
    function addressDisplayed() {
        return (
            <div className="address">
                <small>
                    Street: {address.streetNumber} {address.street}
                </small>
                <br />
                <small>City: {address.city}</small>
                <br />
                <small>State: {address.state}</small>
                <br />
                <small>Zip: {address.zip}</small>
            </div>
        );
    }

    function resetAddressWarning(e) {
        return e.target.value.length == 0 ? setShowGetLocation(true) : "";
    }
    function handleSearch(e) {
        let val = e.target.value;
        setQuery(val);
        if (val.length == 0) {
            val = null;
        }
        axios.get('http://localhost:3000/api/menu/item/search', { params: { menuItemName: val } })
            .then(res => {
                setItemConfig(res.data);
                setRestaurants(res.data.length <= 0 ? restaurantsCopy : restaurants.filter((r) => {
                    return res.data.find(x => x.restaurant === r.id);
                }))
            })
    }

    let lastCategory = "";
    function setLastCategoryPrinted(v) {
        lastCategory = v;
    }

    const restaurantData = [];
    function populateRestaurantData() {
        for (const j in result) {
            for (const i in result[j]) {
                restaurantData.push(result[j][i]);
            }
        }
    }
    populateRestaurantData();
    function Welcome() {
        initMapScript().then(() => initAutocomplete());
        return (
            showGetLocation ? 
                <div className="row search p-5">
                    <h2>Welcome to Riverside County Delivery!</h2>
                    <h1>We'll deliver fast food, groceries, alcohol, and more...</h1>
                    <div className="col-sm-12">
                        <DeliveryAddress 
                            showGetLocation={showGetLocation} 
                            setShowGetLocation={setShowGetLocation}
                            address={address} 
                        />
                        <div className="row">
                            <div className="col-sm-12">
                                <input
                                    className="form-control mt-0 text-bg-dark rounded"
                                    ref={searchInput}
                                    type="text"
                                    placeholder="### Street"
                                    onChange={(e) => resetAddressWarning(e)}
                                />
                            </div>
                        </div>
                        {debug ? addressDisplayed : ""}
                    </div>
                </div> : ""
        )
    }
    return (
        <div>
            <Welcome />
            {
                !showGetLocation ? 
                    <DeliveryAddress 
                        showGetLocation={showGetLocation} 
                        setShowGetLocation={setShowGetLocation} 
                        address={address} 
                    /> 
                : ""
            }
            <br />
            {
                !showGetLocation ?
                    <div className="row">
                        <div className="col-sm-12">
                            <input 
                                placeholder="Search for item..." 
                                className="form-control text-bg-dark rounded" 
                                value={query} 
                                onChange={(e) => handleSearch(e)} 
                                type="text" 
                            />
                        </div>
                    </div>
                : ""
            }
            {!showGetLocation ? 
                restaurantData.map((data, key) => {
                    const h = haversine_dist(data.lat, data.lng, latitude, longitude);
                    const fee = 10 + (h < 1 ? 1 : h);
                    const maxFee = 100;
                    function selectRestaurant(data) {
                        setRestaurantName(data.name);
                        setRestaurant(data.id);
                        setRestaurantAddress(data.address);
                        setDeliveryFee(fee);
                        setDistance(h);
                    }
                    return (
                        <span key={key}>
                            {data.category != null && lastCategory != data.category ? <h5 className="indent">{data.category}</h5> : ""}
                            {data.category != null ? setLastCategoryPrinted(data.category) : ""}
                            <Link to={"/menu"}>
                                <button
                                    className="btn btn-primary m-1"
                                    onClick={(e) => selectRestaurant(data)}>
                                    <b>{data.name}</b>
                                    <br />
                                    <small>
                                        {data.address}
                                        <br />
                                        <span>
                                            {fee > maxFee ? "--" : USDollar.format(roundedToFixed(fee, 2))}
                                        </span> Delivery Fee
                                    </small>
                                    <br />
                                    <small><span>
                                        {roundedToFixed(h, 1)}</span> Miles
                                    </small>
                                </button>
                            </Link>
                        </span>
                    );
                }) : ""
            }
        </div>
    );
}

export function haversine_dist(lat, lng, lat2, lng2) {
    var R = 3958.8;
    var rlat1 = lat2 * (Math.PI / 180);
    var rlat2 = lat * (Math.PI / 180);
    var difflat = rlat2 - rlat1;
    var difflon = (lng - lng2) * (Math.PI / 180);
    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return d;
}

export function getStreetOnly(address) {
    return address.streetNumber + " " + address.street;
}

export function getFullAddress(address) {
    if (address == undefined) {
        return "Error";
    }
    const streetNumber = address.streetNumber + " ";
    const street = address.street ? address.street + ", " : "";
    const city = address.city ? address.city + ", " : "";
    const state = address.state ? address.state + " " : "";
    const zip = address.zip;
    return streetNumber + street + city + state + zip;
}

export function DeliveryAddress(props) {
    const showGetLocation = props.showGetLocation;
    const setShowGetLocation = props.setShowGetLocation;
    const address = props.address;
    const defaultAddress = function () {
        return <span className='text-danger'>
            <u>Address Required Below!</u>
        </span>
    };
    function changeAddress() {
        setShowGetLocation(true);
        //navigate("/");
    }
    return (
        <h6 className="m-1">
            Deliver to: {showGetLocation ? defaultAddress() : 
                <span>
                    <mark className="linespacing">
                        {getFullAddress(address)}
                    </mark>
                    <span> </span>
                    <a 
                        href="#"
                        onClick={(e) => changeAddress()}>Update
                    </a>
                </span>}
        </h6>
    );
}
