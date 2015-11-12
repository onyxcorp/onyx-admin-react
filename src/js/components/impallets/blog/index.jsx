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
    PostContainer;

PostContainer =
    React.createClass({
        // component config
        contextTypes: {
            flux: React.PropTypes.object
        },

        statics: {
            fetchInitialData: function (flux, state) {
                // from app container
                flux.getActions('app').setRoutes(state.routes, state.path);

                state.routes.forEach(function (route) {
                    switch (route.name) {
                        case 'page':
                            if (state.params && state.params.slug) flux.getActions('post').setPostBySlug(flux.getStore('post').getState('pages'), 'pages', state.params.slug);
                        break;
                        case 'pagesList':
                            flux.getActions('post').setPosts(flux.getStore('post').getState('posts'), 'pages');
                        break;
                        case 'blog':
                            if (state.params && state.params.slug) flux.getActions('post').setPostBySlug(flux.getStore('post').getState('blogs'), 'blogs', state.params.slug);
                        break;
                        case 'blogsList':
                            flux.getActions('post').setPosts(flux.getStore('post').getState('blogs'), 'blogs');
                        break;
                    }
                });
            }
        },

        mixins: [ Router.State ],

        // component initialization
        getInitialState: function () {
            return {
                app: this.context.flux.getStore('app').getState(),
                cart: this.context.flux.getStore('cart').getState(),
                user: this.context.flux.getStore('user').getState(),
                post: this.context.flux.getStore('post').getState()
            };
        },

        // component lifecycle (in order)
        componentWillMount: function () {
            this.context.flux.getActions('app').watch(this.state.app.user);
            this.context.flux.getStore('app').listenTo(this._onChangeApp);
            this.context.flux.getStore('cart').listenTo(this._onChangeCart);
            this.context.flux.getStore('user').listenTo(this._onChangeUser);
            this.context.flux.getStore('post').listenTo(this._onChangePost);
        },

        componentWillUnmount: function () {
            this.context.flux.getStore('app').unlistenTo(this._onChangeApp);
            this.context.flux.getStore('cart').unlistenTo(this._onChangeCart);
            this.context.flux.getStore('user').unlistenTo(this._onChangeUser);
            this.context.flux.getStore('post').unlistenTo(this._onChangePost);
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

        _onChangeUser: function () {
            this.setState({
                user: this.context.flux.getStore('user').getState()
            });
        },

        _onChangePost: function () {
            this.setState({
                post: this.context.flux.getStore('post').getState()
            });
        },

        render: function () {
            var props = assign({},{
                user: this.state.app.user,
                pendingApp: this.state.app.pending,
                cart: this.state.cart.cart,
                pendingCart: this.state.cart.pending,
                post: this.state.post.post,
                pending: this.state.post.pending
            });

            var isLoading;

            if (props.pendingApp || props.pendingCart) {
                isLoading = true;
            } else {
                isLoading = false;
            }

            return (
                <Layout fixedHeader={true}>
                    <Header cart={props.cart} user={props.user} />
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

module.exports = PostContainer;
