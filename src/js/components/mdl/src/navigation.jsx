
/**
 *      REFERENCES
 *      http://www.getmdl.io/components/index.html#layout-section
 *
 */

var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../upgradeMixin.jsx'),
    cloneChildren = require('./utils/cloneChildren'),
    Navigation  ;

Navigation = React.createClass({

    displayName: 'Navigation ',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object
    },

    mixins: [PureRenderMixin, UpgradeMixin('navigation,navLink')],

    defaultStyles: {},

    eventFire: function(instance){
        var el = document.getElementsByClassName('mdl-layout__obfuscator')[0];
        var etype = 'click';

        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
        return instance;
    },

    render: function() {
        var {
            className,
            style,
            children,
            drawer,
            ...otherProps
        } = this.props;

        var classes,
            links;

        classes = classNames('mdl-navigation', className);

        if (drawer) {
            links = React.Children.map(children, function (link, index) {
                var _self = this;
                return React.cloneElement(link, {
                    key: index,
                    onClick: _self.eventFire.bind(this, link.onClick),
                    className: 'mdl-navigation__link'
                });
            }, this);
        } else {
            links = React.Children.map(children, function (link, index) {
                return React.cloneElement(link, {
                    key: index,
                    className: 'mdl-navigation__link'
                });
            }, this);
        }



        return (
            <nav ref={this.theRef()} style={assign({}, this.defaultStyles, style)} className={classes} {...otherProps}>
                {links}
            </nav>
        );
    }
});

module.exports = Navigation  ;
