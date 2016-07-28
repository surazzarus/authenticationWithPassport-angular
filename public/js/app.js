var app = angular.module('passport', ['ngRoute']);

app.config(function($routeProvider, $locationProvider){
   $routeProvider
       .when('/home', {
          templateUrl: '../views/home.html'
       })
       .when('/profile', {
          templateUrl: '../views/profile.html',
           controller: 'profileCtrl',
           resolve: { // allow only the authorized user to see their profile
               logincheck: checkLoggedin
           }
       })
       .when('/register', {
           templateUrl: '../views/register.html',
           controller: 'registerCtrl'
       })
       .when('/login', {
           templateUrl: '../views/login.html',
           controller: 'loginCtrl'
       })
       .when('/logout', {
           templateUrl: '../views/logout.html'
       })
       .otherwise({
           redirectTo: '/home'
       });
    $locationProvider.html5Mode(true);
});

// Allow only the logged in user to see the profile
var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
    var deferred = $q.defer();

    $http.get('/loggedin').success(function(user){
       $rootScope.errorMessage = null;
       // User is Authenticated
       if(user !== '0'){
           $rootScope.currentUser = user;
           deferred.resolve();
       }
       // User is Not Authenticated
       else{
           $rootScope.errorMessage = "You need to log in.";
           deferred.reject();
           $location.url('/login');
       }
    });
    return deferred.promise;
};

// logout
app.controller('navCtrl', function($rootScope, $scope, $http, $location){
    $scope.logout = function(){
        $http.post('/logout').success(function(){
            $rootScope.currentUser = null; // remove the current user after logout
            $location.url('/home');
        });
    }
});