import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { APIService } from '../services/APIService';
import { useSearchParams } from 'react-router-dom';

const Verify = () => {
  const loc = useLocation();
  const nav = useNavigate();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // token and email pull from url
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    setSearchParams({ token: token!, email: email! });

    // email and token sent through auth/verify route
    fetch(`/auth/verify?email=${email}&token=${token}`)
      .then((res) => res.json())
      .then((res) => {
        // token set if successful
        localStorage.setItem('token', res.token);
        //const tokenStatus = res.message === 'valid';
        console.log(token);
        setIsAuthed(res.token);

        //redirect to start - stage 1
        nav(`/select`);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // loading please wait - use will see temporarily
  if (!isAuthed) {
    return <>loading please wait...</>;
  }

  return (
    <div className="container">
      <h1 className="display-3 m-3 text-center"> ⚠️ You are now Verified! </h1>

      <h2 className="row justify-content-center m-2">Momentum: The Ultimate Life Purpose App</h2>
      <div className="row justify-content-center m-2">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body row m-5 justify-content-center">
              {isAuthed && (
                <Link to={`/select`} className="row btn btn-outline-success m-2">
                  Get Started{' '}
                </Link>
              )}

              {!isAuthed && (
                <Link to={`/register`} className="row btn btn-outline-warning m-2">
                  Register{' '}
                </Link>
              )}
              {!isAuthed && (
                <Link to={`/login`} className="row btn btn-outline-success m-2">
                  Login{' '}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
