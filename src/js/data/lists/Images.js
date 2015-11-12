
var OnyxData = require('../OnyxData'),
    ImageRecord = require('../records/Image'),
    ImageListFactory,
    ImageFactory;

ImageListFactory = OnyxData.List({
    getByType: function (type) {
        return this.get('list').find( function(item) {
            return item.get('type') === type;
        });
    }
});

ImageFactory = new ImageListFactory(ImageRecord);

module.exports = ImageFactory;
