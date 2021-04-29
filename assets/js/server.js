let express = require('express');
var bodyParser = require('body-parser');
let nodemailer = require('nodemailer');
var server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.raw());

server.listen(8001, function () {
  console.log("This confirms the server is running")
});

server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8001/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Send Mail
let sendMes = async function (name, email, subject, message) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports

    auth: {
      user: "boadiunmonitored@gmail.com", // email
      pass: "qsczseqsczseQ@", // password
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });
  try {
    await transporter.sendMail({
      from: email.toString(), // sender address
      to: "boadiunmonitored@gmail.com", // myself as the reciever
      subject: "Name " + name.toString() + "Subject " + subject.toString() + "From " + email.toString(), // Subject line
      text: message.toString(), // plain text body
    });
  }
  catch (ex) {
    console.log('Failed registration ' + ex);
    return false;
  }

  return true;
}

// Registration
server.get('/sendMessage?', async function (req, res) { // callback

  let name = new String(req.query.name);
  let email = new String(req.query.email);
  let subject = new String(req.query.subject);
  let message = new String(req.query.message);

  const reg = await sendMes(name, email, subject, message);

  if(reg === true)
  {
    console.log("Request successful ");
    res.sendStatus(200);
  }
  else
  {
    res.sendStatus(400);
  }
});