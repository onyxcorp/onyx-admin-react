var FirebaseUtils = require('../utils/FirebaseUtils.js'),
    db = FirebaseUtils.initFirebase(),
    MiniFlux = require('../utils/MiniFlux'),
    UserActions;

UserActions = MiniFlux.createAction({

    _config: {
        setUsers: {
            track: {
                analytics: {
                    sendEvent: {category: 'User', action: 'setUsers'}
                }
            }
        },
        setUsersReviews: {
            track: {
                analytics: {
                    sendEvent: { category: 'User', action: 'setUsersReview'}
                }
            }
        },
        setUsersFriends: {
            track: {
                analytics: {
                    sendEvent: {category: 'User', action: 'setUsers', label: null}
                }
            }
        }
    },

    // set users by type
    setUsers: function (Users, total, more) {
        this.track('setUsers', 'analytics', 'sendEvent');
        return this.async(function (callback) {
            var startAt = more && Users.total() ? Users.getLast().get('uid') : null; // most recent first by default
            db.utils.watchSet('setUsers', db.tables.users, total, startAt, function success(dataSnapshot) {
                callback(Users.updateAll(FirebaseUtils.fromFirebaseJS(dataSnapshot, 'list')));
            }, callback);
        }, Users);
    },

    // set users with reviews or related to reviews
    setUsersReviews: function (Users, total, orderBy) {
        this.track('setUsersReviews', 'analytics', 'sendEvent');
        return this.async(function (callback) {
            // nothing for now
            callback();
        }, Users);
    },

    // set users for friendlists usage (maybe filter only users that have friends or something like this)
    setUsersFriends: function (Users, total, orderBy, User) {
        this.track('setUsersFriends', 'analytics', 'sendEvent', {label: User.get('uid')});
        return this.async(function (callback) {
            // nothing for now
            callback();
        }, Users);
    }
});

module.exports = UserActions;
