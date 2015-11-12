var MiniFlux = require('../utils/MiniFlux'),
    CartFactory =  require('../data/records/Cart'),
    ProductListFactory = require('../data/lists/Products'),
    CartStore;

CartStore = MiniFlux.createStore({

    _init: function (flux) {
        this.register(flux.getActions('cart').addProduct, this._handleAddProduct);
        this.register(flux.getActions('cart').removeProduct, this._handleRemoveProduct);
        this.register(flux.getActions('cart').updateProduct, this._handleUpdateProduct);
        this.register(flux.getActions('cart').updateAddress, this._handleUpdateAddress);
        this.register(flux.getActions('cart').selectProducts, this._handleSelectProducts);
        this.register(flux.getActions('cart').checkout, this._handleCheckout);
        this.registerAsync(flux.getActions('order').createOrderFromCart, this._handleCreateOrderFromCart, this._handleCreateOrderFromCartCompleted);
        this.registerAsync(flux.getActions('cart').setCurrentCart, this._handleSetCurrent, this._handleSetCurrentCompleted);
        this.registerAsync(flux.getActions('cart').updateCart, this._handleUpdate, this._handleUpdateCompleted);
    },

    initialState: {
        cart: CartFactory.create(),
        selectedProducts: ProductListFactory.create(),
        checkoutStep: 0,
        completed: false,
        pending: 'isLoading'
    },

    _handleAddProduct: function (Cart) { /** do nothing **/ },
    _handleRemoveProduct: function (Cart) { /** do nothing **/ },
    _handleUpdateProduct: function (Cart) { /** do nothing **/ },
    _handleUpdateAddress: function (Cart) { /** do nothing **/ },

    _handleSelectProducts: function (Products) {
        if (this.getState('selectedProducts') !== Products) {
            this.setState({
                selectedProducts: Products
            });
        }
    },

    _handleCheckout: function (step) {
        step = parseInt(step) || 1;
        this.setState({ checkoutStep: step });
    },

    _handleCreateOrderFromCart: function (Order) {
        this.setState({
            pending: 'isCreatingOrderFromCart'
        });
    },
    _handleCreateOrderFromCartCompleted: function (error) {
        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.contains('isCreatingOrderFromCart') : false);

        if (this.types.isError(error)) {
            this.error.track(error);
            if (isPending) this.rollback();
        } else {
            newState.cart = currentState.cart.clear();
            newState.completed = false;
            newState.checkoutStep = 0;
            if (isPending) newState.pending = false;
        }
        this.setState(newState);
    },

    _handleSetCurrent: function (Cart) {

        var newState = {},
            currentState = this.getState();

        if (currentState.cart !== Cart) {
            newState.cart = Cart;
            newState.pending = 'isLoadingCart';
        }
        this.setState(newState);
    },
    _handleSetCurrentCompleted: function (Cart) {

        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.containsOr('isLoading', 'isLoadingCart') : false);
        if (this.types.isError(Cart)) {
            this.error.track(Cart);
            if (isPending) this.rollback();
        } else {
            if (currentState.cart !== Cart) newState.cart = Cart;
            if (isPending) newState.pending = false;
            this.setState(newState);
        }
    },

    _handleUpdate: function (Cart) {

        var newState = {},
            currentState = this.getState();

        if (Cart && currentState.cart !== Cart && Cart.invalidate().isValid()) {
            newState.cart = Cart;   // optimisc update
        }
        this.setState(newState);
    },
    _handleUpdateCompleted: function (error) {

        var newState = {},
            currentState = this.getState();

        if (this.types.isError(error)) {
            this.error.track(error);
        } else {
            if (
                !currentState.cart.invalidateSchema('completed').isInvalid() && // all data are set ?
                currentState.cart.get('address').total() && // have at least 1  address?
                currentState.cart.get('products').total()   // have at least 1  product ?
            ) {
                newState.completed = true;
            }
        }
        this.setState(newState);
    }
});

module.exports = CartStore;
