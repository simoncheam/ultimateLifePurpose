import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Contact from './views/Contact';
import Home from './views/Home';
import Learn from './views/Learn';
import Login from './views/Login';
import Register from './views/Register';
import RegistrationConfirm from './views/RegistrationConfirm';
import ResetConfirm from './views/ResetConfirm';
import ResetPassword from './views/ResetPassword';
import ResetVerify from './views/ResetVerify';
import SelectValues from './views/SelectValues';
import UpdateConfirm from './views/UpdateConfirm';
import UpdatePassword from './views/UpdatePassword';
import UpdateValues from './views/UpdateValues';
import ValueCongruence from './views/ValueCongruence';
import ValueDefinitions from './views/ValueDefinitions';
import ValueHabits from './views/ValueHabits';
import ValueIdeal from './views/ValueIdeal';
import ValuePriority from './views/ValuePriority';
import ValueSummary from './views/ValueSummary';
import Verify from './views/Verify';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = (props: AppProps) => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/verify" element={<Verify />}></Route>
        <Route path="/resetverify" element={<ResetVerify />}></Route>
        <Route path="/resetpassword" element={<ResetPassword />}></Route>
        <Route path="/resetconfirm" element={<ResetConfirm />}></Route>
        <Route path="/updatepassword" element={<UpdatePassword />}></Route>
        <Route path="/updateconfirm" element={<UpdateConfirm />}></Route>

        <Route path="/register" element={<Register />}></Route>
        <Route path="/confirm" element={<RegistrationConfirm />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/learn" element={<Learn />}></Route>

        {/* User selects from master list */}
        <Route path="/select" element={<SelectValues />}></Route>

        {/* User creates personal definitions */}
        <Route path="/define" element={<ValueDefinitions />}></Route>

        {/* Congruence rating - pass 6 */}
        <Route path="/congruence" element={<ValueCongruence />}></Route>

        {/* Level 10 Definition */}
        <Route path="/idealstate" element={<ValueIdeal />}></Route>

        {/* Priority Ranking */}
        <Route path="/priority" element={<ValuePriority />}></Route>

        {/* Define 1-3 Habits for top priority values */}
        <Route path="/habits" element={<ValueHabits />}></Route>

        {/* Value Summary */}
        <Route path="/summary" element={<ValueSummary />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

interface AppProps {}

export default App;
