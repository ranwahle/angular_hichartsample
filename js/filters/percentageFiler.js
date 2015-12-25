/**
 * Created by ranwahle on 8/9/15.
 */
(function(angular)
{
 var  filter = function()
 {
     return function(number, total) {
         return (Math.round( parseInt( number) / parseInt( total) * 100)) + '%';
     };


 };
    angular.module('hiChartsample').filter('percentage',[filter]);
}(window.angular));