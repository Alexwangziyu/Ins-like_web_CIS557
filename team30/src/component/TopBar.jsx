/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from 'react-router-dom';
import { getUserID, getUser } from '../api/mock_api';
import logo from './logo.png';

function TopBar() {
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(path);
  };
  const handleLogOut = () => {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('app-token');
    navigate('/login');
  };
  const [udata, setudata] = useState({});
  const CurrentUserID = getUserID();
  useEffect(() => {
    // const CurrentUserID = getUserID();
    getUser(CurrentUserID).then((res) => setudata(res));
  }, []);

  // const Token = sessionStorage.getItem('app-token');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary bg-gradient shadow">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img src={logo} width="115" height="40" alt="" />
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" onClick={() => { handleClick(`/user/${CurrentUserID}`); }}>Activity</a>
            </li>
            <li className="nav-item">
              <a id="search" className="nav-link active" aria-current="page" onClick={() => { handleClick('/follow'); }}>Search</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Todo
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" onClick={() => { handleClick(`/profile/${CurrentUserID}`); }}>My Profile</a></li>
                <li><a className="dropdown-item" onClick={() => { handleClick('/post'); }}>New Post</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" onClick={() => { handleLogOut(); }}>Log Out</a></li>
              </ul>
            </li>
          </ul>
          <span className="navbar-text">
            <div className="navbar-brand marginleft=100px">{udata.name}</div>
          </span>
          <span className="navbar-brand">
            <a className="navbar-brand" href={`http://localhost:3000/profile/${CurrentUserID}`}>
              <img
                className="mb-0 rounded-circle border border-light border-2 display: inline"
                alt="showcase"
                style={{
                  width: '2.7rem', height: '2.7rem', objectFit: 'cover', borderRadius: '50%',
                }}
                src={udata.uavatar}
              />
            </a>
          </span>
        </div>
      </div>
    </nav>
  );
}

export default TopBar;
