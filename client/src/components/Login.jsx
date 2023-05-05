import React, { useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import signinImage from "../assets/signup.jpg";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

const Login = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    // e.preventDefault();
    const { username, password } = data;

    const URL = "http://localhost:5000/auth";

    const response = await axios.post(`${URL}/login`, {
      username,
      password,
    });

    const { token, userId, hashedPassword, fullName, phoneNumber, avatarURL } =
      response.data;

    cookies.set("token", token);
    cookies.set("username", username);
    cookies.set("fullName", fullName);
    cookies.set("userId", userId);
    cookies.set("hashedPassword", hashedPassword);
    cookies.set("phoneNumber", phoneNumber);
    cookies.set("avatarURL", avatarURL);

    navigate("/");
    // window.location.reload();
  };

  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p>Medical Pager</p>
          <h2> Sign In</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="username">Username</label>
              <input
                name="username"
                type="text"
                {...register("username")}
                placeholder="Username"
                className={`${errors.username ? "is-invalid" : ""}`}
                required
                data-cy={"username"}
              />
              <div className="invalid-feedback">{errors.username?.message}</div>
            </div>

            <div className="auth__form-container_fields-content_input">
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className={`${errors.Password ? "is-invalid" : ""}`}
                // onChange={(e) => handleChange(e)}
                {...register("password")}
                required
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </div>

            <div className="auth__form-container_fields-content_button">
              <button onClick={handleSubmit}>Continue</button>
            </div>
          </form>
          <div className="auth__form-container_fields-account">
            <p>
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")}> Sign Up </span>
            </p>
          </div>
        </div>
      </div>
      <div className="auth__form-container_image">
        <img src={signinImage} alt="sign in" />
      </div>
    </div>
  );
};

export default Login;
