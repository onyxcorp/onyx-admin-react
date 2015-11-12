var React = require('react'),
    assign = require('object-assign'),
    Progress = require('./progress.jsx'),
    Button = require('../../mdl').Button,
    LoadMore;

LoadMore = React.createClass({

    displayName: 'LoadMore',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.shape({
            base: React.PropTypes.object,
            button: React.PropTypes.object
        }),
        loading: React.PropTypes.bool,
        label: React.PropTypes.string,
        icon: React.PropTypes.string,
        auto: React.PropTypes.bool,
        fullWidth: React.PropTypes.bool,
        onClick: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            loading: false,
            label: 'Load more items',
            icon: 'more_horiz',
            auto: false,
            fullWidth: false
        };
    },

    defaultStyles: {
        base: {
            margin: '15px auto',
        },
        button: {}
    },

    render: function () {

        var {
            className,
            style,
            loading,
            label,
            icon,
            auto,
            fullWidth,
            onClick,
            ...otherProps
        } = this.props;

        if (auto) {
            console.log('Need implement auto-loading');
        }

        var baseStyle,
            buttonStyle;

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        buttonStyle = style && style.button ? assign({}, this.defaultStyles.button, style.button) : this.defaultStyles.button;

        return (
            <div style={baseStyle} className={className} {...otherProps}>
                <Progress loading={loading} size={1}>
                    <Button style={buttonStyle} colored={true} ripple={true} raised={true} fullWidth={fullWidth} icon={icon} onClick={onClick}>
                        {label}
                    </Button>
                </Progress>
            </div>
        );
    }
});

module.exports = LoadMore;
