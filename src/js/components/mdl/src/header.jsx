
/**
 *      REFERENCES
 *      http://www.getmdl.io/components/index.html#layout-section
 *
 */

var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    HeaderRow = require('./headerRow.jsx'),
    UpgradeMixin = require('../upgradeMixin.jsx'),
    Header;

Header = React.createClass({

    displayName: 'Header',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        scroll: React.PropTypes.bool,
        title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        transparent: React.PropTypes.bool,
        waterfall: React.PropTypes.bool
    },

    mixins: [PureRenderMixin, UpgradeMixin('header')],

    defaultStyles: {},

    render: function () {
        var {
            className,
            scroll,
            title,
            transparent,
            waterfall,
            style,
            children,
            ...otherProps
        } = this.props;

        var classes,
            isRowOrTab;

        classes = classNames('mdl-layout__header', {
            'mdl-layout__header--scroll': scroll,
            'mdl-layout__header--transparent': transparent,
            'mdl-layout__header--waterfall': waterfall
        }, className);

        isRowOrTab = false;
        React.Children.forEach(children,  function (child, index) {
            if(child && (child.type === HeaderRow)) {
                isRowOrTab = true;
            }
        });

        return (
            <header ref={this.theRef()} className={classes} style={assign({}, this.defaultStyles, style)} {...otherProps}>
                {isRowOrTab ? children : (
                    <HeaderRow title={title}>{children}</HeaderRow>
                )}
            </header>
        );
    }
});

module.exports = Header;
