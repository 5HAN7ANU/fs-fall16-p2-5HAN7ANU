angular.module('Blog.directives', [])
.directive('blogPost', function(){
    return {
        templateUrl: 'directives/post.html',
        restrict: 'E',
        scope: {
            post: '=postData'
        }
    }
});