
var React = require('react'),
    titleSetMixin;

titleSetMixin= {

    // Lots of Validations, and must be in this point of the LifeCycle to get the title correctly in an 'async' way
    componentWillReceiveProps: function (nextProps) {
        if (this.context.router){
            if (this.context.router.getCurrentRoutes()[2].name === 'product') {
                if (this.props.product !== nextProps.product) {
                    if (nextProps.product.get('title')) {
                        var productTitle = nextProps.product.get('title');
                        this.context.flux.getActions('app').setTitle(this.title(productTitle));
                    }
                }
            }
        }
    },

    // For Non-Async componentes, this is the most efficient way:
    componentDidMount: function(){
        if (this.context.router) {
            if (this.context.router.getCurrentRoutes()[2].name !== 'product') {
                var pageTitle = this.constructor.displayName;
                this.context.flux.getActions('app').setTitle(this.title(pageTitle));
            }
        }
    },

    title: function(title){
        var website = window.projectName;
        return website + ' - ' + title;
    }
};

module.exports = titleSetMixin;
