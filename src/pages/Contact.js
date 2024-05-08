import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import { contactSchema } from '../schema'

let initVal = {
    name: '',
    email: '',
    subject: '',
    message: ''
}

let host = "http://localhost:5001"

export default function Contact() {

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initVal,
        validationSchema: contactSchema,
        onSubmit: async (values, action) => {
            try {
                const response = await fetch(`${host}/contact`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });
                const responseData = await response.json();
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: responseData.message
                    });
                    action.resetForm();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: responseData.message
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: `${error.toString()}`
                });
            }
        }
    })

    return (
        <>
            <Navbar />
            {/* Breadcrumb Start */}
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <a className="breadcrumb-item text-dark" href="#">Home</a>
                            <span className="breadcrumb-item active">Contact</span>
                        </nav>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}
            {/* Contact Start */}
            <div className="container-fluid">
                <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Contact Us</span></h2>
                <div className="row px-xl-5">
                    <div className="col-lg-7 mb-5">
                        <div className="contact-form bg-light p-30">
                            <form name="sentMessage" id="contactForm" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input type="text" className="form-control" id="name" placeholder="Your Name" onChange={handleChange} onBlur={handleBlur} value={values.name} />
                                    {
                                        errors.name && touched.name ? (
                                            <p className='text-danger'>{errors.name}</p>
                                        ) : null
                                    }
                                </div>
                                <div className="form-group">
                                    <input type="email" className="form-control" id="email" placeholder="Your Email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
                                    {
                                        errors.email && touched.email ? (
                                            <p className='text-danger'>{errors.email}</p>
                                        ) : null
                                    }
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" id="subject" placeholder="Subject" onChange={handleChange} onBlur={handleBlur} value={values.subject} />
                                    {
                                        errors.subject && touched.subject ? (
                                            <p className='text-danger'>{errors.subject}</p>
                                        ) : null
                                    }
                                </div>
                                <div className="form-group">
                                    <textarea className="form-control" rows={8} id="message" placeholder="Message" onChange={handleChange} onBlur={handleBlur} value={values.message} />
                                    {
                                        errors.message && touched.message ? (
                                            <p className='text-danger'>{errors.message}</p>
                                        ) : null
                                    }
                                </div>
                                <div>
                                    <button className="btn btn-primary py-2 px-4" type="submit" id="sendMessageButton">Send
                                        Message</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-lg-5 mb-5">
                        <div className="bg-light p-30 mb-30">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.356230517616!2d72.78745132486655!3d21.22006940319414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04c17c9b417f7%3A0xc38679a08b814700!2sN.T.C.E.%20Computer%20Education%20%26%20Job%20Placement!5e0!3m2!1sen!2sin!4v1709290471590!5m2!1sen!2sin" style={{ border: 0, height: 250, width: "100%" }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                        <div className="bg-light p-30 mb-3">
                            <p className="mb-2"><i className="fa fa-map-marker-alt text-primary mr-3" />123 Street, New York, USA</p>
                            <p className="mb-2"><i className="fa fa-envelope text-primary mr-3" />info@example.com</p>
                            <p className="mb-2"><i className="fa fa-phone-alt text-primary mr-3" />+012 345 67890</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Contact End */}
            <Footer />
        </>
    )
}
