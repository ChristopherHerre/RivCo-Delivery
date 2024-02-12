import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import currency from 'currency.js';
import { CartItemDetails, calcSubtotal, Subtotal, Ingredients } from './Cart';
import { roundedToFixed } from './App';
import { DeliveryAddress, getStreetOnly } from './RestaurantsList';
import { dbPost2 } from './Admin';

export default function Checkout(props) {
	const USDollar = props.USDollar;
	const cart = props.cart;
	const setCart = props.setCart;
	const address = props.address;
	const distance = props.distance;
    const showGetLocation = props.showGetLocation;
	const setShowGetLocation = props.setShowGetLocation;
	const restaurantAddress = props.restaurantAddress;
	const deliveryFee = props.deliveryFee;
	const [subtotal, setSubtotal] = useState(0.00);
	const [businessType1, setBusinessType1] = useState(0);
	const [businessType2, setBusinessType2] = useState(0);
	const [businessType3, setBusinessType3] = useState(0);
	const [textAreaValue, setTextAreaValue] = useState("");
	const [knockType1, setKnockType1] = useState(0);
	const [knockType2, setKnockType2] = useState(0);
	const [knockType3, setKnockType3] = useState(0);
	const navigate = useNavigate();
	useEffect(() => {
		if (cart.length < 1)
			navigate("/");
		let newSubtotal = calcSubtotal(cart, setSubtotal);
		setSubtotal(newSubtotal);
	}, [cart]);
	return (cart.length > 0 ? (
		<form onSubmit={(e) => submit(e)}>
			<h1>Checkout</h1>
			<DeliveryAddress 
				showGetLocation={showGetLocation} 
				setShowGetLocation={setShowGetLocation} 
				address={address} 
			/>
			<div className="row">
				<DeliveryInstructions 
					setTextAreaValue={setTextAreaValue} 
				/>
				<BusinessTypes
					businessType1={businessType1}
					setHome={setHome}
					businessType2={businessType2}
					setApartment ={setApartment}
					businessType3 = {businessType3}
					setBusiness = {setBusiness}
				/>
				<KnockTypes
					knockType1={knockType1}
					setKnock={setKnock}
					knockType2={knockType2}
					setRing ={setRing}
					knockType3 = {knockType3}
					setLeave = {setLeave}
				/>
			</div>
			<OrderReview
				USDollar={USDollar}
				cart={cart}
				subtotal={subtotal}
				deliveryFee={deliveryFee}
			/>
		</form>) : <h1>Error: You cannot view this page right now.</h1>
	);
	function submit(e) {
		e.preventDefault();
		const addr = getStreetOnly(address);
		console.log("submitted " 
			+ addr + " " 
			+ textAreaValue + " " 
			+ businessType1 + " " 
			+ businessType2 + " " 
			+ businessType3 + " "
			+ knockType1 + " " 
			+ knockType2 + " " 
			+ knockType3);
		let bt = "";
		if (businessType1 == 1) {
			bt = "Home";
		} else if (businessType2 == 1) {
			bt = "Apartment";
		} else if (businessType3 == 1) {
			bt = "Business";
		}
		let kt = "";
		if (knockType1 == 1) {
			kt = "Knock on door";
		} else if (knockType2 == 1) {
			kt = "Ring doorbell";
		} else if (knockType3 == 1) {
			kt = "Leave at door";
		} 
		const userInputData = [
			addr, 
			textAreaValue, 
			bt,
			kt,
			cart.length,
			cart[0].restaurant,
			restaurantAddress,
			roundedToFixed(deliveryFee, 2),
			roundedToFixed(subtotal, 2),
			roundedToFixed(distance, 1)
		];
		let cartClone = [];
		for (let i = 0; i < cart.length; i++) {
			console.log(cart[i].name);
			let size = "";
			if (cart[i].val1 == 1) {
				size = cart[i].size1;
			} else if (cart[i].val2 == 1) {
				size = cart[i].size2;
			} else if (cart[i].val3 == 1) {
				size = cart[i].size3;
			} else if (cart[i].val4 == 1) {
				size = cart[i].size4;
			}
			console.log(size + "\n" + 
				Ingredients(cart[i]) + "\n" + 
				cart[i].price + "\n" + cart[i].quantity
			);
			const cartData = [
				cart[i].name,
				size,
				cart[i].price,
				cart[i].quantity,
				Ingredients(cart[i], 0),
			];
			cartClone.push(cartData);
		}
		dbPost2(e, [userInputData, cartClone], "co");
		setCart([]);
		navigate("/success");
	}
	function setHome() {
		setBusinessType1(true)
		setBusinessType2(false)
		setBusinessType3(false)
	}
	function setApartment() {
		setBusinessType1(false)
		setBusinessType2(true)
		setBusinessType3(false)
	}
	function setBusiness() {
		setBusinessType1(false)
		setBusinessType2(false)
		setBusinessType3(true)
	}
	function setKnock() {
		setKnockType1(true)
		setKnockType2(false)
		setKnockType3(false)
	}
	function setRing() {
		setKnockType1(false)
		setKnockType2(true)
		setKnockType3(false)
	}
	function setLeave() {
		setKnockType1(false)
		setKnockType2(false)
		setKnockType3(true)
	}
}

