
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    ProfileForm = require('../../../form').User.ProfileForm,
    Grid = require('../../../mdl').Grid,
    Paper = require('../../../mdl').Paper,
    UserDashboard;

UserDashboard = React.createClass({

    contextTypes: {
        flux: React.PropTypes.object
    },

    propTypes: {
        user : React.PropTypes.instanceOf(Immutable.Record).isRequired,
        pending: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ])
    },

    mixins: [PureRenderMixin],

    _onSubmit: function (user) {
        this.context.flux.getActions('app').updateUserData(user);
    },

    render: function () {

        return (
            <div style={{color: "#707070"}}>
                <div className="page-title-wrapper">
                    <Grid>
                        <div className="page-title">
                            <h2>Meu Perfil</h2>
                        </div>
                    </Grid>
                </div>
                <Grid>
                    <div className='paperContent' style={{width: '100%'}}>
                        <Paper shadow={2} style={{zIndex: 2, width: '100%'}}>
                            <ProfileForm user={this.props.user} onSubmit={this._onSubmit} />
                        </Paper>
                    </div>
                </Grid>
            </div>
        );
    }
});

module.exports = UserDashboard;
