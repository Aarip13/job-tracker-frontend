import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../api/axios";

function Register() {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
    const response = await API.post("/auth/register", formData);

    toast.success(response.data.message || "Registration Successful!");

    navigate("/login");
  } catch (error) {
    console.log(error);
  console.log(error.response);

  toast.error(
    error.response?.data?.message ||
    error.message ||
    "Registration Failed"
  );
  }
};
 

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />

        <br />
        <br />

        <button type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;