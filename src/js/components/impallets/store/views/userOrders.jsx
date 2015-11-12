
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Table = require('../../../common').Table,
    Progress = require('../../../common').Progress,
    LoadMore = require('../../../common').LoadMore,
    Grid = require('../../../mdl').Grid,
    Paper = require('../../../mdl').Paper,
    Orders;

Orders = React.createClass({

    contextTypes: {
        flux: React.PropTypes.object
    },

    propTypes: {
        user: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        orders: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        pending: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ])
    },

    mixins: [PureRenderMixin],

    _loadMore: function () {
        this.context.flux.getActions('order').setOrdersByUser(this.props.orders, this.props.user, 3);
    },

    render: function () {

        var isLoading = this.props.pending ? this.props.pending.containsOr('isLoading', 'isLoadingOrders') : false,
            isLoadingMore = this.props.pending ? this.props.pending.contains('isLoadingMoreOrders') : false;

        return (
        <div>
            <div className="page-title-wrapper">
                <Grid>
                    <div className="page-title">
                        <h2>Lista de Pedidos</h2>
                    </div>
                </Grid>
            </div>
            <Grid>
                <div className='paperContent'>
                    <Progress loading={isLoading} size={2}>
                        <Table list={this.props.orders.get('list')} fields={['id', 'total', 'uid']} />
                    </Progress>
                    <div className="admin-load-more">
                        <LoadMore label={'Carregar mais Pedidos'} loading={isLoadingMore} onClick={this._loadMore} />
                    </div>
                </div>
            </Grid>
        </div>

        );
    }
});

module.exports = Orders;
