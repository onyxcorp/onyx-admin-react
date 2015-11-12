
/**
 *      REFERENCE http://www.getmdl.io/components/index.html#cards-section
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    CardMedia;

CardMedia = React.createClass({

    displayName: 'CardMedia',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object
    },

    mixins: [PureRenderMixin, UpgradeMixin('cardMedia')],

    defaultStyles: {
        backgroundColor: '#fff'
    },

    render: function () {
        var {
            className,
            style,
            children,
            ...otherProps
        } = this.props;

        var classes = classNames(['mdl-card__media'], className);

        return (
            <div ref={this.theRef()} style={assign({}, this.defaultStyles, style)} className={classes} {...otherProps}>
                {children}
            </div>
        );
    }
});

module.exports = CardMedia;
