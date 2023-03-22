var d;
 fetch("http://localhost:3001/json").then((res)=>{
    return res.text();

}).then((data)=>{
    d=data;
});
google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  setTimeout(()=>{
                      
    let arr=JSON.parse(d);
    console.log(typeof(arr),arr);
        let first=arr["pie_data"][2];
        let second=arr["pie_data"][4];
      
    
    var data = google.visualization.arrayToDataTable([
      ['data', 'Amount'],
      ['Integrated ',first],
      ['Unrecognized violators',second],
     
    ])
 var options = {
                    title: 'Integrated Vs Unrecognized violators',
                    pieHole: 0.5,
                    pieStartAngle:100,
                    width: 800,
                    height: 600,
                    titleColor:'Darkblue',
                    fontSize:15,
                    'backgroundColor': 'transparent',
                    
                    colors: ['darkblue', 'skyblue']
                  };
                 
  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data, options);
},200);
}