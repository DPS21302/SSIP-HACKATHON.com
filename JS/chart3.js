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
                        let first=arr["pie_data"][1];
                        let second=arr["pie_data"][2];
                      
                    
                    var data = google.visualization.arrayToDataTable([
                      ['data', 'Amount'],
                      ['paid',first],
                      ['pending',second],
                     
                    ])
                  var options = {
                    title: 'Paid vs Pending',
                    pieHole: 0.5,
                    width: 800,
                    height: 600,
                    titleColor:'Darkblue',
                    fontSize:15,
                    'backgroundColor': 'transparent',
                    
                    colors: ['darkblue', 'skyblue']
                  };
                 
          
                  var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
                  chart.draw(data, options);
                },200);
                }
                
    