import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Cookies from 'universal-cookie'

export default function Detail() {
    const [searchParam] = useSearchParams();
    const id = searchParam.get("id");
    const navigate = useNavigate();
    const [proQty, setProQty] = useState(1);
    const [product, setProduct] = useState([]);
    const [images, setImages] = useState(0);
    const cookies = useMemo(() => new Cookies(), []);
    const decreaseVal = () => {
        if (proQty > 1) setProQty((prev) => prev - 1);
    }

    const increaseVal = () => {
        setProQty((prev) => prev + 1);
    }

    const fetchProducts = useCallback(() => {
        if (id) {
            fetch(`http://localhost:5001/getProductDetails?id=${id}`)
                .then((resp) => resp.json())
                .then((data) => {
                    if (data && data.data) {
                        if (data.data[0].image.length > 0) {
                            setImages(data.data[0].image.length);
                        }
                        setProduct(data.data)
                    }
                })
                .catch((err) => console.error(err));
        }
    }, [searchParam, setProduct]);

    const addToCart = (id) => {
        try {
            const existingCart = cookies.get('cookieDemo') || [];
            const existingItem = existingCart.find(item => item.cartId === id);

            if (existingItem) {
                existingItem.proQty += proQty;
            } else {
                existingCart.push({ cartId: id, proQty: proQty });
            }
            cookies.set('cookieDemo', JSON.stringify(existingCart), { path: '/' }, { maxAge: (24 * 60 * 60) * 5 });
            setProQty(1);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        if (!id) {
            navigate("/shop");
        }
        fetchProducts();
    }, [searchParam, cookies, fetchProducts]);
    return (
        <>
            <Navbar />
            {/* Breadcrumb Start */}
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <a className="breadcrumb-item text-dark" href>Home</a>
                            <a className="breadcrumb-item text-dark" href>Shop</a>
                            <span className="breadcrumb-item active">Shop Detail</span>
                        </nav>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}
            {/* Shop Detail Start */}
            <div className="container-fluid pb-5">
                {
                    product?.map((v, i) => {
                        const desc = v.productData[0].desc;
                        const description = desc.replace(/<[^>]+>/g, '');
                        return (
                            <div key={i}>
                                <div className="row px-xl-5">
                                    <div className="col-lg-5 mb-30">
                                        <div id="product-carousel" className="carousel slide" data-ride="carousel">
                                            <div className="carousel-inner bg-light">
                                                {
                                                    v.image?.map((i, k) => {
                                                        return (
                                                            <div className={`carousel-item ${k === 0 ? 'active' : ''}`} style={{ height: "400px" }} key={k}>
                                                                <img className="w-100 h-100" src={`http://localhost:5000/${i}`} alt="" />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            {
                                                images > 1
                                                    ?
                                                    <>
                                                        <a className="carousel-control-prev" href="#product-carousel" data-slide="prev">
                                                            <i className="fa fa-2x fa-angle-left text-dark" />
                                                        </a>
                                                        <a className="carousel-control-next" href="#product-carousel" data-slide="next">
                                                            <i className="fa fa-2x fa-angle-right text-dark" />
                                                        </a>
                                                    </>
                                                    : ""
                                            }
                                        </div>
                                    </div>
                                    <div className="col-lg-7 h-auto mb-30">
                                        <div className="h-100 bg-light p-30">
                                            <h3>{v.productData[0].name}</h3>
                                            {
                                                v.compare_price > 0 ?
                                                    <><h3>₹{v.compare_price}</h3><h5 className="text-muted ml-2"><del>₹{v.price}</del></h5></>
                                                    :
                                                    <h3 className="font-weight-semi-bold mb-4">₹{v.price}</h3>
                                            }
                                            <p className="mb-4">{description}</p>
                                            <div className="d-flex mb-3">
                                                <strong className="text-dark mr-3">{v.varType === null ? "" : (v.varVal.length > 1 ? `${v.variantData[0].name}:` : `${v.variantData[0].name}: ${v.varVal[0]}`)}</strong>
                                                <form>
                                                    {
                                                        v.varVal === null ? "" :
                                                            (v.varVal.length > 1 ?
                                                                v.varVal.map((val, ind) => {
                                                                    return (
                                                                        <div className="custom-control custom-radio custom-control-inline" key={ind}>
                                                                            <input type="radio" className="custom-control-input" id="size-1" name="size" />
                                                                            <label className="custom-control-label" htmlFor="size-1">{val}</label>
                                                                        </div>

                                                                    )
                                                                }) : "")
                                                    }
                                                </form>
                                            </div>
                                            <div className="d-flex align-items-center mb-4 pt-2">
                                                <div className="input-group quantity mr-3" style={{ width: 130 }}>
                                                    <div className="input-group-btn">
                                                        <button className="btn btn-primary shadow-none btn-minus" onClick={() => decreaseVal()}>
                                                            <i className="fa fa-minus" />
                                                        </button>
                                                    </div>
                                                    <input type="text" id="pro_qty" className="form-control bg-secondary border-0 text-center" value={proQty} onChange={(e) => e.target.value} />
                                                    <div className="input-group-btn">
                                                        <button className="btn btn-primary shadow-none btn-plus" onClick={() => increaseVal()}>
                                                            <i className="fa fa-plus" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <button className="btn btn-primary px-3" onClick={() => addToCart(v._id)}><i className="fa fa-shopping-cart mr-1" /> Add To
                                                    Cart</button>
                                            </div>
                                            <div className="d-flex pt-2">
                                                <strong className="text-dark mr-2">Share on:</strong>
                                                <div className="d-inline-flex">
                                                    <a className="text-dark px-2" href>
                                                        <i className="fab fa-facebook-f" />
                                                    </a>
                                                    <a className="text-dark px-2" href>
                                                        <i className="fab fa-twitter" />
                                                    </a>
                                                    <a className="text-dark px-2" href>
                                                        <i className="fab fa-linkedin-in" />
                                                    </a>
                                                    <a className="text-dark px-2" href>
                                                        <i className="fab fa-pinterest" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="row px-xl-5">
                    <div className="col">
                        <div className="bg-light p-30">
                            <div className="nav nav-tabs mb-4">
                                <a className="nav-item nav-link text-dark active" data-toggle="tab" href="#tab-pane-1">Description</a>
                                <a className="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-2">Information</a>
                            </div>
                            <div className="tab-content">
                                <div className="tab-pane fade show active" id="tab-pane-1">
                                    <h4 className="mb-3">Product Description</h4>
                                    <p>Eos no lorem eirmod diam diam, eos elitr et gubergren diam sea. Consetetur vero aliquyam invidunt duo dolores et duo sit. Vero diam ea vero et dolore rebum, dolor rebum eirmod consetetur invidunt sed sed et, lorem duo et eos elitr, sadipscing kasd ipsum rebum diam. Dolore diam stet rebum sed tempor kasd eirmod. Takimata kasd ipsum accusam sadipscing, eos dolores sit no ut diam consetetur duo justo est, sit sanctus diam tempor aliquyam eirmod nonumy rebum dolor accusam, ipsum kasd eos consetetur at sit rebum, diam kasd invidunt tempor lorem, ipsum lorem elitr sanctus eirmod takimata dolor ea invidunt.</p>
                                    <p>Dolore magna est eirmod sanctus dolor, amet diam et eirmod et ipsum. Amet dolore tempor consetetur sed lorem dolor sit lorem tempor. Gubergren amet amet labore sadipscing clita clita diam clita. Sea amet et sed ipsum lorem elitr et, amet et labore voluptua sit rebum. Ea erat sed et diam takimata sed justo. Magna takimata justo et amet magna et.</p>
                                </div>
                                <div className="tab-pane fade" id="tab-pane-2">
                                    <h4 className="mb-3">Additional Information</h4>
                                    <p>Eos no lorem eirmod diam diam, eos elitr et gubergren diam sea. Consetetur vero aliquyam invidunt duo dolores et duo sit. Vero diam ea vero et dolore rebum, dolor rebum eirmod consetetur invidunt sed sed et, lorem duo et eos elitr, sadipscing kasd ipsum rebum diam. Dolore diam stet rebum sed tempor kasd eirmod. Takimata kasd ipsum accusam sadipscing, eos dolores sit no ut diam consetetur duo justo est, sit sanctus diam tempor aliquyam eirmod nonumy rebum dolor accusam, ipsum kasd eos consetetur at sit rebum, diam kasd invidunt tempor lorem, ipsum lorem elitr sanctus eirmod takimata dolor ea invidunt.</p>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item px-0">
                                                    Sit erat duo lorem duo ea consetetur, et eirmod takimata.
                                                </li>
                                                <li className="list-group-item px-0">
                                                    Amet kasd gubergren sit sanctus et lorem eos sadipscing at.
                                                </li>
                                                <li className="list-group-item px-0">
                                                    Duo amet accusam eirmod nonumy stet et et stet eirmod.
                                                </li>
                                                <li className="list-group-item px-0">
                                                    Takimata ea clita labore amet ipsum erat justo voluptua. Nonumy.
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item px-0">
                                                    Sit erat duo lorem duo ea consetetur, et eirmod takimata.
                                                </li>
                                                <li className="list-group-item px-0">
                                                    Amet kasd gubergren sit sanctus et lorem eos sadipscing at.
                                                </li>
                                                <li className="list-group-item px-0">
                                                    Duo amet accusam eirmod nonumy stet et et stet eirmod.
                                                </li>
                                                <li className="list-group-item px-0">
                                                    Takimata ea clita labore amet ipsum erat justo voluptua. Nonumy.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Shop Detail End */}
            <Footer />
        </>
    )
}
