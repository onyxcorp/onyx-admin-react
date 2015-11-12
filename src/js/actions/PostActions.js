
var FirebaseUtils = require('../utils/FirebaseUtils.js'),
    db = FirebaseUtils.initFirebase(),
    MiniFlux = require('../utils/MiniFlux'),
    PostActions;


PostActions = MiniFlux.createAction({

    _config: {
        createPost: {},
        setPosts: {},
        setPostBySlug: {},
        setPostById: {},
        updatePost: {}
    },

    createPost: function () {
        return null;
    },

    setPosts: function (Posts, type, total, from, more) {
        return this.async ( function (callback) {
            from = from || 'store';
            var startAt = more && Posts.total() ? Posts.getLast().get('id') : null; // most recent first by default
            db.utils.watchSetByChild('setPostPages', db.tables.posts, total, startAt, 'type', type, function success(dataSnapshot) {
                callback({Posts: Posts.clear().updateAll(FirebaseUtils.fromFirebaseJS(dataSnapshot, 'list')), type: type});
            }, callback);
        }, {Posts: Posts, type: type});
    },

    setPostBySlug: function (Posts, type, slug) {
        var Post = Posts.getBySlug(slug);
        if (!Post) Post = Posts.newRecord().set('slug', slug);
        return this.async( function (callback) {
            db.utils.oneOn('PostSlug', db.tables.posts.orderByChild('slug').equalTo(slug), 'value', function success(dataSnapshot) {
                callback({Post: Post.merge(FirebaseUtils.fromFirebaseJS(dataSnapshot, 'list').first()), type:type});
            }, callback);
        }, Post);
    },

    setPostById: function (Posts, type, id) {
        var Post = Posts.getById(id);
        if (!Post) Post = Posts.newRecord().set('id', id);
        return this.async( function (callback) {
            db.utils.oneOn('PostID', db.tables.posts.child(id), 'value', function success(dataSnapshot) {
                callback({Post: Post.merge(FirebaseUtils.fromFirebaseJS(dataSnapshot)), type: type});
            }, callback);
        }, Post);
    },

    updatePost: function (Post) {
        return this.async( function (callback) {

            var PostValidationResult = Post.invalidate();

            if (PostValidationResult.isValid()) {
                db.tables.posts.update(Post.toFirebaseJS(), callback);
            } else {
                callback(new Error('updatePost página com dados inválidos: ' + PostValidationResult.getStringifiedMessages()));
            }
        }, Post);
    }
});

module.exports = PostActions;
