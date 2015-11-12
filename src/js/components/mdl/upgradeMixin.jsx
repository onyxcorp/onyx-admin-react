
var React = require('react'),
    assign = require('object-assign'),
    uniqueId = require('uniqueid'),
    UpgradeDomMixing;


function createMixing(elementName,childName) {

    UpgradeDomMixing = {

        getInitialState: function(){
            return {
                ref: elementName + uniqueId(),
                childRef: false
            };
        },

        componentWillMount: function(){
            if (childName){
                this.setState({
                    childRef: childName + uniqueId()
                });
            }
        },

        componentDidMount: function () {
            // componentHandler.upgradeDom();
           componentHandler.upgradeElement(this.refs[this.state.ref].getDOMNode());
            if (this.state.childRef && this.refs[this.state.childRef]) {
                componentHandler.upgradeElement(this.refs[this.state.childRef].getDOMNode());

            }
        },

        // componentDidUpdate: function () {
        //     // componentHandler.upgradeDom();
        //     componentHandler.upgradeElement(this.refs[this.state.ref].getDOMNode());
        //     if (this.state.childRef && this.refs[this.state.childRef]) {
        //         componentHandler.upgradeElement(this.refs[this.state.childRef].getDOMNode());
        //     }
        // },

        componentWillUnmount: function () {
            componentHandler.downgradeElements(this.refs[this.state.ref].getDOMNode());
        },

        theRef: function(){
            return this.state.ref;
        },

        theChildRef: function(){
            return this.state.childRef;
        }
    };

    return UpgradeDomMixing;

}

module.exports = createMixing;
