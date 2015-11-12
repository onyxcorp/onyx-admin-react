var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    titleSetMixin = require('../../../mixin/titleMixin'),
    Grid = require('../../../mdl').Grid,
    Col = require('../../../mdl').Col,
    Paper = require('../../../mdl').Paper,
    BlogsList;

BlogsList =
    React.createClass({

        mixins: [PureRenderMixin, titleSetMixin],

        render: function () {
            return (
            <div>
                <div className="page-title-wrapper">
                    <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                        <div className="page-title">
                            <h4>Blogs List</h4>
                        </div>
                    </Grid>
                </div>
                <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                    <div className='paperContent'>
                        <Paper shadow={2} style={{zIndex: 2}}>
                            <p>Lorem ispum aqui</p>
                        </Paper>
                    </div>
                </Grid>
            </div>

            );
        }
    });

module.exports = BlogsList;
