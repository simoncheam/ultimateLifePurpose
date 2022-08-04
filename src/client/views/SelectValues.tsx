import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { LifeValues } from '../client_types';
import { APIService } from '../services/APIService';
import Swal from 'sweetalert2';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Accordion from 'react-bootstrap/Accordion';

const SelectValues = () => {
  const [lifeValues, setLifeValues] = useState<LifeValues[]>([]);
  const [selectedIdArray, setSelectedIdArray] = useState<number[]>([]);
  const nav = useNavigate();
  const loc = useLocation();
  const now = 20;
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

  useEffect(() => {
    APIService(`/api/values`)
      .then((data) => {
        setLifeValues(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleSubmitButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // input validation
    if (!selectedIdArray || selectedIdArray.length != 10) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select 10 items!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });

      return;
    }

    APIService('/api/usermetrics', 'POST', {
      userValueArray: selectedIdArray,
    })
      .then((data) => {
        // ! add sweet alert
        Toast.fire({
          icon: 'success',
          title: 'Values added successfully',
        });

        // useNavigate is sending an object with state prop
        nav('/define', {
          state: {
            selectedIdArray,
            lifeValues,
          },
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (!lifeValues.length) {
    return <> Loading...</>;
  }

  return (
    <div className="container">
      {/* if Array length = 10 => show button, else display # values left to select */}
      <div className="row m-3  justify-content-center">
        <ProgressBar animated now={now} label={`${now}%`} />
      </div>

      <div className=" container position-fixed bottom-0 end-0 my-3">
        <div className=" row align-items-center">
          <i
            onClick={() => topRef.current!.scrollIntoView()}
            role="button"
            className="  bi bi-arrow-up-circle-fill text-info col-auto me-auto "
            style={{ fontSize: 50 }}
          ></i>

          <div className=" col-auto">
            {selectedIdArray.length === 10 ? (
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
                  {10 - selectedIdArray.length}
                </span>
                Left
              </button>
            )}
          </div>
        </div>
      </div>

      <div className=" card shadow m-3  p-3" ref={topRef}>
        {selectedIdArray.length === 10 ? (
          <div className="row m-5 justify-content-center">
            <button className="btn m-3 btn-outline-success " onClick={handleSubmitButton}>
              Submit
            </button>
          </div>
        ) : (
          <h1 className="display-3 m-3 text-center">Select {10 - selectedIdArray.length} Values</h1>
        )}
      </div>
      <Accordion defaultActiveKey={['0']} alwaysOpen className="m-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <strong>Instructions: </strong>
          </Accordion.Header>
          <Accordion.Body>
            Select your top 10 life values. We will assign priority later.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <form>
        <div className="row m-2">
          {lifeValues.map((lv) => (
            <div key={lv.id} className=" col-6 col-md-4 ">
              <div className=" form-check mx-2 my-2">
                <input
                  className="form-check-input col-4"
                  type="checkbox"
                  value=""
                  onChange={(e) => {
                    if (selectedIdArray.length === 10 && e.target.checked) {
                      e.target.checked = false;
                      //alert("Pick 10 only!");
                      Swal.fire({
                        title: 'Error!',
                        text: 'Please select only 10 items!',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                      });
                      return;
                    }

                    if (e.target.checked) {
                      // temp array contains old values with newly checked valueid
                      const tempArray = [...selectedIdArray, lv.id];
                      setSelectedIdArray(tempArray);
                    } else {
                      // undo or remove from array, returns id that is not equal to unselected valueid
                      const tempArray = [...selectedIdArray].filter((id) => id != lv.id);
                      setSelectedIdArray(tempArray);
                    }
                  }}
                />
                <label>
                  <p>
                    {/* //! /g replaces all items */}
                    {lv.value_name.replace(/\//g, ', ')}

                    {selectedIdArray.includes(lv.id) && lv.is_lower_self ? (
                      <span className="ml-3 text-danger">
                        {' '}
                        * CAUTION: likely toxic, inauthentic, or lower self value...
                      </span>
                    ) : null}
                  </p>
                </label>
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SelectValues;
