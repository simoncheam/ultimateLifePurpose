import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

const ResetVerify = () => {
  const loc = useLocation();
  const nav = useNavigate();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    setSearchParams({ token: token, email: email });

    fetch(`/auth/resetverify?email=${email}&token=${token}`)
      .then((res) => res.json())
      .then((res) => {
        // ! Sets new token to LS after resetverify email link clicked & verified
        localStorage.setItem('token', res.token);
        console.log(token);
        setIsAuthed(res.token);

        nav(`/updatepassword`);
      })
      .catch((e) => {
        console.log(e);
        nav(`/resetconfirm`);
      });
  }, []);

  if (!isAuthed) {
    return <>loading please wait...</>;
  }

  return (
    <div className="container">
      <h1 className="display-3 m-3 text-center"> ⚠️ You are now Verified! </h1>

      <h2 className="row justify-content-center m-2">Momentum: The Ultimate Life Purpose App</h2>
      <div className="row justify-content-center m-2">
        <div className="col-md-6">
          <div className="card shadow"></div>
        </div>
      </div>
    </div>
  );
};

export default ResetVerify;
