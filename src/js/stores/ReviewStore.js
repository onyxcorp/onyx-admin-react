var MiniFlux = require('../utils/MiniFlux'),
    ReviewFactory = require('../data/records/Review'),
    ReviewListFactory = require('../data/lists/Reviews'),
    ReviewStore;

ReviewStore = MiniFlux.createStore({

    _init: function (flux) {
        this.register(flux.getActions('review').createReview, this._handleCreateReview);
        this.registerAsync(flux.getActions('review').setReviews, this._handleSetReviews, this._handleSetReviewsCompleted);
        this.registerAsync(flux.getActions('review').setReviewsByProductId, this._handleSetReviews, this._handleSetReviewsCompleted);
        this.registerAsync(flux.getActions('review').setReviewsByProductSlug, this._handleSetReviews, this._handleSetReviewsCompleted);
        this.registerAsync(flux.getActions('review').setReviewsByUserId, this._handleSetReviews, this._handleSetReviewsCompleted);
        this.registerAsync(flux.getActions('review').setReviewById, this._handleSetReviewById, this._handleSetReviewByIdCompleted);
        this.registerAsync(flux.getActions('review').updateReview, this._handleUpdateReview, this._handleUpdateReviewCompleted);
    },

    initialState: {
        reviews: ReviewListFactory.create(),
        review: ReviewFactory.create(),
        pending: 'isLoading'
    },

    _handleCreateReview: function () {
        this.setState({
            review: ReviewFactory.create(),
            pending: false
        });
    },

    _handleSetReviews: function (Reviews) {

        var newState = {},
            currentState = this.getState();

        if (!currentState.reviews.total()) {
            newState.pending = 'isLoadingReviews';
        } else {
            newState.pending = 'isLoadingMoreReviews';
        }

        if (currentState.reviews !== Reviews) {
            newState.reviews = Reviews;
        }
        this.setState(newState);
    },
    _handleSetReviewsCompleted: function (Reviews) {

        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.containsOr('isLoading', 'isLoadingReviews', 'isLoadingMoreReviews') : false);

        if (this.types.isError(Reviews)) {
            this.error.track(Reviews);
            if (isPending) this.rollback();
        } else {
            if (currentState.reviews !== Reviews) {
                newState.reviews = Reviews;
            }
            if (isPending) newState.pending = false;
            this.setState(newState);
        }
    },

    _handleSetReviewById: function (Review) {

        var newState = {},
            currentState = this.getState();

        if (currentState.review !== Review) {
            newState.review = Review;
        }

        if (!newState.product) newState.pending = 'isLoadingReview';
        this.setState(newState);
    },
    _handleSetReviewByIdCompleted: function (Review) {

        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.containsOr('isLoading', 'isLoadingProduct') : false);

        if (this.types.isError(Review)) {
            this.error.track(Review);
            if (isPending) this.rollback();
        } else {
            if (currentState.review !== Review) {
                newState.reviews = currentState.reviews.update(Review);
                newState.review = newState.reviews.getById(Review.get('id'));
            }
            if (isPending) newState.pending = false;
            this.setState(newState);
        }
    },

    _handleUpdateReview: function (Review) {

        var newState = {},
            currentState = this.getState();

        if (Review && Review.invalidate().isValid()) {
            newState.reviews = currentState.reviews.update(Review);
            // If there is a current selected review and it's the same being updated, update it
            if (currentState.review && currentState.review.get('id') === Review.get('id')) {
                newState.review = newState.reviews.get('lastUpdated');
            }
        }
        this.setState(newState);
    },
    _handleUpdateReviewCompleted: function (error) {
        if (this.types.isError(error)) {
            this.error.track(error);
        }
    }
});

module.exports = ReviewStore;
