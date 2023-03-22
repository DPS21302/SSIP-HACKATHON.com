google.charts.load('current', {'packages':['controls']});
google.charts.setOnLoadCallback(drawDashboard);

function drawDashboard() {
  var data = google.visualization.arrayToDataTable([
    ['Year', 'RTO REVENUE', 'TORRENT REVENUE'],
    ['2020', 354789, 121500],
    ['2021',425850 ,75150 ],
    ['2022', 372618,150300 ]
   
    
  ]);

  var dashboard = new google.visualization.Dashboard(
    document.getElementById('dashboard_div'));

  var categoryPicker = new google.visualization.ControlWrapper({
    'controlType': 'CategoryFilter',
    'containerId': 'filter_div',
    'options': {
      'filterColumnIndex': 0,
      'ui': {
        'labelStacking': 'vertical',
        'allowTyping': false,
        'allowMultiple': false
      }
    }
  });

  var chart = new google.visualization.ChartWrapper({
    'chartType': 'BarChart',
    'containerId': 'chart_div',
    'options': {
      'width': 800,
      'height': 300,
      'legend': 'top'
    }
  });

  dashboard.bind(categoryPicker, chart);
  dashboard.draw(data);
}