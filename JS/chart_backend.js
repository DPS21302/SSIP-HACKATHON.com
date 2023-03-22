var mysql = require('mysql');
var path = require('path');
var express = require('express');
const { dirname } = require('path');
const cors=require('cors');
var con = require('../database')
const app=express();
app.use(cors());

  let total_genreted=0;
  let total_paid=0;
  let total_intigrated=0;
  let pending=0;
  let FTI=0;
  let overspeeding=0;
  let rwh=0;
  let dwl=0;
  let sj=0;
  let dwi=0;
  let rto=0;
  let Torrent=0;
  //connect database 
 
     
    //to find num of generated  e-challan
    //write query for select all row in e-challan generated table
    con.query("SELECT * FROM RTO", function (err, result, fields) {
      if (err) throw err;
      total_genreted=result.length;
      
    });
  
    //to find num of paid challan
    //write query to select all row where paid =yes but not intigrated
    con.query("SELECT * FROM RTO where Status_Code=1 OR Status_Code=2" , function (err, result, fields) {
      if (err) throw err;
      total_paid=result.length;
    });
  
    //to find num of intigrated challan
    //write a query to select all row where challan is paid but intigrated=yes
    con.query("SELECT * FROM RTO where Status_Code=2 OR Status_Code=4", function (err, result, fields) {
      if (err) throw err;
      total_intigrated=result.length;
     
    });
    con.query("SELECT * FROM RTO where Rulebreak='overspeeding'", function (err, result, fields) {
      if (err) throw err;
      overspeeding=result.length;
     
    });
    con.query("SELECT * FROM RTO where Rulebreak='Riding without helmet'", function (err, result, fields) {
      if (err) throw err;
      rwh=result.length;
     
    });
    con.query("SELECT * FROM RTO where Rulebreak='Driving without license'", function (err, result, fields) {
      if (err) throw err;
      dwl=result.length;
     
    });
    con.query("SELECT * FROM RTO where Rulebreak='Signal jumping'", function (err, result, fields) {
      if (err) throw err;
      sj=result.length;
     
    });
    con.query("SELECT * FROM RTO where Rulebreak='Driving without insurance'", function (err, result, fields) {
      if (err) throw err;
      dwi=result.length;
     
    });
  
  
    //to find pending challan details
    //write Query for select all row where payment is pending 
    con.query("SELECT * FROM RTO where Status_Code=3 OR Status_Code=4", function (err, result, fields) {
      if (err) throw err;
      pending=result.length;   
    });
    con.query("SELECT * FROM RTO where Status_Code=6 OR Status_Code=7", function (err, result, fields) {
      if (err) throw err;
      FTI=result.length;   
    });
  const totalamount=501000;
  
  
  setTimeout(() => {
    //total_paid-=total_intigrated;
    //pending=total_genreted-total_paid-total_intigrated;

    let x=(total_paid*100)/total_genreted;
    let y=(pending*100)/total_genreted;
    let z=(total_intigrated*100)/total_genreted;
    let p=(FTI*100)/total_genreted;
    x=parseFloat(x.toFixed(2));
    y=parseFloat(y.toFixed(2));
    z=parseFloat(z.toFixed(2));
    p=parseFloat(p.toFixed(2));
    total=overspeeding+rwh+dwi+dwl+sj;
    overspeeding=(overspeeding*100)/total;
    rwh=(rwh*100)/total;
    dwi=(dwi*100)/total;
    dwl=(dwl*100)/total;
    sj=(sj*100)/total;
    overspeeding=parseFloat(overspeeding.toFixed(2));
    rwh=parseFloat(rwh.toFixed(2));
    dwi=parseFloat(dwi.toFixed(2));
    dwl=parseFloat(dwl.toFixed(2));
    sj=parseFloat(sj.toFixed(2));
    rto=totalamount-(totalamount*(15/100));
    Torrent=totalamount*(15/100);
   const o={
    pie_data:[total_genreted,x,y,z,p],
    other_chart:[total_genreted,total_paid,total_intigrated,pending,FTI]
   }
  
    app.get("/json",(req,res)=>{
      res.json({
        pie_data:[total_genreted,x,y,z,p],
        other_chart:[total_genreted,total_paid,total_intigrated,pending,FTI],
        rulebreak:[overspeeding,rwh,dwi,dwl,sj],
        amount:[rto,Torrent]
      });
    })
   
    app.listen(3001,(err)=>{
      if(err)
        console.log("error");
        
     console.log("go to port 3001:");
    })
    module.exports=o;
 
   
      
   
  },100);
 

    
  
  
