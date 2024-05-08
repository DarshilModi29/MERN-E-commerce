import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLocation } from 'react-router-dom'
import Swal from 'sweetalert2';

export default function Checkout() {
    const location = useLocation();
    let name = [];

    const initPayment = (data) => {
        const options = {
            key: process.env.KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: Object.keys(location.state.billAmounts.productDetails),
            description: "Test Description",
            order_id: data.id,
            handler: async (response) => {
                try {
                    const verifyUrl = "http://localhost:5001/verify";
                    const resp = await fetch(verifyUrl, {
                        method: "POST",
                        body: JSON.stringify({
                            response
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    const data = await resp.json();
                    if (resp.ok) {
                        Swal.fire({
                            icon: "success",
                            title: `Payment successful!`,
                            text: data.message,
                        })
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#ffc800"
            }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    }

    const handlePayment = async () => {
        try {
            let url = "http://localhost:5001/orders";
            const resp = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    amount: location.state.billAmounts.total
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (resp.ok) {
                const data = await resp.json();
                console.log(data.data);
                initPayment(data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Navbar />
            {/* Breadcrumb Start */}
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <a className="breadcrumb-item text-dark" href="#">Home</a>
                            <a className="breadcrumb-item text-dark" href="#">Shop</a>
                            <span className="breadcrumb-item active">Checkout</span>
                        </nav>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}
            {/* Checkout Start */}
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-lg-8">
                        <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Billing Address</span></h5>
                        <form>
                            <div className="bg-light p-30 mb-5">

                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>First Name</label>
                                        <input className="form-control" type="text" placeholder="John" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Last Name</label>
                                        <input className="form-control" type="text" placeholder="Doe" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>E-mail</label>
                                        <input className="form-control" type="text" placeholder="example@email.com" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Mobile No</label>
                                        <input className="form-control" type="text" placeholder="+123 456 789" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Address Line 1</label>
                                        <input className="form-control" type="text" placeholder="123 Street" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Address Line 2</label>
                                        <input className="form-control" type="text" placeholder="123 Street" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Country</label>
                                        <select className="custom-select">
                                            <option selected>United States</option>
                                            <option>Afghanistan</option>
                                            <option>Albania</option>
                                            <option>Algeria</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>City</label>
                                        <input className="form-control" type="text" placeholder="New York" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>State</label>
                                        <input className="form-control" type="text" placeholder="New York" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>ZIP Code</label>
                                        <input className="form-control" type="text" placeholder={123} />
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="newaccount" />
                                            <label className="custom-control-label" htmlFor="newaccount">Create an account</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="shipto" />
                                            <label className="custom-control-label" htmlFor="shipto" data-toggle="collapse" data-target="#shipping-address">Ship to different address</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="collapse mb-5" id="shipping-address">
                            <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Shipping Address</span></h5>
                            <div className="bg-light p-30">
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>First Name</label>
                                        <input className="form-control" type="text" placeholder="John" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Last Name</label>
                                        <input className="form-control" type="text" placeholder="Doe" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>E-mail</label>
                                        <input className="form-control" type="text" placeholder="example@email.com" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Mobile No</label>
                                        <input className="form-control" type="text" placeholder="+123 456 789" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Address Line 1</label>
                                        <input className="form-control" type="text" placeholder="123 Street" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Address Line 2</label>
                                        <input className="form-control" type="text" placeholder="123 Street" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Country</label>
                                        <select className="custom-select">
                                            <option selected>United States</option>
                                            <option>Afghanistan</option>
                                            <option>Albania</option>
                                            <option>Algeria</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>City</label>
                                        <input className="form-control" type="text" placeholder="New York" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>State</label>
                                        <input className="form-control" type="text" placeholder="New York" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>ZIP Code</label>
                                        <input className="form-control" type="text" placeholder={123} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Order Total</span></h5>
                        <div className="bg-light p-30 mb-5">
                            <div className="border-bottom">
                                <h6 className="mb-3">Products</h6>
                                {
                                    Object.keys(location.state.billAmounts.productDetails).map((name, index) => (
                                        <>
                                            <div className="d-flex justify-content-between">
                                                <p style={{ width: "250px" }}>{name}</p>
                                                <p>₹ {location.state.billAmounts.productDetails[name]}</p>
                                            </div>
                                        </>
                                    ))
                                }

                            </div>
                            <div className="border-bottom pt-3 pb-2">
                                <div className="d-flex justify-content-between mb-3">
                                    <h6>Subtotal</h6>
                                    <h6>₹ {location.state.billAmounts.subTotal}</h6>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <h6 className="font-weight-medium">Shipping</h6>
                                    <h6 className="font-weight-medium">₹ {location.state.billAmounts.shipping}</h6>
                                </div>
                            </div>
                            <div className="pt-2">
                                <div className="d-flex justify-content-between mt-2">
                                    <h5>Total</h5>
                                    <h5>₹ {location.state.billAmounts.total}</h5>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-block btn-primary font-weight-bold py-3" onClick={handlePayment}>Place Order</button>
                    </div>
                </div>
            </div >
            {/* Checkout End */}
            < Footer />
        </>
    )
}
