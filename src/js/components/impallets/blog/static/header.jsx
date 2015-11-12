
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Link = require('react-router').Link,
    Header = require('../../../common').Header,
    Avatar = require('../../../common').Avatar,
    Img = require('../../../common').Img,
    MiniCart = require('../../../ecommerce').MiniCart,
    Button = require('../../../mdl').Button,
    Menu = require('../../../mdl').Menu,
    MenuItem = require('../../../mdl').MenuItem,
    Divider = require('../../../mdl').Divider,
    Navigation = require('../../../mdl').Navigation,
    BlogHeader;

BlogHeader = React.createClass({

    displayName: 'BlogHeader',

    contextTypes: {
        flux: React.PropTypes.object,
        router: React.PropTypes.func
    },

    propTypes: {
        user: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        cart: React.PropTypes.instanceOf(Immutable.Record).isRequired
    },

    mixins: [PureRenderMixin],

    _handleUserBox: function (event) {
        event.preventDefault();
        if (this.props.user.get('provider') === 'anonymous') {
            this.context.flux.getActions('app').modal('login');
        } else {
            this.context.router.transitionTo('userDashboard');
        }
    },

    _handleMenuSelection: function (event, key, payload) {
        this.context.router.transitionTo(payload.route);
    },

    _handleUserOrders: function (event) {
        event.preventDefault();
        this.context.router.transitionTo('orders');
    },

    _handleLogout: function (event) {
        event.preventDefault();
        this.context.flux.getActions('app').logout(this.props.user);
    },

    _handleMiniCartClick: function () {
        this.context.router.transitionTo('cart');
    },

    render: function () {

        var naming;

        if (this.props.user.get('provider') === 'anonymous' || !this.props.user.get('provider')) {
            naming = (
                <Button ripple={true} onClick={this._handleUserBox} iconButton={true} icon="person" className='impallets-more-button'/>
            );
        } else {
            naming = (
                <span className='impallets-more-button'>
                    <Button id="header-menu" ripple={true} iconButton={true} icon="person" className='impallets-more-button'/>
                    <Menu target="header-menu">
                        <MenuItem onClick={this._handleUserBox} icon="account_circle">Editar Perfil</MenuItem>
                        <MenuItem onClick={this._handleUserOrders} icon="view_list">Meus Orçamentos</MenuItem>
                        <Divider />
                        <MenuItem onClick={this._handleLogout} icon="power_settings_new">Sair/Logout</MenuItem>
                    </Menu>
                </span>
            );
        }

        return (
            <Header link='store' logo='/assets/images/logo1.png'>
                {naming}
                <div className='impallets-search-box'>
                    <MiniCart total={this.props.cart.get('products').total()} onClick={this._handleMiniCartClick} />
                </div>

                <span className="impallets-mobile-title mdl-layout-title">
                     <Link to="store">
                        <Img className="impallets-logo-image" src='/assets/images/logo1.png' alt='Impallets' title='Impallets' />
                     </Link>
                </span>

                <div className='impallets-navigation-container mdl-cell--hide-phone mdl-cell--hide-tablet'>
                    <Navigation className='impallets-navigation'>
                        <Link to="store" className='mdl-navigation__link'>Início</Link>
                        <Link to="blogs" className='mdl-navigation__link'>Blog</Link>
                        <Link to="page" params={{ slug: 'venda-corporativa' }} className='mdl-navigation__link'>Venda Corporativa</Link>
                        <Link to="page" params={{ slug: 'sobre-nos' }} className='mdl-navigation__link'>Sobre Nós</Link>
                        <Link to="contact" className='mdl-navigation__link'>Contato</Link>
                    </Navigation>
                </div>
            </Header>
        );
    }
});

module.exports = BlogHeader;
