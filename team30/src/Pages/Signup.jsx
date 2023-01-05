import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import API functions
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { createStudent } from '../api/mock_api';
import './Signup.css';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Signup() {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  // const [email, setEmail] = useState("")

  // const [, setNewStudent] = useState(null);
  // const loadData = useRef(false);
  const [user, setUser] = useState('');
  const [name, setName] = useState('');
  const [validName, setValidName] = useState(false);
  const [validUser, setValidUser] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidUser(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidName(name.length !== 0);
  }, [name]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    // stop default behavior to avoid reloading the page
    e.preventDefault();
    // create new student variable
    const newStudent = {
      email: user,
      password: pwd,
      name,
      uavatar: null,
      follownum: 0,
      profiletext: '',
      postlist: [],
      following: [],
      likes: [],
    };
    const form = document.getElementById('info');
    form.reset();
    navigate('/login');
    // send POST request to create the student
    await createStudent(newStudent);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary bg-gradient shadow">
        <div className="container-fluid">
          <a className="navbar-brand" href=" ">Navbar</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="Login">Log In</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="pt-8 bg-primary bg-gradient text-light">
        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
        <div className="container">
          <form
            id="info"
            className="row d-md-flex justify-content-between align-items-center mb-3"
            onSubmit={handleSubmit}
          >
            <h3 className="mb-3 text-light">
              Account
              <CheckIcon className={validUser ? 'valid' : 'hide'} />
              <ClearIcon className={validUser || !user ? 'hide' : 'invalid'} />
            </h3>
            <div className="input-group news-input">
              {/*                 <input
                  type="text"
                  className="form-control"
                  placeholder="Email Address"
                  onChange={handleOnChange}
                  name="email"
                /> */}
              <input
                type="text"
                id="username"
                data-testid="account"
                ref={userRef}
                placeholder="Email Address"
                className="form-control"
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                aria-invalid={validUser ? 'false' : 'true'}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              <p id="uidnote" className={userFocus && user && !validUser ? 'instructions' : 'offscreen'}>
                4 to 24 characters.
                <br />
                Must begin with a letter.
                <br />
                Letters, numbers, underscores, hyphens allowed.
              </p>
            </div>

            <h3 className="mb-3 text-light">
              Username
              <CheckIcon className={validName ? 'valid' : 'hide'} />
              <ClearIcon className={validName || !name ? 'hide' : 'invalid'} />
            </h3>
            <div className="input-group news-input">
              <input
                type="text"
                id="definename"
                data-testid="name"
                ref={userRef}
                placeholder="Username"
                className="form-control"
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                aria-invalid={validName ? 'false' : 'true'}
                aria-describedby="uidnote"
                onFocus={() => setNameFocus(true)}
                onBlur={() => setNameFocus(false)}
              />
              <p id="uidnote" className={nameFocus && user && !validUser ? 'instructions' : 'offscreen'}>
                Cannot be empty.
              </p>
            </div>

            <h3 className="mb-3 text-light">
              Password
              <CheckIcon className={validPwd ? 'valid' : 'hide'} />
              <ClearIcon className={validPwd || !pwd ? 'hide' : 'invalid'} />
            </h3>
            <div className="input-group news-input">
              {/*                 <input
                  type="text"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  onChange={handleOnChange}
                /> */}
              <input
                type="password"
                id="password"
                data-testid="password"
                className="form-control"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                aria-invalid={validPwd ? 'false' : 'true'}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                placeholder="Enter Password"
              />
              <p id="pwdnote" className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
                8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number and a special character.
                <br />
                Allowed special characters:
                {' '}
                <span aria-label="exclamation mark">!</span>
                {' '}
                <span aria-label="at symbol">@</span>
                {' '}
                <span aria-label="hashtag">#</span>
                {' '}
                <span aria-label="dollar sign">$</span>
                {' '}
                <span aria-label="percent">%</span>
              </p>
            </div>
            <h3 className="mb-3 text-light">
              Confirm Password
              <CheckIcon className={validMatch && matchPwd ? 'valid' : 'hide'} />
              <ClearIcon className={validMatch || !matchPwd ? 'hide' : 'invalid'} />
            </h3>
            <div className="input-group news-input">
              <input
                type="password"
                data-testid="comfirm-password"
                id="confirm_pwd"
                className="form-control"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                aria-invalid={validMatch ? 'false' : 'true'}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
                placeholder="Re-enter Password"
                required
              />
              <p id="confirmnote" className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}>
                Must match the first password input field.
              </p>
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-dark btn-lg"
                type="submit"
                disabled={!!(!validUser || !validPwd || !validMatch)}
              >
                SIGN UP

              </button>
            </div>
          </form>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" fillOpacity="1" d="M0,64L24,96C48,128,96,192,144,192C192,192,240,128,288,90.7C336,53,384,43,432,53.3C480,64,528,96,576,101.3C624,107,672,85,720,96C768,107,816,149,864,192C912,235,960,277,1008,293.3C1056,309,1104,299,1152,272C1200,245,1248,203,1296,176C1344,149,1392,139,1416,133.3L1440,128L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z" /></svg>
      </section>
    </>
  );
}

export default Signup;
