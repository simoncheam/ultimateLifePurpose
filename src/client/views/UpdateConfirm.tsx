import React, { useState } from 'react';

const UpdateConfirm = () => {
  return (
    <div>
      <h1 className="display-3 text-success m-3 text-center">
        Your Password has been update successfully
      </h1>
      <p className=" m-3 text-center">You can now use the app.</p>

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

export default UpdateConfirm;
