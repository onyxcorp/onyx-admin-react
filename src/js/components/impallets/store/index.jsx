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
    StoreContainer;

StoreContainer =
    React.createClass({
        // component config
        contextTypes: {
            flux: React.PropTypes.object
        },

        statics: {
            fetchInitialData: function (flux, state) {

                // from app container
                flux.getActions('app').setRoutes(state.routes, state.path);

                // from contact container
                flux.getActions('contact').createContact();

                // from user container
                if (state.params && state.params.id) {
                    flux.getActions('order').setOrderById(flux.getStore('order').getState('orders'), state.params.id);
                } else {
                    flux.getActions('order').setOrdersByUser(flux.getStore('order').getState('orders'), flux.getStore('app').getState('user'), 'store');
                }

                if (state.params && state.params.slug) {
                    flux.getActions('product').setProductBySlug(flux.getStore('product').getState('products'), state.params.slug);
                    flux.getActions('review').setReviewsByProductSlug(flux.getStore('review').getState('reviews'), state.params.slug);
                    flux.getActions('user').setUsers(flux.getStore('user').getState('usersReviews'));
                } else {
                    flux.getActions('product').setProducts(flux.getStore('product').getState('products'), 30, 'store');
                }
            }
        },

        mixins: [ Router.State ],

        // component initialization
        getInitialState: function () {
            return {
                app: this.context.flux.getStore('app').getState(),
                message: this.context.flux.getStore('message').getState(),
                contact: this.context.flux.getStore('contact').getState(),
                cart: this.context.flux.getStore('cart').getState(),
                user: this.context.flux.getStore('user').getState(),
                order: this.context.flux.getStore('order').getState(),
                product: this.context.flux.getStore('product').getState(),
                review: this.context.flux.getStore('review').getState()
            };
        },

        // component lifecycle (in order)
        componentWillMount: function () {
            // not route related, just start watching the User
            this.context.flux.getActions('app').watch(this.state.app.user);
            this.context.flux.getStore('app').listenTo(this._onChangeApp);
            this.context.flux.getStore('cart').listenTo(this._onChangeCart);
            this.context.flux.getStore('contact').listenTo(this._onChangeContact);
            this.context.flux.getStore('message').listenTo(this._onChangeMessage);
            this.context.flux.getStore('user').listenTo(this._onChangeUser);
            this.context.flux.getStore('order').listenTo(this._onChangeOrder);
            this.context.flux.getStore('product').listenTo(this._onChangeProduct);
            this.context.flux.getStore('review').listenTo(this._onChangeReview);
        },

        componentDidMount: function () {
            this._snackbar();
        },

        componentWillUpdate: function (nextProps, nextState) {
            if (this.state.app.user.get('uid') !== nextState.app.user.get('uid') && nextState.app.user.isValidLogin()) {
                if (this.isActive('orders')) {
                    this.context.flux.getActions('order').setOrdersByUser(this.state.order.orders, nextState.app.user);
                }
                this.context.flux.getActions('cart').setCurrentCart(this.state.cart.cart, nextState.app.user);
            }
        },

        componentDidUpdate: function (prevProps, prevState) {
            if (this.state.message !== prevState.message) this._snackbar();
        },

        componentWillUnmount: function () {
            this.context.flux.getStore('app').unlistenTo(this._onChangeApp);
            this.context.flux.getStore('cart').unlistenTo(this._onChangeCart);
            this.context.flux.getStore('contact').unlistenTo(this._onChangeContact);
            this.context.flux.getStore('message').unlistenTo(this._onChangeMessage);
            this.context.flux.getStore('user').unlistenTo(this._onChangeUser);
            this.context.flux.getStore('order').unlistenTo(this._onChangeOrder);
            this.context.flux.getStore('product').unlistenTo(this._onChangeProduct);
            this.context.flux.getStore('review').unlistenTo(this._onChangeReview);
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

        _onChangeContact: function () {
            this.setState({
                contact: this.context.flux.getStore('contact').getState()
            });
        },

        _onChangeUser: function () {
            this.setState({
                user: this.context.flux.getStore('user').getState()
            });
        },

        _onChangeOrder: function () {
            this.setState({
                order: this.context.flux.getStore('order').getState()
            });
        },

        _onChangeProduct: function () {
            this.setState({
                product: this.context.flux.getStore('product').getState()
            });
        },

        _onChangeReview: function () {
            this.setState({
                review: this.context.flux.getStore('review').getState()
            });
        },

        _onChangeCart: function () {
            this.setState({
                cart: this.context.flux.getStore('cart').getState()
            });
        },

        _onChangeMessage: function () {
            this.setState({
                message: this.context.flux.getStore('message').getState()
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
                message: this.state.message.message,
                review: this.state.review.review,
                reviews: this.state.review.reviews,
                pendingCart: this.state.cart.pending,
                contact: this.state.contact.contact,
                pendingContact: this.state.contact.pending
            });

            if (this.isActive('product')) {
                assign(props, {product: this.state.product.product, users: this.state.user.usersReviews, pendingProduct: this.state.product.pending});
            } else if (this.isActive('products')) {
                assign(props, {products: this.state.product.products, pendingProduct: this.state.product.pending});
            } else if (this.isActive('order')) {
                assign(props, {order: this.state.order.order, pendingOrder: this.state.order.pending});
            } else if (this.isActive('orders')) {
                assign(props, {orders: this.state.order.orders, pendingOrder: this.state.order.pending});
            }

            var isLoading;

            if (props.pendingApp || props.pendingCart || props.pendingContact || props.pendingProduct || props.pendingOrder) {
                if (props.pendingProduct) {
                    isLoading = props.pendingProduct.contains('isLoadingProducts') ? true : false;
                } else {
                    isLoading = true;
                }
            } else {
                isLoading = false;
            }

            if (this.state.app.pageTitle) {
                document.title = this.state.app.pageTitle;
            }

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

module.exports = StoreContainer;
