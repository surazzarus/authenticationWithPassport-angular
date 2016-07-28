app.controller('registerCtrl', function($scope, $http, $rootScope){
   $scope.register = function(user){
      console.log(user);
      // Verify if passwords are the same
      if(user.password == user.password2){ // post data only if both passwords match
          $http.post('/register', user).success(function(user){
              $rootScope.currentUser = user;
              console.log(user);
          }) ;
      }
   } ;
});