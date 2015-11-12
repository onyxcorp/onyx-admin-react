
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Immutable = require('immutable'),
    ImmutableFormMixin = require('../../../mixin/ImmutableForm'),
    titleSetMixin = require('../../../mixin/titleMixin'),
    Texts = require('../../texts.js'),
    ProductTabs = require('../static/productTabs.jsx'),
    FacebookButton = require('../../../common').FacebookButton,
    TwitterButton = require('../../../common').TwitterButton,
    AddToCart = require('../../../ecommerce').AddToCart,
    Price = require('../../../ecommerce').Price,
    Grid = require('../../../mdl').Grid,
    Col = require('../../../mdl').Col,
    Paper = require('../../../mdl').Paper,
    Button = require('../../../mdl').Button,
    Icon = require('../../../mdl').Icon,
    Divider = require('../../../mdl').Divider,
    UpdateQuantity = require('../../../ecommerce').UpdateQuantity,
    Img = require('../../../common').Img,
    Product;

Product = React.createClass({

    contextTypes: {
        flux: React.PropTypes.object
    },

    propTypes: {
        cart: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        product: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        reviews: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        review: React.PropTypes.instanceOf(Immutable.Record),
        user: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        users: React.PropTypes.instanceOf(Immutable.Record).isRequired
    },

    mixins: [PureRenderMixin, titleSetMixin, ImmutableFormMixin(['product'])],

    _clearProductPropertyError: function (event) {
        this.clearErrorState('product', event);
    },

    _onAddQuantity: function () {
        this.setLinkedState('product', this.getLinkedState('product').addQuantity(1));
    },

    _onSubtractQuantity: function () {
        this.setLinkedState('product', this.getLinkedState('product').removeQuantity(1));
    },

    _onChangeQuantity: function (newQuantity) {
        this.setLinkedState('product', this.getLinkedState('product').set('quantity', newQuantity));
    },

    _onAddProduct: function () {
        this.context.flux.getActions('cart').addProduct(this.props.cart, this.getLinkedState('product'));
    },

    render: function () {

        var content;

        // no sense run this logic if we don't even finished loading the product yet...
        var defaultList,
            imageSrc;

        if (this.props.product.get('id')) {
            if (this.props.product.getFirstImage()) {
                imageSrc = this.props.product.getFirstImage().get('src');
            } else {
                imageSrc = '';
            }

            content = (
                <Grid noSpacing>
                    <Col cd={6} ct={8} cp={4}>
                        <div className="product-image" style={{textAlign: 'center'}}>
                            <Img src={imageSrc} alt={this.props.product.get('title')} title={this.props.product.get('title')} />
                        </div>
                    </Col>
                    <Col cd={6} ct={8} cp={4}>
                        <h1 style={{
                                color: '#292a2b',
                                fontWeight: 'normal',
                                fontSize: '28px'
                            }}>
                            {this.props.product.get('title')}
                        </h1>
                        <p>
                            <FacebookButton url={window.location.href} />
                            <TwitterButton url={window.location.href} />
                        </p>
                        <p>{this.props.product.get('description')}</p>
                        <p>
                            <Price old={true} style={{fontSize: 18}}>{this.getLinkedState('product').getFormatted('price')}</Price>
                            <Price style={{color: '#8bc435'}}>{this.getLinkedState('product').getFormatted('price')}</Price>
                        </p>
                        <Divider />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            WebkitAlignItems: 'center',
                            textAlign: 'center'
                            }}>
                            <UpdateQuantity
                                quantity={this.getLinkedState('product').get('quantity')}
                                onAdd={this._onAddQuantity}
                                onSubtract={this._onSubtractQuantity}
                                onChange={this._onChangeQuantity} />
                            <Price style={{color: '#8bc435', margin: 0}}>{this.getLinkedState('product').getFormatted('total')}</Price>
                            <AddToCart onAdd={this._onAddProduct} raised={true} colored={true} />
                        </div>
                    </Col>
                </Grid>
            );
        } else {
            content = (
                <h2>Produto não encontrado =(</h2>
            );
        }

        return (
            <div>
                <div className="page-title-wrapper">
                    <Grid>
                        <div className="page-title">
                            <h2>{this.props.product.get('title')}</h2>
                        </div>
                    </Grid>
                </div>
                <Grid>
                    <div className='paperContent'>
                        <Paper shadow={2} style={{zIndex: 2}}>
                            {content}
                        </Paper>
                        <ProductTabs {...this.props}/>
                    </div>
                </Grid>
            </div>
        );
    }
});

module.exports = Product;
