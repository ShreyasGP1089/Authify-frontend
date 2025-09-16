import React, { use } from 'react'
import '../App.css'
import { Link, useNavigate } from 'react-router-dom'
import { useRef, useEffect } from "react";
import axios from 'axios';
import { AppContext } from '../Context/AppContext';

const RegisterTemp = () => {

      const usernameRef = useRef(null);
      
      const navigate=useNavigate();

      const [registered,setRegistered]=React.useState(false);
      const [name,setName]=React.useState("");
      const [email,setEmail]=React.useState("");
      const [password,setPassword]=React.useState("");
      const [loading,setLoading]=React.useState(false);
      const [error,setError]=React.useState("");
      const {backendurl}= React.useContext(AppContext);
  

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
      if(registered)
      navigate(`/verify/${email}`);
    },[registered, navigate]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setError("");
        if(name==="" || email==="" || password===""){
          setError("All fields are required");
          return;
        }
        axios.defaults.withCredentials = true;
        setLoading(true);
        try {
          const response = await axios.post(`${backendurl}/api/v1.0/register`, { name :name, email:email, password: password },  {
        headers: {
          "Content-Type": "application/json"
        }
      });
          setLoading(false);
          setRegistered(true);
          console.log(response.data);
  }
  catch (error) {
        console.log(error);
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError("Registration failed. Please try again.");
        }
        setName("");
        setEmail("");
        setPassword("");
      }
      finally {
        setLoading(false);
      }
    }

  return (
       <form onSubmit={onSubmitHandler}>
       <section className="gradient-custom">
      <div className="container py-5 5-80">
        <div className="row d-flex justify-content-center align-items-center h-50">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-5 text-center">

                <div className="mb-md-5 mt-md-4 pb-5">

                  <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                  <p className="text-white-50 mb-5">Please enter your Username, email and password!</p>

                  <div className="form-outline form-white mb-4">
                    <input type="text" id="typeEmailX" className="form-control form-control-lg" ref={usernameRef} onChange={(e)=>{setName(e.target.value)}} value={name}/>
                    <label className="form-label" htmlFor="typeUsernamedX">Username</label>
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input type="email" id="typeEmailX" className="form-control form-control-lg" onChange={(e)=>{setEmail(e.target.value)}} value={email} />
                    <label className="form-label" htmlFor="typeEmailX">Email</label>
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input type="password" id="typePasswordX" className="form-control form-control-lg" onChange={(e)=>{setPassword(e.target.value)}} value={password}/>
                    <label className="form-label" htmlFor="typePasswordX">Password</label>
                  </div>

                  

                   <button className="btn btn-outline-light btn-lg px-5" type="submit">{loading? "Loading..": "Resgister"}</button>
                  {error && (<p className='text-danger mt-3'>{error}</p>)}

                  <div className="d-flex justify-content-center text-center mt-4 pt-1">
                    <a href="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                    <a href="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                    <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                  </div>

                </div>

                <div>
                  <p className="mb-0">Already Registered?</p> 
                  <div className='d-flex justify-content-center align-items-center'>
                        <Link to="/login" className="text-decoration-none text-white-50 fw-bold">Login</Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </form>
  )
}

export default RegisterTemp