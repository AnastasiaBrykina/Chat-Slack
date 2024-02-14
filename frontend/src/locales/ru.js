const ru = {
  translation: {
    header: {
      title: 'Hexlet Chat',
    },
    loginPage: {
      title: 'Войти',
      form: {
        fields: {
          username: 'Ваш ник',
          password: 'Пароль',
        },
        errors: 'Неверные имя пользователя или пароль',
      },
      footer: {
        text: 'Нет аккаунта?',
      },
    },
    signupPage: {
      title: 'Регистрация',
      form: {
        fields: {
          username: 'Имя пользователя',
          password: 'Пароль',
          confirm: 'Подтвердите пароль',
        },
        errors: 'Такой пользователь уже существует',
      },
    },
    chatPage: {
      channels: {
        title: 'Каналы',
      },
      messages: {
        message_one: '{{count}} сообщение',
        message_few: '{{count}} сообщения',
        message_many: '{{count}} сообщений',
        form: {
          body: 'Введите сообщение...',
        },
      },
      modals: {
        add: 'Добавить канал',
        remove: 'Удалить канал',
        rename: 'Переименовать канал',
        rmTitle: 'Уверены?',
      },
    },
    validationSchema: {
      generalErr: {
        length: 'От 3 до 20 символов',
        required: 'Обязательное поле',
      },
      password: {
        length: 'Не менее 6 символов',
        confirm: 'Пароли должны совпадать',
      },
      channel: {
        unique: 'Должно быть уникальным',
      },
    },
    buttons: {
      cancel: 'Отменить',
      send: 'Отправить',
      remove: 'Удалить',
      rename: 'Переименовать',
      signup: 'Зарегистрироваться',
      loogin: 'Регистрация',
      enter: 'Войти',
      exit: 'Выйти',
    },
  },
};

export default ru;
