var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Link = require('react-router').Link,
    Img = require('../../../common').Img,
    Drawer = require('../../../mdl').Drawer,
    Navigation = require('../../../mdl').Navigation,
    CartDrawer;

CartDrawer = React.createClass({

    displayName: 'CartDrawer',

    mixins: [PureRenderMixin],

    render: function () {

        return (
            <Drawer
                style={{backgorund: '#fff'}}
                className='impallets-logo-image'
                title={<Img style={{base:{margin: '10px 0'}}} src='/assets/images/logo1.png' alt='Impallets' title='Impallets' />}>
                <Navigation drawer={true}>
                    <Link to="store">Início</Link>
                    <Link to="blogs">Blog</Link>
                    <Link to="contactCorporative">Venda Corporativa</Link>
                    <Link to="page" params={{ slug: 'sobre-nos' }}>Sobre Nós</Link>
                    <Link to="contact">Contato</Link>
                </Navigation>
            </Drawer>
        );
    }
});

module.exports = CartDrawer;
