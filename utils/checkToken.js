const { validate } = require('../helpers/token');
const UserController = require('../modules/users/user.controller');
const { ERR } = require('../helpers/error');

const checkPermissions = (userPerm, accessPerm) => userPerm.some(v => accessPerm.indexOf(v) !== -1);

const Secure = () => (req, res, next) => {
  const token = req.body.access_token || req.query.access_token || req.headers.access_token;
  if (!token) throw ERR.TOKEN_REQ;

  UserController.validateToken(token)
    .then(async tokenData => {
      req.sessionData = tokenData;
      next();
    })
    .catch(next);
};

const SecureAPI =
  (...perms) =>
  (req, res, next) => {
    // TODO need to verify permissions
    const token = req.body.access_token || req.query.access_token || req.headers.access_token;
    if (!token) throw ERR.TOKON_REQ;

    validate(token)
      .then(async t => {
        const user = await UserController.getById(t.data.user_id);
        req.ruser = user;
        req.tokenData = t.data;
        req.body.updatedBy = user._id;
        const userPerms = t.data.permissions || [];
        if (perms.length > 0) {
          if (!checkPermissions(userPerms, perms)) {
            throw ERR.UNAUTHORIZED;
          }
        }
        next();
      })
      .catch(next);
  };

module.exports = {
  Secure,
  SecureAPI
};
