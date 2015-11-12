
var React = require('react'),
    titleSetMixin = require('../../../mixin/titleMixin'),
    Grid = require('../../../mdl').Grid,
    Paper = require('../../../mdl').Paper,
    CartNotFound;

CartNotFound = React.createClass({

    displayName: 'StoreNotFound',

    mixins: [titleSetMixin],

    render: function (){
        return (

        <div>
            <div className="page-title-wrapper">
                <Grid>
                    <div className="page-title">
                        <h4>Página não Encontrada</h4>
                    </div>
                </Grid>
            </div>
            <Grid>
                <div className='paperContent' style={{width: '100%'}}>
                    <Paper shadow={2}>
                        <h1>404</h1>
                    </Paper>
                </div>
            </Grid>
        </div>

        );
    }
});

module.exports = CartNotFound;
