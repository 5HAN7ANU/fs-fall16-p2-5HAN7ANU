angular.module('Blog.factories', ['ngResource'])
.factory('Post', ['$resource', function($resource){
    var r = $resource('/api/posts/:id', { id: '@id' }, { update: { method: 'PUT', headers: {'Content-Type': 'application/json'} }});
    return r;
}])
.factory('User', ['$resource', function($resource){
    var r = $resource('/api/users/:id', { id: '@id'}, {
        update: { method: 'PUT', headers: {'Content-Type': 'application/json'}}});
    return r;
}])
.factory('Category', ['$resource', function($resource){
    var r = $resource('/api/categories/:id');
    return r;
}])
.factory('Contact', ['$resource', function($resource){
    var r = $resource('/api/contact', {
        post: { method: 'POST' }
    });
    return r;
}])
.factory('Donation', ['$resource', function($resource){
    return $resource('/api/donations/:id');
}])