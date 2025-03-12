const passwordEncryptor = require('./passwordEncryptor');

module.exports = function (app, runQuery, db) {

  app.get('/api/my-orders', (req, res) => {

    let userId = req.session.user?.id;

    runQuery('my-orders', req, res, { customerId: userId }, `
      SELECT * FROM orderDetails WHERE customerId = :customerId
    `);

  });

  function editMyUserInfo(req, res) {

    // To prevent changes to userRole remove userRole
    // from the request body
    delete req.body.userRole;
    // if nohting to change then do nothing...
    if (Object.keys(req.body).length === 0) {
      res.json({ changes: 0 });
      return;
    }

    let userId = req.session.user?.id;

    let queryParameters = { ...req.body, id: userId };

    if (queryParameters.password) {
      queryParameters.password = passwordEncryptor(queryParameters.password);
    }

    runQuery('edit-my-user-info', req, res, queryParameters, `
        UPDATE customers
        SET ${Object.keys(req.body).map(x => x + ' = :' + x)}
        WHERE id = :id
    `);

    let stmt = db.prepare('SELECT * FROM customers WHERE id = :id');
    let updatedUserInfo = stmt.all({ id: queryParameters.id })[0];
    delete updatedUserInfo.password;
    req.session.user = updatedUserInfo;
  }
  app.put('/api/edit-my-user-info', editMyUserInfo);
  app.patch('/api/edit-my-user-info', editMyUserInfo);

}