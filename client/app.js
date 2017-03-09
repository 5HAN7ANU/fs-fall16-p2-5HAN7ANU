angular.module('Blog', ['ngRoute', 'ngResource', 'Blog.factories', 'Blog.services', 'Blog.directives', 'Blog.controllers'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $routeProvider
    .when('/', {
        templateUrl: 'views/welcome.html',
        controller: 'WelcomeController'
    })
    .when('/donate', {
        templateUrl: 'views/donate.html',
        controller: 'DonationController'
    })
    .when('/contact', {
        templateUrl: 'views/contactus.html',
        controller: 'ContactUsController'
    })
    .when('/compose', {
        templateUrl: 'views/compose.html',
        controller: 'ComposeController'
    })
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
    })
    .when('/logout', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
    })
    .when('/users/create', {
        templateUrl: 'views/createuser.html',
        controller: 'CreateUserController'
    })
    .when('/users', {
        templateUrl: 'views/userslist.html',
        controller: 'UserListController'
    })
    .when('/users/:id/update', {
        templateUrl: 'views/update_user.html',
        controller: 'UpdateUserController'
    })
    .when('/:id/update', {
        templateUrl: 'views/update_post.html',
        controller: 'UpdatePostController'
    })
    .when('/:id', {
        templateUrl: 'views/single_post.html',
        controller: 'SinglePostController'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);