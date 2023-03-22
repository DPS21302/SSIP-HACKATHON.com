const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const nodemailer = require('nodemailer');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var flash = require('express-flash');
var session = require('express-session');
var connection  = require('./database');
var router = express.Router();
var fs = require('fs');
// var sampledataRouter = require('./JS/sample_data');
// app 
const app = express();
app.use(express.static("assets"));

app.use(express.json());       
app.use(express.urlencoded({extended: true})); 

app.use(express.static("html"));
app.use(express.static("JS"));
// app.use('/sample_data', sampledataRouter); 
const chart=require("./JS/chart_backend");
// login page 
app.get("/",function(req,res){
    res.sendFile(__dirname + "/HTML/index.html");
});

// authorization 
app.post("/",encoder, function(req,res){
    var Username = req.body.username;
    var password = req.body.password;
    console.log("Username " + Username );
    console.log("Password " + password );
  
    connection.query("select * from Login where username = ? and password = ?",[Username,password],function(error,results,fields){
        if (results.length > 0) {
            res.redirect("/HTML");
        } else {
            res.send(`<script>
      alert("Incorrect username or password.");
      window.location.href = "/";
    </script>`)
        }
        res.end();
    })  
});

// send Home page 
app.get("/HTML",function(req,res){
  res.sendFile(__dirname + "/HTML/Home_Page.html");
});

// Insert Records



app.post('/submit', (req, res) => {
    console.log(req);
    console.log("data from body is ");
    console.log(req.body);
    const V_no = req.body.V_no;
    const C_I =req.body.C_I;
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
    const code = 7;
    connection.query(
      
        'INSERT INTO RTO (Vehicle_No,Challan_No, First_name, Last_Name, Email, Mobile_No, Address_Line1, Address_Line2, Echallan_generated_date, Pincode, Rulebreak, AMOUNT,Status_Code) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
        [V_no,C_I, F_name, L_name, email, M_N, Hn, Ad, C_I_D, Pc, R_b, AMOUNT ,code]
        ,
      (error, results) => {
        if (error) {
          return res.send(error);
        }
        console.log(" data submited ");
        res.sendFile(__dirname+"/HTML/newform.html")
      }
    );
  });
  

  // Update Records
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
  ``
    connection.query(
      `UPDATE data SET  First_name = '${F_name}', Last_Name = '${L_name}', Email = '${email}', Mobile_No = '${M_N}', Address_1 = '${Hn}', Address_2 = '${Ad}', Echallan_generated_date = '${C_I_D}', Pincode = '${Pc}', Rule_Break = '${R_b}', AMOUNT = '${AMOUNT}' where Vehicle_No = '${V_no}' `,
      [V_no, F_name, L_name, email, M_N, Hn, Ad, C_I_D, Pc, R_b, AMOUNT],
      (error, results) => {
        if (error) {
          return res.send(error);
        }
        res.sendFile(__dirname + '/unewform.html');
      }
    );
  });


// view engine setup
app.use(express.static("views"));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ 
    secret: '123456cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash());
app.use(expressValidator());

//E-generated page 
const resultsPerPage = 10;
app.get('/generated', (req, res) => {
    let sql = 'SELECT * FROM RTO';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? parseInt(req.query.page) : 1;
        console.log((req.query.page));
        console.log(numOfResults);
        console.log(numberOfPages);
        if(page > numberOfPages){
            res.redirect('/generated/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/generated/?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        //Get the relevant number of POSTS for this starting page
        sql = `SELECT * FROM RTO LIMIT ${startingLimit},${resultsPerPage} `;
        connection.query(sql, (err, result)=>{
            if(err) throw err;
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;
            // }
            res.render('generated', {data: result, page, iterator, endingLink, numberOfPages});
        });
    });
});

