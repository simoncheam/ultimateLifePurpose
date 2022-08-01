import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { APIService } from '../services/APIService';
import Swal from 'sweetalert2';

const Contact = () => {
  const nav = useNavigate();

  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>(null);

  const handleSubmitButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!userName || !email || !message) {
      return Swal.fire({
        title: 'Error!',
        text: '🚨 Please complete all empty fields!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }

    // !check for valid email

    APIService(`/api/contact`, 'POST', {
      userName: userName,
      email: email,
      message: message,
    })
      .then((data) => {
        Swal.fire(
          'Success!',
          `Thanks for your message, ${userName}!
                    Be sure to check your spam to avoid missing updates.`,
          'success'
        );

        nav(`/`);
      })
      .catch((e) => {
        console.log(e);
        alert(e.message);
      });
  };

  return (
    <div>
      <h1 className="display-3 m-3 text-center"> Contact Us </h1>

      <main className="container my-5">
        <section className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header">
                <span className="row mx-2"> Got an idea, question, or feedback?</span>
                <span className="row mx-2"> Drop us a message. We'd love to hear from you!</span>
              </div>

              <div className="card-body">
                <h1>Complete fields below: </h1>
                <form className="form-group my-2">
                  <label>Name :</label>
                  <input
                    className="form-control m-2"
                    name="username"
                    value={userName}
                    placeholder="your name"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUserName(e.target.value)
                    }
                  />

                  <label>email:</label>

                  <input
                    className="form-control m-2 required"
                    name="email"
                    value={email}
                    placeholder="your account email"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />

                  <label>Message:</label>

                  <textarea
                    className="form-control m-2 required"
                    name="password"
                    value={message || ''}
                    placeholder={`What's on your mind`}
                    rows={4}
                    cols={100}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setMessage(e.target.value)
                    }
                  ></textarea>

                  <button onClick={handleSubmitButton} className="btn btn-outline-success mt-2">
                    {' '}
                    Submit Feedback
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

export default Contact;
