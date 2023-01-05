/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import './SearchBar.css';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { haveliked, addlike, dellike } from '../api/mock_api';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function likebtn({ myid, postid }) {
  const [hasliked, setHasliked] = useState(false);
  useEffect(() => {
    haveliked(postid, myid).then((res) => setHasliked(res));
  }, [postid]);
  if (!hasliked) {
    return (
      <Button
        type="link"
        className="likebtntest"
        data-testid="lbtn"
        icon={<HeartOutlined style={{ fontSize: '100px' }} />}
        onClick={() => {
          setHasliked(!hasliked);
          addlike(postid, myid);
        }}
        danger
      />

    );
  }
  return (
    <Button
      type="link"
      className="unlikebtntest"
      data-testid="unlbtn"
      icon={<HeartFilled style={{ fontSize: '100px' }} />}
      onClick={() => {
        setHasliked(!hasliked);
        dellike(postid, myid);
      }}
      danger
    />
  );
}
export default likebtn;
