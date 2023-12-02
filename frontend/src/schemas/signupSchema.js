import * as yup from 'yup';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const errorMessage = "Use at least on 1 lowercase, 1 uppercase and 1 digit";

const signupSchema = yup.object().shape({
    first_name: yup.string().min(3).max(30).required('First name is required'),
    last_name: yup.string().max(30).required('Last name is required'),
    username: yup.string().min(5).max(30).required('username is required'),
    email: yup.string().email('Enter a valid email').required('email is required'),
    password: yup.string().min(8).max(25).matches(passwordPattern, {message: errorMessage}).required('password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'password is not matched').required('confirm password is required'),
});

export default signupSchema;