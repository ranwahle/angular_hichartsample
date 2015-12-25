/**
 * Created by ranwahle on 8/8/15.
 */
(function (angular) {

    var _chartOptions = {},
        isNewChartPoint = function(lastNode, record, chartOption)
    {
        //record.time  =new Date(record.time);
        var lastDate, recordDate = new moment(record.time)._d;
        if (!lastNode )
        {
            return true;
        }
        lastDate =  moment(lastNode.time)._d;
        if (chartOption === 'hourly')
        {
            return lastNode.time !== record.time;
        }
        if (chartOption === 'daily')
        {
            return lastDate.getDate() !== recordDate.getDate();
        }


    },
     sortByDate = function (data) {
        return data.sort(function(obj1, obj2){
            return obj1.time > obj2.time ? 1 :
                obj1.time === obj2.time ?  0 : -1;
        });
    },
        aggregate = function (data, chartOption) {
            var result = [],  lastObject;
            data = sortByDate(data);
            data.forEach(function(record)
            {
                if (isNewChartPoint(lastObject, record, chartOption))
                {
                    tempDate = record.time;
                    lastObject  = angular.copy( record);
                    result.push(lastObject);
                }
                else{
                    lastObject.served += record.served;
                    lastObject.inited += record.inited;
                    lastObject.def += record.def;
                }
            });
            return result;

        },
     setSeries = function (keys, names, chartData) {
            if (!names) {
                throw 'series names aren\'t defined';
            }

            if (!keys) {
                throw 'series keys aren\'t defined';
            }
            var series = [];
            names.forEach(function (name) {
                series.push({name: name, data: []});
            });
            for (var i = 0; i < keys.length; i++) {
                series[i].key = keys[i];
            }

            chartData.forEach(function (data) {
                series.forEach(function (serie) {
                    serie.data.push(data[serie.key]);
                })
            });

            return series;

        },

        getCategoriesByRecords = function(records)
        {
            var result = [], existenceFlag = {};

            records.forEach(function (record) {
                var time = record.time, timeAsDateTime = new Date(time);
                if (timeAsDateTime.getHours() === 0)
                {
                    time = timeAsDateTime.toDateString();
                }

                if (!existenceFlag[time]) {
                    existenceFlag[time] = true;
                    result.push(time)
                }
            });
            return result;
        }
        createChart = function (scope, element) {

            if (_chartOptions[scope.chartType])
            {
                $(element).highcharts(_chartOptions[scope.chartType]);
                return;
            }
            var aggregatedRecords = aggregate( scope.chartData, scope.chartType);
            if (!scope.chartData)
                return;

            var chartOptions = {
                chart: {
                    type: 'line'
                },
                title: {
                    text: scope.chartTitle
                },

                yAxis: {
                    title: {
                        text: 'Ads'
                    }
                },
                series: setSeries(scope.seriesKeys, scope.seriesNames, aggregatedRecords)
            };

            chartOptions.xAxis = {categories : getCategoriesByRecords(aggregatedRecords)};

            _chartOptions[scope.chartType] = chartOptions;
            $(element).highcharts(chartOptions);
        },
        directive = function () {
            return {
                scope: {
                    chartTitle: '=',
                     chartData: '=',
                    seriesNames: '=',
                    seriesKeys: '=',
                    chartType: '=',
                    reportPeriod: '=',
                    dataChanged: '&'

                },
                link: function (scope, element) {
                    scope.$watch(function () {
                        return scope.chartData;

                    }, function (chartData) {
                        _chartOptions = {}; //reset
                        createChart(scope, element);
                    });

                    scope.$watch(function(chartType) {return scope.chartType},
                    function(){createChart(scope, element)});
                }
            }
        };

    angular.module('hiChartsample').directive('chartDirective', [directive]);

}(window.angular));