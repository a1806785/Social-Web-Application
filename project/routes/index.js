var express = require('express');
var router = express.Router();

'use strict';
var nodemailer = require('nodemailer');
var argon2 = require('argon2');


router.post('/sign_up', async function (req, res, next) {
  var phash = null;
  try {
    phash = await argon2.hash(req.body.password);
  } catch (err) {
    res.sendStatus(500);
    return;
  }
  console.log(phash);

  if ('username' in req.body && 'email' in req.body && 'password' in req.body) {
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      let query = "SELECT Username FROM Users WHERE Username = ?;";
      connection.query(query, [req.body.username], function (err, rows, fields) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        if (rows.length > 0) {
          res.sendStatus(409);
          return;
        } else {
          query = "INSERT INTO Users (Username, Email, Password, Type) VALUES (?, ?, ?, 'normal');";
          connection.query(query, [req.body.username, req.body.email, phash], function (err, rows, fields) {
            if (err) {
              console.log(err);
              res.sendStatus(403);
              return;
            }
            query = "SELECT User_ID, Username, Email, Password FROM Users WHERE Username = ?;";
            connection.query(query, [req.body.username], function (err, rows, fields) {
              connection.release();
              if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
              }
              if (rows.length > 0) {
                console.log('success');
                console.log(rows);
                req.session.user = rows[0];
                res.sendStatus(200);
              } else {
                console.log('bad login');
                res.sendStatus(401);
              }
            });
          });
        }
      });

    });
  } else {
    console.log('bad request');
    res.sendStatus(400);
  }

});

// sign in
router.post('/sign_in', function (req, res, next) {
 if ('username' in req.body && 'password' in req.body) {

    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      let query = "SELECT User_ID, Username, Email, Password, Type FROM Users WHERE Username = ?;";
      connection.query(query, [req.body.username, req.body.password], function (err, rows, fields) {
        connection.release();
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }

        var loggg = false;

        async function te(sqlP, inputP, res) {
          var argon2 = require('argon2');
          try {
            if (await argon2.verify(sqlP, inputP)) {
              console.log("right");
              loggg = true;
              return 0;
            } else {
              loggg = false;
              console.log("wrong");
              return 1;
            }
          } catch (err) {
          }
        }

        te(rows[0].Password, req.body.password, res).then(function () {
          console.log(rows.length);
          if (loggg === true) {
            console.log('success');
            console.log(rows);
            req.session.user = rows[0];
            if (rows[0].Type === 'normal') {
              res.status(200);
              res.send('normal');
            } else {
              res.status(200);
              res.send('admin');
            }
          } else {
            console.log('bad login');
            res.sendStatus(401);
          }
        });
      });
    });
  } else {
    res.sendStatus(400);
  }
});

async function sl() {
  await new Promise(r => setTimeout(r, 2000));
}

// get user information
router.post('/user_information', function (req, res, next) {
  res.json(req.session.user);
});

// query people
router.get('/people', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let query = "SELECT Username, Email FROM Users;";
    connection.query(query, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// delete people
router.post('/delete_people', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let query = "DELETE FROM Users WHERE Username = ? AND Email = ?;";
    connection.query(query, [req.body.username, req.body.email], function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

// add event
router.post('/event', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let query = "INSERT INTO Events (User_ID, Event_name, Start_time, End_time, Detail) VALUES (?, ?, ?, ?, ?);";
    let str = `<p>A new event: <strong>${req.body.name}</strong> has created. It will start from <strong>${req.body.start_time}</strong> and end in <strong>${req.body.end_time}</strong>.</p>`;
    connection.query(query, [req.session.user.User_ID, req.body.name, req.body.start_time, req.body.end_time, req.body.desc], function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      sendEmail(str, req.session.user.Email, "A new event");
      res.sendStatus(200);
    });
  });
});

// delete event
router.post('/delete_event', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query = "DELETE FROM Events WHERE Event_name = ? AND Start_time = ? AND End_time = ?;";
    let str = `<p>An event: <strong>${req.body.name}</strong>(from <strong>${req.body.start_time}</strong> to <strong>${req.body.end_time}</strong>) has been deleted.</p>`;
    connection.query(query, [req.body.name, req.body.start_time, req.body.end_time], function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      query = "SELECT Email FROM Users;";
      connection.query(query, function (err, rows, fields) {
        connection.release();
        if (err) {
          res.sendStatus(500);
          return;
        }
        for (let i = 0; i < rows.length; i++) {
          sendEmail(str, rows[i].Email, "An event has been deleted");
        }
      });
      res.sendStatus(200);
    });
  });
});

// send email
function sendEmail(str, email, topic) {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'marquis.keebler76@ethereal.email',
        pass: 'tAU2CRZUVz9j7cUH6u'
      }
    });

    let em = email;

    // Message object
    let message = {
      from: 'marquis.keebler76@ethereal.email',
      to: em,
      subject: topic,
      html: str,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
}

// admin sign up
router.post('/admin_sign_up', async function (req, res, next) {
  // console.log(req.body);


  var phash = null;
  try {
    phash = await argon2.hash(req.body.password);
  } catch (err) {
    res.sendStatus(500);
    return;
  }

  console.log(phash);


  if ('username' in req.body && 'email' in req.body && 'password' in req.body && 'code' in req.body) {
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      let query = "SELECT Username FROM Users WHERE Username = ?;";
      connection.query(query, [req.body.username], function (err, rows, fields) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        if (rows.length > 0) {
          res.sendStatus(409);
          return;
        } else {
          query = "INSERT INTO Users (Username, Email, Password, Code, Type) VALUES (?, ?, ?, ?, 'admin');";
          connection.query(query, [req.body.username, req.body.email, phash, req.body.code], function (err, rows, fields) {
            if (err) {
              console.log(err);
              res.sendStatus(403);
              return;
            }
            query = "SELECT User_ID, Username, Email, Password FROM Users WHERE Username = ?;";
            connection.query(query, [req.body.username], function (err, rows, fields) {
              connection.release();
              if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
              }
              if (rows.length > 0) {
                console.log('success');
                req.session.user = rows[0];
                res.sendStatus(200);
              } else {
                console.log('bad login');
                res.sendStatus(401);
              }
            });
          });
        }
      });

    });
  } else {
    console.log('bad request');
    res.sendStatus(400);
  }

});

// show event
router.get('/show_event', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT Event_name, Start_time, End_time, Detail FROM Events;";
    connection.query(query, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

module.exports = router;
