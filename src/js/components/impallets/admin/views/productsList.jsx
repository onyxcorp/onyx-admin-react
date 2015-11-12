
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    titleSetMixin = require('../../../mixin/titleMixin'),
    Table = require('../../../common').Table,
    Progress = require('../../../common').Progress,
    LoadMore = require('../../../common').LoadMore,
    Col = require('../../../mdl').Col,
    Grid = require('../../../mdl').Grid,
    Paper = require('../../../mdl').Paper,
    ProductsList;

ProductsList =
    React.createClass({

        contextTypes: {
            flux: React.PropTypes.object
        },

        propTypes: {
            products: React.PropTypes.instanceOf(Immutable.Record).isRequired,
            pending: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ])
        },

        mixins: [titleSetMixin, PureRenderMixin],  // automatically uses shouldComponentUpdate

        _loadMore: function () {
            this.context.flux.getActions('product').setProducts(this.props.products, 3);
        },

        render: function () {

            var isLoading =this.props.pending ? this.props.pending.containsOr('isLoading', 'isLoadingProducts') : false,
                isLoadingMore = this.props.pending ? this.props.pending.contains('isLoadingMoreProducts') : false;

            return (

            <div>
                <div className="page-title-wrapper">
                    <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                        <div className="page-title">
                            <h2>Lista de Produtos</h2>
                        </div>
                    </Grid>
                </div>
                <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                    <div className='paperContent' style={{width: '100%'}}>
                        <Paper shadow={2}>
                            <Progress loading={isLoading} size={2}>
                                <Table list={this.props.products.get('list')} fields={['id', 'title', 'description']} />
                            </Progress>
                        </Paper>
                        <div className="admin-load-more">
                            <LoadMore label={'Carregar mais Produtos'} loading={isLoadingMore} onClick={this._loadMore} />
                        </div>
                    </div>
                </Grid>
            </div>
            );
        }
    });

module.exports = ProductsList;
