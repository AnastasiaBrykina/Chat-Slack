import Navbar from './Navbar';
import Channels from './Channels';
import Messages from './Messages/Messages';
import Modals from './Modals';

const ChatPage = () => (
  <div className="h-100 d-flex flex-column" id="chat">
    <Navbar />
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <Channels />
        </div>
        <div className="col p-0 h-100">
          <Messages />
        </div>
      </div>
    </div>
    <Modals />
  </div>
);

export default ChatPage;
