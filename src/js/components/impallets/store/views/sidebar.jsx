var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Texts = require('../../texts.js'),
    ProductSummary = require('../../../ecommerce').ProductSummary,
    ProductListItem = require('../../../ecommerce').ProductListItem,
    List = require('../../../mdl').List,
    ListItem = require('../../../mdl').ListItem,
    Icon = require('../../../mdl').Icon,
    StoreSidebar;

StoreSidebar = React.createClass({

    contextTypes: {
        flux: React.PropTypes.object,
        router: React.PropTypes.func
    },

    propTypes: {
        cart: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        pendingCart: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ])
    },

    mixins: [PureRenderMixin],

    _onRemoveProduct: function (Product) {
        this.context.flux.getActions('cart').removeProduct(this.props.cart, Product);
    },

    _onCheckout: function () {
        this.context.router.transitionTo('cart');
    },

    render: function () {

        return (
            <div>
                <ProductSummary
                    subTotal={this.props.cart.getFormatted('total')}
                    onCheckout={this._onCheckout}>
                    {this.props.cart.get('products').get('list').map(function (product, index) {
                        return (
                            <ProductListItem
                                key={index}
                                title={product.get('title')}
                                quantity={product.get('quantity')}
                                image={product.getFirstImage().get('src')}
                                onRemove={this._onRemoveProduct.bind(this, product)} />
                        );
                    }.bind(this)).toJS()}
                </ProductSummary>
                <List subHeader={Texts.contact.title}>
                    <ListItem primaryText={Texts.contact.phone} secondaryText={Texts.contact.phoneTitle} leftIcon={<Icon name="phone_forwarded" size={24} />} />
                    <ListItem primaryText={Texts.contact.secondaryPhone} secondaryText={Texts.contact.secondaryPhoneTitle} leftIcon={<Icon name="smartphone" size={24} />} />
                </List>
            </div>
        );
    }
});

module.exports = StoreSidebar;
