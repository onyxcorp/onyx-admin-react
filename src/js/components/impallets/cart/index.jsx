var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    assign = require('object-assign'),
    Drawer = require('./static/drawer.jsx'),
    Header = require('./static/header.jsx'),
    Footer = require('../../common').Footer,
    Modal = require('../../common').Modal,
    Progress = require('../../common').Progress,
    LoginRegisterForm = require('../../form').User.LoginRegisterForm,
    Layout = require('../../mdl').Layout,
    Snackbar = require('../../mdl').Snackbar,
    CartContainer;

CartContainer =
    React.createClass({

        contextTypes: {
            flux: React.PropTypes.object
        },

        statics: {
            fetchInitialData: function (flux, state) {
                // from app container
                flux.getActions('app').setRoutes(state.routes, state.path);
            }
        },

        mixins: [ Router.State ],

        // component initialization
        getInitialState: function () {
            return {
                app: this.context.flux.getStore('app').getState(),
                message: this.context.flux.getStore('message').getState(),
                cart: this.context.flux.getStore('cart').getState(),
                order: this.context.flux.getStore('order').getState()
            };
        },

        // component lifecycle (in order)
        componentWillMount: function () {
            this.context.flux.getActions('app').watch(this.state.app.user);
            this.context.flux.getStore('app').listenTo(this._onChangeApp);
            this.context.flux.getStore('cart').listenTo(this._onChangeCart);
            this.context.flux.getStore('message').listenTo(this._onChangeMessage);
            this.context.flux.getStore('order').listenTo(this._onChangeOrder);

            // make sure we have a new order to be filled with data
            this.context.flux.getActions('order').createOrder();
        },

        componentDidMount: function () {
            this._snackbar();
        },

        componentWillUpdate: function (nextProps, nextState) {

            if (nextState.order.orderCreatedFromCart) {
                this.context.router.transitionTo('order', { id: nextState.order.order.get('id') });
            }

            if (this.state.app.user.get('uid') !== nextState.app.user.get('uid') && nextState.app.user.isValidLogin()) {
                this.context.flux.getActions('cart').setCurrentCart(this.state.cart.cart, nextState.app.user);
            }
        },

        componentDidUpdate: function (prevProps, prevState) {
            if (this.state.message !== prevState.message) this._snackbar();

            /** Fixes the component transition and scroll position **/
            function scrollElmVert(el,num) { // to scroll up use a negative number
                var re=/html$/i;
                while(!re.test(el.tagName) && (1 > el.scrollTop)) el=el.parentNode;
                if(0 < el.scrollTop) el.scrollTop += num;
            }

            if (this.refs.addressSelector) {
                var addressDomNode = React.findDOMNode(this.refs.addressSelector);
                addressDomNode.scrollIntoView();
                scrollElmVert(addressDomNode, -170);
            }
        },

        componentWillUnmount: function () {
            this.context.flux.getStore('app').unlistenTo(this._onChangeApp);
            this.context.flux.getStore('cart').unlistenTo(this._onChangeCart);
            this.context.flux.getStore('message').unlistenTo(this._onChangeMessage);
            this.context.flux.getStore('order').unlistenTo(this._onChangeOrder);
        },

        _timeoutHandle: null,

        _snackbar: function () {
            if (this.state.message.message !== this.state.message.lastMessage) {
                this.refs.snackbar.show();
                if (this._timeoutHandle) {
                    window.clearTimeout(this._timeoutHandle);
                }
                this._timeoutHandle = window.setTimeout( function () {
                    if (this.refs.snackbar) this.refs.snackbar.dismiss();
                }.bind(this), 2500);
            }
        },

        _onChangeApp: function () {
            this.setState({
                app: this.context.flux.getStore('app').getState()
            });
        },

        _onChangeCart: function () {
            this.setState({
                cart: this.context.flux.getStore('cart').getState()
            });
        },

        _onChangeOrder: function () {
            this.setState({
                order: this.context.flux.getStore('order').getState()
            });
        },

        _onRequestCloseModal: function () {
            this.context.flux.getActions('app').modal(false);
        },

        _onSubmitFacebookLogin: function () {
            this.context.flux.getActions('app').login(this.state.app.user.set('provider', 'facebook'));
        },

        _onSubmitLogin: function (user) {
            this.context.flux.getActions('app').login(user.set('provider', 'password'));
        },

        _onSubmitRegister: function (user) {
            this.context.flux.getActions('app').register(user.set('provider', 'password'));
        },

        render: function () {
            var props = assign({}, {
                user: this.state.app.user,
                pendingApp: this.state.app.pending,
                cart: this.state.cart.cart,
                pendingCart: this.state.cart.pending,
                cartCompleted: this.state.cart.completed,
                selectedProducts: this.state.cart.selectedProducts,
                message: this.state.message.message,
                checkoutStep: this.state.cart.checkoutStep,
                order: this.state.order.order,
                pendingOrder: this.state.order.pending,
                newAddress: this.state.app.address
            }),
            isLoading = (props.pendingApp || props.pendingCart || props.pendingOrder) ? true : false;

            return (
                <Layout fixedHeader={true}>
                    <Header cart={props.cart} user={props.user} />
                    <Snackbar ref='snackbar' message={props.message || ''} />
                    <Modal style={{maxWidth: 345}} isOpen={this.state.app.modal ? true : false} pending={props.pendingApp ? true : false} onRequestClose={this._onRequestCloseModal}>
                        <Progress loading={isLoading} size={2}>
                            <LoginRegisterForm
                                user={props.user}
                                login={true}
                                onSubmitLogin={this._onSubmitLogin}
                                onSubmitRegister={this._onSubmitRegister}
                                onSubmitFacebookLogin={this._onSubmitFacebookLogin}
                                />
                        </Progress>
                    </Modal>
                    <Drawer />
                    <main className="mdl-layout__content">
                        <Progress loading={isLoading} size={2}>
                            <RouteHandler {...props} />
                        </Progress>
                        <Footer />
                    </main>
                </Layout>
            );
        }
    });

module.exports = CartContainer;
