var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Immutable = require('immutable'),
    assign = require('object-assign'),
    Avatar = require('../../mdl').Avatar,
    UserAvatar;

UserAvatar = React.createClass({

    displayName: 'UserAvatar',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        user: React.PropTypes.instanceOf(Immutable.Record)
    },

    mixins: [PureRenderMixin],

    defaultStyles: {
        base: {},
        avatar: {}
    },

    render: function () {
        var {
            className,
            style,
            user,
            ...otherProps
        } = this.props;

        var content,
            baseStyle,
            avatarStyle;

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        avatarStyle = style && style.avatar ? assign({}, this.defaultStyles.avatar, style.avatar) : this.defaultStyles.avatar;

        if (this.props.isLinkedState || (this.props.user && this.props.user.get('avatar'))) {
            content = (
                <Avatar
                    style={avatarStyle}
                    className={className}
                    borderColor="#ececec"
                    size={this.props.size}
                    src={this.props.isLinkedState || this.props.user.get('avatar')}
                    {...otherProps} />
            );
        } else {
            var name;
            if (this.props.user && this.props.user.get('name')) {
                name = this.props.user.get('name').charAt(0);
            } else {
                name = 'A';
            }
            content = (
                <Avatar
                    style={avatarStyle}
                    className={className}
                    color={'#fff'}
                    backgroundColor={'#478C37'}
                    size={this.props.size}
                    borderColor="#ececec"
                    {...otherProps} >
                    {name}
                </Avatar>
            );
        }

        return (
            <span style={baseStyle}>
                {content}
            </span>
        );
    }
});

module.exports = UserAvatar;
