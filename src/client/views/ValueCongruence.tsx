import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { LifeValues, userMetrics } from '../client_types';
import { APIService } from '../services/APIService';
import Swal from 'sweetalert2';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Accordion } from 'react-bootstrap';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const ValueCongruence = () => {
  const loc = useLocation();
  const nav = useNavigate();
  const now = 60;
  const topRef = useRef<null | HTMLDivElement>(null);

  //use state
  //const [merged, setMerged] = useState([])

  const [lifeValues, setLifeValues] = useState<LifeValues[]>([]);
  const [userMetrics, setUserMetrics] = useState<userMetrics[]>([]);

  const [formData, setFormData] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    APIService('/api/usermetrics')
      .then((data) => {
        setUserMetrics(data);
      })
      .catch((e) => {
        console.log(e);
      });

    APIService(`/api/values`)
      .then((data) => {
        setLifeValues(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  let userMergedArray: number[] = [];
  userMetrics.forEach((um) => userMergedArray.push(um.valueid!));
  let selectedValues = lifeValues.filter((lv) => userMergedArray.includes(lv.id));

  //----------// !handleSubmitButton , API PUT,

  const handleSubmitButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // ! add input validation - check for 10 items or empty string

    if (Object.keys(formData).length !== 10) {
      Swal.fire({
        title: 'Error!',
        text: 'Please complete all 10 items!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });

      // alert('please complete all 10 items!')
      return;
    }

    let temp = Object.keys(formData).map((key) => {
      return {
        valueid: Number(key),
        rating: formData[Number(key)],
      };
    });

    APIService(`/api/usermetrics/6`, 'PUT', {
      userRatings: temp,
    })
      .then((data) => {
        Toast.fire({
          icon: 'success',
          title: 'Congruence ratings added successfully',
        });

        nav(`/idealstate`);
      })
      .catch((e) => {
        console.log(e);

        Swal.fire({
          title: 'Error! Check the console',
          text: 'Do you want to continue',
          icon: 'error',
          confirmButtonText: 'Cool',
        });
      });
  };

  //--------// * handleTextAreaUpdate

  const handleRangeAreaUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRating = e.target.value;

    const valueId = e.target.name;

    setFormData({ ...formData, [valueId]: newRating });
  };

  /*
    ! setFormData

    */

  if (!userMetrics) {
    return <> Loading...</>;
  }

  const progressStyle = {
    width: '60%',
  };

  return (
    // container
    <div className="container my-5">
      <div className="row justify-content-center mx-3">
        {/* progress bar */}
        <div className="col-md-6 ">
          <ProgressBar animated now={now} label={`${now}%`} />

          {/* <div className="progress my-3">
                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuemin={0} aria-valuemax={100}
                        style={progressStyle}>
                        {progressStyle.width}
                    </div>
                </div> */}

          {/* card  */}
          <div className="row card shadow my-3 py-3" ref={topRef}>
            <h1>Congruence </h1>

            <div className=" justify-content-center">
              <Accordion defaultActiveKey={['0']} alwaysOpen className="m-3">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <strong>Instructions: </strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="">
                      For each selected value, choose a congruence rating a scale of 0-10. This is a
                      personal estimate.
                    </p>

                    <ul className="">
                      Things to consider:
                      <li>
                        <strong>Ask yourself: </strong>
                        How much do I embody this value day to day in my life?
                      </li>
                      <li>
                        Living in congruence or alignment means that you embody this value in your
                        daily thoughts, words, actions etc.{' '}
                      </li>
                      <li> Rating of 0 means low alignment </li>
                      <li> Rating of 10 means high alignment </li>
                      <li>
                        Be honest with yourself and let go of any self judgement. Lack of congruence
                        is expected and is okay!
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>

          <form>
            {selectedValues.map((val) => (
              <div key={`value-id-${val.id}`} className="row  justify-content-center">
                {/* card shadow p-2 */}
                <div className="card mb-2 shadow p-2">
                  {/* card header */}
                  <label className="form-label h3 "> {val.value_name}</label>

                  {/* card body */}
                  <label className="form-label">
                    {' '}
                    Rating: {isNaN(Number(formData[val.id])) ? 5 : formData[val.id]}{' '}
                  </label>

                  <input
                    type="range"
                    className="slider"
                    min="0"
                    max="10"
                    id="customRange2"
                    onChange={handleRangeAreaUpdate}
                    name={`${val.id}`}
                    value={formData[val.id] || 5}
                  />
                </div>
              </div>
            ))}
            <button onClick={() => nav(-1)} className="row btn btn-primary m-2">
              Go Back{' '}
            </button>
            {/* <button className="btn btn-outline-success" onClick={handleSubmitButton}>
            {' '}
            Submit
          </button> */}
          </form>
        </div>
      </div>
      <div className=" container position-fixed bottom-0 end-0 my-3">
        <div className="row align-items-center ">
          <i
            onClick={() => topRef.current!.scrollIntoView()}
            role="button"
            className=" bi bi-arrow-up-circle-fill text-info  bottom-0 end-0 col-auto me-auto "
            style={{ fontSize: 50 }}
          ></i>

          <div className="col-auto">
            {Object.keys(formData).length === 10 ? (
              <button
                className="btn btn-outline-success "
                style={{ fontSize: 30 }}
                onClick={handleSubmitButton}
              >
                Submit
              </button>
            ) : (
              <button type="button" className=" btn btn-warning " style={{ fontSize: 30 }}>
                <span style={{ fontSize: 30 }} className=" badge badge-dark">
                  {10 - Object.keys(formData).length}
                </span>
                Left
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValueCongruence;
