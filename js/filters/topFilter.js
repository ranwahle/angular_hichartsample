/**
 * Created by ranwahle on 8/8/15.
 */
(function(angular)
{

    var objectToArray = function(obj)
    {
        if (!obj)
            return;

      var result = [];
        for (var key in obj)
        {
            if (obj.hasOwnProperty(key))
                result.push(obj[key]);
        }
        return result;
    },
        filter = function()
    {

      return function(array, limit)
      {
          if (!array)
          {
              return;
          }
          if (!array.isPrototypeOf(Array))
          {
              array = objectToArray(array);
          }
          return array.slice(0, limit);
      }
    };
    angular.module('hiChartsample').filter('top', [filter]);
}(window.angular));