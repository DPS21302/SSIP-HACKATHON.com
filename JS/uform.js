const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'challan'
});

app.use(express.static('HTML'))

connection.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/CSS'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/unewform.html');
  });

  app.post('/update', (req, res) => {
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
      `UPDATE data SET  First_Name = '${F_name}', Last_Name = '${L_name}', Email = '${email}', Mobile_No = '${M_N}', Address_1 = '${Hn}', Address_2 = '${Ad}', C_I_D = '${C_I_D}', Pincode = '${Pc}', Rule_Break = '${R_b}', AMOUNT = '${AMOUNT}' where Vehicle_No = '${V_no}' `,
      [V_no, F_name, L_name, email, M_N, Hn, Ad, C_I_D, Pc, R_b, AMOUNT],
      (error, results) => {
        if (error) {
          return res.send(error);
        }
        res.sendFile(__dirname + '/unewform.html');
      }
    );
  });
  
  app.listen(3000, () => {
      console.log('Server started on localhost:3000');
  });