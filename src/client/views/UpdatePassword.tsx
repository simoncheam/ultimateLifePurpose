import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { APIService } from '../services/APIService';
import Swal from 'sweetalert2';

const UpdatePassword = () => {
  const nav = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>(null!);

  const handleSubmitButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email || !password) {
      return Swal.fire({
        title: 'Error!',
        text: '🚨 Please complete all empty fields!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }

    APIService(`/auth/reset`, 'PUT', {
      // name: userName,
      email: email,
      password: password,
    })
      .then((data) => {
        Swal.fire(
          'Success!',
          `Your password has been updated for: ${email}!
          Please store your password in a secure place (like Bitwarden).`,
          'success'
        );

        nav(`/updateconfirm`);
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          title: 'Error: Invalid credentials',
          text: `🚨 Check to make sure email belongs to your account. `,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      });
  };

  return (
    <div>
      <h1 className="display-3 m-3 text-center"> Update Password </h1>

      <main className="container my-5">
        <section className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header"> Confirm your details...</div>

              <div className="card-body">
                <h1>Enter your email and new password below: </h1>
                <form className="form-group my-2">
                  <label>email:</label>
                  <input
                    className="form-control my-2 required"
                    name="email"
                    value={email}
                    placeholder="your email"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />

                  <label>new password:</label>
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
                  <p className="text-warning">Please store your password in a safe place.</p>

                  <button onClick={handleSubmitButton} className="btn btn-outline-success mt-2">
                    Update Password
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

export default UpdatePassword;
