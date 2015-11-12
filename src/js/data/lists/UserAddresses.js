
var OnyxData = require('../OnyxData'),
    UserAddressRecord = require('../records/UserAddress'),
    UserAddressListFactory,
    UserAddressFactory;

UserAddressListFactory = OnyxData.List({
    getByName: function (name) {
        return this.get('list').find( function(userAddress) {
            return userAddress.get('id') === name;
        });
    }
});

UserAddressFactory = new UserAddressListFactory(UserAddressRecord);

module.exports = UserAddressFactory;
