var MiniFlux = require('../utils/MiniFlux'),
    UserFactory = require('../data/records/User'),
    UserListFactory = require('../data/lists/Users'),
    UserList,
    UserStore;

UserList = UserListFactory.create();

UserStore = MiniFlux.createStore({

    _init: function (flux) {
        this.registerAsync(flux.getActions('user').setUsers, this._handleSetUsers, this._handleSetUsersCompleted);
    },

    initialState: {
        users: UserList.set('type', 'users'),
        usersFriends: UserList.set('type', 'usersFriends'),
        usersReviews: UserList.set('type', 'usersReviews'),
        user: UserFactory.create(),
        pending: 'isLoading'
    },

    _handleSetUsers: function (Users) {

        var newState = {},
            currentState = this.getState();

        if (currentState[Users.get('type')] !== Users) {
            newState[Users.get('type')] = Users;
            newState.pending = 'isLoading' + Users.get('type').capitalize();
        }
        this.setState(newState);
    },
    _handleSetUsersCompleted: function (Users) {

        var newState = {},
            currentState = this.getState(),
            isPending = (currentState.pending ? currentState.pending.containsOr('isLoadingReview', 'isLoadingFriends', 'isLoadingUsers') : false);

        if (this.types.isError(Users)) {
            this.error.track(Users);
            if (isPending) this.rollback();
        } else {
            if (currentState[Users.get('type')] !== Users) newState[Users.get('type')] = Users;
            if (isPending) newState.pending = false;
            this.setState(newState);
        }
    }
});

module.exports = UserStore;
