/**
 * Created by Thomas on 5/28/2015.
 */
angular.module('groceryListApp', ['ngRoute'])
.config(function($routeProvider){
    $routeProvider.
    when('/',{
        templateUrl:'view/grocerylist.html',
        controller:'GroceryListItemsController'
    }).
    when('/addItem',{
        templateUrl:'view/additem.html',
        controller:'GroceryItemsController'
    }).
    when('/addItem/edit/:id',{
        templateUrl:'view/additem.html',
        controller:'GroceryItemsController'
    }).
    otherwise({
        redirectTo:'/'
    })
})
.factory("GroceryService",function($http){
    var groceryItems = [];
    $http.get("data/grocery_item.json").success((res)=>{
        groceryItems = res;
        
        groceryItems.map(function(element){
            element.date = new Date(element.date);
        })
    }).error((data,status)=>{
        data    });
    
    var service = {};
    service.getGroceryItems = function(){
        return groceryItems;
    }

    service.addGroceryItem = function(item){
        item.id = service.getNewId()
        item.date = new Date()
        item.completed = false
        groceryItems.push(item);
    }

    service.getNewId = function(){
        if(service.newId){
            service.newId++;
            return service.newId;
        } else {
            var maxElement = _.max(groceryItems,(element) => element.id)

            service.newId = maxElement.id + 1;
            return service.newId;
        }
    }

    service.findById = function(id){
        var item = {};
        groceryItems.forEach(element=>{
            if(element.id == id){
                item = element;
            }
        });

        return item;
    }

    service.editGroceryItem = function(item,id){
        groceryItems.forEach((element, index)=>{
            if(element.id == id){
                element.date = new Date()
                element.completed = false
                element.itemName = item.itemName
                //groceryItems[index] = element;
            }
        });
    }

    service.removeItem = function(item){
        var index = groceryItems.indexOf(item);

        groceryItems.splice(index,1);
    }


    return service;
})
.controller("HomeController", ["$scope", function($scope) {
    $scope.appTitle = "Grocery List";
}])
.controller("GroceryListItemsController", ["$scope", "GroceryService", function($scope, GroceryService){
    $scope.groceryItems = GroceryService.getGroceryItems()


    $scope.removeItem = function(item){
        GroceryService.removeItem(item);
    }

    $scope.toggleComplete = function(item){
        if(item.completed){
            item.completed = false;
        } else {
            item.completed = true;
        }
    }

    $scope.$watch(function(){return GroceryService.getGroceryItems();},function(groceryItems){$scope.groceryItems = groceryItems})

}])
.controller("GroceryItemsController",["$scope","GroceryService" ,"$location", "$routeParams",function($scope,GroceryService, $location,$routeParams){
    
    if($routeParams.id){
        var id = parseInt($routeParams.id);

        $scope.item = _.clone(GroceryService.findById(id));
        $scope.title = "Edit Item Below";

        $scope.add = function(){
            GroceryService.editGroceryItem($scope.item, id)
            $location.path('/')
        }    
    } else {
        $scope.item = {};
        $scope.title = "Add Item Below";
        
        $scope.add = function(){
            GroceryService.addGroceryItem($scope.item)
            $location.path('/')
        }
    }
 
}])
.directive("dgsGroceryItem",function(){
    return {
        restrict : "E",
        templateUrl:"view/groceryitem.html"
    }
})
