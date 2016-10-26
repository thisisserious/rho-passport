angular.module('passportApp')
.controller('RegisterController', RegisterController);

function RegisterController($http, $location) {
  console.log('RegisterController loaded');
  var ctrl = this;

  ctrl.register = function() {
    console.log('registering new user');
    $http.post('/register', {
      username: ctrl.username, // these are available b/c of ng-model on register.html
      password: ctrl.password
    }).then(function() {
      $location.path('/home');
    }, function(error) {
      console.log('error registering', error);
    });
  };
}
