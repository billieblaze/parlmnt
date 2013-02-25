define([
  'sandbox',

  'widgets/session/views/session-manager'
],

  function (sandbox, SessionManagerView) {


    return function (options) {
      var session = new SessionManagerView(options);

      return session;
    };

  });