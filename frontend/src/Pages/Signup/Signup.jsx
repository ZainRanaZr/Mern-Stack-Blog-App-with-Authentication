import TextInput from "../../components/TextInput/TextInput";
import signupSchema from "../../schemas/signupSchema";
import styles from "./Signup.module.css";
import { signup } from "../../api/internal";
import { useFormik } from "formik";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useState } from "react";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const handleSignup = async () => {
    const data = {
      first_name: values.first_name,
      last_name: values.last_name,
      username: values.username,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    const response = await signup(data);

    if (response.status === 201) {
      // 1: setUser
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        username: response.data.user.username,
        first_name: response.data.user.first_name,
        last_name: response.data.user.last_name,
        auth: response.data.auth,
      };
      dispatch(setUser(user));
      // 2: redirect to Home
      navigate("/");
    } else if (response.code === "ERR_BAD_REQUEST") {
      // display error message
      setError(response.response.data.message);
    }
  };
  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
  });
  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupHeader}>Create an Account</div>
      <TextInput
        type="text"
        name="first_name"
        value={values.first_name}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="first_name"
        error={errors.first_name && touched.first_name ? 1 : undefined}
        errormessage={errors.first_name}
      />
      <TextInput
        type="text"
        name="last_name"
        value={values.last_name}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="last_name"
        error={errors.last_name && touched.last_name ? 1 : undefined}
        errormessage={errors.last_name}
      />
      <TextInput
        type="text"
        name="username"
        value={values.username}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="username"
        error={errors.username && touched.username ? 1 : undefined}
        errormessage={errors.username}
      />
      <TextInput
        type="email"
        name="email"
        value={values.email}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="email"
        error={errors.email && touched.email ? 1 : undefined}
        errormessage={errors.email}
      />
      <TextInput
        type="password"
        name="password"
        value={values.password}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="password"
        error={errors.password && touched.password ? 1 : undefined}
        errormessage={errors.password}
      />
      <TextInput
        type="password"
        name="confirmPassword"
        value={values.confirmPassword}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="Confirm Password"
        error={
          errors.confirmPassword && touched.confirmPassword ? 1 : undefined
        }
        errormessage={errors.confirmPassword}
      />
      <button
        className={styles.signupButton}
        onClick={handleSignup}
        disabled={
          !values.first_name ||
          !values.last_name ||
          !values.username ||
          !values.email ||
          !values.password ||
          !values.confirmPassword ||
          errors.last_name ||
          errors.first_name ||
          errors.username ||
          errors.email ||
          errors.password ||
          errors.confirmPassword
        }
      >
        Sign Up
      </button>
      <span>
        Already have an account?{" "}
        <button
          className={styles.loginAccount}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </span>
      {error !== "" ? <p className={styles.errorMessage}>{error}</p> : ""}
    </div>
  );
};

export default Signup;
