import React, { useState, useContext } from "react";
import axios from "axios";

import AuthContext from "../../context/authContext";
import "./Auth.css";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const Auth = () => {
  const { login } = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!email.trim().length || !password.trim().length) {
      return;
    }

    const signupBody = {
      query: `
        mutation CreateUser($email: String!, $password: String!) {
          createUser(userInput: {email: $email, password: $password}){
            email
            _id
          }
        }
      `,
      variables: {
        email,
        password,
      },
    };

    const loginBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password){
            token
            userId
          }
        }
      `,
      variables: {
        email,
        password,
      },
    };

    try {
      const res = await axios.post(
        "/graphql",
        isLoginMode ? loginBody : signupBody,
        config
      );
      console.log(res.data);

      if (isLoginMode) {
        login(res.data.data.login.token, res.data.data.login.userId);
      }
    } catch (error) {
      console.error(error.response);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
        />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        {isLoginMode ? (
          <button type="button" onClick={() => setIsLoginMode(false)}>
            Switch to Signup
          </button>
        ) : (
          <button type="button" onClick={() => setIsLoginMode(true)}>
            Switch to Login
          </button>
        )}
      </div>
    </form>
  );
};

export default Auth;
