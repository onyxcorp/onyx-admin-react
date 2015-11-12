var MiniFlux = require('../utils/MiniFlux'),
    UserFactory = require('../data/records/User'),
    UserAddressFactory = require('../data/records/UserAddress'),
    AppStore;

AppStore = MiniFlux.createStore({

    _init: function (flux) {
        this.register(flux.getActions('app').createAddress, this._handleCreateAddress);
        this.register(flux.getActions('app').setRoutes, this._handleRoutes);
        this.register(flux.getActions('app').setTitle, this._handleTitles);
        this.register(flux.getActions('app').modal, this._handleUserModal);
        this.register(flux.getActions('app').logout, this._handleUserLogout);
        this.registerAsync(flux.getActions('app').watch, this._handleUserWatch, this._handleUserWatchCompleted);
        this.registerAsync(flux.getActions('app').login, this._handleUserLogin, this._handleUserLoginCompleted);
        this.registerAsync(flux.getActions('app').register, this._handleUserRegister, this._handleUserRegisterCompleted);
        this.registerAsync(flux.getActions('app').updateUserData, this._handleUpdateUserData, this._handleUpdateUserDataCompleted);
        this.registerAsync(flux.getActions('app').updateUserAddressesData, this._handleUpdateUserData, this._handleUpdateUserDataCompleted);
        this.registerAsync(flux.getActions('app').updateUserProductListData, this._handleUpdateUserData, this._handleUpdateUserDataCompleted);
    },

    initialState: {
        routes: [],
        route: null,
        path: null,
        pageTitle: null,
        user: UserFactory.create(),
        address: UserAddressFactory.create(),
        modal: false,
        // isNew: false,    maybe reactivate in the future
        pending: 'isLoading'
    },

    _handleCreateAddress: function () {
        this.setState({
            address: UserAddressFactory.create()
        });
    },

    _handleRoutes: function (data) {
        var newState = {},
            currentState = this.getState();

        if (currentState.path !== data.path) {
            // rouyte list
            newState.routes = data.routes.map( function (route) {
                return route.name;
            });
            // route name
            newState.route = newState.routes[newState.routes.length - 1];
            newState.path = data.path;
        }
        this.setState(newState);
    },

    _handleTitles: function (pageTitle) {

        var newState = {},
            currentState = this.getState();

        if (currentState.pageTitle !== pageTitle) newState.pageTitle = pageTitle;
        this.setState(newState);
    },

    // maybe validate only valid possible states here...
    _handleUserModal: function (state) {

        var newState = {},
            currentState = this.getState();

        if (currentState.modal !== state) newState.modal = state;
        this.setState(newState);
    },

    _handleUserLogout: function () {
        this.setState({
            user: UserFactory.create()  // override old user with a new one
        });
    },

    // all user update and atualization happens here
    _handleUserWatch: function (User) {

        var newState = {},
            currentState = this.getState();

        if (currentState.user !== User) {
            newState.user = User;
        }
        newState.pending = 'isLoadingUserWatch';

        this.setState(newState);
    },
    _handleUserWatchCompleted: function (User) {

        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.containsOr('isLoading', 'isLoadingUserWatch') : false);

        if (this.types.isError(User)) {
            this.error.track(User);
            if (isPending) this.rollback();
        } else {
            if (currentState.user !== User) {
                newState.user = User;
                // if (currentState.isNew) newState.user = newState.user.set('name', undefined);
            }
            if (isPending) newState.pending = false;
            this.setState(newState);
        }
    },

    // NO optimisc update here (watch should keep an eye on it)
    _handleUserLogin: function (User) {

        var newState = {},
            currentState = this.getState();

        if (currentState.user !== User) {
            // this covers the case when the user is trying to login
            // since we want to keep the e-mail the user tryed alive for the next render
            // even if the loggin fails
            // if we merge everything we might create problems with cart watch and other parts of the site
            newState.user = currentState.user.set('email', User.get('email'));
        }
        newState.pending = 'isUserLogin';

        this.setState(newState);
    },
    _handleUserLoginCompleted: function (User) {

        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.contains('isUserLogin') : false);

        if (this.types.isError(User)) {
            this.error.track(User);
            if (isPending) this.rollback();
        } else {
            // The login success needs to know only if and what modal to update, the user data will be updated
            // through the handleUserWatchCompleted method
            // newState.modal = (User.get('provider') !== 'anonymous' && currentState.isNew) ? 'profile' : false;
            newState.modal = false;
            if (isPending) newState.pending = false;
            this.setState(newState);
        }
    },

    // NO optimisc update here (watch should keep an eye on it)
    _handleUserRegister: function (User) {

        var newState = {},
            currentState = this.getState();

        if (currentState.user !== User) {
            newState.user = User;
            newState.pending = 'isUserRegistering';
        }
        this.setState(newState);
    },
    _handleUserRegisterCompleted: function (User) {

        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.contains('isUserRegistering') : false);

        if (this.types.isError(User)) {
            this.error.track(User);
            if (isPending) this.rollback();
        } else {
            // newState.isNew = true;
            if (isPending) newState.pending = false;
            this.setState(newState);
        }
    },

    _handleUpdateUserData: function (User) {

        var newState = {},
            currentState = this.getState();

        if (User && currentState.user !== User && User.invalidate().isValid()) {
            newState.user = User;   // could also do a currentState.merge(User) but whatever i guess...
            if (currentState.modal) newState.modal = false;
        }
        this.setState(newState);
    },
    _handleUpdateUserDataCompleted: function (error) {
        if (this.types.isError(error)) {
            this.error.track(error);
        }
    }
});

module.exports = AppStore;
