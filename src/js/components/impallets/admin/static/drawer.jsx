var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Link = require('react-router').Link,
    Img = require('../../../common').Img,
    Drawer = require('../../../mdl').Drawer,
    Navigation = require('../../../mdl').Navigation,
    Divider = require('../../../mdl').Divider,
    AdminDrawer;

AdminDrawer = React.createClass({

    displayName: 'AdminDrawer',

    mixins: [PureRenderMixin],

    render: function () {

        return (
            <Drawer
                style={{backgorund: '#fff'}}
                className='impallets-logo-image'
                title={<Img style={{base:{margin: '10px 0'}}} src='/assets/images/logo1.png' alt='Impallets' title='Impallets' />}>
                <Navigation drawer={true}>
                    <Link to="adminOrders">Pedidos</Link>
                    <Link to="adminNewOrder">Novo Pedido</Link>
                    <Link to="adminProducts">Produtos</Link>
                    <Link to="adminNewProduct">Novo Produto</Link>
                    <Link to="adminReviews">Reviews</Link>
                    <Link to="adminNewReview">Novo Review</Link>
                    <Link to="adminContacts">Contatos</Link>
                </Navigation>
                <Divider />
                <Navigation drawer={true}>
                    <Link to="adminNewPostPage">Nova Página</Link>
                    <Link to="adminPostPages">Páginas</Link>
                    <Link to="adminNewPostBlog">Novo Blog</Link>
                    <Link to="adminPostBlogs">Blogs</Link>
                </Navigation>
            </Drawer>
        );
    }
});

module.exports = AdminDrawer;
