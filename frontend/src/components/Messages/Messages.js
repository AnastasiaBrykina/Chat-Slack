import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as filter from 'leo-profanity';

import restApi from '../../restApi';
import { loadMessages, setLoadStatus } from '../../slices/messages';
import MessagesForm from './MessagesForm';
import useAuth from '../../hooks/authHook';

const Messages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refMessage = useRef(null);
  const messages = useSelector((state) => state.messages.messages);
  const currentChannel = useSelector((state) => state.channels.selectedChannel);
  const auth = useAuth();
  const { logOut } = auth;

  const { t } = useTranslation();

  useEffect(() => {
    if (refMessage.current) {
      refMessage.current.scrollIntoView();
    }
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        dispatch(setLoadStatus(true));
        const res = await restApi.loadMessages();
        dispatch(loadMessages(res.data));
      } catch (e) {
        console.error(e);
        if (e.isAxiosError && e.message === 'Network Error') {
          toast.error(t('toast.error'));
          dispatch(setLoadStatus(false));
          return;
        }
        if (e.response.status === 401) {
          navigate('login');
          logOut();
        }
      }
      dispatch(setLoadStatus(false));
    };
    fetchMessages();
  }, []);

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
          <b>
            #
            {filter.clean(currentChannel.name)}
          </b>
        </p>
        <span>
          {t('chatPage.messages.message', {
            count: currentMessagesLength,
          })}
        </span>
      </div>
    );
  };

  const renderCurrentMessages = (m) => {
    if (m.length === 0) {
      return null;
    }

    return (
      <>
        {m.map(({ id, body, username }) => (
          <div key={id} className="text-break mb-2" ref={refMessage}>
            <b>{username}</b>
            {`: ${filter.clean(body)}`}
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
        <MessagesForm />
      </div>
    </div>
  );
};

export default Messages;
