import { React, useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import InfiniteScroll from 'react-infinite-scroll-component';
import Products from '../components/Products';

const host = "http://localhost:5001";
const limit = 18;

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [variants, setVariants] = useState([]);
    const [hashmorevar, setHashmorevar] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [offset, setOffset] = useState(0);
    const [allProductCheck, setAllProductCheck] = useState(true);
    const [variantValue, setVariantValue] = useState(['all-products']);
    const [variantCheck, setVariantCheck] = useState({});
    const handleCheckbox = (e) => {
        const { value, checked } = e.target;
        setOffset(0);
        if (value === "all-products") {
            if (checked) {
                setVariantValue(["all-products"]);
                setAllProductCheck(true);
                setVariantCheck({});
            } else {
                setVariantValue([variantValue.filter((e) => e !== "all-products")]);
                setAllProductCheck(false);
                setVariantCheck({});
            }
        } else {
            let filterValue = [...variantValue];
            var updatedVariantChecks = {};
            if (checked) {
                if (!filterValue.includes(value)) {
                    filterValue.push(value);
                    setAllProductCheck(false);
                }
            } else {
                filterValue = filterValue.filter((e) => e !== value);
            }
            if (filterValue.length > 0 && filterValue.includes("all-products")) {
                filterValue = filterValue.filter((e) => e !== "all-products");
                setAllProductCheck(false);
            }
            if (filterValue.length === 0) {
                setAllProductCheck(true);
                filterValue = ["all-products"];
            } else {
                setAllProductCheck(false);
                filterValue = filterValue.filter((e) => e !== "all-products");
            }
            updatedVariantChecks = filterValue.includes(value) ? { ...variantCheck, [value]: true } : { ...variantCheck, [value]: false };
            variants.forEach((v) => {
                if (value.split("-")[0] == v._id) {
                    v.var_values.forEach((val) => {
                        filterValue = filterValue.filter((e) => e !== val);
                        updatedVariantChecks[val] = checked;
                    })
                }
            });
            setVariantValue(filterValue);
            setVariantCheck(updatedVariantChecks);
        }
    }

    const handleMinPriceChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setMinPrice(value === "" ? 0 : parseInt(value));
    }

    const handleMaxPriceChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setMaxPrice(value === "" ? 0 : parseInt(value));
    }

    const fetchProducts = useCallback(() => {
        setHashmorevar(true);
        fetch(`${host}/getProduct?limit=${limit}&offset=${offset}&minPrice=${minPrice}&maxPrice=${maxPrice}&filter=${variantValue}`)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.data) {
                    setHashmorevar(false);
                    if (offset === 0) {
                        setProducts(data.data);
                    } else {
                        setProducts((prev) => [...prev, ...data.data]);
                    }
                    setTotalProducts(data.total);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [minPrice, maxPrice, offset, variantValue, setHashmorevar, setTotalProducts, setProducts]);

    const fetchVariants = useCallback(() => {
        fetch(`${host}/getVariants`)
            .then((resp) => resp.json())
            .then((data) => {
                setVariants(data.data);
            })
            .catch((err) => console.log(err))
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchVariants();
    }, [fetchProducts, fetchVariants]);


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
                            <span className="breadcrumb-item active">Shop List</span>
                        </nav>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}
            {/* Shop Start */}
            <div className="container-fluid">
                <div className="row px-xl-5">
                    {/* Shop Sidebar Start */}
                    <div className="col-lg-3 col-md-4">
                        {/* Price Start */}
                        <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Filter by price</span></h5>
                        <div className="bg-light p-4 mb-30">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="min_price">Minimum Price</label>
                                    <input type="text" className="form-control" id="min_price" value={minPrice} onChange={handleMinPriceChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="max_price">Maximum Price</label>
                                    <input type="text" className="form-control" id="max_price" value={maxPrice} onChange={handleMaxPriceChange} />
                                </div>
                            </form>
                        </div>
                        {/* Price End */}
                        {/* All product filter start */}
                        <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">All Products</span></h5>
                        <div className="bg-light p-4 mb-30">
                            <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                <input type="checkbox" checked={allProductCheck} className="custom-control-input" id={`all-products`} value={`all-products`}
                                    onChange={handleCheckbox}
                                />
                                <label className="custom-control-label" htmlFor={`all-products`}>All</label>
                            </div>
                        </div>
                        {/* All product filter end */}
                        {/* Other Filters Start */}
                        {
                            variants?.map((v, i) => {
                                return (
                                    <div key={v._id}>
                                        <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Filter by {v.name}</span></h5>
                                        <div className="bg-light p-4 mb-30">
                                            <form>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input type="checkbox" className="custom-control-input" id={`${v.name.toLowerCase().replaceAll(" ", "-")}-all`} value={`${v._id}-all`}
                                                        onChange={handleCheckbox}
                                                    />
                                                    <label className="custom-control-label" htmlFor={`${v.name.toLowerCase().replaceAll(" ", "-")}-all`}>All</label>
                                                </div>
                                                {
                                                    v.var_values?.map((val, ind) => {
                                                        return (
                                                            <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3" key={ind}>
                                                                <input type="checkbox" checked={variantCheck[val] || false} className="custom-control-input" id={`${v.name.toLowerCase().replaceAll(" ", "-")}[${ind}]`} value={val}
                                                                    onChange={handleCheckbox}
                                                                />
                                                                <label className="custom-control-label" htmlFor={`${v.name.toLowerCase().replaceAll(" ", "-")}[${ind}]`}>{val}</label>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </form>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {/* Other Filters End */}
                    </div>
                    {/* Shop Sidebar End */}
                    {/* Shop Product Start */}
                    <div className="col-lg-9 col-md-8">
                        {
                            minPrice === 0 && maxPrice === 0 ?
                                <InfiniteScroll
                                    style={{ overflow: 'hidden' }}
                                    dataLength={products.length}
                                    next={(() => setOffset((prev) => prev + limit))}
                                    hasMore={products.length < totalProducts}
                                    loader={
                                        hashmorevar ?
                                            <p>Loading...</p> : null
                                    }>
                                    <Products products={products} />
                                </InfiniteScroll>
                                :
                                <Products products={products} />
                        }
                    </div>
                    {/* Shop Product End */}
                </div>
            </div >
            <Footer />
        </>
    )
}
