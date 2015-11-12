
/**
 *      REFERENCE http://www.getmdl.io/components/index.html#cards-section
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    classNames = require('classnames'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    CardTitle;

CardTitle = React.createClass({

    displayName: 'CardTitle',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.shape({
            base: React.PropTypes.object,
            title: React.PropTypes.object
        })
    },

    mixins: [PureRenderMixin, UpgradeMixin('cardTitle')],

    defaultStyles: {
        base: {},
        title: {}
    },

    render: function () {
        var {
            className,
            style,
            children,
            ...otherProps
        } = this.props;

        var classes,
            baseStyle,
            titleStyle;

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) :  this.defaultStyles.base;
        titleStyle = style && style.title ? assign({}, this.defaultStyles.title, style.title) : this.defaultStyles.title;
        classes = classNames(['mdl-card__title'], className);

        return (
            <div ref={this.theRef()} className={classes} style={assign({}, this.defaultStyles, style)} {...otherProps} >
                <h2 className="mdl-card__title-text">{children}</h2>
            </div>
        );
    }
});

module.exports = CardTitle;
