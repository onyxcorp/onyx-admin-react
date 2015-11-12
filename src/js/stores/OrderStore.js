var MiniFlux = require('../utils/MiniFlux'),
    OrderFactory = require('../data/records/Order'),
    OrderListFactory = require('../data/lists/Orders'),
    OrderStore;

OrderStore = MiniFlux.createStore({

    _init: function (flux) {
        this.register(flux.getActions('order').createOrder, this._handleCreateOrder);
        // everytime we reach the checkout page we should create a new empty order
        this.registerAsync(flux.getActions('order').createOrderFromCart, this._handleCreateOrderFromCart, this._handleCreateOrderFromCartCompleted);
        this.registerAsync(flux.getActions('order').setOrders, this._handleSetOrders, this._handleSetOrdersCompleted);
        this.registerAsync(flux.getActions('order').setOrdersByUser, this._handleSetOrders, this._handleSetOrdersCompleted);
        this.registerAsync(flux.getActions('order').setOrderById, this._handleSetOrderById, this._handleSetOrderByIdCompleted);
        this.registerAsync(flux.getActions('order').updateOrder, this._handleUpdateOrder, this._handleUpdateOrderCompleted);
    },

    initialState: {
        orders: OrderListFactory.create(),
        order: OrderFactory.create(),
        pending: 'isLoading',
        orderCreatedFromCart: false
    },

    _handleCreateOrder: function () {
        this.setState({
            order: OrderFactory.create(),
            orderCreatedFromCart: false,
            pending: null
        });
    },

    _handleSetOrders: function (Orders) {

        var newState = {},
            currentState = this.getState();

        if (!currentState.orders.total()) {
            newState.pending = 'isLoadingOrders';
        } else {
            newState.pending = 'isLoadingMoreOrders';
        }

        if (currentState.orders !== Orders) {
            newState.orders = Orders;
        }
        this.setState(newState);

    },
    _handleSetOrdersCompleted: function (Orders) {

        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.containsOr('isLoading', 'isLoadingOrders', 'isLoadingMoreOrders') : false);

        if (this.types.isError(Orders)) {
            this.error.track(Orders);
            if (isPending) this.rollback();
        } else {
            if (currentState.orders !== Orders) {
                newState.orders = Orders;
            }
            if (isPending) newState.pending = false;
            this.setState(newState);
        }
    },

    _handleSetOrderById: function (Order) {

        var newState = {},
            currentState = this.getState();

        if (currentState.order !== Order) {
            newState.order = Order;
        }
        // no order found to show
        if (!newState.order && !currentState.order) newState.pending = 'isLoadingOrder';
        this.setState(newState);
     },
    _handleSetOrderByIdCompleted: function (Order) {

        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.containsOr('isLoading', 'isLoadingOrder') : false);

        if (this.types.isError(Order)) {
            this.error.track(Order);
            if (isPending) this.rollback();
        } else {
            if (currentState.order !== Order) {
                newState.orders = currentState.orders.update(Order);
                newState.order = newState.orders.getById(Order.get('id'));
            }
            if (isPending) newState.pending = false;
            this.setState(newState);
        }
    },

    // update the current existing order with the one that we are receiving now
    _handleCreateOrderFromCart: function (Order) {
        this.setState({
            order: Order,
            pending: 'isCreatingOrder'
        });
    },
    _handleCreateOrderFromCartCompleted: function (error) {

        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.contains('isCreatingOrder') : false);

        if (this.types.isError(error)) {
            this.error.track(error);
            if (isPending) this.rollback();
        } else {
            if (isPending) newState.pending = false;
            newState.orderCreatedFromCart = true;
            this.setState(newState);
        }
    },

    _handleUpdateOrder: function (Order) {

        var newState = {},
            currentState = this.getState();

        if (Order && Order.invalidate().isValid()) {
            newState.orders = currentState.orders.update(Order);
            // If there is a current selected Orders and it's the same being updated, update it
            if (currentState.order && currentState.order.get('id') === Order.get('id')) {
                newState.order = newState.orders.get('lastUpdated');
            }
        }
        this.setState(newState);
    },
    _handleUpdateOrderCompleted: function (error) {
        if (this.types.isError(error)) {
            this.error.track(error);
        }
    }
});

module.exports = OrderStore;
