
var FirebaseUtils = require('../utils/FirebaseUtils'),
    db = FirebaseUtils.initFirebase(),
    MiniFlux = require('../utils/MiniFlux'),
    CartActions;

CartActions = MiniFlux.createAction({

    _config: {
        addProduct: {
            track: {
                analytics: {
                    addProduct: {id: null, name: null, price: null, quantity: null},
                    setAdd: {},
                    sendEvent: {category: 'Cart', action: 'addProduct', label: null}
                }
            }
        },
        removeProduct: {
            track: {
                analytics: {
                    addProduct: {id: null, name: null, price: null, quantity: null},
                    setRemove: {},
                    sendEvent: {category: 'Cart', action: 'removeProduct', label: null}
                }
            }
        },
        updateProduct: {},
        updateCart: {
            track: {
                analytics: {
                    sendEvent: {category: 'Cart', action: 'updateCart', label: null}
                }
            }
        },
        updateAddress: {
            track: {
                analytics: {
                    sendEvent: {category: 'Cart', action: 'updateAddress', label: null}
                }
            }
        },
        setCurrentCart: {
            track: {
                analytics: {
                    sendEvent: {category: 'Cart', action: 'setCurrentCart', label: null }
                }
            }
        },
        checkout: {
            track: {
                analytics: {
                    addProduct: {id: null, name: null, price: null, quantity: null},
                    setCheckout: {step: null},
                    sendEvent: {category: 'Cart', action: 'checkout', label: null}
                }
            }
        }
    },

    addProduct: function (Cart, Product) {
        this.track('addProduct', 'analytics', 'addProduct', {
            id: Product.get('id'),
            name: Product.get('title'),
            price: Product.get('price'),
            quantity: Product.get('quantity')
        });
        this.track('addProduct', 'analytics', 'setAdd');
        this.track('addProduct', 'analytics', 'sendEvent', {label:Product.get('id')});
        Cart = Cart.updateProduct(Product, 'add');
        this.updateCart(Cart);
        return Cart;
    },

    removeProduct: function (Cart, Products) {

        if (Products.getRecordFactory) {
            Products.get('list').forEach( function (Product) {
                this.track('removeProduct', 'analytics', 'addProduct', {
                    id: Product.get('id'),
                    name: Product.get('title'),
                    price: Product.get('price'),
                    quantity: Product.get('quantity')
                });
                this.track('removeProduct', 'analytics', 'setRemove');
                this.track('removeProduct', 'analytics', 'sendEvent', { label: Product.get('id') });
                Cart = Cart.updateProduct(Product, 'remove');
            }.bind(this));
        } else {
            this.track('removeProduct', 'analytics', 'addProduct', {
                id: Products.get('id'),
                name: Products.get('title'),
                price: Products.get('price'),
                quantity: Products.get('quantity')
            });
            this.track('removeProduct', 'analytics', 'setRemove');
            this.track('removeProduct', 'analytics', 'sendEvent', { label: Products.get('id') });
            Cart = Cart.updateProduct(Products, 'remove');
        }
        this.updateCart(Cart);
        return Cart;
    },

    selectProducts: function (SelectedProducts, Product, select) {
        if (select) {
            SelectedProducts = SelectedProducts.update(Product);
        } else {
            SelectedProducts = SelectedProducts.remove(Product);
        }
        return SelectedProducts;
    },

    // update the cart product data, normally used for changes in quantity
    updateProduct: function (Cart, Product) {
        Cart = Cart.updateProduct(Product, 'update');
        this.updateCart(Cart);
        return Cart;
    },

    updateAddress: function (Cart, UserAddress) {
        Cart = Cart.updateAddress(UserAddress);
        this.track('updateAddress', 'analytics', 'sendEvent', { label: Cart.get('id') });
        this.updateCart(Cart);
        return Cart;
    },

    // the updated cart
    updateCart: function (Cart) {
        this.track('updateCart', 'analytics', 'sendEvent', { label: Cart.get('id') });
        return this.async( function (callback) {
            var cartValidationResult = Cart.invalidate();
            if (cartValidationResult.isValid()) {
                db.tables.carts.update(Cart.toFirebaseJS(), callback);
            } else {
                callback(new Error('updateCart carrinho com dados inválidos: ' + cartValidationResult.getStringifiedMessages()));
            }

        }, Cart);
    },

    setCurrentCart: function (Cart, User) {

        Cart = Cart.merge({
            id: User.get('uid'),
            uid: User.get('uid')
        });

        this.track('setCurrentCart', 'analytics', 'sendEvent', {label:Cart.get('id')});

        return this.async( function (callback) {
            // if there is data in current cart, update it (normally this will be
            // trigged when player state changes)
            if (Cart.get('products').total()) {
                this.updateCart(Cart);
            }
            // Start watching forever for changes on the current cart...
            db.utils.oneOn('currentCart', db.tables.carts.child(Cart.get('id')), 'value', function success(dataSnapshot) {
                if (!dataSnapshot || !dataSnapshot.exists()) {
                    this.updateCart(Cart);
                } else {
                    Cart = Cart.clear().merge(FirebaseUtils.fromFirebaseJS(dataSnapshot));
                }
                callback(Cart);

            }.bind(this), callback);
        }.bind(this), Cart);
    },

    checkout: function (Cart, step) {
        // TODO add step as part of cart properties
        step = parseInt(step) || 1;
        if (!this.types.isNumber(step)) throw new TypeError('Checkout step must be a number');
        if (Cart) {
            Cart.get('products').get('list').forEach( function (product) {
                this.track('checkout', 'analytics', 'addProduct', {
                    id: product.get('id'),
                    name: product.get('title'),
                    price: product.get('price'),
                    quantity: product.get('quantity')
                });
            }.bind(this));
            this.track('checkout', 'analytics', 'setCheckout', { step: step });
            this.track('checkout', 'analytics', 'sendEvent', { label: Cart.get('id') });
        }
        return step;
    }
});

module.exports = CartActions;
