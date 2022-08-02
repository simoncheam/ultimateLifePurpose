import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { APIService } from '../services/APIService';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const Login = () => {
  const nav = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>(null!);

  const handleSubmitButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email || !password) {
      return alert('🚨 fill out all fields');
    }

    APIService(`/auth/login`, 'POST', {
      email: email,
      password: password,
    })
      .then((data) => {
        localStorage.setItem('token', data.token);
        //console.log(data.token);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Welcome Back!',
          showConfirmButton: false,
          timer: 1500,
        });
        nav(`/select`);
      })
      .catch((e) => {
        console.log(e);
        // ! add swal
        Swal.fire({
          title: 'Error: Invalid credentials',
          text: `🚨 Please check login! If you've created an account please click the link in your email to confirm(check spam folder)`,
          icon: 'error',
          confirmButtonText: 'Ok',
        });

        // alert('Invalid credentials')
      });
  };

  return (
    <div>
      <h1 className="display-3 m-3 text-center"> Get Started Below </h1>
      <main className="container my-5">
        <section className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header"> Login or Create Your Account</div>

              <div className="card-body">
                {/* <h1>Enter your credentials: </h1> */}
                <form className="form-group my-2">
                  <label>email:</label>

                  <input
                    className="form-control my-2"
                    value={email}
                    placeholder="your email"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />

                  <label>password:</label>

                  <input
                    className="form-control my-2"
                    value={password}
                    placeholder="password"
                    type="password"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                  />

                  <button onClick={handleSubmitButton} className="btn btn-outline-success mt-2">
                    {' '}
                    Log In
                  </button>
                  <Link to={`/register`} className="row btn btn-outline-warning mx-2 mt-2">
                    Not Registered? Click here to sign up{' '}
                  </Link>
                  <Link to={`/resetpassword`} className="row btn btn-outline-warning mx-2 mt-2">
                    Forgot Password? Click here to reset{' '}
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
