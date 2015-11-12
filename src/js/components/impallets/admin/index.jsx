var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    Link = Router.Link,
    assign = require('object-assign'),
    Drawer = require('./static/drawer.jsx'),
    Header = require('./static/header.jsx'),
    Footer = require('../../common').Footer,
    Modal = require('../../common').Modal,
    Progress = require('../../common').Progress,
    LoginRegisterForm = require('../../form').User.LoginRegisterForm,
    Layout = require('../../mdl').Layout,
    Navigation = require('../../mdl').Navigation,
    Divider = require('../../mdl').Divider,
    AdminContainer;

AdminContainer =
    React.createClass({
        // component config
        contextTypes: {
            flux: React.PropTypes.object,
            router: React.PropTypes.func
        },

        statics: {

            willTransitionTo: function (transition, params, query, callback) {
                console.log('willTransitionTo admin area');
                console.log(transition);
                console.log(params);
                console.log(query);
                callback(); // keep loading dawg
            },

            fetchInitialData: function (flux, state) {

                // from app container
                flux.getActions('app').setRoutes(state.routes, state.path);

                state.routes.forEach(function (route) {
                    switch (route.name) {

                    /** Contact management **/
                        case 'adminContacts' :
                            flux.getActions('contact').setContacts(flux.getStore('contact').getState('contacts'), 10);
                            break;
                        case 'adminEditContact':
                            flux.getActions('contact').setContactById(flux.getStore('contact').getState('contact'), state.params.id);
                            break;

                    /** General Management **/
                        case 'adminMenuBuilder':
                            flux.getActions('post').setPosts(flux.getStore('post').getState('pages'), 'pages', 10);
                            break;

                    /** Product management **/
                        case 'adminNewProduct':
                            flux.getActions('product').createProduct();
                            break;
                        case 'adminEditProduct':
                            if (state.params && state.params.id) flux.getActions('product').setProductById(flux.getStore('product').getState('products'), state.params.id);
                            break;
                        case 'adminProducts':
                            flux.getActions('product').setProducts(flux.getStore('product').getState('products'), 10, 'admin');
                            break;

                    /** Post management **/
                        case 'adminNewPostPage':
                        case 'adminNewPostBlog':
                            flux.getActions('post').createPost();
                            break;
                        case 'adminEditPostPage':
                            if (state.params && state.params.id) flux.getActions('post').setPostById(flux.getStore('post').getState('pages'), state.params.id);
                            break;
                        case 'adminPostPages':
                            flux.getActions('post').setPosts(flux.getStore('post').getState('pages'), 'pages', 10, 'admin');
                            break;
                        case 'adminEditPostBlog':
                            if (state.params && state.params.id) flux.getActions('post').setPostById(flux.getStore('post').getState('blogs'), state.params.id);
                            break;
                        case 'adminPostBlogs':
                            flux.getActions('post').setPosts(flux.getStore('post').getState('blogs'), 'blogs', 10, 'admin');
                            break;

                    /** Order management **/
                        case 'adminNewOrder':
                            flux.getActions('order').createOrder();
                            break;
                        case 'adminEditOrder':
                            if (state.params && state.params.id) flux.getActions('order').setOrderById(flux.getStore('order').getState('orders'), state.params.id);
                            break;
                        case 'adminOrders':
                            flux.getActions('order').setOrders(flux.getStore('order').getState('orders'), 10, 'admin');
                            break;

                    /** Review management **/
                        case 'adminNewReview':
                            flux.getActions('review').createReview();
                            break;
                        case 'adminEditReview':
                            if (state.params && state.params.id) flux.getActions('review').setReviewById(flux.getStore('review').getState('reviews'), state.params.id);
                            break;
                        case 'adminReviews':
                            flux.getActions('review').setReviews(flux.getStore('review').getState('reviews'), 10, 'admin');
                            break;
                        default:
                            // do nothing
                            break;
                    }
                });
            }
        },

        mixins: [ Router.State ],

        getInitialState: function () {
            return {
                app: this.context.flux.getStore('app').getState(),
                contact: this.context.flux.getStore('contact').getState(),
                product: this.context.flux.getStore('product').getState(),
                order: this.context.flux.getStore('order').getState(),
                review: this.context.flux.getStore('review').getState(),
                post: this.context.flux.getStore('post').getState()
            };
        },

        componentWillMount: function () {
            this.context.flux.getActions('app').watch(this.state.app.user);
            this.context.flux.getStore('app').listenTo(this._onChangeApp);
            this.context.flux.getStore('contact').listenTo(this._onChangeContact);
            this.context.flux.getStore('product').listenTo(this._onChangeProduct);
            this.context.flux.getStore('post').listenTo(this._onChangePost);
            this.context.flux.getStore('order').listenTo(this._onChangeOrder);
            this.context.flux.getStore('review').listenTo(this._onChangeReview);
        },

        componentWillUnmount: function () {
            this.context.flux.getStore('app').unlistenTo(this._onChangeApp);
            this.context.flux.getStore('contact').unlistenTo(this._onChangeContact);
            this.context.flux.getStore('product').unlistenTo(this._onChangeProduct);
            this.context.flux.getStore('post').unlistenTo(this._onChangePost);
            this.context.flux.getStore('order').unlistenTo(this._onChangeOrder);
            this.context.flux.getStore('review').unlistenTo(this._onChangeReview);
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

        // component methods
        _onChangeProduct: function () {
            this.setState({
                product: this.context.flux.getStore('product').getState()
            });
        },

        _onChangeOrder: function () {
            this.setState({
                order: this.context.flux.getStore('order').getState()
            });
        },

        _onChangeReview: function () {
            this.setState({
                review: this.context.flux.getStore('review').getState()
            });
        },

        _onChangePost: function () {
            this.setState({
                post: this.context.flux.getStore('post').getState()
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
            var content;
            var props = assign({}, {
                user: this.state.app.user,
                pendingApp: this.state.app.pending,
            });

            if (this.isActive('adminEditOrder') || this.isActive('adminNewOrder')) {
                assign(props, {
                    order: this.state.order.order,
                    pending: this.state.order.pending
                });
            } else if (this.isActive('adminOrders')) {
                assign(props, {
                    orders: this.state.order.orders,
                    pending: this.state.order.pending
                });
            } else if (this.isActive('adminEditProduct') || this.isActive('adminNewProduct')) {
                assign(props, {
                    product: this.state.product.product,
                    pending: this.state.product.pending
                });
            } else if (this.isActive('adminProducts')) {
                assign(props, {
                    products: this.state.product.products,
                    pending: this.state.product.pending
                });
            } else if (this.isActive('adminEditReview') || this.isActive('adminNewReview')) {
                assign(props, {
                    review: this.state.review.review,
                    pending: this.state.review.pending
                });
            } else if (this.isActive('adminReviews')) {
                assign(props, {
                    reviews: this.state.review.reviews,
                    pending: this.state.review.pending
                });
            } else if (this.isActive('adminEditPostPage') || this.isActive('adminNewPostPage') ||
                this.isActive('adminEditPostBlog') || this.isActive('adminNewPostBlog')) {
                assign(props, {
                    post: this.state.post.post,
                    type: this.isActive('adminEditPostPage') || this.isActive('adminNewPostPage') ? 'pages' : 'blogs',
                    pending: this.state.post.pending
                });
            } else if (this.isActive('adminPostPages') || this.isActive('adminPostBlogs')) {
                assign(props, {
                    posts: this.isActive('adminPostBlogs') ? this.state.post.blogs : this.state.post.pages,
                    pending: this.state.post.pending
                });
            } else if (this.isActive('adminMenuBuilder')) {
                assign(props, {
                    pages: this.state.post.pages
                });
            } else if (this.isActive('adminContacts')) {
                assign(props, {
                    contacts: this.state.contact.contacts,
                    pending: this.state.contact.pending
                });
            } else if (this.isActive('adminEditContact')) {
                assign(props, {
                    contact: this.state.contact.contact,
                    pending: this.state.contact.pending
                });
            }

            var isLoading;

            if (props.pendingApp) {
                isLoading = true;
            } else {
                isLoading = false;
            }

            if(props.user.get('is_admin')) {
                content = (
                    <RouteHandler {...props} />
                );
            } else {
                content = (
                    <div>
                        <h1>Sem Acesso ao Admin</h1>
                        <Link to="/"> Retornar ao website </Link>
                    </div>
                );
            }

            return (
                <Layout fixedHeader={true}  >
                    <Header user={props.user} />
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
                            {content}
                        </Progress>
                        <Footer />
                    </main>
                </Layout>

            );
        }
    });

module.exports = AdminContainer;
