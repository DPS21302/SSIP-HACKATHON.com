google.charts.load('current', {'packages':['controls']});
google.charts.setOnLoadCallback(drawDashboard);

function drawDashboard() {
  var data = google.visualization.arrayToDataTable([
    ['YEAR-2022', 'RTO REVENUE', 'TORRENT REVENUE'],
    ['JAN', 28686,8604],
    ['FEB', 30415,9124],
    ['MAR',40512,12152],
    ['APR', 28858, 8658],
    ['MAY', 31015, 9314],
    ['JUN', 29015, 8704],
    ['JUL', 28600, 8580],
    ['AUG', 25000, 7500],
    ['SEP', 31015, 9314],
    ['OCT', 28702, 8610],
    ['NAV', 30615, 9184],
    ['DEC', 40115, 12034]
  ]);
  



  var dashboard = new google.visualization.Dashboard(
    document.getElementById('dashboard_div1'));

  var categoryPicker = new google.visualization.ControlWrapper({
    'controlType': 'CategoryFilter',
    'containerId': 'filter_div1',
    'options': {
      'filterColumnIndex': 0,
      'ui': {
        'labelStacking': 'vertical',
        'allowTyping': false,
        'allowMultiple': true,
      }
    }
  });

  var chart = new google.visualization.ChartWrapper({
    'chartType': 'BarChart',
    'containerId': 'columnchart_material',
    'options': {
      'width': 800,
      'height': 600,
      'legend': 'top',
    ' fontSize':20,
   
    }
  });

  dashboard.bind(categoryPicker, chart);
  dashboard.draw(data);
  
}