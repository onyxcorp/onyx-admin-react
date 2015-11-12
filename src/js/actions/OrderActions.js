
var FirebaseUtils = require('../utils/FirebaseUtils'),
    db = FirebaseUtils.initFirebase(),
    MiniFlux = require('../utils/MiniFlux'),
    OrderActions;

OrderActions = MiniFlux.createAction({

    _config: {
        createOrder: {},
        setOrders: {
            track: {
                analytics: {
                    sendEvent: {category: 'Order', action: 'setOrders'}
                }
            }
        },
        setOrdersByUser: {
            track: {
                analytics: {
                    sendEvent: {category: 'Order', action: 'setOrdersByUser', label: null}
                }
            }
        },
        setOrderById: {
            track: {
                analytics: {
                    sendEvent: {category: 'Order', action: 'setOrderById', label: null}
                }
            }
        },
        updateOrder: {
            track: {
                analytics: {
                    sendEvent: {category: 'Order', action: 'updateOrder', label: null}
                }
            }
        },
        createOrderFromCart: {
            track: {
                analytics: {
                    addProduct: {id: null, name: null, price: null, quantity: null},
                    setPurchase: {id: null, revenue: null, tax: null, shipping: null},
                    sendEvent: {category: 'Order', action: 'createOrderFromCart', label: null}
                }
            }
        }
    },

    // called in admin when manually creating an order (sync)
    createOrder: function () {
        return null;
    },

    // called from the user when finishing a shop from a cart
    createOrderFromCart: function (Order, Cart) {

        // need to delete the id so the order object can be created with a new one
        Order = Order.clear().merge(Cart.delete('id'));

        return this.async( function (callback) {

            var orderValidationResult = Order.invalidate();

            if (orderValidationResult.isValid()) {
                db.tables.orders.update(Order.toFirebaseJS(), function completed(err) {
                    if (err) {
                        callback(err);
                    } else { // success!
                        // everything was ok, send the purchase as successfull to analytics
                        Order.get('products').get('list').forEach(function (product) {
                            this.track('createOrderFromCart', 'analytics', 'addProduct', {
                                id: product.get('id'),
                                name: product.get('title'),
                                price: product.get('price'),
                                quantity: product.get('quantity')
                            });
                        }.bind(this));
                        this.track('createOrderFromCart', 'analytics', 'setPurchase', {
                            id: Order.get('id'),
                            revenue: Order.get('total'),
                            tax: 0,
                            shipping: 0
                        });
                        this.track('createOrderFromCart', 'analytics', 'sendEvent', {label:Order.get('id')});
                        // everything went just fine, clear the cart
                        db.tables.carts.update(Cart.clear().toFirebaseJS(), callback);
                    }
                }.bind(this));
            } else {
                callback(new Error('createOrderFromCart Cart com dados inválidos: ' + orderValidationResult.getStringifiedMessages()));
            }
            callback();
        }.bind(this), Order);
    },

    setOrders: function (Orders, total, from, more) {
        return this.async( function (callback) {
            from = from || 'store';
            var startAt = more && Orders.total() ? Orders.getLast().get('id') : null; // most recent first by default
            db.utils.watchSet('setOrders', db.tables.orders, total, startAt, function success(dataSnapshot) {
                if (from === 'store') this.track('setOrders', 'analytics', 'sendEvent');
                callback(Orders.updateAll(FirebaseUtils.fromFirebaseJS(dataSnapshot, 'list')));
            }.bind(this), callback);
        }.bind(this), Orders);
    },

    // TODO weird behavior
    setOrdersByUser: function (Orders, User, from) {
        Orders = Orders.set('list', Orders.filterBy('uid', User.get('uid')).get('filteredList'));
        from = from || 'store';
        if (from === 'store') this.track('setOrdersByUser', 'analytics', 'sendEvent', {label: User.get('uid')});
        return this.async( function (callback) {
            if (User.get('uid')) {
                db.utils.oneOn('setOrdersByUser', db.tables.orders.orderByChild('uid').equalTo(User.get('uid')), 'value', function success(dataSnapshot) {
                    callback(Orders.clear().updateAll(FirebaseUtils.fromFirebaseJS(dataSnapshot, 'list')));
                }, callback);
            } else {
                callback(new Error('setOrdersByUser User com UID inválido'));
            }
        }, Orders);
    },

    // event on which order are being viewed now
    setOrderById: function (Orders, orderId, from) {
        var Order = Orders.getById(orderId);
        if (!Order) Order = Orders.newRecord().set('id', orderId);
        from = from || 'store';
        if (from === 'store') this.track('setOrderById', 'analytics', 'sendEvent', {label: orderId});
        return this.async( function (callback) {
            db.utils.oneOn('setOrderById', db.tables.orders.child(orderId), 'value', function success(dataSnapshot) {
                Order = Order.merge(FirebaseUtils.fromFirebaseJS(dataSnapshot));
                callback(Order);
            }, callback);
        }, Order);
    },

    updateOrder: function (Order, from) {
        from = from || 'store';
        if (from === 'store') this.track('updateOrder', 'analytics', 'sendEvent', {label: Order.get('id')});
        return this.async( function (callback) {

            var orderValidationResult = Order.invalidate();

            if (orderValidationResult.isValid()) {
                db.tables.orders.update(Order.toFirebaseJS(), callback);
            } else {
                callback(new Error('updateOrder Order com dados inválidos: ' + orderValidationResult.getStringifiedMessages()));
            }
        }, Order);
    }
});

module.exports = OrderActions;
