'use client'
import axios from "axios";
import { useState } from "react";

export default function Home() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users', {name, email});
    } catch (error) {
      console.log(error); 
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2>Connection test</h2>
      <form>
        <div>
          <label>Name</label>
          <input type="text" onChange={(e) => setName(e.target.value)} name="name" placeholder="Enter name"/>
        </div>
        <div>
          <label>Email</label>
          <input type="text" onChange={(e) => setEmail(e.target.value)} name="email" placeholder="Enter email"/>
        </div>

        <button>Submit</button>
      </form> 
    </div>
  );
}
