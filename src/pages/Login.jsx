import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await API.post("/auth/login", formData);

    login(response.data.token);

    toast.success("Login Successful!");

    navigate("/dashboard");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Login Failed"
    );
  }
};

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h1>Login</h1>

      <form  onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;