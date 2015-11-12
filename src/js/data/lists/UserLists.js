
var OnyxData = require('../OnyxData'),
    UserListRecord = require('../records/UserList'),
    UserListListFactory,
    UserListFactory;

UserListListFactory = OnyxData.List({
    getByName: function (name) {
        return this.get('list').find( function(userList) {
            return userList.get('name') === name;
        });
    }
});

UserListFactory = new UserListListFactory(UserListRecord);

module.exports = UserListFactory;
