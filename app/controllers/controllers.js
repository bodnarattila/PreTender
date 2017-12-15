app.controller("pretenderMainController", function($rootScope, $scope, $http, $location){

  init();

  function init(){
    $rootScope.newUser = {};
    $rootScope.user = undefined;
    $rootScope.successfulLogin = false;
    console.log("MainController started...");
  }

  $scope.logout = function(){

    console.log($rootScope.user.username + ' is logging out!');
    $rootScope.user = {};
    $rootScope.newUser = {};
    $rootScope.successfulLogin = false;
    $location.path("/");

  };


});


app.controller("registrationController", function($rootScope, $scope, $http, $location){

  	console.log("registrationController started...");
    $scope.regFailed = false;

  	$scope.reg = function() {

	     console.log($rootScope.newUser.username);
	     console.log($rootScope.newUser.password);
	     console.log($rootScope.newUser.email);

	      var regUserData = {
		        "username" : $rootScope.newUser.username,
		        "password" : $rootScope.newUser.password,
		        "email" : $rootScope.newUser.email
	      };
	     console.log(regUserData);

	     $http.post("http://localhost:9030/reguser", regUserData)
	     .then(

      		function(response){
      			console.log("response:");
      			console.log(angular.copy(response.data));
      			if(response.data.n == 1){
      				$rootScope.user = $rootScope.newUser;
      				$rootScope.newUser = undefined;
      				$rootScope.successfulLogin = true;
              $scope.regFailed = false;
      				$location.path("/loggedInUser");
      			} else {

      				$rootScope.successfulLogin = false;
              $rootScope.user = undefined;
              $scope.regFailed = true;
      				console.log("username taken");
      			}

      		}

      	)
      	.catch(console.error);

      };

});


app.controller("loginController", function($rootScope, $scope, $http, $location){

  console.log("loginController started...");

  $scope.login = function() {

    $scope.loginRes = {};
    $scope.loginFailed = false;
    console.log("http://localhost:9031/login/" + $rootScope.newUser.username + "/" + $rootScope.newUser.password);

    $http.post("http://localhost:9031/login/" + $rootScope.newUser.username + "/" + $rootScope.newUser.password)
    .then(
      function(response){
        console.log("login response header:");
        console.log(response.header);
        $rootScope.successfulLogin = true;
        $rootScope.user = $rootScope.newUser;
        $scope.loginFailed = false;
        $scope.loginRes = angular.copy(response.data);

        console.log("Login successful, retrieving user data: ");
        console.log("http://localhost:9002/user/" + $rootScope.newUser.username);
        $http.get("http://localhost:9002/user/" + $rootScope.newUser.username)
        .then(
          function(userInfoResponse){
            console.log(userInfoResponse.data);
            $rootScope.user = userInfoResponse.data;
          }
        )
        .catch(console.error);



        $location.path("/loggedInUser");
      }
    )
    .catch(
      function(err_response){
        $scope.loginRes = err_response.data;
        $rootScope.successfulLogin = false;
        $scope.loginFailed = true;

        console.log($rootScope.successfulLogin);
        console.log("in catch branch: " + $scope.loginFailed);
      }
    );

  };


});

app.controller("editUserController", function($rootScope, $scope, $http, $location){

  console.log("editUserController started....");
  console.log($rootScope.user['_id']);
  console.log("ObjectId("+ $rootScope.user['_id'] + ")");
  /*console.log("Authentication started...");

  $http.get("http://localhost:9032/auth/")
  .then(
    function(response){
      console.log(response.data);
    }
  )
  .catch(
    function(err_response){
      console.log(err_response.data);
      $location.path("/");
    }
  );*/

  $scope.submitEditUser = function(){

    var editedUserData = {
      "username" : $rootScope.newUser.username,
      "password" : $rootScope.newUser.password,
      "role" : $rootScope.user.role,
      "profile" : {
        "firstname" : $rootScope.newUser.profile.firstname,
        "lastname" : $rootScope.newUser.profile.lastname,
        "birth date" : $rootScope.newUser.profile['birth date'],
        "place of birth" : $rootScope.newUser.profile['place of birth'],
        "nationality" : $rootScope.newUser.profile.nationality,
        "email" : $rootScope.newUser.profile.email,
        "address" : {
          "postcode" : $rootScope.newUser.profile.address.postcode,
          "country" : $rootScope.newUser.profile.address.country,
          "city" : $rootScope.newUser.profile.address.city,
          "street" : $rootScope.newUser.profile.address.street,
          "house number" : $rootScope.newUser.profile.address['house number'],
          "state" : $rootScope.newUser.profile.address.state
        }
      },
      "tenders" : $rootScope.user.tenders
    };

    console.log("editedUserData: ");
    console.log(editedUserData);

    $http.post('http://localhost:9002/user/' + $rootScope.user.username, editedUserData)
    .then(
      function(response){
        console.log(response.data);
        if(response.status == 200){
          alert("Successfully completed edit! Relog to see updated user data!");
          $location.path("/loggedInUser");
        }
      }
    )
    .catch(console.error);

  }

});


