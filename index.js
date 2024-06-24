const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();
var cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();
const port = process.env.PORT || 3022;
const mongoose = require("mongoose");
const User = require("./user");
const corsOptions = {
  origin: ['http://localhost:3002'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: '*',
};

app.use(cors(corsOptions));
app.use("/", route);
const io = new Server(server);

const mongo_URI =
  "mongodb+srv://SAC:G8BO4x3rWEDFSYqk@cluster0.btu1pyt.mongodb.net/kestone-users";

mongoose
  .connect(mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Connected to the MongoDB database");
  })
  .catch((error) => {
    console.error("Error connecting to the MongoDB database:", error);
  });
const transporter = nodemailer.createTransport({
  // port: 465, // true for 465, false for other ports
  host: process.env.SERVER,
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
  secure: true,
});

const topmail = `<style>
body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
img { -ms-interpolation-mode: bicubic; }
img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
table { border-collapse: collapse !important; }
body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
div[style*="margin: 16px 0;"] { margin: 0 !important; }
</style>
<body style="background-color: #f7f5fa; margin: 0 !important; padding: 0 !important;">

 <table border="0" cellpadding="0" cellspacing="0" width="100%">
   <tr>
     <td bgcolor="#426899" align="center">
       <table border="0" cellpadding="0" cellspacing="0" width="480" >
         <tr>
           <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
             <div style="display: block; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;" border="0">WVConnect 2024</div>
           </td>
         </tr>
       </table>
     </td>
   </tr>
   <tr>
     <td bgcolor="#426899" align="center" style="padding: 0px 10px 0px 10px;">
       <table border="0" cellpadding="0" cellspacing="0" width="480" >
         <tr>
           <td bgcolor="#ffffff" align="left" valign="top" style="padding: 30px 30px 20px 30px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; line-height: 48px;">
             <h1 style="font-size: 32px; font-weight: 400; margin: 0;">
           </td>
         </tr>
       </table>
     </td>
   </tr>
   <tr>
     <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
       <table border="0" cellpadding="0" cellspacing="0" width="480" >
         <tr>
           <td bgcolor="#ffffff" align="left">
             <table width="100%" border="0" cellspacing="0" cellpadding="0">
               <tr>
                 <td colspan="2" style="padding-left:30px;padding-right:15px;padding-bottom:10px; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px;">
                   <p>Your requested resources from WVConnect 2024 - Digital Library awaits you.
                 </td>
               </tr>`;

const bottomMail = `</table>
  </td>
</tr>
<tr>
  <td bgcolor="#ffffff" align="center">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td bgcolor="#ffffff" align="center" style="padding: 30px 30px 30px 30px; border-top:1px solid #dddddd;">
          <table border="0" cellspacing="0" cellpadding="0">
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>
</table>
</td>
</tr>
<tr>
<td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;"> <table border="0" cellpadding="0" cellspacing="0" width="480">
<tr>
<td bgcolor="#f4f4f4" align="left" style="padding: 30px 30px 30px 30px; color: #666666; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;" >
  <p style="margin: 0;">This mail is from "<a style="color: #111111; font-weight: 700;">WVConnect2024
</td>
</tr>
</td>
</tr>
</table>

</body>`;

let MiddleMail = "";

async function organizeMail(cardData) {
  if (cardData.length > 0) {
    for (let index = 0; index < cardData.length; index++) {
      let element = `<tr>
    <th align="left" valign="top" style="padding-left:30px;padding-right:15px;padding-bottom:10px; font-family:
    Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">${cardData[index].title}
    <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: Helvetica, Arial,
    sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
    <a href="${cardData[index].link}">Google Drive link</a>
  </tr>`;
      MiddleMail += element;
    }
  }
}





io.on('connection', (socket) => {
  console.log('Angular conneted');

  socket.on('start',() =>{
    console.log('start-video');
    io.emit('playvid')
  })

  socket.on('start2',() =>{
    console.log('start-video');
    io.emit('playvid2')
  })

  socket.on('stop',() =>{
    console.log('stop-video');
    io.emit('stopvid')
  })

  socket.on('stop2',() =>{
    console.log('stop-video');
    io.emit('stopvid2')
  })

  socket.on('addPhone',(e)=>{
    const user = {
      phoneNumber: e
    };
    async function saveUserData(user) {
      if (user) {
        try {
          const newUser = await User.create({
            phoneNumber: user.phoneNumber,
          });
          socket.emit("added", newUser);
          console.log("User data saved successfully!");
        } catch (error) {
          console.error("An error occurred while saving user data:", error);
        }
      } else {
        console.log("Invalid user data provided.");
      }
    }
    saveUserData(user);
  })

  socket.on('addPhone2',(e)=>{
    const user = {
      phoneNumber: e
    };
    async function saveUserData(user) {
      if (user) {
        try {
          const newUser = await User.create({
            phoneNumber: user.phoneNumber,
          });
          socket.emit("added2", newUser);
          console.log("User data saved successfully!");
        } catch (error) {
          console.error("An error occurred while saving user data:", error);
        }
      } else {
        console.log("Invalid user data provided.");
      }
    }
    saveUserData(user);
  })
})

route.post("/sendMail", (req, res) => {
  let { to, subject, text, cardData } = req.body;
  console.log(to);
  organizeMail(cardData);
  const mailData = {
    from: process.env.USER,
    to: to,
    subject: subject,
    text: text,
    html: `${topmail}${MiddleMail}${bottomMail}`,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.status(200).send({ message: "Mail send", message_id: info.messageId });
  });
  MiddleMail = "";
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
