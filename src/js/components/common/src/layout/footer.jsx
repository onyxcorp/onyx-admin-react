var React = require('react'),
    assign = require('object-assign'),
    Link = require('react-router').Link,
    Footer;

Footer = React.createClass({

    displayName: 'Footer',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object
    },

    getDefaultProps: function () {
        return {};
    },

    defaultStyles: {
        marginTop: 30,
        padding: '8px 16px',
        width: '100%'
    },

    render: function () {

        var {
            className,
            style,
            ...otherProps
        } = this.props;

        return (
            <footer style={assign({}, this.defaultStyles, style)} className="mdl-mini-footer" {...otherProps} >
                <div className="mdl-mini-footer__left-section">
                    <div className="mdl-logo" style={{lineHeight: '66px'}}>Impallets</div>
                    <ul className="mdl-mini-footer__link-list">
                        <li><Link to="contactCorporative">Venda Corporativa</Link></li>
                        <li><Link to="page" params={{ slug: 'sobre-nos' }} >A Impallets</Link></li>
                        <li><Link to="contact">Contato</Link></li>
                    </ul>
                </div>
            </footer>
        );
    }
});

module.exports = Footer;
