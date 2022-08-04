import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LifeValues, userMetrics } from '../client_types';
import { APIService } from '../services/APIService';
import Swal from 'sweetalert2';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Accordion } from 'react-bootstrap';

const ValueDefinitions = () => {
  const loc = useLocation();
  const nav = useNavigate();
  const maxLength = 500;
  const now = 40;
  const topRef = useRef<null | HTMLDivElement>(null);

  //use state
  const [merged, setMerged] = useState([]);

  const [lifeValues, setLifeValues] = useState<LifeValues[]>([]);
  const [userMetrics, setUserMetrics] = useState<userMetrics[]>([]);

  // we want to use an Object as we can use Object.keys to target specific element
  const [formData, setFormData] = useState<{ [key: number]: string }>({});

  // fetch data if page reloads or user resumes session

  useEffect(() => {
    // fetch user specific data - req.user
    APIService('/api/usermetrics')
      .then((data) => {
        setUserMetrics(data);
      })
      .catch((e) => {
        console.log(e);
      });

    // fetch all life values
    APIService(`/api/values`)
      .then((data) => {
        setLifeValues(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // *** (1) GET MERGED DATA

  let userValueArray: number[] = [];
  userMetrics.forEach((um) => userValueArray.push(um.valueid!));

  let selectedValues = lifeValues.filter((lv) => userValueArray.includes(lv.id));

  // ***

  const handleSubmitButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // ! add input validation
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

    //*** creates ARRAY of OBJECTS
    let temp = Object.keys(formData).map((key) => {
      return {
        valueid: Number(key),
        personal_definition: formData[Number(key)],
      };
    });

    // server takes in "temp" array

    // if (confirm('Are you sure you want to continue? All previous entries will be overwritten..'))

    Swal.fire({
      title: 'Are you sure you want to continue?',
      text: 'All content will saved in your secure database',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, continue!',
    }).then((result) => {
      if (result.isConfirmed) {
        APIService(`/api/usermetrics/5`, 'PUT', {
          definitions: temp,
        })
          .then((data) => {
            Swal.fire('Success!', 'Definitions updated!', 'success');
            nav(`/congruence`);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };

  // *** (3) TEXT AREA UPDATE (Dynamic update)

  const handleTextAreaUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const valueId = e.target.name;

    setFormData({ ...formData, [valueId]: newText });
  };

  if (!userMetrics) {
    return <> Loading...</>;
  }
  const progressStyle = {
    width: '40%',
  };

  // *** (2) DISPLAY MERGED DATA "selectedValues"

  return (
    <div className="container my-5 ">
      <div className="row justify-content-center">
        <div className="col-md-6 ">
          <ProgressBar animated now={now} label={`${now}%`} />

          <div className=" card shadow my-3 p-3" ref={topRef}>
            <h1> Define Your Values </h1>
            <div className="row justify-content-center"></div>
            <Accordion defaultActiveKey={['0']} alwaysOpen className="m-3">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <strong>Instructions: </strong>
                </Accordion.Header>
                <Accordion.Body>
                  <p>Define what each value means to you.</p>
                  <strong>Ask yourself:</strong>

                  <li> What exactly does this mean to me?</li>
                  <li> What would it look like tangibly?</li>
                  <li> How would I know if I embody this value?</li>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <form>
            {selectedValues.map((val) => (
              <div key={`value-id-${val.id}`} className="row  justify-content-center mx-2 ">
                <div className="card m-2 shadow p-2">
                  {/* header */}

                  <label className="h2 form-label m-2"> {val.value_name} </label>
                  <span className="mx-2 text-muted">
                    {formData[val.id]?.length || 0}/{maxLength}
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
                        'What does this mean to ME? \nWhy is this important?(be specific!)'
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
      {/* //! INSERT FAB  */}

      <div className=" container position-fixed bottom-0 end-0 my-3">
        <div className="row align-items-center">
          <i
            onClick={() => topRef.current!.scrollIntoView()}
            role="button"
            className=" bi bi-arrow-up-circle-fill text-info  col-auto me-auto "
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

export default ValueDefinitions;
