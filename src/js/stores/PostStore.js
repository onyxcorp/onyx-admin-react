var MiniFlux = require('../utils/MiniFlux'),
    PostFactory = require('../data/records/Post'),
    PostListFactory = require('../data/lists/Posts'),
    PostStore;


PostStore = MiniFlux.createStore({

    _init: function (flux) {
        this.register(flux.getActions('post').createPost, this._handleCreatePost);
        this.registerAsync(flux.getActions('post').setPosts, this._handleSetPosts, this._handleSetPostsCompleted);
        this.registerAsync(flux.getActions('post').setPostBySlug, this._handleSetPostBySlugOrId, this._handleSetPostBySlugOrIdCompleted);
        this.registerAsync(flux.getActions('post').setPostById, this._handleSetPostBySlugOrId, this._handleSetPostBySlugOrIdCompleted);
        this.registerAsync(flux.getActions('post').updatePost, this._handleUpdatePost, this._handleUpdatePostCompleted);
    },

    initialState: {
        pages: PostListFactory.create(),
        blogs: PostListFactory.create(),
        post: PostFactory.create(),
        pending: 'isLoading'
    },


    _handleCreatePost: function () {
        this.setState({
            post: PostFactory.create(),
            pending: null
        });
    },

    _handleSetPosts: function (data) {

        var Posts = data.Posts,
            type = data.type,
            newState = {},
            currentState = this.getState();

        if (type !== 'pages' && type !== 'blogs') throw new Error('_handleSetPosts type must be either "pages" or "blogs"');
        // type should be either pages or blogs
        if (!currentState[type].total()) {
            newState.pending = 'isLoadingPost' + type.capitalize();
        } else {
            newState.pending = 'isLoadingMorePost' + type.capitalize();
        }
        if (currentState[type] !== Posts) {
            newState[type] = Posts;
        }
        this.setState(newState);
    },
    _handleSetPostsCompleted: function (data) {

        var Posts = data.Posts,
            type = data.type,
            newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.containsOr(
                'isLoading', 'isLoadingPostPages', 'isLoadingMorePostPages', 'isLoadingPostBlogs', 'isLoadingMorePostBlogs'
            ) : false);

        if (this.types.isError(Posts)) {
            this.error.track(Posts);
            if (isPending) this.rollback();
        } else {
            if (currentState[type] !== Posts) {
                newState[type] = Posts;
            }
            if (isPending) newState.pending = false;
            this.setState(newState);
        }
    },

    _handleSetPostBySlugOrId: function (Post) {

        var newState = {},
            currentState = this.getState();

        if (currentState.post !== Post) {
            newState.post = Post;
        }

        if (!newState.page) newState.pending = 'isLoadingPost';
        this.setState(newState);
    },
    _handleSetPostBySlugOrIdCompleted: function (data) {

        var Post = data.Post,
            type = data.type,
            newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.containsOr('isLoading', 'isLoadingPost') : false);

        if (this.types.isError(Post)) {
            this.error.track(Post);
            if (isPending) this.rollback();
        } else {
            if (currentState.post !== Post) {
                newState[type] = currentState[type].update(Post);
                newState.post = newState[type].getById(Post.get('id'));
            }
            if (isPending) newState.pending = false;
            this.setState(newState);
        }
    },

    _handleUpdatePost: function (Post) {

        var newState = {},
            currentState = this.getState();

        if (Post && Post.invalidate().isValid()) {
            newState.pages = currentState.pages.update(Post);
            // If there is a current selected Posts and it's the same being updated, update it
            if (currentState.page && currentState.page.get('id') === Post.get('id')) {
                newState.page = newState.pages.get('lastUpdated');
            }
        }
        this.setState(newState);
    },
    _handleUpdatePostCompleted: function (error) {
        if (this.types.isError(error)) {
            this.error.track(error);
        }
    }
});

module.exports = PostStore;
