var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    Tab;

Tab = React.createClass({

    displayName: 'Tab',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        id: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
        active: React.PropTypes.bool,
        onTabClick: React.PropTypes.func
    },

    mixins: [PureRenderMixin, UpgradeMixin('tab')],

    defaultStyles: {
        color: '#fff',
        textDecoration: 'none'
    },

    _handleClick: function (e) {
        e.preventDefault();
        if (this.props.onTabClick) this.props.onTabClick(this.props.id);
    },

    render: function () {
        var {
            className,
            style,
            id,
            label,
            active,
            onTabClick,
            ...otherProps
        } = this.props;

        var classes = classNames(['mdl-tabs__tab'], {
            'is-active': active
        }, className);

        return (
            <a ref={this.theRef()} style={assign({}, this.defaultStyles, style)} href={'#' + id} className={classes} onClick={this._handleClick} {...otherProps}>
                {label}
            </a>
        );
    }
});

module.exports = Tab;
