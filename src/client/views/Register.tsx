import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { APIService } from '../services/APIService';
import Swal from 'sweetalert2';

const Register = () => {
  const nav = useNavigate();

  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>(null!);

  const handleSubmitButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      return Swal.fire({
        title: 'Error!',
        text: '🚨 Please complete all empty fields!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }

    APIService(`/auth/register`, 'POST', {
      name: userName,
      email: email,
      password: password,
    })
      .then((data) => {
        //  localStorage.setItem('token', data.token)
        // console.log(data.token);

        Swal.fire(
          'Success!',
          `Welcome, ${userName}!
          Please check your email to confirm your account.`,
          'success'
        );

        nav(`/confirm`);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <h1 className="display-3 m-3 text-center"> Register </h1>

      <main className="container my-5">
        <section className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header"> Create your account get started today:</div>

              <div className="card-body">
                <h1>Complete fields below: </h1>
                <form className="form-group my-2">
                  <label>Username :</label>
                  <input
                    className="form-control my-2"
                    name="username"
                    value={userName}
                    placeholder="username"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUserName(e.target.value)
                    }
                  />

                  <label>email:</label>

                  <input
                    className="form-control my-2 required"
                    name="email"
                    value={email}
                    placeholder="your email"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />

                  <label>password:</label>

                  <input
                    className="form-control my-2 required"
                    name="password"
                    value={password || ''}
                    placeholder="password"
                    type="password"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                  />
                  <p>
                    Your data is protected and will never be shared. We promise never to spam you.
                  </p>

                  <button onClick={handleSubmitButton} className="btn btn-outline-success mt-2">
                    Register Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;
