var React = require('react'),
    Router = require('react-router'),
    Route = Router.Route,
    Redirect = Router.Redirect,
    NotFoundRoute = Router.NotFoundRoute,
    DefaultRoute = Router.DefaultRoute,
    // Containers (stateful components)
    App = require('./app.jsx'),
    AdminContainer = require('./admin'),
    CartContainer = require('./cart'),
    PostContainer = require('./blog'),
    StoreContainer = require('./store'),

    // Prop components
    Products = require('./store/views/productsList.jsx'),
    Product = require('./store/views/product.jsx'),
    Orders = require('./store/views/userOrders.jsx'),
    Order = require('./store/views/userOrder.jsx'),
    UserDashboard = require('./store/views/userDashboard.jsx'),
    Contact = require('./store/views/contact.jsx'),
    contactCorporative = require('./store/views/contactCorporative.jsx'),
    Posts = require('./blog/views/postsList.jsx'),
    Post = require('./blog/views/post.jsx'),
    CartSummary = require('./cart/views/cartSummary.jsx'),
    OnePageCheckout = require('./cart/views/checkout.jsx'),
    StoreNotFound = require('./store/static/notFound.jsx'),
    CartNotFound = require('./cart/static/notFound.jsx'),
    BlogNotFound = require('./blog/static/notFound.jsx'),

    // Admin prop components
    AdminDashboard = require('./admin/views/dashboard.jsx'),
    AdminContacts = require('./admin/views/contactsList.jsx'),
    AdminContact = require('./admin/views/contact.jsx'),
    AdminOrders = require('./admin/views/ordersList.jsx'),
    AdminOrder = require('./admin/views/order.jsx'),
    AdminProducts = require('./admin/views/productsList.jsx'),
    AdminProduct = require('./admin/views/product.jsx'),
    AdminPost = require('./admin/views/post.jsx'),
    AdminPosts = require('./admin/views/postsList.jsx'),
    AdminReviews = require('./admin/views/reviewsList.jsx'),
    AdminReview = require('./admin/views/review.jsx'),
    AdminSystem = require('./admin/views/system.jsx'),
    AdminMenuBuilder = require('./admin/views/smartMenu.jsx'),
    AdminNotFound = require('./admin/static/notFound.jsx');

var routes = (
    <Route name="app" path="/" handler={App}>

        <Route name="admin" path="/admin" handler={AdminContainer}>
            <DefaultRoute name="adminDashboard" handler={AdminDashboard} />

            <Route name="adminContacts" path="adminContacts" handler={AdminContacts} />
            <Route name="adminEditContact" path="adminEditContact/:id" handler={AdminContact} />

            <Route name="adminOrders" path="adminOrders" handler={AdminOrders}/>
            <Route name="adminEditOrder" path="adminEditOrder/:id" handler={AdminOrder}/>
            <Route name="adminNewOrder" path="adminNewOrder" handler={AdminOrder}/>

            <Route name="adminPostBlogs" path="adminPostBlogs" handler={AdminPosts}/>
            <Route name="adminPostPages" path="adminPostPages" handler={AdminPosts}/>
            <Route name="adminEditPostBlog" path="adminEditPostBlog/:id" handler={AdminPost}/>
            <Route name="adminNewPostBlog" path="adminNewPostBlog" handler={AdminPost}/>
            <Route name="adminEditPostPage" path="adminEditPostPage/:id" handler={AdminPost}/>
            <Route name="adminNewPostPage" path="adminNewPostPage" handler={AdminPost}/>

            <Route name="adminProducts" path="adminProducts" handler={AdminProducts}/>
            <Route name="adminEditProduct" path="adminEditProduct/:id" handler={AdminProduct}/>
            <Route name="adminNewProduct" path="adminNewProduct" handler={AdminProduct}/>

            <Route name="adminReviews" path="adminReviews" handler={AdminReviews}/>
            <Route name="adminEditReview" path="adminEditReview/:id" handler={AdminReview}/>
            <Route name="adminNewReview" path="adminNewReview" handler={AdminReview}/>

            <Route name="adminSystem" path="adminSystem" handler={AdminSystem}/>

            <Route name="adminMenuBuilder" path="adminMenuBuilder" handler={AdminMenuBuilder}/>

            <NotFoundRoute handler={AdminNotFound}/>
        </Route>

        <Route name="store" path="/loja" handler={StoreContainer}>
            <DefaultRoute name="products" handler={Products}/>
            <Route name="product" path="produtos/:slug" handler={Product}/>
            <Route name="orders" path="pedidos" handler={Orders} />
            <Route name="order" path="pedidos/:id" handler={Order}/>
            <Route name="userDashboard" path="perfil" handler={UserDashboard} />
            <Route name="contact" path="contato" handler={Contact} />
            <Route name="contactCorporative" path="contato-corporativo" handler={contactCorporative} />
            <NotFoundRoute handler={StoreNotFound}/>
        </Route>

        <Route name="cart" path="/carrinho" handler={CartContainer}>
            <DefaultRoute name="confirm" handler={CartSummary} />
            <Route name="checkout" path="fechamento" handler={OnePageCheckout} />
            <NotFoundRoute handler={CartNotFound}/>
        </Route>

        <Route name="blogs" path="/blogs" handler={PostContainer}>
            <DefaultRoute name="blogsList" handler={Posts} />
            <Route name="blog" path="/blog/:slug" handler={Post} />
            <Route name="pagesList" path="/paginas" handler={Posts} />
            <Route name="page" path="/pagina/:slug" handler={Post} />
            <NotFoundRoute handler={BlogNotFound}/>
        </Route>

        <Redirect from="*" to="/loja" />
    </Route>
);

module.exports = routes;
