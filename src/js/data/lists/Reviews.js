var OnyxData = require('../OnyxData'),
    ReviewRecord = require('../records/Review'),
    ReviewListFactory,
    ReviewFactory;

ReviewListFactory = OnyxData.List();

ReviewFactory = new ReviewListFactory(ReviewRecord);

module.exports = ReviewFactory;
