
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Immutable = require('immutable'),
    assign = require('object-assign'),
    RegisterForm = require('./registerForm.jsx'),
    LoginForm = require('./loginForm.jsx'),
    Img = require('../../../common').Img,
    Button = require('../../../mdl').Button,
    LoginRegisterForm;

LoginRegisterForm = React.createClass({

    displayName: 'LoginRegisterForm',

    propTypes: {
        style: React.PropTypes.shape({
            base: React.PropTypes.object,
            logo: React.PropTypes.object,
            button: React.PropTypes.object,
            facebookButton: React.PropTypes.object
        }),
        user : React.PropTypes.instanceOf(Immutable.Record).isRequired,
        login: React.PropTypes.bool,
        onSubmitLogin: React.PropTypes.func,
        onSubmitRegister: React.PropTypes.func,
        onSubmitFacebookLogin: React.PropTypes.func
    },

    mixins: [PureRenderMixin],  // automatically uses shouldComponentUpdate

    getInitialState: function () {
        return {
            login: this.props.login || true
        };
    },

    defaultStyles: {
        base: {
            maxWidth: 300
        },
        logo: {
            textAlign: 'center',
            padding: 10,
            marginBottom: 10
        },
        button: {
            marginTop: 20,
            display: 'block',
            margin: '0 auto'
        },
        facebookButton: {
            backgroundColor:'#3c4c84',
            color: '#fff'
        }
    },

    _switchToRegister: function () {
        this.setState({
            login: false
        });
    },

    _switchToLogin: function () {
        this.setState({
            login: true
        });
    },

    _handleSubmitFacebookLogin: function () {
        if (this.props.onSubmitFacebookLogin) this.props.onSubmitFacebookLogin(this.props.user.set('provider', 'facebook'));
    },

    _handleSubmitLogin: function (user) {
        if (this.props.onSubmitLogin) this.props.onSubmitLogin(user);
    },

    _handleSubmitRegister: function (user) {
        if (this.props.onSubmitRegister) this.props.onSubmitRegister(user);
    },

    render: function () {

        var {
            style,
            user,
            login,
            onSubmitLogin,
            onSubmitRegister,
            onSubmitFacebookLogin,
            ...otherProps
        } = this.props;

        var currentForm,
            baseStyle,
            logoStyle,
            buttonStyle,
            facebookButtonStyle;

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        logoStyle = style && style.logo ? assign({}, this.defaultStyles.logo, style.logo) : this.defaultStyles.logo;
        buttonStyle = style && style.button ? assign({}, this.defaultStyles.button, style.button) : this.defaultStyles.button;
        facebookButtonStyle = style && style.facebookButton ? assign({}, this.defaultStyles.facebookButton, style.facebookButton) : this.defaultStyles.facebookButton;

        if (this.state.login) {
            currentForm = (
                <div>
                    <LoginForm user={user} onSubmit={this._handleSubmitLogin} />
                    <Button onClick={this._switchToRegister} style={buttonStyle}>
                        Não é registrado? Registre-se
                    </Button>
                </div>
            );
        } else {
            currentForm = (
                <div>
                    <RegisterForm user={user} onSubmit={this._handleSubmitRegister} />
                    <Button onClick={this._switchToLogin} style={buttonStyle}>
                        Já é resgistrado? Acesse
                    </Button>
                </div>
            );
        }

        return (
            <div style={baseStyle} {...otherProps}>
                <div style={logoStyle}>
                    <Img src='/assets/images/logo1.png' alt='Impallets' title='Impallets'/>
                </div>
                <Button style={facebookButtonStyle} fullWidth={true} onClick={this._handleSubmitFacebookLogin}>
                    <i className='social- socialIcon' style={{float: 'left', lineHeight: '32px', paddingLeft: '12px', verticalAlign: 'middle'}}>b</i>
                    Login pelo Facebook
                </Button>
                {currentForm}
            </div>
        );
    }
});

module.exports = LoginRegisterForm;
