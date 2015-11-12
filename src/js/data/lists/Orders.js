
var OnyxData = require('../OnyxData'),
    Order = require('../records/Order'),
    OrderListFactory,
    OrderFactory;

OrderListFactory = OnyxData.List();

OrderFactory = new OrderListFactory(Order);

module.exports = OrderFactory;
