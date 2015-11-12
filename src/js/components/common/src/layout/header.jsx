
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    classNames = require('classnames'),
    Link = require('react-router').Link,
    VHeader = require('../../../mdl').Header,
    CommonHeader;

CommonHeader = React.createClass({

    displayName: 'CommonHeader',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        link: React.PropTypes.string.isRequired,
        logo: React.PropTypes.string.isRequired
    },

    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {
            transform: -64
        };
    },

    defaultStyles: {
        background: '#fff',
        overflow: 'initial'
    },

    componentDidMount: function() {
        window.addEventListener('scroll', this._handleScroll);
    },

    componentWillUnmount: function() {
        window.removeEventListener('scroll', this._handleScroll);
    },

    _handleScroll: function(event) {
        var scrollTop = event.srcElement.body.scrollTop,
            itemTranslate = Math.min(0, scrollTop/3 - 64);

        this.setState({
            transform: itemTranslate
        });
    },

    render: function () {

        var {
            className,
            style,
            link,
            logo,
            children,
            ...otherProps
        } = this.props;

        var scrollable;

        if (this.state.transform != -64) {
            scrollable = 'impallets-header is-casting-shadow is-compact';
        } else {
            scrollable = 'impallets-header';
        }

        var classes = classNames(className, scrollable);

        // TODO cant use Img from common folder due to the "context" bug (the same one)
        // that ocurred with the Avatar component (wtf)
        return (
            <VHeader
                style={assign({}, this.defaultStyles, style)}
                title={<Link to={link}><img className='impallets-title' src={logo} /></Link>}
                waterfall={true}
                className={className}
                {...otherProps}>
                {children}
            </VHeader>
        );
    }
});

module.exports = CommonHeader;
