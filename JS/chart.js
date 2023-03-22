var d;
 fetch("http://localhost:3001/json").then((res)=>{
    return res.text();

}).then((data)=>{
    d=data;
});
                google.charts.load("current", {packages:["corechart"]});
                google.charts.setOnLoadCallback(drawChart);
                function drawChart() {
                  let arr=JSON.parse(d);
                  console.log(typeof(arr),arr);
                      let rto=arr["amount"][0];
                      let torrant=arr["amount"][1];
                  var data = google.visualization.arrayToDataTable([
                    ['RUPESS', 'Amount'],
                    ['RTO AMOUNT',     rto],
                    ['Torrent AMOUNT',      torrant]
                  ]);
          
                  var options = {
                    
                    title: 'Revenue: RTO VS Torrent',
                    pieHole: 0.5,
                    width: 800,
                    height: 600,
                    'backgroundColor': 'transparent',
                    titleColor:'Darkblue',
                    titleSize:20 ,
                    fontSize:15,
                    colors: ['darkblue', 'skyblue']
                  };
                 
          
                  var chart = new google.visualization.PieChart(document.getElementById('donutchart1'));
                  chart.draw(data, options);
                }
                
    