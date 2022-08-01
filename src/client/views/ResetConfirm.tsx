import React from 'react';

const ResetConfirm = () => {
  return (
    <div>
      <h1 className="display-3 text-success m-3 text-center">
        A Password Reset Email Is On The Way!
      </h1>
      <p className=" m-3 text-center">
        Please check your inbox including spam folder. Click the link in that message to reset your
        password. The link expires in 15min, so if you're seeing this for a second time check your
        inbox again for the latest secure link.
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

export default ResetConfirm;
