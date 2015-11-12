var MiniFlux = require('./utils/MiniFlux').createFlux(),
    AppActions = require('./actions/AppActions'),
    ContactActions = require('./actions/ContactActions'),
    CartActions = require('./actions/CartActions'),
    ProductActions = require('./actions/ProductActions'),
    PostActions = require('./actions/PostActions'),
    ReviewActions = require('./actions/ReviewActions'),
    UserActions = require('./actions/UserActions'),
    OrderActions = require('./actions/OrderActions'),
    AppStore = require('./stores/AppStore'),
    CartStore = require('./stores/CartStore'),
    ContactStore = require('./stores/ContactStore'),
    ProductStore = require('./stores/ProductStore'),
    PostStore = require('./stores/PostStore'),
    ReviewStore = require('./stores/ReviewStore'),
    UserStore = require('./stores/UserStore'),
    OrderStore = require('./stores/OrderStore'),
    MessageStore = require('./stores/MessageStore'),
    OnyxFlux;

OnyxFlux = new MiniFlux();
OnyxFlux.createAction('app', AppActions);
OnyxFlux.createAction('contact', ContactActions);
OnyxFlux.createAction('cart', CartActions);
OnyxFlux.createAction('product', ProductActions);
OnyxFlux.createAction('post', PostActions);
OnyxFlux.createAction('review', ReviewActions);
OnyxFlux.createAction('user', UserActions);
OnyxFlux.createAction('order', OrderActions);
OnyxFlux.createStore('app', AppStore);
OnyxFlux.createStore('cart', CartStore);
OnyxFlux.createStore('contact', ContactStore);
OnyxFlux.createStore('product', ProductStore);
OnyxFlux.createStore('post', PostStore);
OnyxFlux.createStore('review', ReviewStore);
OnyxFlux.createStore('user', UserStore);
OnyxFlux.createStore('order', OrderStore);
OnyxFlux.createStore('message', MessageStore);

// Tests(Flux);

module.exports = OnyxFlux;
