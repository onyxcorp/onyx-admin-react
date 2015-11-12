
var OnyxData = require('../OnyxData'),
    UserRecord = require('../records/User'),
    assign = require('object-assign'),
    UserListFactory,
    UserListDefaultValues,
    UserFactory;

UserListFactory = OnyxData.List({
    // users should keep their original type value 
    clear: function () {
        var currentType = this.get('type');
        var defaultValues = assign({}, this._defaultValues, {type: currentType});
        return this.merge(defaultValues);
    }
});

UserListDefaultValues = {
    type: undefined
};

UserFactory = new UserListFactory(UserRecord, UserListDefaultValues);

module.exports = UserFactory;
