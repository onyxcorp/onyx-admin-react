
var FirebaseUtils = require('../utils/FirebaseUtils.js'),
    db = FirebaseUtils.initFirebase(),
    MiniFlux = require('../utils/MiniFlux'),
    ReviewActions;

ReviewActions = MiniFlux.createAction({

    _config: {
        createReview: {},
        setReviews: {},
        setReviewById: {},
        setReviewsByProductSlug: {
            track: {
                analytics: {
                    sendEvent: {category: 'Review', action: 'setReviewsByProductSlug', label: null}
                }
            }
        },
        setReviewsByProductId: {},
        setReviewsByUserId: {},
        updateReview: {
            track: {
                analytics: {
                    sendEvent: {category: 'Review', action: 'updateReview', label: null}
                }
            }
        }
    },

    createReview: function () {
        return null;
    },

    setReviews: function (Reviews, total, from, more) {
        return this.async ( function (callback) {
            from = from || 'store';
            var startAt = more && Reviews.total() ? Reviews.getLast().get('id') : null; // most recent first by default
            db.utils.watchSet('setReviews', db.tables.reviews, total, startAt, function success(dataSnapshot) {
                callback(Reviews.updateAll(FirebaseUtils.fromFirebaseJS(dataSnapshot, 'list')));
            }, callback);
        }, Reviews);
    },

    setReviewById: function (Reviews, reviewId) {
        var Review = Reviews.getById(id);
        if (!Review) Review = Reviews.newRecord().set('id', id);
        return this.async( function (callback) {
            db.utils.oneOn('reviewId', db.tables.reviews.child(reviewId), 'value', function success(dataSnapshot) {
                callback(Review.merge(FirebaseUtils.fromFirebaseJS(dataSnapshot)));
            }, callback);
        }, Review);
    },

    setReviewsByProductSlug: function (Reviews, productSlug) {
        Reviews = Reviews.clear();
        this.track('setReviewsByProductSlug', 'analytics', 'sendEvent', {label: productSlug});
        return this.async( function (callback) {
            // find the product id
            db.tables.products.orderByChild('slug').equalTo(productSlug).once('value', function success(dataSnapshot) {
                if (dataSnapshot.exists() && dataSnapshot.hasChildren()) {
                    // with the product id now find the reviews
                    db.utils.oneOn('setReviewsByProductSlug', db.tables.reviews.orderByChild('product_id').equalTo(FirebaseUtils.fromFirebaseJS(dataSnapshot, 'list').first().get('_id')), 'value', function success(childDataSnapshot) {
                        callback(Reviews.clear().updateAll(FirebaseUtils.fromFirebaseJS(childDataSnapshot, 'list')));
                    }, callback);
                } else {
                    callback(Reviews);
                }
            }, callback);
        }, Reviews);
    },

    // called on admin area, so there's no need for an analytics event
    setReviewsByProductId: function (Reviews, productId) {
        Reviews = Reviews.clear();
        return this.async( function (callback) {
            db.utils.oneOn('setReviewsByProductId', db.tables.reviews.orderByChild('product_id').equalTo(productId), 'value', function success(dataSnapshot) {
                callback(Reviews.updateAll(FirebaseUtils.fromFirebaseJS(dataSnapshot, 'list')));
            }, callback);
        }, Reviews);
    },

    // called on admin area, so there's no need for an analytics event
    setReviewsByUserId: function (Reviews, userId) {
        Reviews = Reviews.clear();
        return this.async( function (callback) {
            db.utils.oneOn('setReviewsByUserId', db.tables.reviews.orderByChild('uid').equalTo(userId), 'value', function success(dataSnapshot) {
                callback(Reviews.updateAll(FirebaseUtils.fromFirebaseJS(dataSnapshot, 'list')));
            }, callback);
        }, Reviews);
    },

    updateReview: function (Review, from) {
        from = from || 'store';
        if (from === 'store') this.track('updateReview', 'analytics', 'sendEvent', {label: Review.get('id')});
        return this.async( function (callback) {

            var reviewValidationResult = Review.invalidate();

            if (reviewValidationResult.isValid()) {
                db.tables.reviews.update(Review.toFirebaseJS(), callback);
            } else {
                callback(new Error('updateReview Review com dados inválidos: ' + reviewValidationResult.getStringfiedMessages()));
            }

        }, Review);
    }
});

module.exports = ReviewActions;
