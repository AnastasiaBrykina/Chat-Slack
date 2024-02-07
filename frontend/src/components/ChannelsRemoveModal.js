import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { setModalInfo } from '../slices/modals';
import { selectedChannel, removeChannel } from '../slices/channels';

const ChannelsRemoveModal = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const currentChannel = useSelector((state) => state.channels.selectedChannel);
  const modalInfo = useSelector((state) => state.modals.modalInfo);
  const status = useSelector((state) => state.channels.status);
  const { channel } = modalInfo;

  const isDesabled = status === 'sending';

  const onRemoveNundler = (channelId) => {
    dispatch(removeChannel(channelId));

    if (currentChannel.id === channelId) {
      dispatch(selectedChannel(channels[0]));
    }

    dispatch(setModalInfo({ type: null }));
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
          disabled={isDesabled}
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
            disabled={isDesabled}
          >
            Отменить
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => onRemoveNundler(channel.id)}
            disabled={isDesabled}
          >
            Удалить
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChannelsRemoveModal;
