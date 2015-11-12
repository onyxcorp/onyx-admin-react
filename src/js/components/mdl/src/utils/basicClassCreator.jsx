//Shameless copy, with ES6.

var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames');


export default function(defaultClassName, element = 'div') {
    class BasicClass extends React.Component {
        render() {
            var { className, ...otherProps } = this.props;

            return React.createElement(element, {
                className: classNames(defaultClassName, className),
                ...otherProps
            }, this.props.children);
        }
    }

    BasicClass.propTypes = {
        className: React.PropTypes.string
    };

    return BasicClass;
}