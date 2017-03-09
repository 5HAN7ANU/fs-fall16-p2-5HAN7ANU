angular.module('Blog.controllers', [])
.controller('WelcomeController', ['$scope', '$route', '$routeParams', '$location', 'Post', 'UserService', 'SEOService', function($scope, $route, $routeParams, $location, Post, UserService, SEOService){
    $scope.loggedInUser;
    $scope.posts = Post.query();
    console.log($scope.posts);

    SEOService.setSEO({
        title: 'NG-BLOG By Shantanu Sahai | Home',
        description: 'This is a blogsite created by Shantanu Sahai in the fall of 2016',
        image: 'http://' + $location.host() + '/images/blog.jpg',
        url: $location.absUrl()
    });
    
    if(UserService.isLoggedIn()){
        console.log('controllers.js/WelcomeController: There is a user logged in');
        console.log('controllers.js/WelcomeController: The logged in user is ' + UserService.user.firstname);
        $scope.loggedInUser = 'The logged in user is: ' + UserService.user.firstname + ' ' + UserService.user.lastname + ', who is a ' + UserService.user.role;
        $('.login-button').hide();
        $('.compose-button').show();
        $('.logout-button').show();
        if(UserService.isAdmin()){
            $('.view_users-button').show();
        }else{
            $('.view_users-button').hide();
        }
    }else{
        $('.login-button').show();
        $('.compose-button').hide();
        $('.logout-button').hide();
        $('.view_users-button').hide();
    } 

    $scope.loginPage = function(){
        $location.path('/login');
    };

    $scope.composePage = function(){
        $location.path('/compose');
    };

    $scope.logoutPage = function(){
        UserService.logout().then(function(){
            console.log('logged out!');
            $route.reload();
        });
        alert('You have been logged out!');
    };
}])
.controller('SinglePostController', ['$scope', '$routeParams', 'Post', 'UserService', function($scope, $routeParams, Post, UserService){
    $scope.featuredPost = Post.get({ id: $routeParams.id }, function(){
        $('.edit-button').hide();
        $('.delete-button').hide();
        authenticate();
    });
    console.log($scope.featuredPost);

    var authenticate = function(){
        if(UserService.isLoggedIn()){
            console.log('controllers.js/WelcomeController: The userid of the author is: ' + $scope.featuredPost.userid);
            console.log('controllers.js/WelcomeController: There is a user logged in');
            console.log('controllers.js/WelcomeController: The logged in user is ' + UserService.user.firstname);
            $scope.loggedInUser = 'The logged in user is: ' + UserService.user.firstname + ' ' + UserService.user.lastname + ', who is a ' + UserService.user.role;

            if(UserService.isPostOwner($scope.featuredPost.userid)){
                $('.edit-button').show();
                $('.delete-button').hide();
            }

            if(UserService.isAdmin()){
                $('.edit-button').show();
                $('.delete-button').show();
            }
        }else{
                $('.edit-button').hide();
                $('.delete-button').hide();
            }
    }

    $scope.deletePost = function(){
        var deletePost = confirm('Are you sure you want to delete this post?');

        if(deletePost){
            $scope.featuredPost.$delete();
            location.pathname = '/';
        };
    };
}])
.controller('ComposeController', ['$scope', 'Post', 'Category', 'User', 'UserService', function($scope, Post, Category, User, UserService){
    UserService.requireLogin();
    UserService.me()
    .then(function(me) {
        console.log('got me!');
        console.log(me);
        $scope.me = me;
        console.log('my id is: ' + me.id);

        if(!UserService.isAdmin()){
            $scope.newPostUserId = me.id;
            $('#user-box').hide();
            $('#author_label').show();
            $('.authorname').show();
        }else{
            $('#user-box').show();
            $('#author_label').hide();
            $('.authorname').hide();
        }

        $scope.savePost = function(){
            console.log('save button clicked!');
            console.log($scope);
            var postData = {
                title: $scope.newPostTitle,
                content: $scope.newPostContent,
                categoryid: $scope.newPostCategoryId,
                userid: $scope.newPostUserId
            }
            var post = new Post(postData);
            post.$save();
            location.pathname = '/';
        };
    });

    $scope.loggedInUser = 'The logged in user is: ' + UserService.user.firstname + ' ' + UserService.user.lastname + ', who is a ' + UserService.user.role;

    $scope.categories = Category.query();
    $scope.users = User.query();
}])
.controller('ContactUsController', ['$scope', 'Contact', function($scope, Contact){
    $scope.fromAddress;
    $scope.subject;
    $scope.body;

    $scope.contactus = function(){
        console.log($scope);
        var contactEmail = {
            fromAddress: $scope.fromAddress,
            subject: $scope.subject,
            body: $scope.body
        }
        var email = new Contact(contactEmail);
        email.$save();
        console.log('controllers.js: Email sent!');
        alert('Your email is on its way to us!');
        location.pathname = '/';
    }
}])
.controller('UpdatePostController', ['$scope', '$routeParams', 'Post', 'Category', function($scope, $routeParams, Post, Category){
    var postId = $routeParams.id;
    $scope.featuredPost = Post.get({ id: postId }, function(){
        $scope.featuredPost.categoryid = String($scope.featuredPost.categoryid);
    });

    $scope.updatePost = function() {
        $scope.featuredPost.$update(function(success) {
            location.pathname = '/';
        });
    };

    $scope.categories = Category.query();
}])
.controller('UserListController', ['$scope', '$location', 'User', 'UserService', function($scope, $location, User, UserService){
    UserService.requireLogin();
    UserService.me();
    console.log('controllers.js/UserListController: The user is logged in');
    $scope.users = User.query();
    console.log('controllers.js/UserListController: users acquired')
    console.log($scope.users);

    $scope.loggedInUser = 'The logged in user is: ' + UserService.user.firstname + ' ' + UserService.user.lastname + ', who is a ' + UserService.user.role;

    $scope.logout = function(){
        UserService.logout()
        .then(function(){
            $location.path('/');
        })
    }

    $scope.deleteUser = function(user){
        console.log('controllers.js/UserListController: The user to be deleted is: ' + user);
        var shouldDelete = confirm ('Are you sure you want to delete this user?');
        console.log(shouldDelete);
        if(shouldDelete){
            console.log('user clicked OK');
            user.$delete(function(){
                console.log('User Deleted!');
                console.log(user);
                $scope.users = User.query();
            });
        }
    }
}])
.controller('LoginController', ['$scope', '$location', 'UserService', function($scope, $location, UserService){
    UserService.me().then(function(me){
        redirect();//success from logging in causes you to redirect
    });
    function redirect(){// bread crumb trail to redirect you back to where you came from
        var dest = $location.search().p;
        if(!dest){
            dest = '/';
        }
        $location.path(dest).search('p', null).replace();//navigate to the destination and set the p flag to be null
    }

    $scope.login = function(user){
        UserService.login($scope.email, $scope.password)
        .then(function(){
            redirect();
        }, function(err){
            console.log(err);
        });
    }
}])
.controller('CreateUserController', ['$scope', 'User', 'UserService', '$location', function($scope, User, UserService, $location){
    $scope.create = function(){
        var data = {
            email: $scope.email,
            password: $scope.password,
            firstname: $scope.firstname,
            lastname: $scope.lastname,
            role: $scope.role
        }

        var u = new User(data);
        u.$save(function(){
            $location.path('/users');
        });
    };

    $scope.loggedInUser = 'The logged in user is: ' + UserService.user.firstname + ' ' + UserService.user.lastname + ', who is a ' + UserService.user.role;

    $scope.roles = [
        {name: 'User', value: 'user'},
        {name: 'Admin', value: 'admin'}
    ];

    $scope.role_default = 'user';
}])
.controller('UpdateUserController', ['$scope', '$routeParams', 'User', 'UserService', function($scope, $routeParams, User, UserService){
    console.log('controllers.js/UpdateUserController: Entered the UpdateUserController');
    UserService.me();
    var userId = $routeParams.id;
    
    $scope.featuredUser = User.get({ id: userId }, function(){
        console.log('The user is: ' + $scope.featuredUser.firstname);
        $scope.id = $scope.featuredUser.id;
        $scope.firstname = $scope.featuredUser.firstname;
        $scope.lastname = $scope.featuredUser.lastname;
        $scope.email = $scope.featuredUser.email;
        $scope.password = $scope.featuredUser.password;
        $scope.role = $scope.featuredUser.role;
        console.log('controllers.js/UpdateUserController: The user role is: ' + $scope.role);
    });

    $scope.updateUser = function(){
        console.log('Controllers.js/UpdateUserController: entered the updateUser function');

        $scope.featuredUser.id = $scope.id;
        $scope.featuredUser.firstname = $scope.firstname;
        $scope.featuredUser.lastname = $scope.lastname;
        $scope.featuredUser.email = $scope.email;
        $scope.featuredUser.password = $scope.password;
        $scope.featuredUser.role = $scope.role;
            
        console.log('Controllers.js/UpdateUserController: $scope.featuredUser.name' + $scope.featuredUser.firstname + ' ' + $scope.featuredUser.lastname);

        console.log('Controllers.js/UpdateUserController: $scope.featuredUser.email ' + $scope.featuredUser.email);

        console.log('Controllers.js/UpdateUserController: $scope.featuredUser.role ' + $scope.featuredUser.role);

        $scope.featuredUser.$update(function(success){
            console.log('controllers.js/UpdateUserController: The user was updated!');
            location.pathname = '/users';
        });
    };

    $scope.loggedInUser = 'The logged in user is: ' + UserService.user.firstname + ' ' + UserService.user.lastname + ', who is a ' + UserService.user.role;

    $scope.roles = [
        {name: 'User', value: 'user'},
        {name: 'Admin', value: 'admin'}
    ];
}])
.controller('DonationController', ['$scope', 'Donation', function($scope, Donation){
    $scope.chargeCard = function(){
        Stripe.card.createToken({
            number: $scope.cardNumber,
            cvc: $scope.cvc,
            exp_month: $scope.expMonth,
            exp_year: $scope.expYear
        }, function(status, response){
            if(response.error){
                console.log(response.error);
            }else{
                //everything ok, stripe generated a token for the card
                var stripeToken = response.id;
                var data = {
                    amount: $scope.amount,
                    token: stripeToken
                }
                var donation = new Donation(data);//using the resource from the factory
                donation.$save(function(){
                    console.log('it worked!');
                });
            }
        });
    }
}])