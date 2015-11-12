
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Immutable = require('immutable'),
    ImmutableFormMixin = require('../../../mixin/ImmutableForm'),
    Form = require('../../../common').Form,
    FormActions = require('../../../common').FormActions,
    Upload = require('../../../common').UploadButton,
    Avatar = require('../../../common').UserAvatar,
    Button = require('../../../mdl').Button,
    TextField = require('../../../mdl').TextField,
    RadioButton = require('../../../mdl').RadioButton,
    Grid = require('../../../mdl').Grid,
    Col = require('../../../mdl').Col,
    ProfileForm;

ProfileForm = React.createClass({

    displayName: 'ProfileForm',

    propTypes: {
        user : React.PropTypes.instanceOf(Immutable.Record).isRequired,
        onSubmit: React.PropTypes.func,
        advanced: React.PropTypes.bool
    },

    mixins: [PureRenderMixin, ImmutableFormMixin(['user'])],  // automatically uses shouldComponentUpdate

    getDefaultProps: function () {
        return {
            advanced: false   // by default, show only the basic form
        };
    },

    _clearUserPropertyError: function (event) {
        this.clearErrorState('user', event);
    },

    _handleChangeAvatar: function (event) {
        event.preventDefault();
        this.getLinkedState('user').addAvatarAsync(event.target.files, function (response) {
            this.setLinkedState('user', response);
        });
    },

    _handleSubmit: function () {
        var invalidState = this.getLinkedState('user').invalidateSchema('profile');
        if (invalidState.isInvalid()) {
            this.setErrorState('user', invalidState);
        } else {
            if (this.props.onSubmit) this.props.onSubmit(this.getLinkedState('user'));
        }
    },

    render: function () {
        var avatarChange,
            avatarStyle = {
                lineHeight: '',
                fontSize: '4.7em'
            };

        if (this.props.user.get('provider') === 'password') {
            avatarChange = (
                <div className="form-group">
                    <Upload label="upload" inputName="images" button="raised" primary={true} disabled={false} onChange={this._handleChangeAvatar} />
                </div>
            );
        }

        return (
            <Form onSubmit={this._handleSubmit}>
                <Grid noSpacing>
                    <Col cd={4} ct={8} cp={4} style={{textAlign: 'center'}}>
                        <Avatar user={this.props.user} size={100} isLinkedState={this.getLinkedState('user').get('avatar')} style={avatarStyle} className='userProfileAvatar'/>
                        {avatarChange}
                        {this.getLinkedState('user').get('is_admin') &&
                        <Col ct={8} cp={4} cd={8} style={{textAlign: 'center', margin: '0 auto'}}>
                            <p style={{color: 'green', paddingTop: 10}}>ADMIN</p>
                            </Col>}
                    </Col>
                    <Col cd={8} ct={8} cp={4}>
                        <TextField
                            name="name"
                            valueLink={this.linkState('user', 'name')}
                            label='Nome'
                            onFocus={this._clearUserPropertyError}
                            errorText={this.getErrorStateMessage('user', 'name')} />
                        <TextField
                            name="lastName"
                            valueLink={this.linkState('user', 'lastName')}
                            label='Sobrenome'
                            onFocus={this._clearUserPropertyError}
                            errorText={this.getErrorStateMessage('user', 'lastName')} />
                        <TextField
                            name="phone"
                            valueLink={this.linkState('user', 'phone')}
                            label='Telefone'
                            onFocus={this._clearUserPropertyError}
                            errorText={this.getErrorStateMessage('user', 'phone')} />
                        <TextField
                            name="bDay"
                            valueLink={this.linkState('user', 'bDay')}
                            label='Aniversário'
                            onFocus={this._clearUserPropertyError}
                            errorText={this.getErrorStateMessage('user', 'bDay')} />
                        <br/>
                        <RadioButton
                            name="gender"
                            checked={this.getLinkedState('user').gender}
                            value="male"
                            label='Masculino'
                            onChange={this.linkRadioState('user', 'gender')}
                            style={{label: {marginRight: 20}}}/>
                        <RadioButton
                            name="gender"
                            checked={this.getLinkedState('user').gender}
                            value="female"
                            label='Feminino'
                            onChange={this.linkRadioState('user', 'gender')} />
                    </Col>
                    <Col cd={12} ct={8} cp={4}>
                        <FormActions>
                            <Button type="submit">Atualizar perfil</Button>
                        </FormActions>
                    </Col>
                </Grid>
            </Form>
        );
    }
});

module.exports = ProfileForm;
