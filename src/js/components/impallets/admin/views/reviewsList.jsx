
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    titleSetMixin = require('../../../mixin/titleMixin'),
    Table = require('../../../common').Table,
    Progress = require('../../../common').Progress,
    LoadMore = require('../../../common').LoadMore,
    Grid = require('../../../mdl').Grid,
    Paper = require('../../../mdl').Paper,
    ProductsList;

ProductsList =
    React.createClass({

        contextTypes: {
            flux: React.PropTypes.object
        },

        propTypes: {
            reviews: React.PropTypes.instanceOf(Immutable.Record).isRequired,
            pending: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ])
        },

        mixins: [PureRenderMixin, titleSetMixin],

        _loadMore: function () {
            this.context.flux.getActions('review').setReviews(this.props.reviews, 3);
        },

        render: function () {

            var isLoading = this.props.pending ? this.props.pending.containsOr('isLoading', 'isLoadingReviews') : false,
                isLoadingMore = this.props.pending ? this.props.pending.contains('isLoadingMoreReviews') : false;

            return (
            <div>
                <div className="page-title-wrapper">
                    <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                        <div className="page-title">
                            <h2>Lista de Reviews</h2>
                        </div>
                    </Grid>
                </div>
                <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                    <div className='paperContent' style={{width: '100%'}}>
                        <Paper shadow={2}>
                            <Progress loading={isLoading} size={2}>
                                <Table list={this.props.reviews.get('list')} fields={['id', 'title', 'description']} />
                            </Progress>
                        </Paper>
                        <div className="admin-load-more">
                            <LoadMore label={'Carregar mais Reviews'} loading={isLoadingMore} onClick={this._loadMore} />
                        </div>
                    </div>
                </Grid>
            </div>
            );
        }
    });

module.exports = ProductsList;
