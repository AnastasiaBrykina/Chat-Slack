import Navbar from './Navbar.js';
import Channels from './Channels.js';
import Messages from './Messages.js';

const ChatPage = () => {
  return (
    <div className="h-100 d-flex flex-column" id="chat">
      <Navbar />
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>Каналы</b>
              <button
                type="button"
                className="p-0 text-primary btn btn-group-vertical"
              >
                +
              </button>
            </div>
            <Channels />
          </div>
          <div className="col p-0 h-100">
            <Messages />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
