import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUser, getUsers, login, postLogHistory, getLogHistory,
} from '../api/mock_api';
import './Signup.css';

const UNSUCCESSFULL_LOGIN = 'UNSUCCESSFULL_LOGIN';
// const AccountLocked = 'Account Locked for the next 2 minutes';

function Login() {
  const [userFocus, setUserFocus] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const [lockOutMessage, setlockOutMessage] = useState('');

  const [data, setData] = useState({
    username: '',
    password: '',
  });
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const loginHistory = {
    loginId: data.username,
    loginTime: new Date(),
  };
  // const currentTime = new Date();
  // const currentTimeString = currentTime.toLocaleTimeString();
  // const updatedTime = new Date(new Date().getTime() - 2 * 60 * 1000);
  // const updatedTimeString = updatedTime.toLocaleTimeString();
  // const currentTimebigger = (currentTime > updatedTime) * 1;

  const handleSubmit = async (e) => {
    // stop default behavior to avoid reloading the page
    e.preventDefault();
    const auth = await getUsers();
    // console.log(auth);
    const authUser = auth.filter((x) => (
      x.email === data.username && x.password === data.password
    ));
    const lockOutList = await getLogHistory();
    const lockedUser = lockOutList.filter((x) => (
      // eslint-disable-next-line max-len
      x.loginId === data.username && new Date(x.loginTime) > new Date(new Date().getTime() - 2 * 60 * 60 * 1000)
    ));
    // && x.loginTime >= new Date(new Date().getTime() - 2 * 60 * 60 * 1000)
    //
    if (lockedUser.length > 2) {
      setlockOutMessage('Account locked out for the next two hours');
      return;
    }

    // console.log(authUser);
    if (authUser.length > 0) {
      // eslint-disable-next-line no-underscore-dangle
      const userid = authUser[0]._id;
      console.log('userid', userid);
      getUser(userid);
      localStorage.setItem('currentUser', JSON.stringify(userid));
      sessionStorage.setItem('id', JSON.stringify(userid));
      navigate(`/user/${userid}`);
    } else {
      setErrMsg(UNSUCCESSFULL_LOGIN);
      postLogHistory(loginHistory);
      // console.log('Wrong password or username');
    }
    e.target.reset();
    // send POST request to create the student
  };

  const [connected, setConnected] = useState(sessionStorage.getItem('app-token') !== null);

  const handleLogin = async () => {
    try {
      // check if login was a success
      if (await login('test-student')) {
        setConnected(true); // update state
        console.log('connected is', connected);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const handleLogout = () => {
  //   setConnected(false);
  // };

  // const [items, setItems] = useState('');

  // useEffect(() => {
  //   const localStorageResult = (localStorage.getItem('currentUser'));
  //   if (localStorageResult) {
  //     setItems(localStorageResult);
  //   }
  // });

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary bg-gradient shadow">
        <div className="container-fluid">
          <a className="navbar-brand" href=" ">Navbar</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="Signup">Sign Up</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <form
        className="pt-8 bg-primary bg-gradient text-light"
        onSubmit={handleSubmit}
      >
        <div className="container">
          <div className="row d-md-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-3 text-light">Account</h3>
            <div className="input-group news-input">
              <input
                type="text"
                data-testid="account"
                className="form-control"
                placeholder="Email Address"
                onChange={changeHandler}
                id="Username"
                // onChange={(e) => setUser(e.target.value)}
                value={data.username}
                aria-describedby="uidnote"
                name="username"
                onFocus={() => setUserFocus(true)}
                required
              />
              <p id="uidnote" className={userFocus && errMsg === UNSUCCESSFULL_LOGIN ? 'instructions' : 'offscreen'}>
                Account wrong or not registered.
                <br />
                Please re-enter or complete registration first.
              </p>
            </div>
            <h3 className="mb-3 text-light">Password</h3>
            <div className="input-group news-input">
              <input
                data-testid="password"
                type="password"
                className="form-control"
                placeholder="Password"
                onChange={changeHandler}
                value={data.password}
                aria-describedby="inputGroupPrepend2"
                name="password"
                onFocus={() => setPwdFocus(true)}
                id="Pword"
                required
              />
              <p id="uidnote" data-testid="err" className={pwdFocus && errMsg === UNSUCCESSFULL_LOGIN ? 'instructions' : 'offscreen'}>
                Wrong password.
              </p>
            </div>
          </div>
        </div>
        <div className="container">
          <div
            className="d-md-flex align-items-center mb-3"
          >
            <a href="Signup" data-testid="signup-link" className="link-light">Sign Up</a>
          </div>
        </div>
        <div className="container">
          <div className="d-flex justify-content-center">
            <button id="submitButton" type="submit" className="btn btn-dark btn-lg" onClick={handleLogin}>LOG IN</button>
          </div>
        </div>
        <div>{lockOutMessage}</div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" fillOpacity="1" d="M0,64L24,96C48,128,96,192,144,192C192,192,240,128,288,90.7C336,53,384,43,432,53.3C480,64,528,96,576,101.3C624,107,672,85,720,96C768,107,816,149,864,192C912,235,960,277,1008,293.3C1056,309,1104,299,1152,272C1200,245,1248,203,1296,176C1344,149,1392,139,1416,133.3L1440,128L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z" /></svg>
      </form>

      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossOrigin="anonymous"
      />
    </>
  );
}

export default Login;
