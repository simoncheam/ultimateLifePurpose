import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { APIService } from '../services/APIService';

const Navbar = () => {
  const loc = useLocation();
  const nav = useNavigate();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    if (
      loc.pathname === '/login' ||
      loc.pathname === '/register' ||
      loc.pathname === '/confirm' ||
      loc.pathname === '/' ||
      loc.pathname === '/verify' ||
      loc.pathname === '/learn' ||
      loc.pathname === '/resetpassword'
    ) {
      return;
    } else {
      APIService('/auth/validate')
        .then((res) => {
          const tokenStatus = res.message === 'valid';
          setIsAuthed(tokenStatus);
        })
        .catch((e) => {
          console.log(e);

          nav(`/`);
        });
    }
  }, [loc.pathname]);

  return (
    <div>
      <Link type="button" className="m-2 btn btn-outline-primary" to="/">
        {' '}
        Home{' '}
      </Link>
      {isAuthed && (
        <Link type="button" className="m-2 btn btn-outline-primary" to="/contact">
          {' '}
          Contact Us{' '}
        </Link>
      )}

      {/* {!isAuthed &&

            <Link type="button" className="m-2 btn btn-outline-primary" to="/register"> Register </Link>
        } */}

      {!isAuthed && (
        <Link type="button" className="m-2 btn btn-outline-primary" to="/login">
          {' '}
          Start Here{' '}
        </Link>
      )}
      {/* //! links for development navigation */}
      {/* <Link type="button" className="m-2 btn btn-outline-success" to="/select">
        {' '}
        Select{' '}
      </Link>
      <Link type="button" className="m-2 btn btn-outline-success" to="/define">
        {' '}
        Define{' '}
      </Link>
      <Link type="button" className="m-2 btn btn-outline-success" to="/congruence">
        {' '}
        Congruence{' '}
      </Link>
      <Link type="button" className="m-2 btn btn-outline-success" to="/idealstate">
        {' '}
        Desired State{' '}
      </Link>
      <Link type="button" className="m-2 btn btn-outline-success" to="/priority">
        {' '}
        Prioritize{' '}
      </Link>
      <Link type="button" className="m-2 btn btn-outline-success" to="/habits">
        {' '}
        Habits{' '}
      </Link> */}
      {/* <Link type="button" className="m-2 btn btn-outline-success" to="/summary">
        Summary
      </Link> */}
      {/* <Link type="button" className="m-2 btn btn-outline-success" to="/resetpassword">
        Reset Password
      </Link>
      <Link type="button" className="m-2 btn btn-outline-success" to="/updatepassword">
        Update Password
      </Link>
      <Link type="button" className="m-2 btn btn-outline-success" to="/updateconfirm">
        Update Password Confirmed
      </Link> */}
    </div>
  );
};

export default Navbar;
