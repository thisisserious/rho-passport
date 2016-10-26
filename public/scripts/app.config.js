// routing
angular.module('passportApp').config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider.when('/home', {
    templateUrl: 'views/home.html',
    // controller: 'HomeController as home'
  }).otherwise({
    templateUrl: 'views/login.html',
    controller: 'LoginController as login'
  });
});
