/**
 * Created by ranwahle on 8/8/15.
 */


(function(angular)
{
    var module = angular.module('hiChartsample',[]);

    angular.element(document).ready(function()
    {
       angular.bootstrap(document,['hiChartsample']);
    });
    return module;
}(window.angular));
