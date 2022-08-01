import React, { useState } from 'react';

const RegistrationConfirm = () => {
  return (
    <div>
      <h1 className="display-3 text-success m-3 text-center">
        A Confirmation Email Has Been Sent!
      </h1>
      <p className=" m-3 text-center">
        We have sent a confirmation link to your email address. Please click the link in that
        message to activate your account.
      </p>

      <main className="container my-5">
        <section className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RegistrationConfirm;
