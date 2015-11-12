var request = require('superagent'),
    db = require('./FirebaseUtils').initFirebase();

function ApiEndpoints() {

    var base;

    if (global.isLocalHost) {
        base = 'http://localhost:3000/';
    } else {
        base = 'https://impallets.mod.bz/';
    }

    this.api = {
        base: base,
        endpoints: {
            get: {
                main: base
            },
            post: {
                file: base + 'fileUpload/'
            }
        }
    };
}

ApiEndpoints.prototype.request = function (type, endpoint, params, headers, data, callback) {

    if (!this.api.endpoints.hasOwnProperty(type)) throw new Error('ApiEndpoints invalid endpoint type');
    if (!this.api.endpoints[type].hasOwnProperty(endpoint)) throw new Error('ApiEndpoints invalid endpoint name');
    if (!request.hasOwnProperty(type)) throw new Error('ApiEndpoints invalid superagent property');

    var url = params ? this.api.endpoints[type][endpoint] + params : this.api.endpoints[type][endpoint];

    // the authorization of our requests are handle through firebase, that's why
    // we need to reference it here with the Authorization Header
    request[type](url)
        .set('Authorization', db.tables.base.getAuth().token)
        .send(data)
        .end(callback);

};

ApiEndpoints.prototype.uploadFile = function (entityType, entityId, file, callback) {
    // TODO this code (FileReader) should live inside the file upload component
    // since that component will try to use this or create an invisible iFrame
    // for IE 10 < support
    var reader = new FileReader();

    reader.onload = function(e) {
        this.request('post', 'file', entityType + '/'  + entityId, 'multipart/form-data', file, callback);
    }.bind(this);

    reader.onabort = function () {
        callback(new Error('The image upload was aborted'));
    };

    reader.onerror = function () {
        callback(new Error('An error ocurred while reading the image'));
    };

    reader.readAsDataURL(file);


};

module.exports = new ApiEndpoints();
