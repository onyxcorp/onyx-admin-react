var FirebaseUtils = require('../utils/FirebaseUtils.js'),
    db = FirebaseUtils.initFirebase(),
    MiniFlux = require('../utils/MiniFlux'),
    ContactActions;

ContactActions = MiniFlux.createAction({

    _config: {
        createContact: {},
        setContacts: {},
        setContactById: {},
        updateContact: {}
    },

    // called in admin when manually creating an order (sync)
    createContact: function () {
        return null;
    },

    // set users by type
    setContacts: function (Contacts, total, more) {
        return this.async(function (callback) {
            var startAt = more && Contacts.total() ? Contacts.getLast().get('id') : null; // most recent first by default
            db.utils.watchSet('setContacts', db.tables.contacts, total, startAt, function success(dataSnapshot) {
                callback(Contacts.updateAll(FirebaseUtils.fromFirebaseJS(dataSnapshot, 'list')));
            }, callback);
        }, Contacts);
    },

    // event on which order are being viewed now
    setContactById: function (Contacts, contactId) {
        var Contact = Contacts.getById(contactId);
        if (!Contact) Contact = Contacts.newRecord().set('id', contactId);
        return this.async( function (callback) {
            db.utils.oneOn('setContactById', db.tables.contacts.child(contactId), 'value', function success(dataSnapshot) {
                Contact = Contact.merge(FirebaseUtils.fromFirebaseJS(dataSnapshot));
                callback(Contact);
            }, callback);
        }, Contact);
    },

    updateContact: function (Contact) {
        return this.async( function (callback) {

            var contactValidationResult = Contact.invalidate('send');

            if (contactValidationResult.isValid()) {
                db.tables.contacts.update(Contact.toFirebaseJS(), callback);
            } else {
                callback(new Error('updateContact contato com dados inválidos: ' + contactValidationResult.getStringifiedMessages()));
            }
        }, Contact);
    }
});

module.exports = ContactActions;
