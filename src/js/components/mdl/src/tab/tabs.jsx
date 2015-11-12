var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    Tab = require('./tab.jsx'),
    Tabs;

Tabs = React.createClass({

    displayName: 'Tabs',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        defaultActiveTab: React.PropTypes.string,
        children: React.PropTypes.arrayOf(function(props, propName, componentName) {
            var prop = props[propName];
            if(prop.type !== Tab) {
                return new Error('`' + componentName + '` only accepts `Tab` as children.');
            }
        }),
    },

    getInitialState: function () {
        return {
            activeTab: this.props.defaultActiveTab
        };
    },

    mixins: [PureRenderMixin, UpgradeMixin('tabs')],

    defaultStyles: {},

    _handleClickTab: function (tabId) {
        this.setState({
            activeTab: tabId
        });
    },

    render: function () {

        var {
            className,
            style,
            activeTab,
            onChange,
            children,
            ...otherProps
        } = this.props;

        var tabContent,
            tabs,
            classes;

        tabContent = [];
        tabs = React.Children.map(children, function (tab, index) {

            // Here we create the tab panels content, it get's all that was passed
            // inside the <Tab>foo</Tab> (in this case, foo)
            if (tab.props.children) {
                tabContent.push(React.createElement('div', {
                    key: index,
                    id: tab.props.id,
                    className: tab.props.id === this.state.activeTab ? 'mdl-tabs__panel is-active' : 'mdl-tabs__panel'
                }, tab.props.children));
            }

            // Here we clone the tab element while correctly linking the tabs
            // with the newley createded panels from above
            return (
                React.cloneElement(tab, {
                    label: tab.props.label,
                    id: tab.props.id,
                    active: tab.props.id === this.state.activeTab,
                    onTabClick: this._handleClickTab,
                    style: tab.props.style ? tab.props.style : {
                        backgroundColor: 'rgb(66,66,66)',
                        width: 100 / React.Children.count(children) +'%'
                    }
                })
            );
        }.bind(this));

        classes = classNames(['mdl-tabs', 'mdl-js-tabs', 'mdl-js-ripple-effect'], className);

        return (
            <div ref={this.theRef()} style={assign({}, this.defaultStyles, style)} className={classes} {...otherProps}>
                <div className="mdl-tabs__tab-bar">
                    {tabs}
                </div>
                {tabContent}
            </div>
        );
    }
});

module.exports = Tabs;
