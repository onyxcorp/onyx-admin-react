
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Immutable = require('immutable'),
    ImmutableFormMixin = require('../../../mixin/ImmutableForm'),
    assign = require('object-assign'),
    Form = require('../../../common').Form,
    FormActions = require('../../../common').FormActions,
    Button = require('../../../mdl').Button,
    TextField = require('../../../mdl').TextField,
    RegisterForm;

RegisterForm = React.createClass({

    displayName: 'RegisterForm',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        user : React.PropTypes.instanceOf(Immutable.Record).isRequired,
        onSubmit: React.PropTypes.func
    },

    mixins: [PureRenderMixin, ImmutableFormMixin(['user'])],

    defaultStyles: {},

    getInitialState: function () {
        return {
            passwordConfirmError: null,
            passwordConfirm: ''
        };
    },

    _handlePasswordConfirmChange: function (event) {
        this.setState({
            passwordConfirm: event.target.value
        });
    },

    _clearPasswordConfirmError: function () {
        this.setState({
            passwordConfirmError: null
        });
    },

    _handleSubmit: function () {
        if (this.state.passwordConfirm === this.getLinkedState('user').get('password')) {
            var invalidState = this.getLinkedState('user').invalidateSchema('register');
            if (invalidState.isInvalid()) {
                this.setErrorState('user', invalidState);
            } else {
                if (this.props.onSubmit) this.props.onSubmit(this.getLinkedState('user').set('provider', 'password'));
            }
        } else {
            this.setState({
                passwordConfirmError: 'A confirmação de senha não bate com a senha'
            });
        }
    },

    render: function () {

        var {
            className,
            style,
            user,
            onSubmit,
            ...otherProps
        } = this.props;

        return (
            <Form style={assign({}, this.defaultStyles, style)} onSubmit={this._handleSubmit} {...otherProps}>
                <TextField
                    name={this.setFieldName('user', 'email')}
                    valueLink={this.linkState('user', 'email')}
                    label="E-mail"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('user', 'email')} />
                <TextField
                    name={this.setFieldName('user', 'password')}
                    valueLink={this.linkState('user', 'password')}
                    password={true}
                    label="Senha"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('user', 'password')} />
                <TextField
                    name="passwordConfirm"
                    password={true}
                    label="Confirmação de Senha"
                    value={this.state.passwordConfirm}
                    onChange={this._handlePasswordConfirmChange}
                    onFocus={this._clearPasswordConfirmError}
                    errorText={this.state.passwordConfirmError} />
                <FormActions>
                    <Button type="submit" raised={true} colored={true} fullWidth={true}>Registrar</Button>
                </FormActions>
            </Form>
        );
    }
});

module.exports = RegisterForm;
