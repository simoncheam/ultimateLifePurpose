import React, { useEffect, useState, useRef, HTMLAttributeAnchorTarget } from 'react';
import { useNavigate } from 'react-router-dom';
import { LifeValues, userMetrics } from '../client_types';
import { APIService } from '../services/APIService';
import Swal from 'sweetalert2';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Accordion } from 'react-bootstrap';

const ValuePriority = () => {
  const nav = useNavigate();
  const now = 90;

  // *  useRefs
  const sum = useRef<any>({}); // ! reverse engineer the types
  //const divRefs = useRef({});
  const topRef = useRef<null | HTMLDivElement>(null);

  const userValueArrayRef = useRef<any>([]);
  const selectedValuesRef = useRef<any[]>([]);
  const userValueNamesArrayRef = useRef<any>({});

  //* --- * set up State
  const [lifeValues, setLifeValues] = useState<LifeValues[]>([]);
  const [userMetrics, setUserMetrics] = useState<userMetrics[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ [key: string]: { [key: string]: number } }>({}); //

  interface groupInfo {
    groupName: string;
    comparisons: {
      pairName: string;
      basekey: string;
      subkey: string;
      disabled: boolean;
      options: {
        label: string;
        value: string;
        selected: boolean;
      }[];
    }[];
  }

  const [priorities, setPriorities] = useState<
    {
      groupName: string;
      comparisons: {
        pairName: string;
        basekey: string;
        subkey: string;
        disabled: boolean;
        options: {
          label: string;
          value: string;
          selected: boolean;
        }[];
      }[];
    }[]
  >([]);

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

  // ✅ OK // * ////////// Button Handlers
  const handleSubmitButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let tempSum: number[] = Object.values(sum.current);

    // reducer to add to previous vale
    let totalScore = tempSum.reduce((a, b) => a + b, 0);

    if (totalScore !== 45) {
      Swal.fire({
        title: 'Error!',
        text: 'Please complete all sections!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return;
    }

    //console.log({ formData });

    // creates array of strings "value names"
    let tempMatch = Object.keys(formData);

    // create array - filter thru life vals - where lv includes value_name from tempMatch array
    let matches = lifeValues.filter((lv) => tempMatch.includes(lv.value_name));

    // ! TESTING
    //console.log({ matches });

    // map over matches
    let arrayMerged: { valueid: number; score: number }[] = matches.map((merged) => ({
      valueid: Number(merged.id),
      score: Number(formData[merged.value_name][merged.value_name]),
      // score: Number(formData[merged.value_name][merged.value_name]) removed
    }));

    //console.log(arrayMerged);

    // ! Submit confirm
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
        APIService(`/api/usermetrics/8`, 'PUT', {
          userPriorities: arrayMerged,
        })
          .then((data) => {
            Toast.fire({
              icon: 'success',
              title: 'Updated successfully',
            });

            nav(`/habits`);
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

  // ✅ OK initial data fetch from server
  useEffect(() => {
    APIService('/api/usermetrics')
      .then((data) => {
        setUserMetrics(data);

        APIService(`/api/values`)
          .then((data) => {
            setLifeValues(data);
            setIsLoaded(true);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // prepares refs of filtered/mapped values after loading is done
  useEffect(() => {
    if (!userMetrics.length || !lifeValues.length) return;

    userValueArrayRef.current = userMetrics.map((um) => um.valueid);
    selectedValuesRef.current = lifeValues.filter((lv) =>
      userValueArrayRef.current.includes(lv.id)
    );

    userValueNamesArrayRef.current = selectedValuesRef.current.map(
      (value: { value_name: string }) => value.value_name
    );
  }, [userMetrics, lifeValues]);

  // ✅ OK // *** Creates compared object - eliminates duplicate subkeys(inner values)
  useEffect(() => {
    if (!isLoaded) return;
    const compared: { [outerValue: string]: Array<{ innerValue: any }> } = {};

    for (const outerValue of userValueNamesArrayRef.current) {
      for (const innerValue of userValueNamesArrayRef.current) {
        if (innerValue !== outerValue) {
          if (
            compared[innerValue] === undefined ||
            compared[innerValue][outerValue] === undefined
          ) {
            //@ts-ignore
            compared[outerValue] = {
              [innerValue]: '',
              ...compared[outerValue],
            };
          }
        }
      }
    }

    // ! NEW grouping structure => updates priorties state

    const data: groupInfo[] = [];
    for (const [basekey, subkeys] of Object.entries(compared)) {
      // Each group is divided by basekey
      const group: groupInfo = {
        groupName: basekey,

        // each comparison tracks the disabled state of the pair and radio options
        comparisons: Object.keys(subkeys).map((subkey) => {
          return {
            pairName: `${basekey}-${subkey}`,
            basekey,
            subkey,
            disabled: false,

            // each option has label, value and selected radio state
            options: [
              {
                label: `(1) LOTS of ${basekey.toUpperCase()}, but little ${subkey.toUpperCase()}.`,
                value: basekey,
                selected: false,
              },
              {
                label: `(2) LOTS of ${subkey.toUpperCase()}, but little ${basekey.toUpperCase()}.`,
                value: subkey,
                selected: false,
              },
            ],
          };
        }),
      };
      data.push(group);
    }
    setPriorities(data);
  }, [isLoaded, lifeValues, userMetrics]);

  // console.log(priorities);

  // ✅ OK // *** handleChange - toggle radio + scoring
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextState = priorities.map((group) => {
      // ! checks for matching groupname (Outer basekey value) and returns non-matching
      if (group.groupName !== e.target.getAttribute('data-group')) return group;

      return {
        ...group,
        comparisons: group.comparisons.map((pair) => {
          // ! check for non-matching pairNames
          if (pair.pairName !== e.target.name) return pair;

          // ! only modifies matching pair names -- disables clicked and +1 to sum
          return {
            ...pair,
            disabled: true,
            options: pair.options.map((opt) => {
              const selected = opt.value === e.target.value;

              // if we got this far to toggle a selected radio
              // time to populate or update our sum object
              if (selected) {
                if (Number(sum.current[opt.value])) {
                  sum.current[opt.value]++;
                } else {
                  sum.current[opt.value] = 1;
                }
              }
              return {
                ...opt,
                selected,
              };
            }),
          };
        }),
      };
    });

    const formDataKey = e.target.value;

    // *********************
    setPriorities(nextState);
    console.log(
      '%cselected! sum object:',
      'color:white;background:#0091ea;padding:5px;margin:5px;'
    );
    console.log(sum.current);
    console.log('----------');
    // *********************

    // ! Need to set formData
    setFormData((formData) => ({
      ...formData,
      [formDataKey]: sum.current, // ? Number(formDataKey) // !
    }));
  };

  //  ! *** handleEdit
  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const nextState = priorities.map((group) => {
      if (group.groupName !== e.currentTarget.getAttribute('data-group')) return group;

      return {
        ...group,
        comparisons: group.comparisons.map((pair) => {
          if (pair.pairName !== e.currentTarget.name) return pair;

          return {
            ...pair,
            disabled: false,
            options: pair.options.map((opt) => {
              if (opt.selected) {
                sum.current[opt.value]--; //? Q: what is wrong with TS?
              }

              return {
                ...opt,
                selected: false,
              };
            }),
          };
        }),
      };
    });
    setPriorities(nextState);

    console.log(
      '%cedited choice! sum object:',
      'color:white;background:#a800ea;padding:5px;margin:5px;'
    );
    console.log(sum.current);
    console.log('----------');
  };

  // * DEV - Scroll to Ref

  // ! conditions: Check object.keys of comparisons

  // const scrollToMyRef = (valueid: number) => {
  //     divRefs.current[valueid === 10 ? 1 : valueid + 1].scrollIntoView({
  //         behavior: "smooth"
  //     })
  // }

  const progressStyle = {
    width: '90%',
  };

  if (
    !userMetrics.length ||
    !lifeValues.length ||
    !userValueNamesArrayRef.current.length ||
    !priorities.length
  ) {
    return <> Loading...</>;
  }

  return (
    <main className="container my-5">
      <section className="row justify-content-center">
        <ProgressBar animated now={now} label={`${now}%`} />

        <div className="col-md-6" ref={topRef}>
          {/* Stage 7 prompt */}
          <div className=" card shadow m-3 p-3">
            <h1> Prioritize Your Values </h1>
            <div className="justify-content-center">
              <Accordion defaultActiveKey={['0']} alwaysOpen className="m-3">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <strong>Instructions: </strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>In this section we'll rank each chosen life value.</p>
                    <li> Each value is compared against all other values to determine priority</li>
                    <li>Consider each comparison and choose between (1) or (2)</li>
                    <li>
                      <strong> Ask Yourself: </strong>
                      Which option would make me more fulfilled?
                    </li>
                    <li> Choices will be custom to you and not based on what society thinks </li>
                    <li> Use your intuition when selecting your choice </li>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>

          {priorities.map((group) => (
            // Value 1 Section - starts 1st basekey comparison
            <div key={`group-${group.comparisons}`}>
              <div className="pb-1 fs-4 ">
                Prioritizing "{group.groupName}":
                <h3> I would be MORE fulfilled with... </h3>
              </div>
              <form className="p-3 mb-5 rounded shadow-sm form-group">
                {/* needs to map through comparisons (compare subkeys to basekey) */}
                {group.comparisons.map((pair) => (
                  <div key={`pair-${pair.pairName}`} className="pb-5 ">
                    {pair.options.map((opt) => (
                      <div key={`${pair.pairName}-${opt.label}`} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={pair.pairName}
                          data-group={group.groupName}
                          id={opt.label}
                          value={opt.value}
                          checked={!!opt.selected}
                          disabled={pair.disabled}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor={opt.label}>
                          {opt.label}
                        </label>
                      </div>
                    ))}

                    {pair.disabled && (
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={handleEdit}
                          name={pair.pairName}
                          data-group={group.groupName}
                        >
                          Edit Choice
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </form>
            </div>
          ))}
        </div>

        <div className="">
          <button onClick={() => nav(-1)} className="m-2 btn btn-primary">
            Go Back{' '}
          </button>

          {/* <button className="m-2 btn btn-outline-success" onClick={handleSubmitButton}>
            {' '}
            Submit
          </button> */}
        </div>
      </section>
      <div className=" container position-fixed bottom-0 end-0">
        <div className=" row align-items-center m-2 ">
          <i
            onClick={() => topRef.current!.scrollIntoView()}
            role="button"
            className=" bi bi-arrow-up-circle-fill text-info  col-auto me-auto "
            style={{ fontSize: 50 }}
          ></i>

          <div className="col-auto">
            {Object.values(sum.current).reduce((a: number, b: any) => a + b, 0) === 45 ? (
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
                  {45 - Number(Object.values(sum.current).reduce((a: number, b: any) => a + b, 0))}
                </span>
                Left
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ValuePriority;
