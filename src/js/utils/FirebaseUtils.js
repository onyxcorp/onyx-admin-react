var Firebase = require('firebase'),
    Immutable = require('immutable'),
    slugify = require('./Slugify'),
    Types = require('./Types');

// normally used to help create a list of elements
function getChildren(dataSnapshot) {
    // DUE TO TESTING!
    var data = [];
    dataSnapshot.forEach( function (childDataSnapshot) {
        data.push(module.exports.fromFirebaseJS(childDataSnapshot));
    });
    return Immutable.List(data);
}

// ** WARNING **
// No caso de uma situação em que o filho de determinado atributo seja um objeto mas não necessariamnete
// uma lista de objetos acredito que ele dará problema igual o problema inicial do Product
// em que estava criando cada propriedade do produto como se fosse um array separado/isolado
// ** TODO NEED MORE TESTS **
module.exports.fromFirebaseJS = function(dataSnapshot, type) {

    type = type || 'object';

    var data;

    if (!dataSnapshot || !Types.isFunction(dataSnapshot.exists)) throw new Error('fromFirebaseJS need a valid dataSnapshot firebase object');

    if (type === 'list') {

        // data will be an Immutable.List
        data = getChildren(dataSnapshot);

    } else if (type === 'object') {

        // data will be an Immutable.Map
        data = Immutable.Map({
            _id: isNaN(dataSnapshot.key()) ? dataSnapshot.key() : parseInt(dataSnapshot.key())
        });

        // now get the values of the snapshot
        dataSnapshot.forEach( function (childSnapshot) {
            var value = childSnapshot.val();
            if (Types.isObject(value)) {
                data = data.set(childSnapshot.key(), module.exports.fromFirebaseJS(childSnapshot, 'list'));
            } else {
                data = data.set(childSnapshot.key(), childSnapshot.val());
            }
        });
    } else {
        throw new TypeError('fromFirebaseJS type should be either a list or an object');
    }
    return data;
};

// TODO continuous improvement to make for all possible cases when converting Immutable to Firebase
// TODO this method should be a recursive one (FUTURE)
module.exports.toFirebaseJS = function (immutableObject, type) {
    var data = {};
    type = type || 'record';
    if (type !== 'record' && type !== 'map' && type !== 'list') {
        throw new TypeError('toFirebaseJS current only accepts types: record, map and/or list');
    }

    // default firebase conversion function
    function modelToFirebaseJS (model) {
        var modelData = Types.isFunction(model.toJS) ? model.toJS() : model;
        for (var prop in modelData) {  // remove all undefined values of object
            if (modelData.hasOwnProperty(prop) && modelData[prop] === undefined) {
                delete modelData[prop];
            }
        }
        if (Types.isFunction(model.getKey)) delete modelData[model.getKey()];
        return modelData;
    }

    // TODO search through the object properties looking for
    if (type === 'record' || type === 'map') {
        data[immutableObject.getKeyValue()] = modelToFirebaseJS(immutableObject);
    } else if ( type === 'list' ) {
        immutableObject.forEach( function (listedObject, key) {
            // try to use the toFirebaseJS if exists, otherwise use the default toJS method
            if (Types.isFunction(listedObject.getKeyValue)) {
                data[listedObject.getKeyValue()] = Types.isFunction(listedObject.toFirebaseJS) ? listedObject.toFirebaseJS()[listedObject.getKeyValue()] : modelToFirebaseJS(listedObject);
            } else {
                data[key] = Types.isFunction(listedObject.toJS) ? listedObject.toJS() : listedObject;
            }
        });
    }
    return data;
};

// reference for more error codes https://www.firebase.com/docs/web/guide/user-auth.html
module.exports.updateAuthenticationErrorMessages = function (error) {
    if (!Types.isError(error) && !Types.isNull(error)) throw new TypeError('FirebaseUtils updateAuthenticationErrorMessages need to be "null" or a valid error object');
    if (error && error.code && error.message) {
        var errorMessage;
        switch (error.code) {
            case 'EMAIL_TAKEN':
                errorMessage = 'e-mail já registrado.';
                break;
            case 'INVALID_EMAIL':
                errorMessage = 'e-mail inválido.';
                break;
            case 'NETWORK_ERROR':
                errorMessage = 'problemas na comunicação com o servidor, por favor tente novamente.';
                break;
            case 'INVALID_USER':
                errorMessage = 'usuário inexistente.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'senha inválida.';
                break;
            default:
                errorMessage = error.message;
                break;
        }
        error.message = errorMessage;
    }
    return error;
};

