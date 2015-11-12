var MiniFlux = require('../utils/MiniFlux'),
    ProductFactory = require('../data/records/Product'),
    ProductListFactory = require('../data/lists/Products'),
    ProductStore;

ProductStore = MiniFlux.createStore({

    _init: function (flux) {
        this.register(flux.getActions('product').sortProducts, this._handleSortProducts);
        this.register(flux.getActions('product').filterProducts, this._handleFilterProducts);
        this.register(flux.getActions('product').createProduct, this._handleCreateProduct);
        this.registerAsync(flux.getActions('product').setProducts, this._handleSetProducts, this._handleSetProductsCompleted);
        this.registerAsync(flux.getActions('product').setProductBySlug, this._handleSetProductBySlugOrId, this._handleSetProductBySlugOrIdCompleted);
        this.registerAsync(flux.getActions('product').setProductById, this._handleSetProductBySlugOrId, this._handleSetProductBySlugOrIdCompleted);
        this.registerAsync(flux.getActions('product').updateProduct, this._handleUpdateProduct, this._handleUpdateProductCompleted);
    },

    initialState: {
        products: ProductListFactory.create(),
        product: ProductFactory.create(),
        pending: 'isLoading'
    },

    _handleCreateProduct: function () {
        this.setState({
            product: ProductFactory.create(),
            pending: false
        });
    },

    _handleSortProducts: function (Products) {
        if (this.getState('products') !== Products) {
            this.setState({
                products: Products
            });
        }
    },

    _handleFilterProducts: function (Products) {
        if (this.getState('products') !== Products) {
            this.setState({
                products: Products
            });
        }
    },

    _handleSetProducts: function (Products) {

        var newState = {},
            currentState = this.getState();

        if (!currentState.products.total()) {
            newState.pending = 'isLoadingProducts';
        } else {
            newState.pending = 'isLoadingMoreProducts';
        }

        if (currentState.products !== Products) {
            newState.products = Products;
        }
        this.setState(newState);
    },
    _handleSetProductsCompleted: function (Products) {

        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.containsOr('isLoading', 'isLoadingProducts', 'isLoadingMoreProducts') : false);

        if (this.types.isError(Products)) {
            this.error.track(Products);
            if (isPending) this.rollback();
        } else {
            if (currentState.products !== Products) {
                newState.products = Products;
            }
            if (isPending) newState.pending = false;
            this.setState(newState);
        }
    },

    _handleSetProductBySlugOrId: function (Product) {

        var newState = {},
            currentState = this.getState();

        // try to get the product only if we have a product list bigger than 0
        if (currentState.product !== Product) {
            newState.product = Product;
        }
        if (!newState.product) newState.pending = 'isLoadingProduct';
        this.setState(newState);
    },
    _handleSetProductBySlugOrIdCompleted: function (Product) {

        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.containsOr('isLoading', 'isLoadingProduct') : false);

        if (this.types.isError(Product)) {
            this.error.track(Product);
            if (isPending) this.rollback();
        } else {
            if (currentState.product !== Product) {
                newState.products = currentState.products.update(Product);
                newState.product = newState.products.getById(Product.get('id'));
            }
            if (isPending) newState.pending = false;
            this.setState(newState);
        }
    },

    _handleUpdateProduct: function (Product) {

        var newState = {},
            currentState = this.getState();

        if (Product && Product.invalidate().isValid()) {
            newState.products = currentState.products.update(Product);
            // If there is a current selected product and it's the same being updated, update it
            if (currentState.product && currentState.product.get('id') === Product.get('id')) {
                newState.product = newState.products.get('lastUpdated');
            }
        }
        this.setState(newState);
    },
    _handleUpdateProductCompleted: function (error) {
        if (this.types.isError(error)) {
            this.error.track(error);
        }
    }
});

module.exports = ProductStore;
