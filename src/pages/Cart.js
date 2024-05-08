import React, { useCallback, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [cartItems, setCartItems] = useState([]);
    const [billAmounts, setBillAmounts] = useState({
        productDetails: {},
        subTotal: 0,
        shipping: 0,
        total: 0
    });

    const fetchData = useCallback(async () => {
        try {
            const data = cookies.get("cookieDemo");
            if (Array.isArray(data) && data.length > 0 && cartItems.length === 0) {
                const updatedCartItems = [];

                for (const item of data) {
                    const resp = await fetch(`http://localhost:5001/getCartDetails?id=${item.cartId}`);
                    const productData = await resp.json();

                    if (productData && productData.data.length > 0) {
                        const cartItem = {
                            ...productData.data[0],
                            quantity: item.proQty
                        };
                        updatedCartItems.push(cartItem);
                    }
                }
                setCartItems(updatedCartItems);
            }
        } catch (error) {
            console.error('Error fetching cart details:', error);
        }
    }, [cookies, cartItems]);

    const increaseVal = (id) => {
        const updatedItems = cartItems.map(item => {
            if (item._id === id) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCartItems(updatedItems);
    }

    const decreaseVal = (id) => {
        const updatedItems = cartItems.map(item => {
            if (item._id === id && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        setCartItems(updatedItems);
    }

    const calculateTotal = useCallback(() => {
        let total = 0;
        let products = {};
        cartItems.forEach((item) => {
            let price = item.compare_price > 0 ? item.compare_price : item.price;
            products[`${item.productData[0].name}`] = price;
            total += price * item.quantity;
        });
        return { total, products };
    }, [cartItems])

    const shipping = (subTotal) => {
        if (subTotal < 500) return 0;
        else if (subTotal < 1000) return 10;
        else if (subTotal < 5000) return 50;
        else if (subTotal < 10000) return 100;
        else if (subTotal < 50000) return 600;
        else return 800;
    }

    const removeItem = (id) => {
        try {
            const updatedData = cartItems.filter(item => item._id !== id);
            setCartItems(updatedData);
            const data = cookies.get("cookieDemo");
            const removeId = data.filter(item => item.cartId !== id);
            cookies.set("cookieDemo", JSON.stringify(removeId), { path: "/" }, { maxAge: (24 * 60 * 60) * 5 });
            if (cookies.get("cookieDemo").length < 1) {
                cookies.remove("cookieDemo");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const { total, products } = calculateTotal();
        const shippingCost = shipping(total);

        setBillAmounts({
            productDetails: products,
            subTotal: total,
            shipping: shippingCost,
            total: total + shippingCost
        });
    }, [calculateTotal]);

    const handleClick = useCallback(() => {
        navigate("/checkout", { state: { billAmounts } });
    }, [navigate, billAmounts]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
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
                            <span className="breadcrumb-item active">Shopping Cart</span>
                        </nav>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}
            {/* Cart Start */}
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-lg-8 table-responsive mb-5">
                        <table className="table table-light table-borderless table-hover text-center mb-0">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Products</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody className="align-middle">
                                {
                                    cartItems.map((v, i) => {
                                        return (
                                            <tr key={i}>
                                                <td className="align-middle"><img src={`http://localhost:5000/${v.image[0]}`} alt style={{ width: 50 }} /> Product Name</td>
                                                <td className="align-middle">{v.compare_price > 0 ? v.compare_price : v.price}</td>
                                                <td className="align-middle">
                                                    <div className="input-group quantity mx-auto" style={{ width: 100 }}>
                                                        <div className="input-group-btn">
                                                            <button className="btn btn-sm btn-primary btn-minus" onClick={() => decreaseVal(v._id)}>
                                                                <i className="fa fa-minus" />
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm bg-secondary border-0 text-center"
                                                            value={v.quantity}
                                                            readOnly
                                                        />
                                                        <div className="input-group-btn">
                                                            <button className="btn btn-sm btn-primary btn-plus" onClick={() => increaseVal(v._id)}>
                                                                <i className="fa fa-plus" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="align-middle">{v.quantity * (v.compare_price > 0 ? v.compare_price : v.price)}</td>
                                                <td className="align-middle"><button className="btn btn-sm btn-danger" onClick={() => removeItem(v._id)}><i className="fa fa-times" /></button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="col-lg-4">
                        <form className="mb-30" action>
                            <div className="input-group">
                                <input type="text" className="form-control border-0 p-4" placeholder="Coupon Code" />
                                <div className="input-group-append">
                                    <button className="btn btn-primary">Apply Coupon</button>
                                </div>
                            </div>
                        </form>
                        <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Cart Summary</span></h5>
                        <div className="bg-light p-30 mb-5">
                            <div className="border-bottom pb-2">
                                <div className="d-flex justify-content-between mb-3">
                                    <h6>Subtotal</h6>
                                    <h6>₹ {calculateTotal().total}</h6>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <h6 className="font-weight-medium">Shipping</h6>
                                    <h6 className="font-weight-medium">₹ {shipping(calculateTotal().total)}</h6>
                                </div>
                            </div>
                            <div className="pt-2">
                                <div className="d-flex justify-content-between mt-2">
                                    <h5>Total</h5>
                                    <h5>₹ {calculateTotal().total + shipping(calculateTotal().total)}</h5>
                                </div>
                                <button onClick={() => {
                                    handleClick();
                                }} className="btn btn-block btn-primary font-weight-bold my-3 py-3">Proceed To Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Cart End */}
            <Footer />
        </>
    )
}