app.get('/generated_pending', (req, res) => {
    let sql = 'SELECT * FROM RTO where Status_Code=3 ';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? parseInt(req.query.page) : 1;
        console.log((req.query.page));
        console.log(numOfResults);
        console.log(numberOfPages);
        if(page > numberOfPages){
            res.redirect('/generated_pending/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/generated_pending/?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        //Get the relevant number of POSTS for this starting page
        sql = `SELECT * FROM RTO where  Status_Code=3 LIMIT ${startingLimit},${resultsPerPage} `;
        connection.query(sql, (err, result)=>{
            if(err) throw err;
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;
            // }
            res.render('generated_pending', {data: result, page, iterator, endingLink, numberOfPages});
        });
    });
});

app.get('/generated_paid', (req, res) => {
    let sql = 'SELECT * FROM RTO where  Status_Code=1';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? parseInt(req.query.page) : 1;
        console.log((req.query.page));
        console.log(numOfResults);
        console.log(numberOfPages);
        if(page > numberOfPages){
            res.redirect('/generated_paid/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/generated_paid/?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        //Get the relevant number of POSTS for this starting page
        sql = `SELECT * FROM RTO where  Status_Code=1 LIMIT ${startingLimit},${resultsPerPage} `;
        connection.query(sql, (err, result)=>{
            if(err) throw err;
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;
            // }
            res.render('generated_paid', {data: result, page, iterator, endingLink, numberOfPages});
        });
    });
});

app.get('/integrated', (req, res) => {
    let sql = 'SELECT * FROM RTO where Status_Code =2 OR Status_Code =4';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? parseInt(req.query.page) : 1;
        console.log((req.query.page));
        console.log(numOfResults);
        console.log(numberOfPages);
        if(page > numberOfPages){
            res.redirect('/integrated/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/integrated/?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        //Get the relevant number of POSTS for this starting page
        sql = `SELECT * FROM RTO where Status_Code =2 OR Status_Code =4 OR  Status_Code=6 OR  Status_Code=7 LIMIT ${startingLimit},${resultsPerPage} `;
        connection.query(sql, (err, result)=>{
            if(err) throw err;
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;
            // }
            res.render('integrated', {data: result, page, iterator, endingLink, numberOfPages});
        });
    });
});


//send mail  
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sonaiya98@gmail.com',
      pass: 'pxobdiuhlzvcxprp'
    }
  });
  
  
app.get("/mail",function(req,res){
    
      var mailOptions = {
      from: 'sonaiya98@gmail.com',
      to: 'mykyadav17112003@gmail.com',
      cc : ['mykyadav2003@gmail.com','harshsonaiya09@gmail.com','vihar_21316@ldrp.ac.in','darshit_21302@ldrp.ac.in','kauranidivya@gmail.com'],
      subject: 'RTO Alert!',
      text: `Your E-Challan ID:GJR-060822XXXXX3 fine is  integrated with your Electricity Bill.Total Amt:6243.78Rs `      
      };
      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        req.flash("success","Mail has been sent Successfully.");
        res.redirect("/integrated")
  });
  

app.get('/integrated_paid', (req, res) => {
    let sql = 'SELECT * FROM RTO where Status_Code=2 ';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? parseInt(req.query.page) : 1;
        console.log((req.query.page));
        console.log(numOfResults);
        console.log(numberOfPages);
        if(page > numberOfPages){
            res.redirect('/integrated_paid/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/integrated_paid/?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        //Get the relevant number of POSTS for this starting page
        sql = `SELECT * FROM RTO where Status_Code=2 LIMIT ${startingLimit},${resultsPerPage} `;
        connection.query(sql, (err, result)=>{
            if(err) throw err;
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;
            // }
            res.render('integrated_paid', {data: result, page, iterator, endingLink, numberOfPages});
        });
    });
});

app.get('/integrated_pending', (req, res) => {
    let sql = 'SELECT * FROM RTO where Status_Code=4 ';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? parseInt(req.query.page) : 1;
        console.log((req.query.page));
        console.log(numOfResults);
        console.log(numberOfPages);
        if(page > numberOfPages){
            res.redirect('/integrated_pending/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/integrated_pending/?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        //Get the relevant number of POSTS for this starting page
        sql = `SELECT * FROM RTO where Status_Code=4 LIMIT ${startingLimit},${resultsPerPage} `;
        connection.query(sql, (err, result)=>{
            if(err) throw err;
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;
            // }
            res.render('integrated_pending', {data: result, page, iterator, endingLink, numberOfPages});
        });
    });
});

