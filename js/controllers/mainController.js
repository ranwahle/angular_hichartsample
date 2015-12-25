/**
 * Created by ranwahle on 8/8/15.
 */
(function (angular) {
    var _adDataService,  _dataChangedSubscribers = [],

        aggregatePlacements = function(records)
        {
          var result = null;
           records.forEach(function(record)
           {
               result = result || {};
              if (!result[record.tagid])
              {

                  result[record.tagid] = angular.copy(record);
              }
               else{
                  var placementData = result[record.tagid];
                  placementData.served += record.served;
                  placementData.inited += record.inited;
                  placementData.def += record.def;
              }
           });
            return result;
        },
        controller = function (adDatarvice) {
            _adDataService = adDatarvice;

        };



    controller.prototype.getData = function () {
        var self = this;
         self.submitted = false;
        self.submitting = true;
        self.error = false;
        _adDataService.getData({
                fromDate: this.fromDate,
                toDate: this.toDate,
                placementId: this.placementId,
                chain: this.chain
            }
        ).then(function (data) {
                self.records = data;
                self.error = false;
                self.placements = aggregatePlacements(data);
            },
            function(error)
            {
                self.error = true;
            }
        ).finally(function()
            {
                self.submitted = true;
                self.submitting = false;
            });
    };


    angular.module('hiChartsample').controller('mainController', [ 'adDatarvice', controller]);
}(window.angular))