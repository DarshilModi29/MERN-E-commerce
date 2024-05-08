import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const [cat, setCat] = useState([]);
    const fetchCategories = useCallback(() => {
        fetch(`http://localhost:5001/getCategories`)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.data) {
                    setCat(data.data);
                }
            })
            .catch((err) => console.log(err))
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories])
    return (
        <>
            {/* Topbar Start */}
            <div>
                <div className="container-fluid">
                    <div className="row bg-secondary py-1 px-xl-5">
                        <div className="col-lg-6 d-none d-lg-block">
                            <div className="d-inline-flex align-items-center h-100">
                                <Link to="/" className="text-body mr-3">About</Link>
                                <Link to="/contact" className="text-body mr-3">Contact</Link>
                                <Link to="/" className="text-body mr-3">Help</Link>
                                <Link to="/" className="text-body mr-3">FAQs</Link>
                            </div>
                        </div>
                        <div className="col-lg-6 text-center text-lg-right">
                            <div className="d-inline-flex align-items-center">
                                <div className="btn-group">
                                    <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">My Account</button>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <button className="dropdown-item" type="button">Sign in</button>
                                        <button className="dropdown-item" type="button">Sign up</button>
                                    </div>
                                </div>
                                <div className="btn-group mx-2">
                                    <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">USD</button>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <button className="dropdown-item" type="button">EUR</button>
                                        <button className="dropdown-item" type="button">GBP</button>
                                        <button className="dropdown-item" type="button">CAD</button>
                                    </div>
                                </div>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">EN</button>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <button className="dropdown-item" type="button">FR</button>
                                        <button className="dropdown-item" type="button">AR</button>
                                        <button className="dropdown-item" type="button">RU</button>
                                    </div>
                                </div>
                            </div>
                            <div className="d-inline-flex align-items-center d-block d-lg-none">
                                <a href className="btn px-0 ml-2">
                                    <i className="fas fa-heart text-dark" />
                                    <span className="badge text-dark border border-dark rounded-circle" style={{ paddingBottom: 2 }}>0</span>
                                </a>
                                <a href className="btn px-0 ml-2">
                                    <i className="fas fa-shopping-cart text-dark" />
                                    <span className="badge text-dark border border-dark rounded-circle" style={{ paddingBottom: 2 }}>0</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex">
                        <div className="col-lg-4">
                            <Link to="/" className="text-decoration-none">
                                <span className="h1 text-uppercase text-primary bg-dark px-2">Multi</span>
                                <span className="h1 text-uppercase text-dark bg-primary px-2 ml-n1">Shop</span>
                            </Link>
                        </div>
                        <div className="col-lg-4 col-6 text-left">
                            <form action>
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Search for products" />
                                    <div className="input-group-append">
                                        <span className="input-group-text bg-transparent text-primary">
                                            <i className="fa fa-search" />
                                        </span>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-4 col-6 text-right">
                            <p className="m-0">Customer Service</p>
                            <h5 className="m-0">+012 345 6789</h5>
                        </div>
                    </div>
                </div>
                {/* Topbar End */}
                {/* Navbar Start */}
                <div className="container-fluid bg-dark mb-30">
                    <div className="row px-xl-5">
                        <div className="col-lg-3 d-none d-lg-block">
                            <a className="btn d-flex align-items-center justify-content-between bg-primary w-100" data-toggle="collapse" href="#navbar-vertical" style={{ height: 65, padding: '0 30px' }}>
                                <h6 className="text-dark m-0"><i className="fa fa-bars mr-2" />Categories</h6>
                                <i className="fa fa-angle-down text-dark" />
                            </a>
                            <nav className="collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 bg-light" id="navbar-vertical" style={{ width: 'calc(100% - 30px)', zIndex: 999 }}>
                                <div className="navbar-nav w-100">
                                    {
                                        cat?.map((v, i) => {
                                            // console.log(window.location.href.split("/").includes("shop"));
                                            return (
                                                <a href className="nav-item nav-link" key={i}>{v.name}</a>
                                            )
                                        })
                                    }
                                </div>
                            </nav>

                        </div>
                        <div className="col-lg-9">
                            <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
                                <a href className="text-decoration-none d-block d-lg-none">
                                    <span className="h1 text-uppercase text-dark bg-light px-2">Multi</span>
                                    <span className="h1 text-uppercase text-light bg-primary px-2 ml-n1">Shop</span>
                                </a>
                                <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                                    <span className="navbar-toggler-icon" />
                                </button>
                                <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                                    <div className="navbar-nav mr-auto py-0">
                                        <Link to="/" className="nav-item nav-link">Home</Link>
                                        <Link to="/shop" className="nav-item nav-link">Shop</Link>
                                        <Link to="/cart" className="nav-link nav-item">Cart</Link>
                                        <Link to="/contact" className="nav-item nav-link">Contact</Link>
                                    </div>
                                    <div className="navbar-nav ml-auto py-0 d-none d-lg-block">
                                        <a href className="btn px-0">
                                            <i className="fas fa-heart text-primary" />
                                            <span className="badge text-secondary border border-secondary rounded-circle" style={{ paddingBottom: 2 }}>0</span>
                                        </a>
                                        <a href className="btn px-0 ml-3">
                                            <i className="fas fa-shopping-cart text-primary" />
                                            <span className="badge text-secondary border border-secondary rounded-circle" style={{ paddingBottom: 2 }}>0</span>
                                        </a>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
                {/* Navbar End */}
            </div>

        </>
    )
}
