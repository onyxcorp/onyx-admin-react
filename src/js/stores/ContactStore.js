var MiniFlux = require('../utils/MiniFlux'),
    ContactFactory = require('../data/records/Contact'),
    ContactListFactory = require('../data/lists/Contacts'),
    ContactStore;

ContactStore = MiniFlux.createStore({

    _init: function (flux) {
        this.register(flux.getActions('contact').createContact, this._handleCreateContact);
        this.registerAsync(flux.getActions('contact').setContacts, this._handleSetContacts, this._handleSetContactsCompleted);
        this.registerAsync(flux.getActions('contact').updateContact, this._handleUpdateContact, this._handleUpdateContactCompleted);
    },

    initialState: {
        contacts: ContactListFactory.create(),
        contact: ContactFactory.create(),
        pending: 'isLoading'
    },

    _handleCreateContact: function () {
        this.setState({
            contact: ContactFactory.create(),
            pending: null
        });
    },

    _handleSetContacts: function (Contacts) {

        var newState = {},
            currentState = this.getState();

        if (!currentState.contacts.total()) {
            newState.pending = 'isLoadingContacts';
        } else {
            newState.pending = 'isLoadingMoreContacts';
        }

        if (currentState.contacts !== Contacts) {
            newState.contacts = Contacts;
        }
        this.setState(newState);
        
    },
    _handleSetContactsCompleted: function (Contacts) {

        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.containsOr('isLoading', 'isLoadingContacts', 'isLoadingMoreContacts') : false);

        if (this.types.isError(Contacts)) {
            this.error.track(Contacts);
            if (isPending) this.rollback();
        } else {
            if (currentState.contacts !== Contacts) {
                newState.contacts = Contacts;
            }
            if (isPending) newState.pending = false;

            this.setState(newState);
        }
    },

    _handleUpdateContact: function (Contact) {

        var newState = {},
            currentState = this.getState();

        if (Contact && Contact.invalidate().isValid()) {
            newState.contacts = currentState.contacts.update(Contact);
            // If there is a current selected Contact and it's the same being updated, update it
            if (currentState.contact && currentState.contact.get('id') === Contact.get('id')) {
                newState.contact = newState.contacts.get('lastUpdated');
            }
        }
        this.setState(newState);
    },
    _handleUpdateContactCompleted: function (error) {
        if (this.types.isError(error)) {
            this.error.track(error);
        }
    }
});

module.exports = ContactStore;
