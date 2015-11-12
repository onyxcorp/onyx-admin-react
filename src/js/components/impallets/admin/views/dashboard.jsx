var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    titleSetMixin = require('../../../mixin/titleMixin'),
    Link = require('react-router').Link,
    Grid = require('../../../mdl').Grid,
    Paper = require('../../../mdl').Paper,
    UploadButton = require('../../../common').UploadButton,
    Dashboard;

Dashboard =
    React.createClass({
        displayName: 'Painel do Administrador',

        mixins: [PureRenderMixin, titleSetMixin],

        onChangeTest: function(e){
            console.log('Working :)');
            console.log(e);
        },

        render: function () {

            return (
                <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                    <Paper shadow={2} style={{width: '100%'}}>
                        <h1>Admin Dashboard</h1>
                        <Link to="adminOrders">
                            Lista de Pedidos
                        </Link>
                        <Link to="adminProducts">
                            Lista de Produtos
                        </Link>
                        <Link to="adminReviews">
                            Lista de Reviews
                        </Link>

                    </Paper>
                </Grid>
            );
        }
    });

module.exports = Dashboard;
