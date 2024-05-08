import React from 'react'
import { Link } from 'react-router-dom';

export default function Products(props) {
    return (
        <>
            <div className="row pb-3">
                <div className="col-12 pb-1">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div>
                            <button className="btn btn-sm btn-light"><i className="fa fa-th-large" /></button>
                            <button className="btn btn-sm btn-light ml-2"><i className="fa fa-bars" /></button>
                        </div>
                        <div className="ml-2">
                            <div className="btn-group">
                                <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">Sorting</button>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="#">Latest</a>
                                    <a className="dropdown-item" href="#">Popularity</a>
                                    <a className="dropdown-item" href="#">Best Rating</a>
                                </div>
                            </div>
                            <div className="btn-group ml-2">
                                <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">Showing</button>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="#">10</a>
                                    <a className="dropdown-item" href="#">20</a>
                                    <a className="dropdown-item" href="#">30</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    props.products?.map((v, i) => {
                        return (
                            <div className="col-lg-4 col-md-6 col-sm-6 pb-1" key={v._id}>
                                <Link to={`/detail?id=${v._id}`}>
                                    <div className="product-item bg-light mb-4">
                                        <div className="product-img position-relative overflow-hidden">
                                            <img className="w-100" height={200} src={`http://localhost:5000/${v.thumbnail}`} alt />
                                        </div>
                                        <div className="text-center py-4" style={{ height: "100px" }}>
                                            <p className="h6 text-decoration-none" style={{ whiteSpace: "initial" }}>{v.name}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}
