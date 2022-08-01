import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { LifeValues, userMetrics } from '../client_types';
import { APIService } from '../services/APIService';
import Swal from 'sweetalert2';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Accordion } from 'react-bootstrap';

const ValueHabits = () => {
  const nav = useNavigate();
  const now = 95;
  const topRef = useRef(null);

  const [lifeValues, setLifeValues] = useState<LifeValues[]>([]);
  const [userMetrics, setUserMetrics] = useState<userMetrics[]>([]);

  const [formData, setFormData] = useState<{ [key: number]: string }>({});
  //const [userMergedArray, setUserMergedArray] = useState<[]>([])
  const maxLength = 500;

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

  useEffect(() => {
    // Gets usermetrics sorted by priority score
    APIService('/api/usermetrics/prioritized')
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

  userMetrics.forEach((um) => userMergedArray.push(um.valueid));
  let selectedValues = lifeValues.filter((lv) => userMergedArray.includes(lv.id));

  //handle Submit
  const handleSubmitButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // ! add input validation - check for 10 items or empty string

    if (Object.keys(formData).length !== 10) {
      //alert('please complete all 10 items!')

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
      // alert('please complete all fields!')
      return;
    }

    // ! add PUT confirmation - warn user of updating values

    let temp = Object.keys(formData).map((key) => {
      return {
        valueid: Number(key),
        habit: formData[Number(key)],
      };
    });

    // Swal confirm
    Swal.fire({
      title: 'Are you sure you want to continue?',
      text: "Any previous content will be overwritten. You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, continue!',
    }).then((result) => {
      if (result.isConfirmed) {
        APIService(`/api/userhabits`, 'POST', {
          userHabits: temp,
        })
          .then((data) => {
            Toast.fire({
              icon: 'success',
              title: 'Habits added successfully',
            });
            nav(`/summary`);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };

  // * handleTextAreaUpdate

  const handleTextAreaUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHabit = e.target.value;
    const valueId = e.target.name;

    setFormData({ ...formData, [valueId]: newHabit });
  };

  if (!userMetrics.length) {
    return <> Loading...</>;
  }

  const progressStyle = {
    width: '95%',
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <ProgressBar animated now={now} label={`${now}%`} />

          {/* Stage 7 prompt */}
          <div className=" card shadow m-3 p-3" ref={topRef}>
            <h1> Discipline = Destiny </h1>
            <h2>🔴 Create a powerful habit </h2>

            <div className="justify-content-center my-2">
              <Accordion defaultActiveKey={['0']} alwaysOpen className="m-3">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <strong>Instructions: </strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul className="">
                      Focus points to consider:
                      <li className="mt-2">
                        <strong> Ask Yourself: </strong>
                        What is ONE THING I can commit to doing each day or week? (Consistency is
                        key!)
                      </li>
                      <li>
                        Create a SMART habit (specific, measurable, achievable, realistic, time
                        bound)
                      </li>
                      <li> Your answers should be custom to you and not what society thinks </li>
                      <li> Your values are listed in order of priority</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>

          <form>
            {selectedValues.map((val) => (
              <div key={`value-id-${val.id}`} className="row  justify-content-center">
                <div className="">
                  {/* card */}
                  <div className="card m-3 shadow p-2">
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
                        rows={6}
                        cols={100}
                        value={formData[val.id]}
                        placeholder={
                          'What is ONE consistent action that would move me closer to my goal in this area? \nWhat would it look like specific?\nWhen will I realisticaly commit to doing this?'
                        }
                        maxLength={maxLength}
                      ></textarea>
                    </div>
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
      <div className=" container position-fixed bottom-0 end-0 my-3">
        <div className=" row align-items-center ">
          <i
            onClick={() => topRef.current.scrollIntoView()}
            role="button"
            className=" bi bi-arrow-up-circle-fill text-info col-auto me-auto "
            style={{ fontSize: 50 }}
          ></i>

          <div className=" col-auto ">
            {Object.keys(formData).length === 10 ? (
              <button
                className=" btn btn-outline-success "
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

export default ValueHabits;
