var React = require('react'),
    Button = require('../../mdl').Button,
    UploadButton;

UploadButton = React.createClass({

    displayName: 'UploadButton',

    propTypes: {
        button: React.PropTypes.oneOf(['flat', 'raised']).isRequired,
        label:  React.PropTypes.string.isRequired,
        disabled: React.PropTypes.bool,
        multiLabel:  React.PropTypes.string,
        multiple: React.PropTypes.bool,
        inputName:  React.PropTypes.string,
        inputRef:  React.PropTypes.string,
        onChange:  React.PropTypes.func
    },

    getInitialState: function() {
        return {
            fileName: this.props.label
        };
    },

    _getFileName: function(e) {
        if (e.target.files[0].name) {
            this.setState({
                fileName: '.../' + e.target.files[0].name
            });
        }
        if (this.props.onChange) this.props.onChange(e);
    },

    _multipleHandler: function(e){
        var multipleLabel = this.props.multiLabel || 'Files Selected';

        if (e.target.files.length > 0) {
            this.setState({
                fileName: e.target.files.length + ' ' + multipleLabel
            });
        }
        if (this.props.onChange) this.props.onChange(e);
    },

    render: function () {
        var {
            button,
            label,
            multiLabel,
            multiple,
            inputName,
            inputRef,
            raised,
            onChange,
            ...otherProps
        } = this.props;


        var inputElement,
            currentLabel;

        var styles = {
            inputFile: {
                cursor: 'pointer',
                height: '100%',
                position:'absolute',
                top: 0,
                right: 0,
                zIndex: 2,
                fontSize: 50,
                opacity: 0
            }
        };

        var inputProps = {
            style : styles.inputFile,
            ref: inputRef ? inputRef : 'input',
            name : inputName ? inputName : 'input'
        };

        if (this.props.hasOwnProperty('valueLink')) {
            inputProps.valueLink = this.props.valueLink;
        }

        if(!this.props.disabled) {
            if (!multiple) {
                inputProps.onChange = this._getFileName;

            } else {
                inputProps.onChange = this._multipleHandler;
                inputProps.multiple = "multiple";
            }

            inputElement = (
                <input type='file' {...inputProps} />
            );

        }

        currentLabel = this.state.fileName;

        return (
            <Button colored={true} raised={raised === 'flat' ? false : true } {...otherProps}>
                {currentLabel}
                {inputElement}
            </Button>
        );
    }
});

module.exports = UploadButton;