module.exports.initFirebase = function() {

    var baseRef = 'https://impallets.firebaseio.com/',
        childRefs,
        authRef,
        mainRefs,
        tables,
        refs;

    childRefs = {}; // save all the references that are being used
    authRef = {}; // save all the auth references
    // set main tables firebase references
    mainRefs = {
        tables: {},
        utils: {
            getFbKey: function (customKey) {
                return slugify(customKey, {delimiter: ''});
            },
            hasOn: function (firebaseRefKey) {
                return childRefs[firebaseRefKey] ? true : false;
            },
            watchSet: function (setName, reference, total, startAt, successCallback, errorCallback) {
                total = total || 100;   // many anonymous users being created is generating problems..
                startAt = startAt || null;
                this.oneOn(
                    setName,
                    startAt ? reference.orderByKey().startAt(startAt).limitToFirst(total) : reference.orderByKey().limitToFirst(total),
                    'value',
                    successCallback,
                    errorCallback
                );
            },
            watchSetByChild: function (setName, reference, total, startAt, childKey, equalTo, successCallback, errorCallback) {
                total = total || 100;   // many anonymous users being created is generating problems..
                startAt = startAt || null;
                this.oneOn(
                    setName,
                    equalTo && startAt ? reference.orderByChild(childKey).startAt(startAt).equalTo(equalTo).limitToFirst(total) :
                    !equalTo && startAt ? reference.orderByChild(childKey).startAt(startAt).limitToFirst(total) :
                    equalTo && !startAt ? reference.orderByChild(childKey).equalTo(equalTo).limitToFirst(total) :
                    reference.orderByChild(childKey).limitToFirst(total),
                    'value',
                    successCallback,
                    errorCallback
                );
            },
            oneOn: function (customKey, firebaseRef, eventType, callback, errorCallback) {
                eventType = eventType || 'value';
                // https://www.firebase.com/docs/web/api/query/
                customKey = customKey || 'query';

                if (!Types.isString(eventType)) throw new TypeError('eventType must be a string');

                // available firebase events https://www.firebase.com/docs/web/api/query/
                if (eventType !== 'value' &&
                    eventType !== 'child_added' &&
                    eventType !== 'child_removed' &&
                    eventType !== 'child_changed' &&
                    eventType !== 'child_moved') {
                        throw new Error('Invalid eventType');
                    }

                if (!Types.isFunction(callback)) throw new TypeError('Callback must be a function');
                if (!Types.isFunction(errorCallback)) throw new TypeError('ErrorCallback must be a function');
                var firebaseRefKey = this.getFbKey(customKey);
                if (this.hasOn(firebaseRefKey)) {
                    childRefs[firebaseRefKey].reference.off(eventType, childRefs[firebaseRefKey].callback);
                    delete childRefs[firebaseRefKey];
                }
                childRefs[firebaseRefKey] = {};
                childRefs[firebaseRefKey].reference = firebaseRef;
                childRefs[firebaseRefKey].callback = callback;
                childRefs[firebaseRefKey].reference.on(eventType, childRefs[firebaseRefKey].callback, errorCallback);
            },
            oneOnAuth: function (firebaseRef, callback) {
                if (!Types.isFunction(callback)) throw new TypeError('Callback must be a function');
                if (authRef.reference) {
                    authRef.reference.offAuth(authRef.callback);
                    authRef.reference = null;
                    authRef.callback = null;
                }
                authRef = {};
                authRef.callback = callback;
                authRef.reference = firebaseRef;
                authRef.reference.onAuth(authRef.callback);
            }
        }
    };

    tables = [
        'users',
        'carts',
        'contacts',
        'orders',
        'posts',
        'products',
        'roles',
        'reviews',
        'mail'
    ];

    // ovewrite the default set method so it works now as a wrapper to the setWithPriority method
    Firebase.prototype.set = function (value, onComplete) {
        this.setWithPriority(value, Firebase.ServerValue.TIMESTAMP, onComplete);
    };

    mainRefs.tables.base = new Firebase(baseRef);
    if (tables.length) {
        tables.forEach( function (value) {
            mainRefs.tables[value] = mainRefs.tables.base.child(value);
        });
    }
    return mainRefs;
};
