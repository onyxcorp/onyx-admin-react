
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    titleSetMixin = require('../../../mixin/titleMixin'),
    ProductGridBlock = require('../../../ecommerce').ProductGridBlock,
    LoadMore = require('../../../common').LoadMore,
    Grid = require('../../../mdl').Grid,
    Col = require('../../../mdl').Col,
    Sidebar = require('./sidebar.jsx'),
    Products;

Products = React.createClass({

    displayName: 'Produtos',

    contextTypes: {
        flux: React.PropTypes.object
    },

    propTypes: {
        cart: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        products: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        pending: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ])
    },

    mixins: [PureRenderMixin, titleSetMixin],

    _loadMore: function () {
        this.context.flux.getActions('product').setProducts(this.props.products, 4, 'store', true);
    },

    _onAddProduct: function (product) {
        this.context.flux.getActions('cart').addProduct(this.props.cart, product);
    },

    render: function () {

        var content,
            isLoadingMore = this.props.pending ? this.props.pending.contains('isLoadingMoreProducts') : false;

        if (this.props.products.total()) {
            var list = this.props.products.get('isFiltered') ? this.props.products.get('filteredList') : this.props.products.get('list');
            content = list.map( function(product, index) {
                return (
                    <Col cd={4} ct={8} cp={4} key={index}>
                        <ProductGridBlock
                            title={product.get('title')}
                            slug={product.get('slug')}
                            description={product.get('description')}
                            image={product.getImageByType('medium').get('src')}
                            price={product.getFormatted('price')}
                            onAdd={this._onAddProduct.bind(this, product)} />
                    </Col>
                );
            }.bind(this));
        } else {
            content = (
                <Col cd={4} ct={8} cp={4}>
                    <p>Nenhum produto encontrado =(</p>
                </Col>
            );
        }

        return (
            <Grid noSpacing>
                <Col cd={9} ct={8} cp={4}>
                    <Grid>
                        {content}
                    </Grid>
                </Col>
                <Col cd={3} ct={8} cp={4}>
                    <Grid>
                        <Col cd={12} ct={8} cp={4}>
                            <Sidebar {...this.props} />
                        </Col>
                    </Grid>
                </Col>
                <LoadMore label={'Mais produtos'} loading={isLoadingMore} fullWidth={false} onClick={this._loadMore} />
            </Grid>
        );
    }
});

module.exports = Products;
