import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import ShowMenu from './ShowMenu';
import ShowMenuItem from './ShowMenuItem';
import RestaurantsList from './RestaurantsList';
import Cart from './Cart';
import Admin from './Admin';
import Admin2 from './Admin2'
import Checkout from './Checkout'
import axios from 'axios';
import qs from 'qs';

export function App() {
	const [cart, setCart] = useState([]);
	const [cartAmount, setCartAmount] = useState(0);
	const [orders, setOrders] = useState([]);// Orders that have been placed by all users.
	const [orderItems, setOrderItems] = useState([]);
	const [restaurant, setRestaurant] = useState(-1);
	const [restaurantName, setRestaurantName] = useState("");
	const [restaurantAddress, setRestaurantAddress] = useState("");
	const [deliveryFee, setDeliveryFee] = useState(0.00);
	const [menuItem, setMenuItem] = useState(-1);
	const [showGetLocation, setShowGetLocation] = useState(false);
	const [address, setAddress] = useState({});
	const [debug, setDebug] = useState(false);
	const [distance, setDistance] = useState(0);
	useEffect(() => {
		console.log("useEffect App")
		let ca = 0;
		for (const item in cart) {
			ca += cart[item].quantity;
		}
		setCartAmount(ca)
	}, [cart, setCart, setCartAmount, setOrderItems]);
	let USDollar = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	function Badge() {
		return (
			cartAmount > 0 ? 
				<span className="badge bg-danger">
					{cartAmount}
				</span>
			: ""
		)
	}
	function servicesForm() {
		return (
			<BrowserRouter>
				<div className="outter mx-auto">
					<div className="row">
						<div className="col-sm-6">
							<Link to="/">
								<button className="removebutton align-text-bottom">
									<span className="logofont2">RivCo</span>
									<span className="logofont">DELIVERY</span>
								</button>
							</Link>
						</div>
						<div className="col-sm-6 text-sm-end text-xs-end ">
							<Link to="/cart">
								<button className="btn btn-secondary btn-lg m-1">
									<i className="bi bi-cart"></i> Cart <Badge />
								</button>
							</Link>
						</div>
					</div>
					<div className="mx-auto p-3 blackborder">
						<Routes>
							<Route
								path='*'
								exact={true}
								element={
									<RestaurantsList
										USDollar={USDollar}
										setRestaurant={setRestaurant}
										setRestaurantName={setRestaurantName}
										roundedToFixed={roundedToFixed}
										showGetLocation={showGetLocation}
										setShowGetLocation={setShowGetLocation}
										address={address}
										setAddress={setAddress}
										setRestaurantAddress={setRestaurantAddress}
										setDeliveryFee={setDeliveryFee}
										debug={debug}
										setDistance={setDistance}
									/>
								}
							/>
							<Route
								path={"/orders"}
								element={
									<OrderList
										orders={orders}
										setOrders={setOrders}
										orderItems={orderItems}
										setOrderItems={setOrderItems}
										USDollar={USDollar}
									/>
								}
							/>
							<Route
								path={"/success"}
								element={
									<h1 className="text-center">
										Your order has been received!
									</h1>
								}
							/>
							<Route
								path={"/menu"}
								element={
									<ShowMenu
										restaurantName={restaurantName}
										restaurant={restaurant}
										menuItem={menuItem}
										setMenuItem={setMenuItem}
									/>
								}
							/>
							<Route
								path={"/menu/item"}
								element={
									<ShowMenuItem
										USDollar={USDollar}
										cartAmount={cartAmount}
										setCartAmount={setCartAmount}
										restaurant={restaurant}
										restaurantName={restaurantName}
										restaurantAddress={restaurantAddress}
										menuItem={menuItem}
										debug={debug}
										cart={cart}
										setCart={setCart} />
								}
							/>
							<Route
								path={"/cart"}
								element={
									<Cart
										USDollar={USDollar}
										cartAmount={cartAmount}
										setCartAmount={setCartAmount}
										cart={cart}
										setCart={setCart} />
								} 
							/>
							<Route
								path={"/checkout"}
								element={
									<Checkout
										USDollar={USDollar}
										cart={cart}
										setCart={setCart}
										showGetLocation={showGetLocation}
										setShowGetLocation={setShowGetLocation}
										address={address}
										setAddress={setAddress}
										restaurantAddress={restaurantAddress}
										setRestaurantAddress={setRestaurantAddress}
										deliveryFee={deliveryFee}
										distance={distance}
									/>
								} 
							/>
							<Route
								path={"/admin"}
								element={
									<Admin />
								}
							/>
							<Route
								path={"/admin2"}
								element={
									<Admin2 />
								}
							/>
						</Routes>
					</div>
					<Link to="/admin">
						Admin
					</Link>
					<span> </span>
					<Link to="/admin2">
						Admin2
					</Link>
					<span> </span>
					<Link to="/orders">
						Orders
					</Link>
				</div>
			</BrowserRouter>
		);
	}
	return (
		<div>
			<br />
			<div>{servicesForm()}</div>
			<br />
		</div>
	);
}
export function dbPost2(e, inputs, route) {
    e.preventDefault(e);
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
}

export function roundedToFixed(input, digits) {
	var rounder = Math.pow(10, digits);
	var result = (Math.round(input * rounder) / rounder).toFixed(digits);
	return result;
}

