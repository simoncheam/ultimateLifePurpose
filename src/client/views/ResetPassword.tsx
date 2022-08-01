import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { APIService } from '../services/APIService';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const nav = useNavigate();

  const [email, setEmail] = useState<string>('');

  const handleSubmitButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email) {
      return Swal.fire({
        title: 'Error!',
        text: '🚨 Please complete all empty fields!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }

    APIService(`/auth/reset`, 'POST', {
      email: email,
    })
      .then((data) => {
        Swal.fire(
          'Success!',
          `Email sent to, ${email}!
          Please check your inbox(including spam folder) to reset your password.`,
          'success'
        );

        nav(`/resetconfirm`);
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          title: 'Error: Invalid credentials',
          text: `🚨 No account with that email. Check spelling. `,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      });
  };

  return (
    <div>
      <h1 className="display-3 m-3 text-center"> Reset Password </h1>

      <main className="container my-5">
        <section className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header">
                Forgot your password? No worries, we'll help you reset it...
              </div>

              <div className="card-body">
                <h1>Enter your email below: </h1>
                <form className="form-group my-2">
                  <input
                    className="form-control my-2 required"
                    name="email"
                    value={email}
                    placeholder="your email"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />

                  <p>
                    Password reset link will be sent to your email. This link will expire in 15
                    minutes. Check Spam folder.
                  </p>

                  <button onClick={handleSubmitButton} className="btn btn-outline-success mt-2">
                    Reset Password
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

export default ResetPassword;
