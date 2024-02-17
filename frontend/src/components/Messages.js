import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as filter from 'leo-profanity';

import restApi from '../restApi';
import { loadMessages } from '../slices/messages';
import { getCurrentUserName } from '../authData';

const Messages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputEl = useRef(null);
  const refMessage = useRef(null);
  const [isDisabled, setDisablesStatus] = useState(false);
  const messages = useSelector((state) => state.messages.messages);
  const currentChannel = useSelector((state) => state.channels.selectedChannel);

  const { t } = useTranslation();

  useEffect(() => {
    inputEl.current.focus();

    if (refMessage.current) {
      refMessage.current.scrollIntoView(false);
    }
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setDisablesStatus(true);
        const res = await restApi.loadMessages();
        dispatch(loadMessages(res.data));
      } catch (e) {
        console.error(e);
        if (e.isAxiosError && e.message === 'Network Error') {
          toast.error(t('toast.error'));
          setDisablesStatus(false);
          return;
        }
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
      const filterBody = filter.clean(body);
      try {
        setDisablesStatus(true);
        const newMessage = {
          body: filterBody,
          channelId: currentChannel.id,
          username: getCurrentUserName(),
        };
        await restApi.newMessage(newMessage);
      } catch (e) {
        console.error(e);
        toast.error(t('toast.error'));
      }
      setDisablesStatus(false);
      formik.values.body = '';
    },
  });

  const isDesabledBtn = !formik.values.body.trim() || isDisabled;

  const currentMessages = currentChannel
    ? messages.filter(({ channelId }) => channelId === currentChannel.id)
    : [];

  const currentMessagesLength = currentMessages.length;

  const renderChannelInfo = () => {
    if (!currentChannel) {
      return null;
    }

    return (
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b># {currentChannel.name}</b>
        </p>
        <span>
          {t('chatPage.messages.message', {
            count: currentMessagesLength,
          })}
        </span>
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
          <div key={id} className="text-break mb-2" ref={refMessage}>
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
          <InputGroup id="body">
            <Form.Control
              id="messagesInput"
              name="body"
              placeholder={t('chatPage.messages.form.body')}
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
              {t('buttons.send')}
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
};

export default Messages;
