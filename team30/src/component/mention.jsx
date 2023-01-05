import React, { useState, useEffect } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// import Checkbox from '@mui/material/Checkbox';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Avatar from '@mui/material/Avatar';
import defaultMentionStyle from '../Pages/defaultMentionStyle';
import defaultStyle from '../Pages/defaultStyle';
import {
  createComment, getComments, getUser, deleteComment, editComment, getComment, getUserID,
} from '../api/mock_api';
import '../Pages/Signup.css';
// editComment, getComment,

function mentionSpan(mentionUsername, userID) {
  const navigate = useNavigate();
  return (
    <span
      role="link"
      onClick={() => navigate(`/profile/${userID}`)}
      onKeyDown={() => {}}
      style={{ backgroundColor: '#cee4e5' }}
      key={mentionUsername}
      tabIndex="0"
    >
      {mentionUsername}
    </span>
  );
}

function MentionUser({ users, id }) {
  const [commentEdit, setcommentEdit] = useState('');
  const [comment, setComment] = useState('');
  const [pcList, setpcList] = useState('');
  // const [newMention, setnewMention] = useState('');
  // change to userid after fixed
  // const uid = 'HLH6Drg';
  const uid = getUserID();
  // console.log(uid);
  // export const MENTION_REGEX = /@\[(.+?)]\((.+?)\)/g;
  // export const MENTION_REGEX_SPLIT = /@\[[^\]]*]\([A-Za-z0-9]+\)/i;

  // const match = comment.match(/(?<=@\[)(.*?)(?=\])/g);
  // const split = comment.match(/(?<=@\[(.+?)]\()(.+?)(?=\))/g);
  // const mentionComp = comment.match(/@\[(.+?)]\((.+?)\)/g);
  // const newMention = comment.replace(mentionComp, `,${mentionComp},`).split(',');

  const matchEdit = commentEdit.match(/(?<=@\[)(.*?)(?=\])/g);
  const splitEdit = commentEdit.match(/(?<=@\[(.+?)]\()(.+?)(?=\))/g);
  console.log('commentEdit:', commentEdit);
  console.log('matchEdit:', matchEdit);
  console.log('splitEdit:', splitEdit);

  const handleDelete = (commentid) => () => {
    deleteComment(commentid);
    // check another way
    window.location.reload();
  };

  useEffect(() => {
    getComments().then(async (res) => {
      const postcommentList = res.filter((x) => (
        x.pid === id
      ));

      const newpcList = await Promise.all(
        postcommentList.map(async (item) => {
          const user = await getUser(item.uid);
          const itemComment = item.body;
          const match = itemComment.match(/(?<=@\[)(.*?)(?=\])/g);
          const mentionUserid = itemComment.match(/(?<=@\[(.+?)]\()(.+?)(?=\))/g);
          const mentionComp = itemComment.match(/@\[(.+?)]\((.+?)\)/g);
          console.log('itemComment', itemComment);
          console.log('mentionUserid', mentionUserid);
          console.log('mentionComp', mentionComp);
          console.log('match', match);
          // // const newMention = itemComment.replace(mentionComp, `,${mentionComp},`).split(',');
          // setnewMention(item.body);
          let test = [itemComment];
          console.log('before', test);
          if (mentionComp !== null) {
            for (let i = 0; i < mentionComp.length; i += 1) {
              console.log(mentionComp[i]);
              // const regx = new RegExp(mentionComp[i].toString(), 'g');
              // const replace = new RegExp(mentionComp[i]);
              // console.log('regx', regx);
              test = test.toString().replace(mentionComp[i], `,${mentionComp[i]},`).split(',');
              console.log('test:', test);
            }
          }
          return {
            ...item,
            username: user.name,
            splitcomment: test,
            mentionUid: mentionUserid,
            mentionUsername: match,
            // splitMention: newMention,
          };
        }),
      );
      setpcList(newpcList);
      console.log('pcList: ', pcList);
    });
  }, []);

  const fetchUsers = (query, Callback) => {
    if (!query) {
      return;
    }
    setTimeout(() => {
      const filteredUsers = users.filter((user) => user.display.toLowerCase().includes(query));
      Callback(filteredUsers);
    }, 200);
  };

  const handleEditSubmit = (commentid) => async (e) => {
    // stop default behavior to avoid reloading the page
    e.preventDefault();
    const oldcomment = await getComment(commentid);
    console.log('oldcomment', oldcomment);
    const oldinfo = { pid: oldcomment.pid, uid: oldcomment.uid };
    console.log('oldinfo', oldinfo);
    // setclickEdit(true);
    // console.log(clickEdit);
    const updateComment = commentEdit;
    editComment(commentid, updateComment, oldinfo);
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    // stop default behavior to avoid reloading the page
    e.preventDefault();
    const newComment = { body: comment, postid: id, userid: uid };
    console.log(newComment);
    await createComment(newComment);
    window.location.reload();
    // const commentList = await getComments();
    // const postcommentList = commentList.filter((x) => (
    //   x.pid === id
    // ));

    // const newpcList = await Promise.all(
    //   postcommentList.map(async (item) => {
    //     const user = await getUser(item.uid);
    //     return {
    //       ...item,
    //       username: user.name,
    //     };
    //   }),
    // );

    // await setpcList(newpcList);
    // console.log('pcList', pcList);
    // document.getElementById('commentbox').reset();
    // e.target.reset();
  };

  const textMessage = (text) => {
    const array = [];
    if (text.mentionUid !== null) {
      for (let i = 0; i < text.mentionUid.length; i += 1) {
        array[i] = mentionSpan(text.mentionUsername[i], text.mentionUid[i]);
      }
    }
    // console.log(array);
    const commentText = [];
    for (let i = 0; i < text.splitcomment.length; i += 1) {
      commentText[2 * i] = <span key={i}>{text.splitcomment[2 * i]}</span>;
      commentText[2 * i + 1] = array[i];
    }
    return commentText;
  };

  return (
    <>
      {/* Comments */}
      <div className="container mb-3">
        <h3 className="display-10 text-dark text-left mt-5 mb-2">
          Comments
        </h3>
      </div>

      {pcList.length !== 0 ? (
        <div className="container mb-3">
          <List>
            {pcList.map((value) => (
              <SingleComment
                handleEditSubmit={handleEditSubmit}
                value={value}
                setcommentEdit={setcommentEdit}
                commentEdit={commentEdit}
                fetchUsers={fetchUsers}
                handleDelete={handleDelete}
                uid={uid}
                textMessage={textMessage}
                // clickEdit={clickEdit}
                // handleEditClick={handleEditClick}
              />
            ))}
          </List>
        </div>
      ) : <div />}

      {/* Mentions */}
      <div className="mb-3">
        <form
          id="commentbox"
          onSubmit={handleSubmit}
        >
          <div className="container mb-3">
            <MentionsInput
          // markup="@[__name__](__id__)"
              placeholder="Add your comment..."
              style={defaultStyle}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            >
              <Mention
                trigger="@"
                data={fetchUsers}
                style={defaultMentionStyle}
                markup="@[__display__](__id__)"
              />
            </MentionsInput>
          </div>

          <div className="container">
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary btn-lg">Add New Comment</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

function SingleComment({
  // eslint-disable-next-line react/prop-types
  handleEditSubmit,
  value,
  setcommentEdit,
  commentEdit,
  fetchUsers,
  handleDelete,
  uid,
  textMessage,
}) {
  const [clickEdit, setclickEdit] = useState(false);
  const handleEditClick = () => {
    setclickEdit(!clickEdit);
    // console.log(clickEdit);
  };
  return (
    <>
      <ListItem
        key={value._id}
        secondaryAction={(
          <>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => { handleEditClick(); }}
              className={value.uid === uid ? '' : 'offscreen'}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={handleDelete(value._id)}
              className={value.uid === uid ? '' : 'offscreen'}
            >
              <DeleteIcon />
            </IconButton>
          </>
      )}
      // secondaryAction={(
      //   <Checkbox
      //     edge="end"
      //     onChange={handleToggle(value)}
      //     checked={checked.indexOf(value) !== -1}
      //     inputProps={{ 'aria-labelledby': labelId }}
      //   />
      // )}
        disablePadding
      >
        <ListItemText
          primary={`${value.username}:`}
          secondary={textMessage(value)}
        />
      </ListItem>
      <Divider />
      <div className={clickEdit && value.uid === uid ? '' : 'offscreen'}>
        <div className="mb-3">
          <form
            id="commentbox"
            onSubmit={handleEditSubmit(value._id)}
          >
            <div className="container mb-3">
              <MentionsInput
                placeholder="Edit comment..."
                style={defaultStyle}
                onChange={(e) => setcommentEdit(e.target.value)}
                value={commentEdit}
              >
                <Mention
                  trigger="@"
                  data={fetchUsers}
                  style={defaultMentionStyle}
                  markup="@[__display__](__id__)"
                />
              </MentionsInput>
            </div>

            <div className="container">
              <div className="d-flex justify-content-center mb-3">
                <button type="submit" className="btn btn-primary btn-lg">Edit Comment</button>
              </div>
            </div>

          </form>
          <Divider />
        </div>
      </div>

    </>
  );
}

MentionUser.propTypes = {
  id: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    uavatar: PropTypes.string,
    follownum: PropTypes.number,
    profiletext: PropTypes.string,
    postlist: PropTypes.arrayOf(PropTypes.number),
    following: PropTypes.arrayOf(PropTypes.string),
    likes: PropTypes.arrayOf(PropTypes.number),
  })).isRequired,
};
SingleComment.propTypes = {
  handleEditSubmit: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.object.isRequired,
  setcommentEdit: PropTypes.func.isRequired,
  commentEdit: PropTypes.string.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired,
  textMessage: PropTypes.func.isRequired,
};
export default MentionUser;
