import { useSelector } from 'react-redux';

import ChannelsAddModal from './ChannelsAddModal';
import ChannelsRemoveModal from './ChannelsRemoveModal';
import ChannelsRenameModal from './ChannelsRenameModal';

const switchModals = (type) => {
  const modals = {
    adding: ChannelsAddModal,
    removing: ChannelsRemoveModal,
    renaming: ChannelsRenameModal,
  };

  return modals[type];
};

const Modals = () => {
  const activeModal = useSelector((state) => state.modals.modalInfo.type);
  const Modal = switchModals(activeModal);
  if (!Modal) return null;

  return <Modal />;
};

export default Modals;
