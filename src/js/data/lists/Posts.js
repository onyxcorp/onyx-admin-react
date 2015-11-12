var OnyxData = require('../OnyxData'),
    PostRecord = require('../records/Post'),
    PostListFactory,
    PostFactory;

// get the constructor
PostListFactory = OnyxData.List({
    getBySlug: function (slug) {
        return this.get('list').find( function(item) {
            return item.get('slug') === slug;
        });
    }
});

PostFactory = new PostListFactory(PostRecord);

module.exports = PostFactory;
