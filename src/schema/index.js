import * as Yup from 'yup';

export const contactSchema = Yup.object({
    name: Yup.string().required("PLease enter your name"),
    email: Yup.string().required("Please Enter Email").matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Invalid Email"),
    subject: Yup.string().min(2).required("Please enter the subject you have query on"),
    message: Yup.string().required("Describe you query or complaint")
});