export function OrderReview(props) {
	const cart = props.cart;
	const subtotal = props.subtotal;
	const deliveryFee = props.deliveryFee;
	const USDollar = props.USDollar;
	return (
		<div className="row m-1">
			<div className="col-md-12 text-center p-1">
				<h3>Order Review</h3>
			</div>
			<div className="col-md-7">
			{
				cart.map((ci, key) => {
					return (
						<div key={key} className="cartitem p-3">
							<CartItemDetails 
								USDollar={USDollar}
								cartItem={ci} />	
						</div>
					)
				})
			}
			</div>
			<div className="col-md-5">
				<Subtotal
					USDollar={USDollar}
					subtotal={subtotal} />
				<h3 className="text-end">
					Service Fee: <b>{USDollar.format(roundedToFixed(deliveryFee, 2))}</b>
				</h3>
				<h3 className="text-end">
					Total: <b>
						{USDollar.format(roundedToFixed(currency(subtotal)
							.add(currency(deliveryFee)).value, 2))
						}</b>
				</h3>
				<button className="btn btn-primary form-control">
					Place order
				</button>
			</div>
		</div>
	)
}

export function KnockTypes(props) {
	const knockType1 = props.knockType1;
  	const setKnock = props.setKnock;
  	const knockType2 = props.knockType2
  	const setRing = props.setRing;
  	const knockType3 = props.knockType3;
  	const setLeave = props.setLeave;
	return (
		<div className="col-md-6">
			<h5 className="m-1"><span className="text-danger">*</span>Drop-off type</h5>
			<div className="text-bg-dark p-3 m-1 rounded">
				<label>
					<input 
						required 
						checked={knockType1} 
						onChange={(e) => setKnock()} 
						name="knocktype" 
						type="radio" 
					/> Knock on door
				</label>
			</div>
			<div className="text-bg-dark p-3 m-1 rounded">
				<label>
					<input 
						required 
						checked={knockType2}
						onChange={(e) => setRing()} 
						name="knocktype" 
						type="radio"
					/> Ring doorbell
				</label>
			</div>
			<div className="text-bg-dark p-3 m-1 rounded">
				<label>
					<input 
						required 
						checked={knockType3}
						onChange={(e) => setLeave()} 
						name="knocktype"
						type="radio"
					/> Leave at door
				</label>
			</div>
		</div>
	)
}

export function BusinessTypes(props) {
	const businessType1 = props.businessType1;
  	const setHome = props.setHome;
  	const businessType2 = props.businessType2
  	const setApartment = props.setApartment;
  	const businessType3 = props.businessType3;
  	const setBusiness = props.setBusiness;
	return (
		<div className="col-md-6">
			<h5 className="m-1"><span className="text-danger">*</span>Destination type</h5>
			<div className="text-bg-dark p-3 m-1 rounded">
				<label>
					<input 
						required 
						checked={businessType1} 
						onChange={(e) => setHome()} 
						name="deliverytype" 
						type="radio" 
					/> Home
				</label>
			</div>
			<div className="text-bg-dark p-3 m-1 rounded">
				<label>
					<input 
						required 
						checked={businessType2}
						onChange={(e) => setApartment()} 
						name="deliverytype" 
						type="radio"
					/> Apartment
				</label>
			</div>
			<div className="text-bg-dark p-3 m-1 rounded">
				<label>
					<input 
						required 
						checked={businessType3}
						onChange={(e) => setBusiness()} 
						name="deliverytype"
						type="radio"
					/> Business
				</label>
			</div>
		</div>
	)
}

export function DeliveryInstructions(props) {
	const setTextAreaValue = props.setTextAreaValue;
	return (
		<div className="col-md-12">
			<div className="text-bg-dark p-3 m-1 rounded">
				<h4>Delivery Instructions:</h4>
				<textarea
					onChange={(e) => setTextAreaValue(e.target.value)}
					rows="2" 
					placeholder="Enter delivery instructions here..." 
					className="form-control text-bg-dark " 
				/>
			</div>
		</div>
	)
}