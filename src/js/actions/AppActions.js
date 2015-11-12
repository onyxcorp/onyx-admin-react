
var FirebaseUtils = require('../utils/FirebaseUtils.js'),
    db = FirebaseUtils.initFirebase(),
    Types = require('../utils/Types'),
    MiniFlux = require('../utils/MiniFlux'),
    AppActions;

AppActions = MiniFlux.createAction({

    _config: {
        createAddress: {},
        setRoutes: {
            params: '(string) route, (string) path', // { route: [string], path: [string] }
            track: {
                analytics: {
                    sendView: { page: null }
                }
            }
        },
        setTitle: {
            params: '(string) pageTitle'    // { pageTitle: [string] }
        },
        modal: {
            params: '(string)(bool)(null) state', // { state: [string. bool, null] }
            track: {
                analytics: {
                    sendEvent: { category: 'App', action: 'modal', label: null }
                }
            }
        },
        watch: {
            params: 'null', // {}
            track: {
                analytics: {
                    sendEvent: { category: 'App', action: 'watch' }
                }
            }
        },
        login: {
            params: '(string) type, (Immutable.Record) User',  // { type: [string], user: [Immutable.Record] }
            track: {
                analytics: {
                    sendEvent: { category: 'App', action: 'login'}
                }
            }
        },
        logout: {
            params: 'null', // {}
            track: {
                analytics: {
                    sendEvent: { category: 'App', action: 'logout'}
                }
            }
        },
        register: {
            params: '(Immutable.Record) User',  // { user: [Immutable.Record] }
            track: {
                analytics: {
                    sendEvent: { category: 'App', action: 'register'}
                }
            }
        },
        updateUserData: {
            params: '(Immutable.Record) User',  // { user: [Immutable.Record] }
            track: {
                analytics: {
                    sendEvent: { category: 'App', action: 'updateUserData', label: null}
                }
            }
        },
        updateUserProductListData: {
            params: '(Immutable.Record) User', // { user: [Immutable.Record] }
            track: {
                analytics: {
                    sendEvent: { category: 'App', action: 'updateUserProductListData', label: null}
                }
            }
        },
        updateUserAddressesData: {
            params: '(Immutable.Record) User',  // { user: [Immutable.Record] }
            track: {
                analytics: {
                    sendEvent: { category: 'App', action: 'updateUserAddressesData', label: null}
                }
            }
        }
    },

    // called in admin when manually creating an order (sync)
    createAddress: function () {
        return null;
    },

    setRoutes: function (routes, path) {
        this.track('setRoutes', 'analytics', 'sendView', {page: path});
        return {
            routes: routes,
            path: path
        };
    },

    setTitle: function (pageTitle) {
        return pageTitle;
    },

    modal: function (state) {
        this.track('modal', 'analytics', 'sendEvent', {label: state ? state : 'closed'});
        return state;
    },

    // keep watching the current user state
    watch: function (User) {
        this.track('watch', 'analytics', 'sendEvent');
        function updateUserData(authData) {
            // deep clone the object, but be aware of the Date problem
            // http://stackoverflow.com/questions/11491938/issues-with-date-when-using-json-stringify-and-json-parse/11491993#11491993
            var safeAuthData = JSON.parse(JSON.stringify(authData));

                // normalize the data received from facebook with our user data model
                if (safeAuthData.provider === 'facebook') {
                    safeAuthData.avatar = safeAuthData.facebook.profileImageURL;
                    safeAuthData.name = safeAuthData.facebook.cachedUserProfile.first_name;
                    safeAuthData.lastName = safeAuthData.facebook.cachedUserProfile.last_name;
                    safeAuthData.gender = safeAuthData.facebook.cachedUserProfile.gender;
                    safeAuthData.email = safeAuthData.facebook.cachedUserProfile.email;
                    if (safeAuthData.facebook.cachedUserProfile.birthday) {
                        safeAuthData.bDay = safeAuthData.facebook.cachedUserProfile.birthday;
                    }
                } else if (safeAuthData.provider === 'password') {
                    safeAuthData.email = safeAuthData.password.email;
                }
                // remove all reamining unneeded data
                delete safeAuthData.expires;
                delete safeAuthData.auth;
                delete safeAuthData.anonymous;  // anonymous login
                delete safeAuthData.facebook;   // facebook login
                delete safeAuthData.password;   // simple login
                delete safeAuthData.token;
                delete safeAuthData.uid;

                db.tables.users.child(authData.uid).update(safeAuthData, function completed(error) {
                    if (error) { /* Do something? Like Trying again? */ }
                });

        }
        return this.async(function (callback) {
            db.utils.oneOnAuth(db.tables.base, function completed(authData) {
                // break the reference from the store, since it was passed in
                // the initialization call of flux.actions('app').watch(User);
                User = User.clear();
                // no authData, means no user, log it in as anonymous
                if (!authData) {
                    this.login(User.merge({
                        'is_admin': false,
                        'provider': 'anonymous'
                    }));
                } else if (authData && authData.uid) {  // we have authData, so we are logged in
                    // look for current logged in user data
                    db.utils.oneOn('user', db.tables.users.child(authData.uid), 'value', function success(dataSnapshot) {
                        // if there is no user data set, set it here for the first time or update if
                        // we are logging in from facebook
                        if (!dataSnapshot || !dataSnapshot.exists() || authData.provider === 'facebook') {
                            updateUserData(authData);
                        }

                        // there is user data, merge it with the current user
                        User = User.merge(FirebaseUtils.fromFirebaseJS(dataSnapshot));

                        // get the current user role and update it on the user object before
                        // calling the callback and sending it to the store
                        db.tables.roles.child(authData.uid).on('value', function (snapshot) {

                            if (snapshot.val() && snapshot.val().hasOwnProperty('admin')) {
                                User = User.set('is_admin', true);
                            } else {
                                User = User.set('is_admin', false);
                            }
                            callback(User);
                        });

                    }, callback);
                }
            }.bind(this));
        }.bind(this), User);
    },

    login: function (User) {
        this.track('login', 'analytics', 'sendEvent');
        return this.async( function (callback) {

            function onCompletedCallback(error, authData) {
                callback(
                    Types.isError(error) ?
                        FirebaseUtils.updateAuthenticationErrorMessages(error) :
                        authData.provider !== User.get('provider') ? User.set('provider', authData.provider) : User
                );
            }

            if (User.get('provider') === 'password') {   // simple login type, the only one that needs the User.Record object

                var userValidationResult = User.invalidateSchema('login');

                if (userValidationResult.isValid()) {
                    db.tables.base.authWithPassword({
                        "email": User.get('email'),
                        "password": User.get('password')
                    }, onCompletedCallback);
                } else {
                    onCompletedCallback(new Error('login com dados inválidos: ' +  userValidationResult.getStringifiedMessages()));
                }
            } else if (User.get('provider') === 'anonymous') {
                db.tables.base.authAnonymously(onCompletedCallback);
            } else if (User.get('provider') === 'facebook') {
                db.tables.base.authWithOAuthPopup("facebook", onCompletedCallback, { scope: "email,user_birthday" });
            } else {
                onCompletedCallback(new Error('Invalid login type: "' + type + '"'));
            }
        }, User);
    },

    logout: function (User) {
        this.track('logout', 'analytics', 'sendEvent');
        // all .onAuth will now fire with a value of null (it's their callback)
        db.tables.base.unauth();
        return null;
    },

    register: function (User) {
        this.track('register', 'analytics', 'sendEvent');
        return this.async( function (callback) {

            function onCompletedCallback(error, authData) {
                if (Types.isError(error)) {
                    callback(FirebaseUtils.updateAuthenticationErrorMessages(error));
                } else {
                    if (authData.uid !== User.get('uid')) User = User.set('uid', authData.uid);
                    callback(User);
                    this.login(User);
                }
            }

            var userValidationResult = User.invalidateSchema('register');

            if (userValidationResult.isValid()) {
                db.tables.base.createUser({
                    email: User.get('email'),
                    password: User.get('password')
                }, onCompletedCallback.bind(this));
            } else {
                onCompletedCallback(new Error('register usuário com dados inválidos:' + userValidationResult.getStringifiedMessages()));
            }
        }.bind(this), User);
    },

    updateUserData: function (User) {
        this.track('updateUserData', 'analytics', 'sendEvent', {label: User.get('uid')});
        return this.async( function (callback) {
            var userValidationResult = User.invalidate();
            if (userValidationResult.isValid()) {
                db.tables.users.update(User.toFirebaseJS(), callback);
            } else {
                callback(new Error('updateUserData usuário com dados inválidos: ' + userValidationResult.getStringifiedMessages()));
            }
        }, User);
    },

    // general User data update
    updateUserProductListData: function (User) {
        this.track('updateUserProductListData', 'analytics', 'sendEvent', {label: User.get('uid')});
        return this.async(function (callback) {

            var userValidationResult = User.invalidate();

            if (userValidationResult.isValid()) {
                db.tables.users.child(User.get('uid')).child('lists').update(User.toFirebaseJS()[User.getKeyValue()].lists, callback);
            } else {
                callback(new Error('updateUserProductListData usuário/list com dados inválidos: ' + userValidationResult.getStringifiedMessages()));
            }

        }, User);
    },

    updateUserAddressesData: function (User, Address) {
        User = User.addAddress(Address);
        this.track('updateUserProductListData', 'analytics', 'sendEvent', {label: User.get('uid')});
        return this.async(function (callback) {

            var userValidationResult = User.invalidate();

            if (userValidationResult.isValid()) {
                db.tables.users.child(User.get('uid')).child('addresses').update(User.toFirebaseJS()[User.getKeyValue()].addresses, callback);
            } else {
                callback(new Error('updateUserAddressesData usuário com dados inválidos: '+ userValidationResult.getStringifiedMessages()));
            }
        }, User);
    }
});

module.exports = AppActions;
