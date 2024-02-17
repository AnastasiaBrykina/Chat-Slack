import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { loadChannels, selectedChannel } from '../slices/channels';
import { setModalInfo } from '../slices/modals';
import restApi from '../restApi';

const Channels = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDisabled, setDisablesStatus] = useState(false);
  const refChannel = useRef(null);
  const channels = useSelector((state) => state.channels.channels);
  const currentChannel = useSelector((state) => state.channels.selectedChannel);

  const { t } = useTranslation();

  useEffect(() => {
    if (refChannel.current) {
      if (refChannel.current.id === currentChannel.id) {
        refChannel.current.scrollIntoView();
      }
    }
  });

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setDisablesStatus(true);
        const res = await restApi.loadChannels();
        dispatch(loadChannels(res.data));
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
    fetchChannels();
  }, []);

  if (channels.length === 0) {
    return null;
  }

  const getBtnVariant = (btnId) =>
    btnId === currentChannel.id ? 'secondary' : '';

  const rendeChannelButton = (channel) => {
    const { id, name, removable } = channel;
    if (removable) {
      return (
        <Dropdown as={ButtonGroup} className="d-flex">
          <Button
            variant={getBtnVariant(id)}
            className="w-100 rounded-0 text-start text-truncate"
            disabled={isDisabled}
            onClick={() => dispatch(selectedChannel(channel))}
          >
            <span className="me-1">#</span>
            {name}
          </Button>

          <Dropdown.Toggle
            split
            variant={getBtnVariant(id)}
            className="flex-grow-0"
          />

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() =>
                dispatch(
                  setModalInfo({
                    type: 'removing',
                    channel,
                  })
                )
              }
            >
              {t('buttons.remove')}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                dispatch(
                  setModalInfo({
                    type: 'renaming',
                    channel,
                  })
                )
              }
            >
              {t('buttons.rename')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    return (
      <Button
        variant={getBtnVariant(id)}
        className="w-100 rounded-0 text-start"
        onClick={() => dispatch(selectedChannel(channel))}
      >
        <span className="me-1">#</span>
        {name}
      </Button>
    );
  };

  const renderChannel = (channel) => (
    <li
      key={channel.id}
      id={channel.id}
      ref={refChannel}
      className="nav-item w-100"
    >
      {rendeChannelButton(channel)}
    </li>
  );

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('chatPage.channels.title')}</b>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={() => dispatch(setModalInfo({ type: 'adding' }))}
          disabled={isDisabled}
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
