/**
 * Created by ranwahle on 8/8/15.
 */
(function (angular) {
    var  service = function ($http, $q) {
       var  self = this;

        this.getData = function (query) {
            var defer = $q.defer();
            var promise = $http({
                url: 'sample_data.json'
            }).success(function (data) {
                var result = data;

                //In here I use client filtering, however on real life I'll use
                //oData ot filter the data on the server side.
                result = result.filter(function (record) {
                    return (!query.fromDate || moment(record.time)._d >= query.fromDate)
                        && (!query.toDate || moment(record.time)._d <= query.toDate)
                        && (!query.placementId || record.tagid === query.placementId)
                        && (!query.chain || record.chain.indexOf( query.chain) >= 0)

                });

                defer.resolve(result);
            }).error(function(error)
            {
                defer.reject(error);
            });

            return defer.promise;
        };
    };
    angular.module('hiChartsample').service('adDatarvice', ['$http', '$q', service]);

}(window.angular));