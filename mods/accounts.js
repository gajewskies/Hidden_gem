var crypto = require('crypto'); //using to generate password HASH
var uuid = require('node-uuid'); //using for unique identifiers.
var ApiResponse = require('./apiResponse.js');
var ApiMessages = require('./apiMessages.js');
var UserProfile = require('./userProfile.js');
var AccountController = function (userModel, session, mailer) {

  this.userModel = userModel;
  this.session = session;
  this.mailer = mailer;

  // method to return a reference to the controllers private session.
  this.getSession = function () {
    return this.session;
  };

  // Method to set controller's private session variable
  this.setSession = function (session) {
    this.session = session;
  };

  //Hashing our password using crypto
  this.hashPassword = function (password, salt, callback) {
    // We use pbkdf2 to hash and iterate 10k times by default
    var iterations = 10000,
      keyLen = 64; // 64 bit.
    this.crypto.pbkdf2(password, salt, iterations, keyLen, callback);
  };

  // Log on as a user if email and password is correct.
  // If correct, the method will add private session variable in the controller.
  this.logon = function (email, password, callback) {

    var me = this;

    me.userModel.findOne({
      email: email
    }, function (err, user) {

      if (err) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: me.ApiMessages.DB_ERROR
          }
        }));
      }

      if (user) {
        me.hashPassword(password, user.passwordSalt, function (err, passwordHash) {

          if (passwordHash == user.passwordHash) {

            var userProfileModel = new me.UserProfileModel({
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName
            });

            me.session.userProfileModel = userProfileModel;

            return callback(err, new me.ApiResponse({
              success: true,
              extras: {
                userProfileModel: userProfileModel
              }
            }));
          } else {
            return callback(err, new me.ApiResponse({
              success: false,
              extras: {
                msg: me.ApiMessages.INVALID_PWD
              }
            }));
          }
        });
      } else {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: me.ApiMessages.EMAIL_NOT_FOUND
          }
        }));
      }

    });
  };
  // Deleting the user's profile data stored in the controller's private session variable
  this.logoff = function () {
    if (this.session.userProfileModel) delete this.session.userProfileModel;
    return;
  };

  //Registering a new user by saving into our database.
  this.register = function (newUser, callback) {
    var me = this;
    me.userModel.findOne({
      email: newUser.email
    }, function (err, user) {

      if (err) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: me.ApiMessages.DB_ERROR
          }
        }));
      }

      if (user) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: me.ApiMessages.EMAIL_ALREADY_EXISTS
          }
        }));
      } else {

        newUser.save(function (err, user, numberAffected) {

          if (err) {
            return callback(err, new me.ApiResponse({
              success: false,
              extras: {
                msg: me.ApiMessages.DB_ERROR
              }
            }));
          }

          if (numberAffected === 1) {

            var userProfileModel = new me.UserProfileModel({
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName
            });

            return callback(err, new me.ApiResponse({
              success: true,
              extras: {
                userProfileModel: userProfileModel
              }
            }));
          } else {
            return callback(err, new me.ApiResponse({
              success: false,
              extras: {
                msg: me.ApiMessages.COULD_NOT_CREATE_USER
              }
            }));
          }

        });
      }

    });
  };

  //Will send an email contianing the password link, which contains a unique string to be used as confirmation.
  this.resetPassword = function (email, callback) {
    var me = this;
    me.userModel.findOne({
      email: email
    }, function (err, user) {

      if (err) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: me.ApiMessages.DB_ERROR
          }
        }));
      }

      if (user) {
        // Save the user's email and a password reset hash in session. We will use
        var passwordResetHash = me.uuid.v4();
        me.session.passwordResetHash = passwordResetHash;
        me.session.emailWhoRequestedPasswordReset = email;

        //Sending the email using mailer function.
        me.mailer.sendPasswordResetHash(email, passwordResetHash);

        return callback(err, new me.ApiResponse({
          success: true,
          extras: {
            passwordResetHash: passwordResetHash
          }
        }));
      } else {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: me.ApiMessages.EMAIL_NOT_FOUND
          }
        }));
      }
    });
  };

  //Reseting the user's password.
  this.resetPasswordFinal = function (email, newPassword, passwordResetHash, callback) {
    var me = this;
    if (!me.session || !me.session.passwordResetHash) {
      return callback(null, new me.ApiResponse({
        success: false,
        extras: {
          msg: me.ApiMessages.PASSWORD_RESET_EXPIRED
        }
      }));
    }

    if (me.session.passwordResetHash !== passwordResetHash) {
      return callback(null, new me.ApiResponse({
        success: false,
        extras: {
          msg: me.ApiMessages.PASSWORD_RESET_HASH_MISMATCH
        }
      }));
    }

    if (me.session.emailWhoRequestedPasswordReset !== email) {
      return callback(null, new me.ApiResponse({
        success: false,
        extras: {
          msg: me.ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH
        }
      }));
    }

    var passwordSalt = this.uuid.v4();

    me.hashPassword(newPassword, passwordSalt, function (err, passwordHash) {

      me.userModel.update({
        email: email
      }, {
        passwordHash: passwordHash,
        passwordSalt: passwordSalt
      }, function (err, numberAffected, raw) {

        if (err) {
          return callback(err, new me.ApiResponse({
            success: false,
            extras: {
              msg: me.ApiMessages.DB_ERROR
            }
          }));
        }

        if (numberAffected < 1) {

          return callback(err, new me.ApiResponse({
            success: false,
            extras: {
              msg: me.ApiMessages.COULD_NOT_RESET_PASSWORD
            }
          }));
        } else {
          return callback(err, new me.ApiResponse({
            success: true,
            extras: null
          }));
        }
      });
    });
  };

  return this;
};

module.exports = AccountController;

