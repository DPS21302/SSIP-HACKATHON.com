const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/submit', (req, res) => {
  const V_no = req.body.V_no;
  const F_name = req.body.F_name;
  const L_name = req.body.L_name;
  const email = req.body.email;
  const M_N = req.body.M_N;
  const Hn = req.body.Hn;
  const Ad = req.body.Ad;
  const C_I_D = req.body.C_I_D;
  const Pc = req.body.Pc;
  const R_b = req.body.R_b;
  const AMOUNT = req.body.AMOUNT;

  connection.query(
    'INSERT INTO data (Vehicle_No, First_Name, Last_Name, Email, Mobile_No, Address_1, Address_2, C_I_D, Pincode, Rule_Break, AMOUNT) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [V_no, F_name, L_name, email, M_N, Hn, Ad, C_I_D, Pc, R_b, AMOUNT],
    (error, results) => {
      if (error) {
        return res.send(error);
      }
      res.sendFile(__dirname + '/newform.html');
    }
  );
});

app.listen(3000, () => {
    console.log('Server started on localhost:3000');
});