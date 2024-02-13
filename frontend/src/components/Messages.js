import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

import restApi from '../restApi';
import { loadMessages } from '../slices/messages';
import { getCurrentUserName } from '../authData';

const Messages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputEl = useRef(null);
  const [isDisabled, setDisablesStatus] = useState(false);
  const messages = useSelector((state) => state.messages.messages);
  const currentChannel = useSelector((state) => state.channels.selectedChannel);

  useEffect(() => {
    inputEl.current.focus();
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setDisablesStatus(true);
        const res = await restApi.loadMessages();
        dispatch(loadMessages(res.data));
      } catch (e) {
        if (e.response.status === 401) {
          navigate('login');
        }
      }
      setDisablesStatus(false);
    };
    fetchMessages();
  }, []);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async ({ body }) => {
      try {
        setDisablesStatus(true);
        const newMessage = {
          body,
          channelId: currentChannel.id,
          username: getCurrentUserName(),
        };
        await restApi.newMessage(newMessage);
      } catch (e) {
        console.log(e);
      }
      setDisablesStatus(false);
      formik.values.body = '';
    },
  });

  const isDesabledBtn = !formik.values.body.trim() || isDisabled;

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
              disabled={isDisabled}
              ref={inputEl}
            />
            <Button
              variant="outline-secondary"
              className="btn btn-group-vertical"
              type="submit"
              disabled={isDesabledBtn}
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
