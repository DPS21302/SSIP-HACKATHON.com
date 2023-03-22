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
    let overspeeding=arr["rulebreak"][0];
    let rwh=arr["rulebreak"][1];
    let dwl=arr["rulebreak"][3];
    let sj=arr["rulebreak"][4];
    let dwi=arr["rulebreak"][2];
    console.log(overspeeding);
    console.log(rwh);
    console.log(sj);
    
  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Riding without helmet',     rwh],
    ['Driving without license',      dwl],
    ['Signal jumping',  sj],
    ['Overspeeding', overspeeding],
    ['Driving without insurance',    dwi]
  ]);

  var options = {
    title: 'Rulebreak',
    pieHole: 0.5,
    width: 800,
    titleColor:'Darkblue',
     titlesize:15,
    'backgroundColor': 'transparent',
    height: 600,
    
    colors: ['darkblue','skyblue','#4B9CD3', '#0039a6','#0047AB']
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
  chart.draw(data, options);
},200);
}