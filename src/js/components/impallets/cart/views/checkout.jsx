
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    titleSetMixin = require('../../../mixin/titleMixin'),
    Texts = require('../../texts.js'),
    ProductSummary = require('../../../ecommerce').ProductSummary,
    ProductListItem = require('../../../ecommerce').ProductListItem,
    ContactAddressForm = require('../../../form').Cart.ContactAddressForm,
    Grid = require('../../../mdl').Grid,
    Col = require('../../../mdl').Col,
    Paper = require('../../../mdl').Paper,
    Checkout;

Checkout = React.createClass({

    displayName: 'Checkout',

    contextTypes: {
        flux: React.PropTypes.object,
        router: React.PropTypes.func
    },

    propTypes: {
        user : React.PropTypes.instanceOf(Immutable.Record).isRequired,
        order: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        cart: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        checkoutStep: React.PropTypes.number.isRequired,
        cartCompleted: React.PropTypes.bool.isRequired,
        newAddress: React.PropTypes.instanceOf(Immutable.Record).isRequired
    },

    mixins: [PureRenderMixin, titleSetMixin],

    componentWillMount: function () {
        // no valid user, redirect back, also we have to be on checkoutStep 2
        if (!this.props.user.isValidUser()) {
            this.context.router.transitionTo('cart');
        } else {
            // only set the checkout step to 2 if we have a valid user
            this.context.flux.getActions('cart').checkout(this.props.cart, 2);
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.cartCompleted) {
            this.context.flux.getActions('cart').checkout(this.props.cart, 3);
            this.context.flux.getActions('order').createOrderFromCart(this.props.order, this.props.cart);
        }
    },

    _onConfirm: function () {
        this.refs.contactAddressForm.triggerSubmit();
    },

    _onSubmitContactAddressForm: function (user, address) {
        // if we have a user, it mean's that everything validated accordingly
        if (user && address) {
            // TODO those actions must be merged into a single one.. i guess..
            this.context.flux.getActions('app').updateUserData(user);
            this.context.flux.getActions('app').updateUserAddressesData(this.props.user, address);
            this.context.flux.getActions('cart').updateAddress(this.props.cart, address);
        }
    },

    render: function () {

        var content,
            addressSelector,
            newAddress;

        if (this.props.cart.get('products').total()) {

            // if (this.props.user.get('addresses').total()) {
            //     addressSelector = this.props.user.get('addresses').get('list').map( function (address, index) {
            //         return (
            //             <AddressForm key={index + address.get('id')} editMode={false} address={address} onSetAddress={this._onSetAddress} onSaveAddress={this._onSaveAddress} />
            //         );
            //     }.bind(this)).toJS();
            //     newAddress = (
            //         <AddressForm editMode={false} address={this.props.newAddress} onSetAddress={this._onSetAddress} onSaveAddress={this._onSaveAddress} />
            //     );
            // } else {
            //     addressSelector = (
            //         <AddressForm editMode={true} address={this.props.newAddress} onSetAddress={this._onSetAddress} onSaveAddress={this._onSaveAddress} />
            //     );
            // }

            content = (
                <div>
                    <h2 style={{fontSize: 24, lineHeight: '36px'}}>Informações de Contato</h2>
                    <ContactAddressForm ref='contactAddressForm' actions={false} user={this.props.user} address={this.props.newAddress} onSubmit={this._onSubmitContactAddressForm} />
                    <ProductSummary
                        subTotal={this.props.cart.getFormatted('total')}
                        total={this.props.cart.getFormatted('total')}
                        buttonText='Fechar Pedido'
                        onCheckout={this._onConfirm}>
                        {this.props.cart.get('products').get('list').map(function (product, index) {
                            return (
                                <ProductListItem
                                    key={index + product.get('id')}
                                    readOnly={true}
                                    title={product.get('title')}
                                    quantity={product.get('quantity')}
                                    image={product.getFirstImage().get('src')}
                                    price={product.getFormatted('price')}
                                    total={product.getFormatted('total')} />
                            );
                        }.bind(this)).toJS()}
                    </ProductSummary>
                </div>
            );

        } else {
            content = (
                <h2>{Texts.cart.empty}</h2>
            );
        }

        return (
            <div>
                <div className="page-title-wrapper">
                    <Grid>
                        <div className="page-title">
                            <h2>Fechamento</h2>
                        </div>
                    </Grid>
                </div>
                <Grid>
                    <div className='paperContent'>
                        <Paper shadow={2}>
                            {content}
                        </Paper>
                    </div>
                </Grid>
            </div>
        );
    }
});
module.exports = Checkout;
