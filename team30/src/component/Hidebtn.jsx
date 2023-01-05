/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import './SearchBar.css';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { addhide, delhide } from '../api/mock_api';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function hidebtn({
  myid, postid, setfunc, change,
}) {
  const [havehided, sethavehided] = useState(true);
  useEffect(() => {
    sethavehided(change.has(postid));
  });
  if (!havehided) {
    return (
      <Button
        type="link"
        className="likebtntest"
        data-testid="lbtn"
        icon={<EyeInvisibleOutlined style={{ fontSize: '100px' }} />}
        onClick={() => {
          addhide(postid, myid);
          const newset = new Set(change);
          newset.add(postid);
          setfunc(newset);
          // let a = true;
          // if (havehided) {
          //   a = false;
          // }
          // sethavehided(a);
        }}
      />
    );
  }
  return (
    <Button
      type="link"
      className="unlikebtntest"
      data-testid="unlbtn"
      icon={<EyeOutlined style={{ fontSize: '100px' }} />}
      onClick={() => {
        delhide(postid, myid);
        const newset = new Set(change);
        newset.delete(postid);
        setfunc(newset);
        // let a = true;
        // if (havehided) {
        //   a = false;
        // }
        // sethavehided(a);
      }}
    />
  );
}
export default hidebtn;
