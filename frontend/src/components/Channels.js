import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';

import {
  loadChannels,
  selectedChannel,
  subscribeSocketChannel,
} from '../slices/channels';
import { setModalInfo } from '../slices/modals';

const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const currentChannel = useSelector((state) => state.channels.selectedChannel);

  useEffect(() => {
    dispatch(loadChannels());
    dispatch(subscribeSocketChannel());
  }, []);

  if (channels.length === 0) {
    return null;
  }

  const onClickChannelHundler = (channel) => (e) => {
    if (e.target.id === 'react-aria1269412036-1') {
      e.stopPropagation();
      return;
    }

    const inputMessages = document.querySelector('#messagesInput');
    inputMessages.focus();
    dispatch(selectedChannel(channel));
  };

  const getBtnVariant = (btnId) =>
    btnId === currentChannel.id ? 'secondary' : '';

  const rendeControlButton = (channel) => {
    const { id, name, removable } = channel;
    if (removable) {
      return (
        <div>
          <Dropdown as={ButtonGroup} className="d-flex">
            <Button
              variant={getBtnVariant(id)}
              className="w-100 rounded-0 text-start text-truncate"
            >
              <span className="me-1">#</span>
              {name}
            </Button>

            <Dropdown.Toggle
              split
              variant={getBtnVariant(id)}
              className="flex-grow-0"
              id="react-aria1269412036-1"
            />

            <Dropdown.Menu onClick={(e) => e.stopPropagation()}>
              <Dropdown.Item
                href="#/action-1"
                onClick={() =>
                  dispatch(
                    setModalInfo({
                      type: 'removing',
                      channel,
                    })
                  )
                }
              >
                Удалить
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-2"
                onClick={() =>
                  dispatch(
                    setModalInfo({
                      type: 'renaming',
                      channel,
                    })
                  )
                }
              >
                Переименовать
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      );
    }

    return (
      <Button
        variant={getBtnVariant(id)}
        className="w-100 rounded-0 text-start"
      >
        <span className="me-1">#</span>
        {name}
      </Button>
    );
  };

  const renderChannel = (channel) => (
    <li
      key={channel.id}
      className="nav-item w-100"
      onClick={onClickChannelHundler(channel)}
    >
      {rendeControlButton(channel)}
    </li>
  );

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={() => dispatch(setModalInfo({ type: 'adding' }))}
        >
          +
        </button>
      </div>
      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels.map((channel) => renderChannel(channel))}
      </ul>
    </>
  );
};

export default Channels;
