import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, InputGroup, Button } from 'react-bootstrap';

import { addMessages } from '../slices/messages';
import routes from '../routes';

const Messages = () => {
  const dispatch = useDispatch();
  const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
  const { token } = currentUser;
  const messages = useSelector((state) => state.messages.messages);
  const currentChannel = useSelector((state) => state.channels.selectedChannel);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await axios.get(routes.messages(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(addMessages(res.data));
      } catch (e) {
        console.log(e.messages);
      }
    };

    fetchMessage();
  }, []);

  if (!currentChannel) {
    return null;
  }

  const currentMessage = messages.filter(
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
            <b>
              {username}:{body}
            </b>
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
        <span>{messages.length} сообщения</span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5">
        {renderCurrentMessages(currentMessage)}
      </div>
      <div className="mt-auto px-5 py-3">
        <InputGroup className="mb-3" id="body">
          <Form.Control
            name="body"
            placeholder="Введите сообщение..."
            aria-label="Новое сообщение"
          />
          <Button variant="outline-secondary" type="submit">
            Отправить
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default Messages;
