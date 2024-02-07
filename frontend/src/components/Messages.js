import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useFormik } from 'formik';

import {
  loadMessages,
  addMessage,
  subscribeSocketMessage,
} from '../slices/messages';

const Messages = () => {
  const dispatch = useDispatch();
  const inputEl = useRef(null);
  const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
  const { username } = currentUser;

  useEffect(() => {
    dispatch(loadMessages());
    dispatch(subscribeSocketMessage());
    inputEl.current.focus();
  }, []);

  const messages = useSelector((state) => state.messages.messages);
  const currentChannel = useSelector((state) => state.channels.selectedChannel);
  const processStatus = useSelector((state) => state.messages.status);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: ({ body }) => {
      const newMessage = {
        body,
        channelId: currentChannel.id,
        username,
      };
      dispatch(addMessage({ newMessage }));
      formik.values.body = '';
    },
  });

  const isDesabled = processStatus === 'sending' || !formik.values.body.trim();

  const currentMessages = currentChannel
    ? messages.filter(({ channelId }) => channelId === currentChannel.id)
    : [];

  const renderChannelInfo = () => {
    if (!currentChannel) {
      return null;
    }

    return (
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b># {currentChannel.name}</b>
        </p>
        <span>{currentMessages.length} сообщения</span>
      </div>
    );
  };

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
      {renderChannelInfo()}
      <div id="messages-box" className="chat-messages overflow-auto px-5">
        {renderCurrentMessages(currentMessages)}
      </div>
      <div className="mt-auto px-5 py-3">
        <Form className="border rounded-2" onSubmit={formik.handleSubmit}>
          <Form.Control.Feedback type="invalid">
            Неверные имя пользователя или пароль
          </Form.Control.Feedback>
          <InputGroup id="body">
            <Form.Control
              id="messagesInput"
              name="body"
              placeholder="Введите сообщение..."
              aria-label="Новое сообщение"
              className="border-0 p-0 ps-2"
              onChange={formik.handleChange}
              value={formik.values.body}
              ref={inputEl}
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