app.get("/mail1",function(req,res){
    var mailOptions = {
    from: 'sonaiya98@gmail.com',
    to: 'mykyadav17112003@gmail.com',
    cc : ['mykyadav2003@gmail.com','harshsonaiya09@gmail.com','vihar_21316@ldrp.ac.in','darshit_21302@ldrp.ac.in','kauranidivya@gmail.com'],
    subject: 'RTO Alert!',
    text: `Your E-Challan ID:GJR-060822XXXXX3 fine is  integrated with your Electricity Bill.Total Amt:6243.78Rs `      
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      req.flash("success","Mail has been sent Successfully.");
      res.redirect("/integrated_pending")
});

app.get('/manual', (req, res) => {
    let sql = 'SELECT * FROM RTO where Status_Code=6 OR Status_Code=7 ';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? parseInt(req.query.page) : 1;
        console.log((req.query.page));
        console.log(numOfResults);
        console.log(numberOfPages);
        if(page > numberOfPages){
            res.redirect('/manual/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/manual/?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        //Get the relevant number of POSTS for this starting page
        sql = `SELECT * FROM RTO where Status_Code=6 OR Status_Code=7 LIMIT ${startingLimit},${resultsPerPage} `;
        connection.query(sql, (err, result)=>{
            if(err) throw err;
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;
            // }
            res.render('manualsearch', {data: result, page, iterator, endingLink, numberOfPages});
        });
    });
});

app.get('/search', (req, res) => {
    console.log("hi" + req.query.query + "ok");
    let sql = 'SELECT * FROM RTO where Challan_No ="'+req.query.query+'"';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? parseInt(req.query.page) : 1;
        console.log((req.query.page));
        console.log(numOfResults);
        console.log(numberOfPages);
        if(page > numberOfPages){
            res.redirect('/search/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/search/?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        //Get the relevant number of POSTS for this starting page
        sql = `SELECT * FROM RTO where  Challan_No ="${req.query.query}" LIMIT ${startingLimit},${resultsPerPage} `;
        connection.query(sql, (err, result)=>{
            if(err) throw err;
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;
            // }
            res.render('search', {data: result, page, iterator, endingLink, numberOfPages});
            
        });
        console.log("hi "+ req.query.id);
    });

});


app.get('/get_data', function(request, response, next){
    console.log("@");
    
    var draw = request.query.draw;
    var start = request.query.start;
    var length = request.query.length;
    var order_data = request.query.order;
    console.log((draw + start + length +order_data));
    if(typeof order_data == 'undefined')
    {
        var column_name = 'RTO1.Challan_No';

        var column_sort_order = 'desc';
    }
    else
    {
        var column_index = request.query.order[0]['column'];

        var column_name = request.query.columns[column_index]['data'];

        var column_sort_order = request.query.order[0]['dir'];
    }

    //search data

    var search_value = request.query.search['value'];

    var search_query = `
     AND (First_name LIKE '%${search_value}%' 
      OR Last_name LIKE '%${search_value}%' 
      OR Challan_No LIKE '%${search_value}%'
      OR Mobile_No LIKE '%${search_value}%'
      OR Vehicle_No LIKE '%${search_value}%'
      OR Address_Line1 LIKE '%${search_value}%'
      OR Address_Line2 LIKE '%${search_value}%'
      OR Pincode LIKE '%${search_value}%'
      OR Echallan_generated_date LIKE '%${search_value}%'
     )
    `;

    //Total number of records without filtering

    connection.query("SELECT COUNT(*) AS Total FROM RTO1", function(error, data){

        var total_records = data[0].Total;

        //Total number of records with filtering

        connection.query(`SELECT COUNT(*) AS Total FROM RTO1 WHERE 1 ${search_query}`, function(error, data){

            var total_records_with_filter = data[0].Total;

            var query = `
            SELECT * FROM RTO1 
            WHERE 1 ${search_query} 
            ORDER BY ${column_name} ${column_sort_order} 
            LIMIT ${start}, ${length}
            `;

            var data_arr = [];

            connection.query(query, function(error, data){

                data.forEach(function(row){
                    data_arr.push({
                        'First_name' : row.First_name,
                        'Last_Name' : row.Last_Name,
                        'Challan_No' : row.Challan_No,
                        'Mobile_No': row.Mobile_No,
                        'Vehicle_No' : row.Vehicle_No,
                        'Address_Line1':row.Address_Line1,
                        'Address_Line2':row.Address_Line2,
                        'Pincode':row.Pincode,
                        'Customerid':row.Customerid,
                        'Echallan_generated_date':row.Echallan_generated_date,
                    });
                });

                var output = {
                    'draw' : draw,
                    'iTotalRecords' : total_records,
                    'iTotalDisplayRecords' : total_records_with_filter,
                    'aaData' : data_arr
                };

                response.json(output);
                console.log(output);

            });

        });

    });

});


app.get('/detain', (req, res) => {
    let sql = 'SELECT * FROM RTO where Status_Code=5';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? parseInt(req.query.page) : 1;
        console.log((req.query.page));
        console.log(numOfResults);
        console.log(numberOfPages);
        if(page > numberOfPages){
            res.redirect('/search?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/search?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        //Get the relevant number of POSTS for this starting page
        sql = `SELECT * FROM RTO where Status_Code=5 LIMIT ${startingLimit},${resultsPerPage} `;
        connection.query(sql, (err, result)=>{
            if(err) throw err;
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;
            // }
            console.log(result)
            res.render('detain', {data: result, page, iterator, endingLink, numberOfPages});
            
        });
    });

});

app.get('/integrate1', (req, res) => {
    var str= 'UPDATE RTO SET  Status_Code=4 WHERE Challan_No="'+req.query.query+'" ';
    connection.query(str);
    let sql = 'SELECT * FROM RTO where Status_Code=4';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? parseInt(req.query.page) : 1;
        console.log((req.query.page));
        console.log(numOfResults);
        console.log(numberOfPages);
        if(page > numberOfPages){
            res.redirect('/search?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/search?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        //Get the relevant number of POSTS for this starting page
        sql = `SELECT * FROM RTO where Status_Code=4 LIMIT ${startingLimit},${resultsPerPage} `;
        connection.query(sql, (err, result)=>{
            if(err) throw err;
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;
            // }
            console.log(result)
            
            req.flash("success",str + " The value of the record has been effectively integrated with the electricity bill of Torrent Power.");
            res.redirect('/manual');
            
        });
    });

});

app.get('/detain1', (req, res) => {
    connection.query('UPDATE RTO SET Status_Code=5 WHERE Challan_No="'+req.query.query+'" ')
    let sql = 'SELECT * FROM RTO where Status_Code=5 ';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? parseInt(req.query.page) : 1;
        console.log((req.query.page));
        console.log(numOfResults);
        console.log(numberOfPages);
        if(page > numberOfPages){
            res.redirect('/search/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/search/?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        //Get the relevant number of POSTS for this starting page
        sql = `SELECT * FROM RTO where Status_Code=5 LIMIT ${startingLimit},${resultsPerPage} `;
        connection.query(sql, (err, result)=>{
            if(err) throw err;
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;
            // }
            req.flash("success","The record has been transferred to the section of unrecognized violators.");
            res.redirect('/manual');
            
        });
    });

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
// render the error page
  res.status(err.status || 500);
  res.render('error');
});

// forgot password
app.get("/forgot.html",function(req,res){
    res.sendFile(__dirname + "/HTML/forgot.html")
})
// Need Help
app.get("/helpdesk.html",function(req,res){
    res.sendFile(__dirname + "/HTML/helpdesk.html")
})

app.get("/HTML1",function(req,res){
    res.sendFile(__dirname + "/HTML/Home_Page.html")
})


// set app port 
app.listen(4500);
module.exports = app;
