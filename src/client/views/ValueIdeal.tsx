import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { LifeValues, userMetrics } from '../client_types';
import { APIService } from '../services/APIService';
import Swal from 'sweetalert2';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Accordion } from 'react-bootstrap';

const ValueIdeal = () => {
  const nav = useNavigate();

  const [lifeValues, setLifeValues] = useState<LifeValues[]>([]);
  const [userMetrics, setUserMetrics] = useState<userMetrics[]>([]);

  const [formData, setFormData] = useState<{ [key: number]: string }>({});
  //const [userMergedArray, setUserMergedArray] = useState<[]>([])
  const maxLength = 500;
  const now = 80;
  const topRef = useRef<null | HTMLDivElement>(null);

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

  // * ✅ Loads inital data from db
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

  //handle Submit
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
      return;
    }
    if (Object.values(formData).includes('')) {
      Swal.fire({
        title: 'Error!',
        text: 'Please complete all empty fields!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return;
    }

    // ! add PUT confirmation - warn user of updating values

    let temp = Object.keys(formData).map((key) => {
      return {
        valueid: Number(key),
        ideal: formData[Number(key)],
      };
    });

    Swal.fire({
      title: 'Are you sure you want to continue?',
      text: 'All content will saved in your secure database.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, continue!',
    }).then((result) => {
      if (result.isConfirmed) {
        APIService(`/api/usermetrics/7`, 'PUT', {
          userIdeals: temp,
        })
          .then((data) => {
            Toast.fire({
              icon: 'success',
              title: 'Updated successfully',
            });
            nav(`/priority`);
          })
          .catch((e) => {
            Toast.fire({
              icon: 'error',
              title: 'Error: check the console',
            });
            console.log(e);
          });
      }
    });
  };

  // * handleTextAreaUpdate
  const handleTextAreaUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newIdeal = e.target.value;
    const valueId = e.target.name;
    setFormData({ ...formData, [valueId]: newIdeal });
  };

  if (!userMetrics) {
    return <> Loading...</>;
  }

  return (
    <div className="container">
      <div className="row justify-content-center mx-2">
        <div className="col-md-6">
          <ProgressBar animated now={now} label={`${now}%`} />

          {/* Stage 7 prompt */}
          <div className="row card shadow my-3 py-3" ref={topRef}>
            <h1> My Ideal Vision </h1>

            <div className=" justify-content-center">
              <Accordion defaultActiveKey={['0']} alwaysOpen className="m-3">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <strong>Instructions: </strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p> What would it look like to fully embody this value? </p>
                    <li>
                      Create a small paragraph (4-6 sentences) explaining with specific details
                    </li>
                    <li>
                      Your answers should be custom to you and not based on what society thinks is
                      right for you
                    </li>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>

          <form>
            {selectedValues.map((val) => (
              <div key={`value-id-${val.id}`} className="row  justify-content-center">
                {/* card */}
                <div className="card mb-2 shadow p-2">
                  {/* header */}
                  <label className="h2 form-label m-2">{val.value_name}</label>

                  <span className="m-1">
                    {formData[val.id]?.length || 0}/ {maxLength}
                  </span>
                  <div className="card body m-2">
                    {/* text area */}
                    <textarea
                      onChange={handleTextAreaUpdate}
                      name={`${val.id}`}
                      className="form-control"
                      rows={4}
                      cols={100}
                      value={formData[val.id]}
                      placeholder={
                        'What would it look like for me to be a 10/10? \nWhat would it look like tangibly?'
                      }
                      maxLength={maxLength}
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => nav(-1)} className="row btn btn-primary m-2">
              Go Back{' '}
            </button>
          </form>
        </div>
      </div>
      <div className="  container position-fixed bottom-0 end-0">
        <div className=" row align-items-center m-2">
          <i
            onClick={() => topRef.current!.scrollIntoView()}
            role="button"
            className=" bi bi-arrow-up-circle-fill text-info col-auto me-auto "
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

export default ValueIdeal;
