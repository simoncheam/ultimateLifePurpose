import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APIService } from '../services/APIService';

const Home = () => {
  const loc = useLocation();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    APIService('/auth/validate')
      .then((res) => {
        const tokenStatus = res.message === 'valid';
        console.log({ tokenStatus });
        setIsAuthed(tokenStatus);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [loc.pathname]);

  return (
    <div className="container">
      <h1 className="display-3 m-3 text-center"> Welcome to Momentum 🚀 </h1>

      <h2 className="row justify-content-center m-2"> Your Ultimate Life Purpose App</h2>
      <h3 className="row justify-content-center m-2">
        {' '}
        Create Clarity. Design Happiness. Build a Fulfilling Life.
      </h3>
      <div className="row justify-content-center m-2">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body row m-5 justify-content-center">
              {isAuthed && (
                <Link to={`/select`} className="row btn btn-outline-success m-2">
                  Get Started{' '}
                </Link>
              )}

              {/* {!isAuthed &&
                            <Link to={`/register`} className="row btn btn-outline-warning m-2">Register </Link>
                        } */}
              {!isAuthed && (
                <Link to={`/login`} className="row btn btn-outline-success m-2">
                  Start Here{' '}
                </Link>
              )}

              <Link to={`/learn`} className="row btn btn-outline-warning m-2">
                Learn More{' '}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
