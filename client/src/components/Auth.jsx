import React, { useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import signinImage from "../assets/signup.jpg";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

const Auth = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    username: Yup.string().required("Username is required"),
    phoneNumber: Yup.number().required("Phone number is required"),
    avatarURL: Yup.string().required("Avatar URL is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
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
    const { fullName, username, password, phoneNumber, avatarURL } = data;

    const URL = "http://localhost:5000/auth";

    const response = await axios.post(`${URL}/signup`, {
      fullName,
      username,
      password,
      phoneNumber,
      avatarURL,
    });

    const { token, userId, hashedPassword } = response.data;
    cookies.set("token", token);
    cookies.set("username", username);
    cookies.set("fullName", fullName);
    cookies.set("userId", userId);
    cookies.set("hashedPassword", hashedPassword);
    cookies.set("phoneNumber", phoneNumber);
    cookies.set("avatarURL", avatarURL);

    navigate("/");
    window.location.reload();
  };

  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p>Medical Pager</p>
          <h2> Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <>
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="fullName">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  className={`${errors.fullName ? "is-invalid" : ""}`}
                  // onChange={(e) => handleChange(e)}
                  {...register("fullName")}
                  required
                  data-cy={"fullName"}
                />
                <div className="invalid-feedback">
                  {errors.fullName?.message}
                </div>
              </div>
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="phoneNumber">Username</label>
                <input
                  name="username"
                  type="text"
                  className={`${errors.username ? "is-invalid" : ""}`}
                  placeholder="User Name"
                  // onChange={(e) => handleChange(e)}
                  {...register("username")}
                  required
                  data-cy={"username"}
                />
                <div className="invalid-feedback">
                  {errors.username?.message}
                </div>
              </div>
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  name="phoneNumber"
                  type="text"
                  className={`${errors.phoneNumber ? "is-invalid" : ""}`}
                  placeholder="Phone Number"
                  // onChange={(e) => handleChange(e)}
                  {...register("phoneNumber")}
                  required
                  data-cy={"phoneNumber"}
                />
                <div className="invalid-feedback">
                  {errors.phoneNumber?.message}
                </div>
              </div>
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="avatarURL">Avatar URL</label>
                <input
                  name="avatarURL"
                  type="text"
                  placeholder="Avatar URL"
                  // onChange={(e) => handleChange(e)}
                  {...register("avatarURL")}
                  required
                  data-cy={"avatarURL"}
                />
                <div className="invalid-feedback">
                  {errors.avatarURL?.message}
                </div>
              </div>
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  // onChange={(e) => handleChange(e)}
                  {...register("password")}
                  required
                  data-cy={"password"}
                />
                <div className="invalid-feedback">
                  {errors.password?.message}
                </div>
              </div>
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  // onChange={(e) => handleChange(e)}
                  {...register("confirmPassword")}
                  required
                  data-cy={"confirmPassword"}
                />
                <div className="invalid-feedback">
                  {errors.confirmPassword?.message}
                </div>
              </div>
              <div className="auth__form-container_fields-content_button">
                <button onClick={handleSubmit}>Continue</button>
              </div>
            </>
          </form>
          <div className="auth__form-container_fields-account">
            <p>
              Already have an account?
              <span onClick={() => navigate("/login")}>Sign In</span>
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

export default Auth;