export function OrderList(props) {
	const orders = props.orders;
	const setOrders = props.setOrders;
	const orderItems = props.orderItems;
	const setOrderItems = props.setOrderItems;
	const USDollar = props.USDollar;
    useEffect(() => {
		console.log("ordersList");
        axios.get('http://localhost:3000/api/orders')
            .then(res => {
                console.log(res.data);
                setOrders(res.data);
            });
	}, []);
    return (
		<>
			<div className="row">
				<div className="col-sm-12">
					<h1>Open Orders</h1>
				</div>
			</div>
			<OrderButtons 
				setOrderItems={setOrderItems} 
				orderItems={orderItems} 
				orders={orders}
				setOrders={setOrders}
				USDollar={USDollar}
			/>
		</>
    );
}

export function OrderButtons(props) {
	const orderItems = props.orderItems;
	const orders = props.orders;
	const setOrders = props.setOrders;
	const setOrderItems = props.setOrderItems;
	const USDollar = props.USDollar;
	const [showInstructions, setShowInstructions] = useState(false);
	const [instructions, setInstructions] = useState("");
	const [knockType, setKnockType] = useState("");
	const [fee, setFee] = useState(0.00);
	const [subtotal, setSubtotal] = useState(0.00);
	useEffect(() => {
		setOrderItems([]);
	}, [])
	function changeOrderOpen(e, iid) {
		e.preventDefault(e);
		if (e.target.value == "closed") {
			console.log("!! " + e.target.value + " " + iid);
			dbPost2(e, [iid], "changeOrderOpen");
			setOrders(orders.filter(function(o) { 
				return o.id !== iid
			}));
			e.target.value = "open";
		}
	}
	function getOrderItems(id, instructionsp, knockTypep, f, s) {
		console.log("oid: " + id)
		axios.get('http://localhost:3000/api/order_items',
		{ params: { oid: id } })
            .then(res => {
                console.log(res.data);
                setOrderItems(res.data);
			});
		setShowInstructions(true);
		setKnockType(knockTypep);
		setInstructions(instructionsp);
		setFee(f);
		setSubtotal(s);
	}
	return (
		<div className="row">
			{
				showInstructions ? 
					<div className="col-md-12">
						<h3 className="text-bg-dark text-center p-1">Delivery Instructions</h3>
						
						<div className="row">
							<div className="col-md-6">
								<ul>
									<li>{knockType}</li>
								</ul>
							</div>
							<div className="col-md-6">
								<ul>
									<li>{instructions}</li>
								</ul>
							</div>
						</div>
					</div> : ""
			}
			<div className="col-md-6">
				<h3 className="text-bg-dark text-center p-1">Order Items</h3>
				<ol className="blackborder mb-2">
					{
						orderItems.length > 0 ?
							<div className="row m-1 alert alert-warning">
								
								<div className="col-xxl-6 text-start">
									Delivery Fee: <b className="text-success">{USDollar.format(fee)}</b>
								</div>
								<div className="col-xxl-6 text-xxl-end">
									Subtotal: <b className="text-success">{USDollar.format(subtotal)}</b>
								</div>
							</div>
						: ""
					}
					{
						orderItems.length < 1 ? (
							<>
								<div>None.</div>
								<div>Select an order first.</div>
							</>
						) : 
						(
							orderItems.map((oi, key2) => {
								return (
									<li className="cartitem p-3" key={key2}>
										<h5>{oi.name}</h5>
										<div>
											<b className="text-success">
												${oi.price} x {oi.quantity} = ${oi.price * oi.quantity}
											</b>
										</div>
										<div>
											{oi.size}
										</div>
										<div>
											{oi.ingredients}
										</div>
									</li>
								)
							})
						)
					}
				</ol>
			</div>
			<div className="col-md-6">
				<h3 className="text-bg-dark text-center p-1">Orders</h3>
				{
					orders.map((o, key) => {
						return (
							<div className="row" key={key}>
								<div className="col-sm-8">
									<button
											className="btn btn-primary form-control m-1" 
											onClick={(e) => getOrderItems(o.id, o.text, o.knockType, o.deliveryFee, o.subtotal)}>
										<div key={key} className="row">
											<div className="col-lg-12">
												{
													new Intl.DateTimeFormat('en-US', {
														dateStyle: 'short',
														timeStyle: 'short',
														timeZone: "America/Los_Angeles"
													}).format(new Date(o.date))
												}
											</div>
											<div className="col-lg-12">
												<b>{o.restaurant}</b>
											</div>
											<div>
												{o.restaurantAddress}
											</div>
											<div className="col-lg-12">
												{o.address}
											</div>
											<div className="col-lg-12">
												{o.distance} miles
											</div>
											<div className="col-lg-12">
												{o.businessType}
											</div>
										</div>
									</button>
								</div>
								<div className="col-sm-4">
									<select 
											onChange={(e) => changeOrderOpen(e, o.id, o.knockType)}
											className="form-control text-bg-dark m-1" 
											name={key}
											defaultValue={o.open == 0 ? "open" : "closed" } 
											id={key}>
										<option value="open">Open</option>
										<option value="closed">Closed</option>
									</select>
								</div>
							</div>
						)
					})
				}
			</div>
		</div>
	)
}
export default App;