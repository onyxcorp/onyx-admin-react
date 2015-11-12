
var OnyxData = require('../OnyxData'),
    ContactRecord = require('../records/Contact'),
    ContactListFactory,
    ContactListDefaultValues,
    ContactFactory;

ContactListFactory = OnyxData.List();

ContactListDefaultValues = {
    type: undefined
};

ContactFactory = new ContactListFactory(ContactRecord, ContactListDefaultValues);

module.exports = ContactFactory;
