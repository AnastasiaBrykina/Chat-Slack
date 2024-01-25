import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addChannels, selectedChannel } from '../slices/channels.js';
import routes from '../routes.js';

const Channels = () => {
  const dispatch = useDispatch();
  const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
  const { token } = currentUser;
  const channels = useSelector((state) => state.channels.channels);
  const currentChannel = useSelector((state) => state.channels.selectedChannel);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await axios.get(routes.channels(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const defaultChannel = res.data[0];
        dispatch(addChannels(res.data));
        dispatch(selectedChannel(defaultChannel));
      } catch (e) {
        console.log(e.message);
      }
    };
    fetchChannels();
  }, []);

  if (channels.length === 0) {
    return null;
  }

  const onChangeChannal = (channel) => dispatch(selectedChannel(channel));

  const getBtnClasses = (btnId) =>
    btnId === currentChannel.id
      ? 'w-100 rounded-0 text-start btn btn-secondary'
      : 'w-100 rounded-0 text-start btn';

  const renderChannel = (channel) => (
    <li
      key={channel.id}
      className="nav-item w-100"
      onClick={() => onChangeChannal(channel)}
    >
      <button type="button" className={getBtnClasses(channel.id)}>
        <span className="me-1">#</span>
        {channel.name}
      </button>
    </li>
  );

  return (
    <ul
      id="channels-box"
      className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
    >
      {channels.map((channel) => renderChannel(channel))}
    </ul>
  );
};

export default Channels;
