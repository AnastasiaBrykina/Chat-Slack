const NotFoundPage = () => (
  <div className="h-100 d-flex flex-column" id="chat">
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/login">
          Hexlet Chat
        </a>
      </div>
    </nav>
    <div className="text-center">
      <h1 className="h4 text-muted">Страница не найдена</h1>
      <p className="text-muted">
        Но вы можете перейти на главную страницу
        <a href="/login"> На главную страницу</a>
      </p>
    </div>
  </div>
);

export default NotFoundPage;
