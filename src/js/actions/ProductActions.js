
var FirebaseUtils = require('../utils/FirebaseUtils.js'),
    db = FirebaseUtils.initFirebase(),
    debounce = require('debounce'),
    MiniFlux = require('../utils/MiniFlux'),
    ProductActions;

function sendFilterEvent(productProperty) {
    this.track('filterProducts', 'analytics', 'sendEvent', {label: productProperty});
}

function sendSearchEvent(searchTerm) {
    this.track('setSearch', 'analytics', 'sendEvent', {label: searchTerm});
}

// make sure to fire only every 5 seconds
var debouncedSendFilterProduct = debounce(sendFilterEvent, 5000);
// TODO the search logic was deleted, need to reimplement to use this debounce bellow
// var debouncedSendSearchEvent = debounce(sendSearchEvent, 5000);

ProductActions = MiniFlux.createAction({

    _config: {
        createProduct: {},
        filterProducts: {
            track: {
                analytics: {
                    sendEvent: {category: 'Product', action: 'filterProducts', label: null}
                }
            }
        },
        sortProducts: {
            track: {
                analytics: {
                    sendEvent: {category: 'Product', action: 'sortProducts', label: null}
                }
            }
        },
        shareProduct: {
            track: {
                analytics: {
                    sendEvent: {category: 'Product', action: 'shareProduct', label: null}
                }
            }
        },
        setProducts: {
            track: {
                analytics: {
                    addImpression: {id: null, name: null, price: null, list: 'Main Results'},
                    sendEvent: {category: 'Product', action:'setProducts'}
                }
            }
        },
        setProductBySlug: {
            track: {
                analytics: {
                    addProduct: {id: null, name: null, price: null},
                    setDetail: {},
                    sendEvent: {category: 'Product', action: 'setProductBySlug', label: null}
                }
            }
        },
        setProductById: {},
        updateProduct: {}
    },

    createProduct: function () {
        return null;
    },

    filterProducts: function (Products, productProperty, filterTerm) {
        debouncedSendFilterProduct.call(this, productProperty);
        return Products.filterBy(productProperty, filterTerm);
    },

    sortProducts: function (Products, productProperty) {
        this.track('sortProducts', 'analytics', 'sendEvent', {label: productProperty});
        return Products.sortBy('title');
    },

    shareProduct: function (Product) {
        this.track('shareProduct', 'analytics', 'sendEvent', {label: Product.get('id')});
        return Product;
    },

    // envia os produtos que já tenha
    // envia uma requisição ao banco de dados por produtos
    setProducts: function (Products, total, from, more) {
        return this.async ( function (callback) {
            from = from || 'store';
            var startAt = more && Products.total() ? Products.getLast().get('id') : null; // most recent first by default
            db.utils.watchSet('setProducts', db.tables.products, total, startAt, function success(dataSnapshot) {
                var newProducts = Products.clear().updateAll(FirebaseUtils.fromFirebaseJS(dataSnapshot, 'list'));
                if (newProducts.total()) {
                    // only fire this action if the call came from the front
                    if (from === 'store') {
                        // fire analytics events only for the new products retrieved from the backend
                        newProducts.get('list').forEach(function (product) {
                            if (!Products.getById(product.get('id'))) {
                                this.track('setProducts', 'analytics', 'addImpression', {
                                    id: product.get('id'),
                                    name: product.get('title'),
                                    price: product.get('price')
                                });
                            }
                        }.bind(this));
                    }
                    Products = Products.updateAll(newProducts.get('list'));
                }
                this.track('setProducts', 'analytics', 'sendEvent');
                callback(Products);
            }.bind(this), callback);
        }.bind(this), Products);
    },

    setProductBySlug: function (Products, slug) {
        var Product = Products.getBySlug(slug);
        if (!Product) Product = Products.newRecord().set('slug', slug);
        return this.async( function (callback) {
            db.utils.oneOn('setProductBySlug', db.tables.products.orderByChild('slug').equalTo(slug), 'value', function success(dataSnapshot) {
                Product = Product.merge(FirebaseUtils.fromFirebaseJS(dataSnapshot, 'list').first());
                this.track('setProductBySlug', 'analytics', 'addProduct', {
                    id: Product.get('id'),
                    name: Product.get('title'),
                    price: Product.get('price')
                });
                this.track('setProductBySlug', 'analytics', 'setDetail');
                this.track('setProductBySlug', 'analytics', 'sendEvent', {label: slug});
                callback(Product);
            }.bind(this), callback);
        }.bind(this), Product);
    },

    // called in the admin area, there's no need for analytics events
    setProductById: function (Products, id) {
        var Product = Products.getById(id);
        if (!Product) Product = Products.newRecord().set('id', id);
        return this.async( function (callback) {
            db.utils.oneOn('setProductById', db.tables.products.child(id), 'value', function success(dataSnapshot) {
                Product = Product.merge(FirebaseUtils.fromFirebaseJS(dataSnapshot));
                callback(Product);
            }, callback);
        }, Product);
    },

    updateProduct: function (Product) {
        return this.async( function (callback) {

            var productValidationResult = Product.invalidate();

            if (productValidationResult.isValid()) {
                db.tables.products.update(Product.toFirebaseJS(), callback);
            } else {
                callback(new Error('updateProduct produto com da dos inválidos: ' + productValidationResult.getStringifiedMessages()));
            }
        }, Product);
    }
});

module.exports = ProductActions;
