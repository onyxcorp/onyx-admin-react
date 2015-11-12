
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Immutable = require('immutable'),
    ImmutableFormMixin = require('../../../mixin/ImmutableForm'),
    assign = require('object-assign'),
    Form = require('../../../common').Form,
    FormActions = require('../../../common').FormActions,
    Button = require('../../../mdl').Button,
    TextField = require('../../../mdl').TextField,
    LoginForm;

LoginForm = React.createClass({

    displayName: 'LoginForm',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        user : React.PropTypes.instanceOf(Immutable.Record).isRequired,
        onSubmit: React.PropTypes.func
    },

    mixins: [PureRenderMixin, ImmutableFormMixin(['user'])],  // automatically uses shouldComponentUpdate

    defaultStyles: {},

    _handleSubmit: function () {
        var invalidState = this.getLinkedState('user').invalidateSchema('login');
        if (invalidState.isInvalid()) {
            this.setErrorState('user', invalidState);
        } else {
            if (this.props.onSubmit) this.props.onSubmit(this.getLinkedState('user').set('provider', 'password'));
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
                    password={true}
                    valueLink={this.linkState('user', 'password')}
                    label="Senha"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('user', 'password')} />
                <FormActions>
                    <Button type="submit" raised={true} colored={true} fullWidth={true}>
                        Login
                    </Button>
                </FormActions>
            </Form>
        );
    }
});

module.exports = LoginForm;