app.controller("userServiceController", function($rootScope, $scope, $http, $location){

  console.log("userServiceController started...");
  $scope.listIssuedTendersAsked = false;
  $scope.listUserApplicationsAsked = false;
  $scope.listTenderTypes = false;
  $scope.issueAnApplicationAsked = false;


  $scope.listIssuedTenders = function(){
    console.log("listing issued tenders...");
    $scope.listIssuedTendersAsked = true;

    $http.get('http://localhost:9004/issuedtender')
    .then(
      function(response){
          if(response.status == 200){
            console.log("successful retrieval of issued tenders!");
            console.log(response);
            $scope.issuedTenders = response.data;
          }
      }
    )
    .catch(console.error);

  }

  $scope.closeIssuedTenders = function(){
    $scope.listIssuedTendersAsked = false;
  }

  $scope.listUserApplications = function(){
    $scope.listUserApplicationsAsked = true;

    var usersApplications = $rootScope.user.tenders;
    $scope.usersApplicationsArray = [];

    $http.get('http://localhost:9005/application')
    .then(
      function(response){
        if(response.status == 200){
          console.log("successful retrieval of user's applications!");
          console.log(response);
          $scope.allApplications = response.data;

          for(var i = 0; i < usersApplications.length; i++){
            for(var j = 0; j < $scope.allApplications.length; j++){
              if(usersApplications[i] == $scope.allApplications[j]['_id']){
                $scope.usersApplicationsArray.push($scope.allApplications[j]);
                break;
              }
            }
          }
        }
      }
    )
    .catch(console.error);
  }

  $scope.closeUserApplications = function(){
    $scope.listUserApplicationsAsked = false;
  }

  $scope.listTenderTypes = function(){
    $scope.listTenderTypesAsked = true;

    $http.get('http://localhost:9003/tendertype')
    .then(
      function(response){
        if(response.status == 200){
          console.log("successful retrieval of tender types!");
          console.log(response);
          $scope.allTenderTypes = response.data;
          console.log($scope.allTenderTypes);
        }
      }
    )
    .catch(console.error);
  }

  $scope.closeTenderTypes = function(){
    $scope.listTenderTypesAsked = false;
  }

  $scope.issueAnApplication = function(){
    $location.path("/issueAnApplication");
  }
});

app.controller("applicationController", function($rootScope, $scope, $http, $location){

  console.log("applicationController started...");
  $scope.newApplication = {};
  var application = {};

  $scope.submitApplication = function(){

    console.log("creating new application");
    application = {
      "referenceID" : 30004,
      "tendertype" : 3,
      "user" : $rootScope.user.username,
      "lastedited" : Date.now(),
      "finilized" : 0,
      "data" : {
        "firstname" : $scope.newApplication.firstname,
        "lastname" : $scope.newApplication.lastname,
        "description" : $scope.newApplication.description
      }
    };

    var application2 = {
      "username" : $rootScope.user.username,
      "issuedtenderid" : 30004
    }

    var url = 'http://localhost:9033/applytender/' + application.user + "/" + String(application.referenceID);
    console.log(url);

    $http.post(url, application2)
    .then(
      function(response){
        if(response.status == 200){
            console.log(response);
        }
      }
    )
    .catch(console.error);

  }


});
