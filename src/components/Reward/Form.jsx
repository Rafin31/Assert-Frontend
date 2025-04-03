import { useState } from "react";
import axios from "axios";

const Form = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/v1/form/submit", formData);
      alert("Form submitted successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      alert("Error submitting form.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <input type="text" name="name" placeholder="Name" onChange={handleChange} value={formData.name} required className="w-full p-2 border rounded-md" />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required className="w-full p-2 border rounded-md" />
      <textarea name="message" placeholder="Message" onChange={handleChange} value={formData.message} required className="w-full p-2 border rounded-md" />
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Submit</button>
    </form>
  );
};

export default Form;
