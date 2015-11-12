
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    ReviewForm = require('../../../form').Product.ReviewForm,
    Progress = require('../../../common').Progress,
    Paper = require('../../../mdl').Paper,
    ReviewsList;

ReviewsList = React.createClass({

    contextTypes: {
        flux: React.PropTypes.object
    },

    propTypes: {
        product: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        reviews: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        review: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        user: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        users: React.PropTypes.instanceOf(Immutable.Record).isRequired
    },

    mixins: [PureRenderMixin],

    getInitialState: function(){
        return {
            showReviewForm: false
        };
    },

    _createReview: function() {
        if (this.props.user.get('uid') && this.props.user.get('provider') === 'anonymous') {
            this.context.flux.getActions('app').modal('login');
            this.setState({
                showReviewForm: false
            });
        } else {
            this.context.flux.getActions('review').createReview();
            this.setState({
                showReviewForm: true
            });
        }
    },

    render: function () {

        var content,
            reviewList;

        if (this.props.reviews.total() && this.props.users.total()) {
            reviewList = this.props.reviews.get('list').map( function(review, index) {
                var foundUser = this.props.users.getById(review.get('uid'));
                if (foundUser) {
                    return (
                        <ReviewForm key={index} productReviewed={this.props.product} user={this.props.user} userReviewer={foundUser} review={review} editMode={false} />
                    );
                }
            }.bind(this)).toJS();
            content = (
                <ReviewForm productReviewed={this.props.product} user={this.props.user} review={this.props.review} editMode={false} />
            );
        } else {
            content = (
                <Paper shadow={2}>
                    <p>Produto sem Reviews, seja o primeiro a avaliar!</p>
                    <ReviewForm productReviewed={this.props.product} user={this.props.user} review={this.props.review} editMode={true} />
                </Paper>
            );
        }

        return (
            <div>
                {reviewList}
                {content}
            </div>
        );
    }
});

module.exports = ReviewsList;
