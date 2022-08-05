import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APIService } from '../services/APIService';
import Accordion from 'react-bootstrap/Accordion';

const Learn = () => {
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
      <h1 className="display-3 m-2 text-center"> Welcome to Momentum 🚀 </h1>

      <div className="row justify-content-center m-2">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body row justify-content-center m-2">
              {/* FAQ Section */}
              <h3 className="row justify-content-center m-2"> Frequently Asked Questions</h3>
              <p className="row justify-content-center m-2"> Click on a section to learn more</p>

              <Accordion flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Why should I use this app?</Accordion.Header>
                  <Accordion.Body>
                    There's a quote that says, 'success without fulfillment is the ultimate
                    failure'. This app is designed to help you create more fulfillment by helping
                    you reclaim clarity around what is most import in your life.
                    <ul>
                      Here are some of the overall benefits you'll experience
                      <li>Clarify the values that optimize your level of happiness</li>
                      <li>
                        Discover which 10 things you should be following to optimize your happiness
                      </li>
                      <li>Create clarity and alignment so making tough decisions becomes easier</li>
                      <li>Build momentum, create more freedom while living your life mission</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>What is it?</Accordion.Header>
                  <Accordion.Body>
                    This app contains a series of exercises and logic to help you find your life
                    purpose and build your ideal life.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>How does it work?(IMPORTANT)</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      Here's an outline of how the process works:
                      <li>Select what's most important to you</li>
                      <li>Get specific and define exactly what your values mean to you</li>
                      <li>Self assessment congruence rating</li>
                      <li>Define the ideal vision for each selected value </li>
                      <li>Prioritize your values with a comparison ranking system</li>
                      <li>Create a powerful SMART habit that move you closer to your dreams</li>
                      <li>Take action and build momentum</li>
                      <li>
                        NOTE: Please allow at least 30 minutes to 1 hour for this process. Creating
                        an authentic life purpose will take time and effort
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>Who is this for?</Accordion.Header>
                  <Accordion.Body>
                    This is for anyone who wants to create a conscious life of clarity, focus, and
                    momentum to achieve goals with maximum fulfillment.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                  <Accordion.Header>What will I get from this app?</Accordion.Header>
                  <Accordion.Body>
                    Here are just a few of specific things you will create...
                    <ul>
                      <li>A prioritized list of your ultimate life values</li>
                      <li>A detailed list of personal definitions for each of your life values</li>
                      <li>
                        A specific and tangible vision for your life purpose aligned with your life
                        values
                      </li>
                      <li>Congruence assessment based on current alignment with life values</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              {isAuthed && (
                <Link to={`/select`} className="row btn btn-outline-success m-2">
                  Get Started{' '}
                </Link>
              )}

              {/* {!isAuthed &&
                            <Link to={`/register`} className="row btn btn-outline-warning m-2">Register </Link>
                        }
                        {!isAuthed &&
                            <Link to={`/login`} className="row btn btn-outline-success m-2">Login </Link>
                        } */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
