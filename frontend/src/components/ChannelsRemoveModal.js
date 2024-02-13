import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import { setModalInfo } from '../slices/modals';
import { selectedChannel } from '../slices/channels';
import restApi from '../restApi';

const ChannelsRemoveModal = () => {
  const dispatch = useDispatch();
  const [isDisabled, setDisablesStatus] = useState(false);
  const channels = useSelector((state) => state.channels.channels);
  const currentChannel = useSelector((state) => state.channels.selectedChannel);
  const modalInfo = useSelector((state) => state.modals.modalInfo);

  const { channel } = modalInfo;

  const onRemoveNundler = async (channelId) => {
    try {
      setDisablesStatus(true);
      await restApi.removeChannel(channelId);
      if (currentChannel.id === channelId) {
        dispatch(selectedChannel(channels[0]));
      }
      dispatch(setModalInfo({ type: null }));
    } catch (e) {
      console.log(e);
    }
    setDisablesStatus(false);
  };

  return (
    <Modal
      show="true"
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>Удалить канал</Modal.Title>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={() => dispatch(setModalInfo({ type: null }))}
          disabled={isDisabled}
        />
      </Modal.Header>
      <Modal.Body>
        <p className="lead">Уверены?</p>
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            type="button"
            className="me-2"
            onClick={() => dispatch(setModalInfo({ type: null }))}
            disabled={isDisabled}
          >
            Отменить
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => onRemoveNundler(channel.id)}
            disabled={isDisabled}
          >
            Удалить
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChannelsRemoveModal;
