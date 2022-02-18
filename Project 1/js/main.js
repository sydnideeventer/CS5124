let data;
let aqiData = [];
let airData = [];
let missData = [];

d3.csv('data/data.csv')
  .then(_data => {
        console.log('Data loading complete. Work with dataset.');
        data = _data;
        
        data.forEach(d => {
            d.MaxAQI = +d.MaxAQI;
            d.Percentile90thAQI = +d.Percentile90thAQI;
            d.MedianAQI = +d.MedianAQI;

            d.DaysCO = +d.DaysCO;
            d.DaysNO2 = +d.DaysNO2;
            d.DaysOzone = +d.DaysOzone;
            d.DaysSO2 = +d.DaysSO2;
            d.DaysPM2 = +d.DaysPM2;
            d.DaysPM10 = +d.DaysPM10;
        });

        data.filter(d => d.State == "Ohio").filter( d => d.County == "Hamilton").forEach(
            d => {

                aqiData.push({'year': d.Year, 'value': d.MaxAQI, 'class': "maxAQI" });
                aqiData.push({'year': d.Year, 'value': d.Percentile90thAQI, 'class': "percentileAQI" });
                aqiData.push({'year': d.Year, 'value': d.MedianAQI, 'class': "medianAQI" });

                airData.push({'year': d.Year, 'value': (d.DaysCO / d.DayswithAQI) * 100, 'class': "daysCO"});
                airData.push({'year': d.Year, 'value': (d.DaysNO2 / d.DayswithAQI) * 100, 'class': "daysNO2"});
                airData.push({'year': d.Year, 'value': (d.DaysOzone / d.DayswithAQI) * 100, 'class': "daysOzone"});
                airData.push({'year': d.Year, 'value': (d.DaysSO2 / d.DayswithAQI) * 100, 'class': "daysPM2_5"});
                airData.push({'year': d.Year, 'value': (d.DaysPM2 / d.DayswithAQI) * 100, 'class': "daysPM10"});
                airData.push({'year': d.Year, 'value': (d.DaysPM10 / d.DayswithAQI) * 100, 'class': "daysSO2"});

                missData.push({'year': d.Year, 'value': 366 - d.DayswithAQI})

            }
        )

        var legend1 = ["Max AQI", "90th Percentile AQI", "Median AQI"];
        var colors1 = ["#520b52", "#d2504c", "#f5d245"];

        let AQILineChart = new LineChart({
            'parentElement': '#lineChart', 
            'containerHeight': 400, 
            'containerWidth': 700,
            }, aqiData, "#lineChartLegend", legend1, colors1);

        var legend2 = ["CO", "NO2", "Ozone", "SO2", "PM2.5", "PM10"];
        var colors2 = ["#41C8FC", "#8E4BFD", "#4db391", "#ff6397", "#FFA13B", "#FFEE3B"];

        let AirLineChart = new LineChart({
            'parentElement': '#airLineChart', 
            'containerHeight': 400, 
            'containerWidth': 700,
            }, airData, "#airLineChartLegend", legend2, colors2);

        let DaysMissedChart = new BarChart({
            'parentElement': "#missBarChart",
            'containerHeight': 400, 
            'containerWidth': 1200,
        }, missData);

        airQualityData = [{'value': (162/304) * 100, 'year': "Good"},
                          {'value': (137/304) * 100, 'year': "Moderate"},
                          {'value': (5/304) * 100, 'year': "UnHealthy for Sensitive Groups"},
                          {'value': 0, 'year': "Unhealthy"},
                          {'value': 0, 'year': "Very Unhealthy"},
                          {'value': 0, 'year': "Hazardous"}];

        let AirQualityChart = new BarChart({
            'parentElement': "#airQualityChart",
            'containerHeight': 400, 
            'containerWidth': 1200,
        }, airQualityData);

        pollutantData = [{'value': 0, 'year': "CO"},
                         {'value': (9/304)*100, 'year': "NO2"},
                         {'value': (137/304)*100, 'year': "Ozone"},
                         {'value': (3/304)*100, 'year': "SO2"},
                         {'value': (155/304)*100, 'year': "PM2.5"},
                         {'value': 0, 'year': "PM10"}];

        let PollutantChart = new BarChart({
            'parentElement': "#pollutantChart",
            'containerHeight': 400, 
            'containerWidth': 700,
        }, pollutantData);


})
.catch(error => {
    console.error('Error loading the data');
});