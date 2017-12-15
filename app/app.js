var app = angular.module("pretenderApp", ["ngRoute"]);

app.config(function ($routeProvider){

  $routeProvider
      .when("/",
      {
        templateUrl: "./app/partials/home.html"
      })
      .when("/login",
      {
        controller: "loginController",
        templateUrl: "./app/partials/login.html"
      })
      .when("/registration",{
        controller: "registrationController",
        templateUrl: "./app/partials/registration.html"

      })
      .when("/loggedInUser",{
        controller: "userServiceController",
        templateUrl: "./app/partials/loggedInUser.html"
      })
      .when("/editUser",{
        controller: "editUserController",
        templateUrl: "./app/partials/editUser.html"
      })
      .when("/issueAnApplication",{
        controller: "applicationController",
        templateUrl: "./app/partials/issueAnApplication.html"
      })
      .otherwise({
          redirectTo: "/"
      });

});
