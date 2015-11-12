var React = require('react'),
    Divider;

Divider = React.createClass({

    displayName: 'Divider',

    render: function () {

        return (
            <hr
                style={{
                    margin: 0,
                    marginTop: -1,
                    marginLeft: 0,
                    height: 1,
                    border: 'none',
                    backgroundColor: '#e0e0e0'
                }}
            />
        );
    }
});

module.exports = Divider;
