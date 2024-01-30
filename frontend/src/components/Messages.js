import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, InputGroup, Button } from 'react-bootstrap';

import { loadMessages, addMessage, loadNewMessage } from '../slices/messages';
import useAuth from '../hooks/authHook';

const Messages = () => {
  const [body, setBody] = useState('');
  const dispatch = useDispatch();
  const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
  const { token, username } = currentUser;
  const headers = { Authorization: `Bearer ${token}` };
  const messages = useSelector((state) => state.messages.messages);
  const currentChannel = useSelector((state) => state.channels.selectedChannel);
  const processStatus = useSelector((state) => state.messages.status);
  const { socket } = useAuth();

  useEffect(() => {
    dispatch(loadMessages(headers));
    socket.on('newMessage', (payload) => {
      console.log(payload);
      dispatch(loadNewMessage(payload));
      // => { body: "new message", channelId: 7, id: 8, username: "admin" }
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      body,
      channelId: currentChannel.id,
      username,
    };
    dispatch(addMessage({ newMessage, headers }));
    setBody('');
  };

  const onChangeBody = ({ target }) => setBody(target.value);

  if (!currentChannel) {
    return null;
  }

  const isDesabled = processStatus === 'sending' || !body.trim();

  const currentMessages = messages.filter(
    ({ channelId }) => channelId === currentChannel.id
  );

  const renderCurrentMessages = (messages) => {
    if (messages.length === 0) {
      return null;
    }

    return (
      <>
        {messages.map(({ id, body, username }) => (
          <div key={id} className="text-break mb-2">
            <b>{username}</b>: {body}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>#{currentChannel.name}</b>
        </p>
        <span>{currentMessages.length} сообщения</span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5">
        {renderCurrentMessages(currentMessages)}
      </div>
      <div className="mt-auto px-5 py-3">
        <Form className="border rounded-2" onSubmit={onSubmit}>
          <Form.Control.Feedback type="invalid">
            Неверные имя пользователя или пароль
          </Form.Control.Feedback>
          <InputGroup id="body">
            <Form.Control
              name="body"
              placeholder="Введите сообщение..."
              aria-label="Новое сообщение"
              className="border-0 p-0 ps-2"
              onChange={onChangeBody}
              value={body}
            />
            <Button
              variant="outline-secondary"
              className="btn btn-group-vertical"
              type="submit"
              disabled={isDesabled}
            >
              Отправить
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
};

export default Messages;
