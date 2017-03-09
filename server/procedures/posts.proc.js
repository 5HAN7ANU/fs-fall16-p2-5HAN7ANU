var db = require('../config/db');

exports.all = function(){
    return db.rows('GetPosts');
}

exports.read = function(id){
    return db.row('GetRequestedPost', [id]);
}

exports.create = function(title, userid, categoryid, content){
    return db.row('PostNewBlog', [title, userid, categoryid, content]);
}

exports.update = function(id, title, content, categoryid){
    return db.empty('UpdatePost', [id, title, content, categoryid]);
}

exports.destroy = function(id){
    return db.empty('DeletePost', [id]);
}