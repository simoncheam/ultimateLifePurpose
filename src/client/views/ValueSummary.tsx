import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { LifeValues, userMetrics, userMetricsJoined } from '../client_types';
import { APIService } from '../services/APIService';
import Swal from 'sweetalert2';
import ProgressBar from 'react-bootstrap/ProgressBar';
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

const ValueSummary = () => {
  const [userMetricsJoined, setUserMetricsJoined] = useState<userMetricsJoined[]>([]);
  const [lifeValues, setLifeValues] = useState<LifeValues[]>([]);
  const now = 100;
  const topRef = useRef<null | HTMLDivElement>(null);
  const divRefs = useRef<any>({});

  //! habit state setup
  const [habit, setHabit] = useState('insert habit');
  const [habitDesc, setHabitDesc] = useState('Add habit description/notes');

  //! DatePicker Setup
  const [start, setStart] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminderInterval, setReminderInterval] = useState('WEEKLY');

  //! date formatter
  const dateTimeFormatter = (date: any) => {
    return date.toISOString().replace(/[^\w+]/g, '');
  };

  const dateFormatter = (date: any) => {
    const YYYY = date.getFullYear();
    let MM = date.getMonth() + 1;
    let DD = date.getDate();

    if (MM < 10) {
      MM = `0${MM}`;
    }

    if (DD < 10) {
      DD = `0${DD}`;
    }
    return `${YYYY}${MM}${DD}`;
  };

  const halfHourOffset = (date: any) => {
    const offset = new Date(date);
    offset.setTime(offset.getTime() + 1000 * 60 * 30);
    return dateTimeFormatter(offset);
  };

  const createWeeklyReminderLink = () => {
    const event: any = {
      action: 'TEMPLATE',
      text: habit,
      details: habitDesc,
      location: '-',
      dates: dateTimeFormatter(start) + '/' + halfHourOffset(start),
      recur: 'RRULE:FREQ=' + reminderInterval + ';UNTIL=' + dateFormatter(selectedDate),
    };

    const queryParams = Object.keys(event)
      .map((key) => `${encodeURI(key)}=${encodeURI(event[key])}`)
      .join('&');

    return `https://calendar.google.com/calendar/render?${queryParams}`;
  };

  const handleButtonClickYall = (e: any) => {
    e.preventDefault();
    const googleCalendarLink = createWeeklyReminderLink();
    window.open(googleCalendarLink, '_blank');
  };

  //! create reminder link (google cal)

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
    APIService('/api/usermetrics/summary')
      .then((data) => {
        setUserMetricsJoined(data);
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

  const scrollToMyRef = (valueid: any) => {
    divRefs.current[valueid].scrollIntoView({
      behavior: 'smooth',
    });
  };

  if (!userMetricsJoined.length) {
    return <> Loading...</>;
  }

  const progressStyle = {
    width: '99%',
  };

  return (
    <main className="container my-5">
      <section className="row justify-content-center ">
        <div className="  col-12 col-md-6 mt-5">
          <ProgressBar animated now={now} label={`${now}%`} />
          <div className=" container position-fixed bottom-0 end-0 my-3">
            <div className=" col-md-6">
              <div className=" row align-items-center">
                <i
                  onClick={() => topRef.current!.scrollIntoView()}
                  role="button"
                  className="  bi bi-arrow-up-circle-fill text-info col-auto me-auto "
                  style={{ fontSize: 50 }}
                ></i>
              </div>
            </div>
          </div>

          <div className=" d-flex justify-content-center " ref={topRef}>
            <div className="col-12 col-md-12 card shadow  ">
              <h1>Life Purpose Summary</h1>
              <ul>
                <li>Below are your top life values in priority order</li>
                <li>
                  Notes: Best viewed on desktop. Habits can be scheduled after logging into Google
                  Calendar.
                </li>
              </ul>
              <table className="table ">
                <thead>
                  <tr className="col-md-8">
                    <th scope="col-12 col-md-2">Priority</th>
                    <th scope="col-12 col-md-2">Value</th>
                    <th scope="col-12">Score</th>
                    {/* <th scope="col-12">Details</th> */}
                  </tr>
                </thead>
                <tbody>
                  {userMetricsJoined.map((sum, index) => (
                    <tr key={`summary-${sum.id}-${sum.userid}-${index}`}>
                      <th className="col-1" scope="row">
                        {Number(index) + 1}
                      </th>
                      {/* regex to replace '/'  for formatting*/}
                      <td className="col-1 col-md-8">{sum.value_name?.replace(/\//g, ' / ')}</td>
                      <td className="col-1">{sum.priority}</td>
                      <td className="col-2">
                        <div
                          className="d-flex justify-content-center"
                          onClick={() => scrollToMyRef(sum.valueid)}
                        >
                          <button className="btn btn-sm btn-outline-warning">See more</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {userMetricsJoined.map((um: userMetricsJoined) => (
            <div
              key={`userMetrics-${um.valueid}-${um.id}-${um.habit}`}
              className="row justify-content-center"
            >
              <div className="" ref={(ref) => (divRefs.current[um.valueid!]! = ref)}>
                {/* outer card */}
                <div className="card my-3  shadow p-2">
                  {/* card header */}
                  <div className="card-title text-center">
                    <label className="h2 form-label m-2">
                      {um.value_name!.replace(/\//g, ' / ')}
                    </label>
                  </div>

                  {/* card body  */}
                  <div className="card-body">
                    {/* inner card content */}
                    <div className="card-body">
                      <h5 className="card-title">My Personal Definition</h5>
                      <p className="card-text">{um.personal_definition}</p>
                    </div>
                    <hr />
                    <div className="card-body">
                      <h5 className="card-title">What a 10 looks like</h5>
                      <p className="card-text">{um.level_ten_definition}.</p>
                    </div>
                    <hr />
                    <div className="card-body">
                      <h5 className="card-title">Habits I am committing to</h5>
                      <div className="card-text">
                        <ul>
                          <li>{um.habit}</li>
                        </ul>
                      </div>

                      {/* // ! Schedule habit form here */}
                      <div className="row justify-content-center">
                        <div className="col">
                          <form className="shadow-lg p-2 rounded-3">
                            <input
                              className="my-2 form-control"
                              placeholder={um.habit}
                              // value={um.habit}
                              onChange={(e) => setHabit(e.target.value)}
                            />
                            <textarea
                              className="my-2 form-control"
                              placeholder={habitDesc}
                              //value={habitDesc}
                              onChange={(e) => setHabitDesc(e.target.value)}
                            />

                            <label className="mt-2 lead">Start Date</label>
                            <DatePicker
                              className="m-2 form-select"
                              selected={start}
                              onChange={(date) => setStart(date!)}
                            />

                            <label className="mt-2 lead">End Date</label>
                            <DatePicker
                              className="m-2 form-select"
                              selected={start}
                              onChange={(date) => setSelectedDate(date!)}
                            />

                            <label className="mt-2 lead">Frequency</label>
                            <select
                              className="m-2 row"
                              onChange={(e) => setReminderInterval(e.target.value)}
                            >
                              <option value="WEEKLY">Weekly</option>
                              <option value="DAILY">Daily</option>
                              <option value="MONTHLY">Monthly</option>
                            </select>

                            <button
                              className="m-2 btn btn-outline-success"
                              onClick={handleButtonClickYall}
                            >
                              Schedule Habit
                            </button>
                          </form>
                        </div>
                      </div>

                      <div>
                        {/* <DatePicker
                          className="form-select"
                          onChange={(data: string) => setSelectedDate(date)}
                          selected={selectedDate}
                        /> */}
                      </div>
                    </div>

                    {/* <h3>Score: {um.priority} </h3> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ValueSummary;
