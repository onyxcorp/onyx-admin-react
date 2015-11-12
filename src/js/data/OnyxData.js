
var FirebaseUtils = require('../utils/FirebaseUtils'),
    Immutable = require('immutable'),
    Types = require('../utils/Types'),
    assign = require('object-assign'),
    moment = require('moment'),
    masker = require('../utils/VanillaMasker.js'),
    round = require('../utils/Round').round,
    validator = require('validator');

/**
 *
 * Lists are ordered indexed dense collections, much like a JavaScript Array.
 * http://facebook.github.io/immutable-js/docs/#/List
 *
 * We need this wrapper because Immutable.List returns an INSTANCE and not a CLASS
 * (RECORD returns a class..)
 */
function OnyxListFactory(extend) {

    function ListFactory(recordFactory, defaultValues) {
        this._recordFactory = recordFactory;
        this._defaultValues = assign({}, defaultValues, {
            list: Immutable.List(),
            filteredList: Immutable.List(),
            isFiltered: false,
            lastUpdated: null,
            lastSorting: 'ASC'
        });
        this._name = 'ListRecord';
    }

    ListFactory.prototype.create = function (data) {

        var _parent = this,
            ListRecord;

        ListRecord = Immutable.Record(this._defaultValues, this._name);    // returns a constructor

        ListRecord.prototype._recordFactory = this._recordFactory;  // reference to parent recordFactory attribute

        ListRecord.prototype.getRecordFactory = function () {
            return this._recordFactory;
        };

        ListRecord.prototype.newRecord = function (data) {
            return this.getRecordFactory().create(data);
        };

        ListRecord.prototype.update = function (data) {

            if (Types.isImmutableList(data) || Types.isArray(data)) throw new Error('Trying to use ListRecord.update with Immutable.List or Array, maybe you were looking for updateAll method?');

            var list,        // Immutable.List
                lastUpdated,
                result;

            if (data) {

                data = (data instanceof Immutable.Record) ? data : this.newRecord(data);

                var existingItem = this.getIndexDataById(data.getKeyValue());

                if (existingItem) {
                    // this will trigger a beforeSet call because we are using Record.merge()
                    list = this.get('list').set(existingItem[0], existingItem[1].merge(data));
                    lastUpdated = list.get(existingItem[0]);
                } else {
                    // this will not trigger a beforeSet call (we are just pushing the data to the list)
                    list = this.get('list').push(data);
                    lastUpdated = data;
                }
            }

            // only update if the list was set and is different from current list
            if (list && this.get('list') !== list) {
                result = this.merge({
                    list: list,
                    lastUpdated: lastUpdated || this.get('lastUpdated')
                });
            } else {
                result = this;
            }

            return result;
        };

        // a very expensive method... maybe there is a better way to do this
        ListRecord.prototype.updateAll = function (data) {

            var newListRecord = this,
                result;

            if (data) {
                data.forEach(function (item) {
                    newListRecord = newListRecord.update(item);
                });
            }

            return newListRecord;
        };

        ListRecord.prototype.remove = function (data) {

            var list,
                lastUpdated,
                result;

            if (data) {

                data = (data instanceof Immutable.Record) ? data : this.newRecord(data);

                var existingItem = this.getIndexDataById(data.getKeyValue());

                if (existingItem) {
                    list = this.get('list').delete(existingItem[0]);
                    lastUpdated = existingItem[1];
                }
            }

            // only update if the list was set and was updated
            if (list && this.get('list') !== list) {
                result = this.merge({
                    list: list,
                    lastUpdated: lastUpdated || this.get('lastUpdated')
                });
            } else {
                result = this;
            }
            return result;
        };

        ListRecord.prototype.removeAll = function (data) {

            var newListRecord = this,
                result;

            if (data) {
                data.forEach(function (item) {
                    newListRecord = newListRecord.remove(item);
                });
            }

            return newListRecord;
        };

        // Ovewrite the default Record/Map clear method
        ListRecord.prototype.clear = function () {
            return this.merge(this._defaultValues);
        };

        ListRecord.prototype.total = function () {
            return this.get('list').count();
        };

        ListRecord.prototype.sortBy = function (property) {
            return this.merge({
                list: this.get('list').sort( function (a, b) {
                    // for the eventuallity of the product being wrongly saved on the database
                    if (!a[property] || !b[property]) return;

                    var sortVal = 0;
                    if (a[property] > b[property]) {
                        sortVal = 1;
                    }
                    if (a[property] < b[property]) {
                        sortVal = -1;
                    }
                    if (this.get('lastSorting') === 'DESC') {
                        sortVal = sortVal * -1;
                    }
                    return sortVal;
                }.bind(this)),
                lastSorting: this.get('lastSorting') === 'ASC' ? 'DESC' : 'ASC'     // switch lastSorting
            });
        };

        ListRecord.prototype.filterBy = function (property, filter) {
            return this.merge({
                filteredList: this.get('list').filter( function (item) {
                    // for the eventuallity of the product being wrongly saved on the database (no title for instance)
                    if (item[property]) return item[property].toLowerCase().indexOf(filter.toLowerCase()) >= 0;
                }),
                isFiltered: (property && filter ? true : false)
            });
        };

        ListRecord.prototype.getById = function (id) {
            return this.get('list').find( function(item) {
                return item.getKeyValue() === id;
            });
        };

        ListRecord.prototype.getIndexDataById = function (id) {
            return this.get('list').findEntry( function(item) {
                return item.getKeyValue() === id;
            });
        };

        ListRecord.prototype.getFirst = function () {
            return this.get('list').first();
        };

        ListRecord.prototype.getLast = function () {
            return this.get('list').last();
        };

        assign(ListRecord.prototype, extend);

        return new ListRecord().updateAll(data);
    };

    return ListFactory;

}

/**
 *
 * Creates a new Class which produces Record instances.
 *
 * A record is similar to a JS object, but enforce a specific set of allowed string keys, and have default values.
 * http://facebook.github.io/immutable-js/docs/#/Record
 *
 *  We can work directly on the Record returned from Immutable because it is A CLASS
 * (List returns an Instance..)
 */
function OnyxRecordFactory(extend) {
    function Invalid() {
        this._errors = {};
    }
    Invalid.prototype.setError = function (error) {
        assign(this._errors, error);
    };
    Invalid.prototype.isInvalid = function () {
        return Object.keys(this._errors).length;
    };
    Invalid.prototype.isValid = function () {
        return !this.isInvalid();
    };
    Invalid.prototype.getErrors = function () {
        if (this.isInvalid()) {
            return this._errors;
        }
        return null;
    };
    Invalid.prototype.getErrorByKey = function (key) {
        return this._errors[key];
    };
    Invalid.prototype.getMessages = function () {
        var messages = {};
        Object.keys(this._errors).forEach(function (messageKey) {
            messages[messageKey] = this._errors[messageKey].message;
        }.bind(this));
        return messages;
    };
    Invalid.prototype.getStringifiedMessages = function () {
        var messages = this.getMessages();
        return Object.keys(messages).map( function (key) {
            return key + ': ' + messages[key];
        }).join(',');
    };

    function validatePropertyJSON(schemaPropertyJSON) {
        if (!schemaPropertyJSON || !Types.isObject(schemaPropertyJSON)) throw new Error('Invalid or undefined schemaPropertyJSON');
        if (!schemaPropertyJSON.type) throw new Error('All schemaPropertyJSON must have a valid type set like string, number, array, object, boolean, etc');
        if (!schemaPropertyJSON.properties) throw new Error('All schemaPropertyJSON must have a valid properties key, even if it is emtpy');
    }

    function getDecimalAndThousandMarkers(schemaPropertyJSON) {

        validatePropertyJSON(schemaPropertyJSON);

        var decimal = schemaPropertyJSON.properties.decimal,
            thousand = schemaPropertyJSON.properties.thousand;

       if (decimal && !thousand) {
           // thousand always are the oposite of decimal
           thousand = decimal === '.' ? ',' : '.';
       } else if (!decimal && thousand) {
           // decimal always are the oposite of decimal
           decimal = thousand === ',' ? '.' : ',';
       } else if (!decimal && !thousand) { // default values
           decimal = '.';
           thousand = ',';
       }

       if (decimal !== ',' && decimal !== '.') throw new Error('Decimal value must be either "," or "."');
       if (thousand !== ',' && thousand !== '.') throw new Error('Thousand value must be either "," or "."');
       if (decimal === thousand) throw new Error('Decimal and thousand cannot be the same value');

       return {
           decimal: decimal,
           thousand: thousand
       };
    }

    // # from https://github.com/facebook/immutable-js/blob/master/src/Record.js
    function makeRecord(likeRecord, map, ownerID) {
        var record = Object.create(Object.getPrototypeOf(likeRecord));
        record._map = map;
        record.__ownerID = ownerID;
        return record;
    }

    // transform invalid markers to supported javascript markers, Basically
    // that means changing ',' to '.' and removing thousand markers..
    function fixMarkers (value, markers) {
        if (!Types.isString(value)) value = value.toString();
        markers = markers || { thousand: '.', decimal: ',' };
        var hasDecimal = value.indexOf(markers.decimal) !== -1;
        var hasThousand = value.indexOf(markers.thousand) !== -1;
        if (markers.thousand === markers.decimal) throw new Error('fixMarkers cant have thousand and decimal using same character');
        if (hasDecimal && hasThousand) {
            // if there is a decimal , transform it here first to a valid numeric data type
            value = value.split(markers.thousand).join('').split(markers.decimal).join('.');
        } else if (hasThousand) { // only thousand
            value = value.split(markers.thousand).join('');
        } else if (hasDecimal && markers.decimal !== '.') { // only decimal and with an invalid marker
            value = value.split(markers.decimal).join('.');
        }
        return value;
    }

    // for when converting back from string to number, should return an Int or Float
    function stringToNumber(value, precision, markers) {
        // set the default parameters
        if (!Types.isString(value)) throw new TypeError('stringToNumber value must be a string');

        precision = precision || 0;
        markers = markers || { thousand: '.', decimal: ',' };

        var parsedValue;

        value = fixMarkers(value);

        if (precision > 0) {

            // final decimalSize by the javascript default decimal marker (dot)
            var decimalSize = value.substr(value.indexOf('.') + 1).length;
            // if the decimalSize is bigger than what it should be, reduce it
            if (decimalSize > precision + 1) value = round(value, precision + 1);

            value = masker.toMoney(value, {
                precision: precision,
                delimiter: markers.thousand,
                separator: markers.decimal
            });
            parsedValue = parseFloat(fixMarkers(value));
        } else {
            parsedValue = parseInt(round(value));
        }
        return parsedValue;
    }

    // for values that should be decimal, should return a numeric STRING
    function fixDecimalLength(value, precision) {
        if (!Types.isString(value)) value = value.toString();
        precision = precision || 0;
        var decimalPosition = value.indexOf('.');
        if (decimalPosition !== -1) {
            // get the lenght of the string after the decimal, the +1 is to make sure
            // that the . is not included
            var decimalSize = value.substr(decimalPosition + 1).length;
            if (decimalSize < precision) {
                value += Array(precision - decimalSize + 1).join('0');
            }
        } else {
            value += Array(precision + 1).join('0');
        }
        return value;
    }

    /**
     * Fancy ID generator that creates 20-character string identifiers with the following properties:
     *
     * 1. They're based on timestamp so that they sort *after* any existing ids.
     * 2. They contain 72-bits of random data after the timestamp so that IDs won't collide with other clients' IDs.
     * 3. They sort *lexicographically* (so the timestamp is converted to characters that will sort properly).
     * 4. They're monotonically increasing.  Even if you generate more than one in the same timestamp, the
     *    latter ones will sort after the former ones.  We do this by using the previous random bits
     *    but "incrementing" them by 1 (only in the case of a timestamp collision).
     */
    function generateId() {

    var PUSH_CHARS,
        lastPushTime,
        lastRandChars;

    // Modeled after base64 web-safe chars, but ordered by ASCII.
    PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

    // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
    lastPushTime = 0;

    // We generate 72-bits of randomness which get turned into 12 characters and appended to the
    // timestamp to prevent collisions with other clients.  We store the last characters we
    // generated because in the event of a collision, we'll use those same characters except
    // "incremented" by one.
    lastRandChars = [];
    var now,
        duplicateTime,
        timeStampChars,
        id;

    now = new Date().getTime();
    duplicateTime = (now === lastPushTime);
    lastPushTime = now;

    timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
        timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
        // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
        now = Math.floor(now / 64);
    }
    if (now !== 0) throw new Error('We should have converted the entire timestamp.');

    id = timeStampChars.join('');

    if (!duplicateTime) {
        for (i = 0; i < 12; i++) {
            lastRandChars[i] = Math.floor(Math.random() * 64);
        }
    } else {
        // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
        for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
            lastRandChars[i] = 0;
        }
            lastRandChars[i]++;
        }
        for (i = 0; i < 12; i++) {
            id += PUSH_CHARS.charAt(lastRandChars[i]);
        }
        if(id.length != 20) throw new Error('Length should be 20.');
        return id;
    }

    function RecordFactory(name, key, defaultValues, schemasJSON) {

        if (!Types.isObject(schemasJSON) ) throw new Error('schemasJSON must be an Object');
        if (!Types.isObject(defaultValues)) throw new Error('defaultValues must be an Object');

        // defensive copy
        this._name = name || 'Record';
        this._key = key || 'id';
        this._defaultValues = assign({}, defaultValues);
        this._schemasJSON = assign({}, schemasJSON);
        this._schemas = {};

        if (!this._schemasJSON.base) throw new Error('schemasJSON must have at least one base definition');

        Object.keys(this._schemasJSON).forEach( function (schemaName) {   // base, profile, register...
            if (schemaName !== 'base') {

                var currentSchemaProperties = Object.keys(this._schemasJSON[schemaName]);
                var baseSchemaProperties = Object.keys(this._schemasJSON.base);

                // see if only valid properties were set at currentSchema for baseSchema
                currentSchemaProperties.forEach( function (currentSchemaProperty) {
                    if (baseSchemaProperties.indexOf(currentSchemaProperty) === -1 ) throw new Error('Trying to set a schemaProperty, "' + currentSchemaProperty + '" is not described at the schemasJSON.base');
                });

                // override the other schemas with the base schema that was defined on the record
                baseSchemaProperties.forEach(function (schemaProperty) {
                    // merge each property on the other schemas from the base schema
                   this._schemasJSON[schemaName][schemaProperty] = assign({}, this._schemasJSON.base[schemaProperty], this._schemasJSON[schemaName][schemaProperty] || {});
               }.bind(this));
            }
        }.bind(this));
    }

    RecordFactory.prototype.create = function (data) {

        // defensive copy of data
        if (!Types.isImmutableMap(data) && data !== undefined) throw new Error('RecordFactory.create - data must be undefined or an Immutable.Map');

        // set a default key id for the object, if the object is cleared/reseted the key
        // will be back to it's default time. Since the ID generated is time based it doesn't matter
        // how long before the creation it was reseted, the key is guaranteed to always be unique
        var newId = {};
        newId[this._key] = generateId();

        var Record = Immutable.Record(assign({}, this._defaultValues, newId), this._name);    // returns a constructor
        Record.prototype._key = this._key;
        Record.prototype._schemasJSON = this._schemasJSON;
        Record.prototype._schemas = this._schemas;

        // ovewritten the default set method in order to be able to call a before function
        // # from https://github.com/facebook/immutable-js/blob/master/src/Record.js
        Record.prototype.set = function set(k, v) {

            // WORKAROUND FOR FIREBASE variable id properties (becuase of user id being uid instead of id)
            // maybe we should just dump the uid idea and rename it to id like all the other models
            if (k === '_id') {
                k = this._key;
            }


            // There are two possible cases now
            // 1 - we have a list to be set at the Onyxdata Immutable.Record of type List
            // 2 - we already have the OnyxData Immutable.Record of type list and just want to set it as it is
            //   so we don't have to do nothing because the record can just be set
            if (Types.isImmutableList(v)) {

                // since it is a immutable list make sure that the record default values are correctly set
                if (!this._defaultValues[k] || !Types.isFunction(this._defaultValues[k].updateAll)) {
                    throw new Error(k + ' must be set as an Immutable.Record of OnyxData List at ' + this._name);
                }
                v = this._defaultValues[k].updateAll(v);

            } else if (Types.isArray(v)) {
                console.warn('Should use the Immutable.Record of Onyxdata List for array data types instead of pure JS arrays');
            }

            if (!this.has(k)) {
                throw new Error('Cannot set unknown key "' + k + '" on ' + this._name || this.constructor.name || 'Record');
            }
            // call beforeSet if exists
            if (Types.isFunction(this.beforeSet)) {
                v = this.beforeSet(k, v);
            }

            // if no value, return the default state value
            if (v === null) {
                return this.remove(k);  // removing on a record set it to default value
            } else if ( v === false ) {
                return this;
            }

            var newMap = this._map && this._map.set(k, v);
            if (this.__ownerID || newMap === this._map) {
                return this;
            }

            // call afterSet if exists
            if (Types.isFunction(this.afterSet)) {
                var updatedData = this.afterSet(k, v);
                if (updatedData && !Types.isObject(updatedData)) throw new Error('updatedData must be an Object');
                if (updatedData && Object.keys(updatedData).length) newMap = newMap.merge(updatedData);
            }
            return makeRecord(this, newMap);
        };

        // this method should be used with INPUT
        Record.prototype.getMasked = function getMasked(k, partial, rawValue) {

            // field will be partial when it is being currently eddited by the user
            partial = partial || false;
            // the original value inputed by the user, with no parse computations performed
            rawValue = rawValue || null;
            var value = this.get(k),
                schemaPropertyJSON = this.getSchemaJSON()[k];

            validatePropertyJSON(schemaPropertyJSON);

            if (!value) return '';

            if (schemaPropertyJSON.type === 'number') {
                var decimalAndThousand = getDecimalAndThousandMarkers(schemaPropertyJSON),
                    precision = schemaPropertyJSON.properties.precision || 0;

                value = value.toString();
                if (rawValue) rawValue = fixMarkers(rawValue, decimalAndThousand);

                // when the field is new (!partial) or when the field is being eddited but the rawValue have a decimal place we should
                // fix the decima length. Basically this will allow the field to be changed from 0,10 to 1,00 when in edit mode
                // and change from 1 to 100 when new or not in edition mode
                if (precision > 0 && (!partial || (partial && rawValue.indexOf('.') !== -1))) value = fixDecimalLength(value, precision);

                value = masker.toMoney(value, {
                    precision: precision,
                    delimiter: decimalAndThousand.thousand,
                    separator: decimalAndThousand.decimal
                });
            } else if (schemaPropertyJSON.type === 'string') {

                var mask;

                if (schemaPropertyJSON.match === 'isDate') {
                    var format = schemaPropertyJSON.properties.format || 'DD/MM/YYYY';

                    mask =  schemaPropertyJSON.properties.mask || '99/99/9999';

                    // if is a valid ISO 8601 date format, transform it to the format specified above
                    var momentDate = moment(value, moment.ISO_8601, true);
                    if (momentDate.isValid()) value = momentDate.format(format);
                    // mask the resulting value before returning
                    value = masker.toPattern(value, mask);

                } else {
                    mask =  schemaPropertyJSON.properties.mask ? schemaPropertyJSON.properties.mask : null;
                    if (mask) value = masker.toPattern(value, mask);
                }
            }
            return value;
        };

        Record.prototype.getFormatted = function getFormatted(k) {

            var value = this.get(k),
                schemaPropertyJSON = this.getSchemaJSON()[k];

            validatePropertyJSON(schemaPropertyJSON);

            if (!value) return '';

            if (schemaPropertyJSON.type === 'number') {
                var decimalAndThousand = getDecimalAndThousandMarkers(schemaPropertyJSON),
                    precision = schemaPropertyJSON.properties.precision || 0;

                // never remove this line!
                value = value.toString();

                // to big decimal? fix it
                // final decimalSize by the javascript default decimal marker (dot)
                var decimalSize = value.substr(value.indexOf('.') + 1).length;
                // if the decimalSize is bigger than what it should be, reduce it
                if (decimalSize > precision + 1) value = round(value, precision + 1);

                // the data should be a float, make sure it is correctly set before applying mask
                if (precision > 0) value = fixDecimalLength(value, precision);

                // if we apply the mask on an incorret value it will break apart...
                value = masker.toMoney(value, {
                    precision: precision,
                    delimiter: decimalAndThousand.thousand,
                    separator: decimalAndThousand.decimal
                });
            } else if (schemaPropertyJSON.type === 'string') {

                var mask;

                if (schemaPropertyJSON.match === 'isDate') {
                    var format = schemaPropertyJSON.properties.format || 'DD/MM/YYYY';
                    mask =  schemaPropertyJSON.properties.mask ? schemaPropertyJSON.properties.mask : '99/99/9999';

                    // if is a valid ISO 8601 date format, transform it to the format specified above
                    var momentDate = moment(value, moment.ISO_8601);
                    value = momentDate.format(format);

                    // mask the resulting value before returning
                    value = masker.toPattern(value, mask);

                } else {
                    mask = schemaPropertyJSON.properties.mask ? schemaPropertyJSON.properties.mask : null;
                    if (mask) value = masker.toPattern(value, mask);
                }
            }
            return value;
        };

        Record.prototype.parseData = function parseData(k, value) {

            var schemaPropertyJSON = this.getSchemaJSON()[k];

            validatePropertyJSON(schemaPropertyJSON);

            /**
            *  React have an integration issue with chrome (maybe other browsers) where a
            *  input type="text" field get's uncontrolled as soon as someone types something that is not a number
            *
            *  By causing that we lose the data information bellow, in order to keep it working
            *  we implementend a own parser functione and all input that is a number must identify
            *  itself through the schemaJSON table
            *
            *  #more info at https://github.com/facebook/react/issues/1549
            */

            if (schemaPropertyJSON.type !== 'number' && schemaPropertyJSON.type !== 'string') return value;

            if (value && Types.isString(value)) {

                value = value.toString();

                if (!value.trim()) return value;

                // Unmask number input fields
                if (schemaPropertyJSON.type === 'number') {

                    // only chars allowed in number input fields
                    var numberRegex = new RegExp('^[0-9,.]+$', 'g');
                    if (!value.match(numberRegex)) return false;

                    // convert value from string to a valid number
                    value = stringToNumber(value, schemaPropertyJSON.properties.precision, getDecimalAndThousandMarkers(schemaPropertyJSON));

                    // an error may have ocurred, in this case it will throw somithng like 1,231312e+21 (like a calculator error)
                    // if thats the case don't update the current value
                    if (!value.toString().match(numberRegex)) return false;

                } else if (schemaPropertyJSON.type === 'string') {

                    // unmask string fields that should match a date pattern
                    if (schemaPropertyJSON.match === 'isDate') {

                        var dateRegex = new RegExp('^[0-9\/\-TZ:.]+', 'g');
                        if (!value.match(dateRegex)) return false;

                        var format = schemaPropertyJSON.properties.format || 'DD/MM/YYYY';

                        // we have a possible valid date, at least the lenght is matched, now try to convert it to ISO 8601 using moment.js library
                        if (value.length === format.length) {
                            var momentDate = moment(value, format, true);
                            if (momentDate.isValid()) value = momentDate.toISOString();
                        }
                    }

                    // nothing for now for the reamining type of strings
                }
            }
            return value;
        };

        // returns null, false or updated value
        Record.prototype.beforeSet = function beforeSet(key, value) {
            return this.parseData(key, value);
        };

        Record.prototype.afterSet = function afterSet() {
            return {};
        };

        Record.prototype.setAsync = function setAsync(property, value, callback) {
            if (!callback) throw new Error('setAsync need the parameter callback to be set');
            if (!Types.isFunction(callback)) throw new TypeError('setAsync need a function as a callback');
            // return the new Immutable.Record as a parameter of the callback function
            callback(this.set(property, value));
        };

        /*
        *   IS CALLED ONLY BY THE METHOD getSchemaJSON bellow
        */
        Record.prototype.getSchemasJSON = function getSchemasJSON() { return this._schemasJSON;};

        Record.prototype.getSchemaJSON = function getSchemaJSON(schemaNameJSON) {
            schemaNameJSON = schemaNameJSON || 'base';

            if (!this.getSchemasJSON().hasOwnProperty(schemaNameJSON)) throw new Error('Invalid schema json name');

            return this.getSchemasJSON()[schemaNameJSON];
        };

        Record.prototype.getSchemas = function getSchemas() { return this._schemas; };

        Record.prototype.getSchema = function getSchema(schema) {
            schema = schema || 'base';
            if (!this.getSchemas().hasOwnProperty(schema)) {
                throw new Error('Invalid schema name');
            }
            return this.getSchemas()[schema];
        };

        Record.prototype.getProperties = function getProperties() {
            return Object.keys(this.getSchemaJSON());
        };

        Record.prototype.getKey = function getKey() { return this._key; };

        Record.prototype.getKeyValue = function getKeyValue() { return this.get(this.getKey()); };

        Record.prototype.invalidate = function invalidate(schema, data) {

            schema = schema || 'base';
            // we are validating for firebase, so that makes more sense to export it that way instead of a toJS()
            if (!data) {
                var key = this.getKeyValue();
                data = this.toFirebaseJS()[key];
                data[this.getKey()] = key;
            }

            var invalid = new Invalid();

            if (!Types.isObject(data)) throw new TypeError('invalidate data must be an object');

            function convertMethod(methodName) {
                if (!methodName || !Types.isString(methodName)) throw new Error('methodName must be defined and be a string');
                return 'is' + methodName.capitalize();
            }

            function createMessage(label, message, example) {
                var newMessage = '';
                if (label) newMessage += label;
                if (message) newMessage += ' ' +  message;
                if (example) newMessage += ' Exemplo: ' + example;
                return newMessage;
            }

            if (!this._schemasJSON.hasOwnProperty(schema)) throw new Error('Need a valid schema name to proceed');

            Object.keys(this._schemasJSON[schema]).forEach( function (schemaPropertyName) { // id, title, name...

                // save a reference to the schema property, this is just to make life easier for calling the property...
                var propertyData = this._schemasJSON[schema][schemaPropertyName];
                validatePropertyJSON(propertyData);

                // we have to convert the string from something like 'string' to 'isString' before continuing...
                var isPropertyType = convertMethod(propertyData.type);

                // validate if the property type exist in the Types validation objects
                if (!Types[isPropertyType]) throw new Error('Invalid property type for ' + schemaPropertyName + ', the type passed was ' + propertyData.type);

                // set the default error messages, examples, labels, etc
                var value = data[schemaPropertyName],
                    label = propertyData.properties.label || schemaPropertyName,
                    errorMessage = propertyData.properties.errorMessage || '',
                    requiredMessage = propertyData.properties.requiredMessage || 'é obrigatório.',
                    exampleMessage = propertyData.properties.exampleMessage || '',
                    erro = {};

                // check if we have any value to validate
                if (value) {

                    // validate data keys
                    if (!data.hasOwnProperty(schemaPropertyName)) throw new Error('Invalid/malformed data object passed for validation for ' + schemaPropertyName + '. The key doesn\'t match the schema');

                    // the data value correctly matches the current type
                    if (Types[isPropertyType](value)) {

                        // if the property type is correct and is array or object our validation ends...
                        // TODO allow for validation of key types for objects and data types for arrays (very very in the future...)
                        if (isPropertyType === 'isArray' || isPropertyType === 'isObject') return;

                        // Validate the value now. The validator want all it's data to be a string
                        // so we need to conver it temporarily here
                        var valueAsString = value.toString(),
                            min = propertyData.properties.min,  // min works both for numbers or string lenghts
                            max = propertyData.properties.max;  // max works both for numbers or string lenghts

                        if (propertyData.match) {
                            // if match is a regex object..
                            if (Types.isRegex(propertyData.match)) {
                                if (!valueAsString.match(propertyData.match)) {
                                    erro[schemaPropertyName] = {
                                        type: propertyData.type,
                                        message: createMessage(label, errorMessage, exampleMessage)
                                    };
                                    invalid.setError(erro);
                                }
                            } else { // if the match is any of the validator default available methods as documneted here https://www.npmjs.com/package/validator#client-side-usage

                                // check if the match is an valid and available function to be called
                                if (!Types.isFunction(validator[propertyData.match])) throw new Error('Invalid validator method for ' + schemaPropertyName + ', the method passed was '+ propertyData.properties.match);

                                var validatorFunctionRefToCall;

                                // only validate this part if we have properties for min or max set and we are dealing with a integer or float
                                if ((propertyData.match === 'isInt' || propertyData.match === 'isFloat') && (min !== undefined || max !== undefined)) {
                                    var opts = {};
                                    if (min) opts.min = min;
                                    if (max) opts.max = max;
                                    validatorFunctionRefToCall = validator[propertyData.match].bind(validator, valueAsString, opts);
                                } else {
                                    // isAlpha, isDate, isBoolean, etc will all fall here
                                    validatorFunctionRefToCall = validator[propertyData.match].bind(validator, valueAsString);
                                }
                                if (!validatorFunctionRefToCall()) {
                                    erro[schemaPropertyName] = {
                                        type: propertyData.type,
                                        message: createMessage(label, errorMessage, exampleMessage)
                                    };
                                    invalid.setError(erro);
                                }
                            }
                        } else {

                            // even if there is no valid format to validate the data with
                            // but we are still able to validate it through using
                            // the min / max or other properties specifications
                            if (min !== undefined || max !== undefined) {
                                if (propertyData.type === 'string') {
                                    if (!validator.isLength(valueAsString, min, max)) {
                                        erro[schemaPropertyName] = {
                                            type: propertyData.type,
                                            message: createMessage(label, errorMessage, exampleMessage)
                                        };
                                        invalid.setError(erro);
                                    }
                                } else if (propertyData.type === 'number') {
                                    throw new Error('Need to set property match as int or float');
                                }
                            }
                        }

                    } else {
                        // invalid type (string, number, date...)
                        erro[schemaPropertyName] = {
                            type: propertyData.type,
                            message: createMessage(label, 'tipo inválido', exampleMessage)
                        };
                        invalid.setError(erro);
                    }
                } else if (propertyData.required) {
                    // no value.. but it is required!
                    erro[schemaPropertyName] = {
                        type: propertyData.type,
                        message: createMessage(label, requiredMessage, exampleMessage)
                    };
                    invalid.setError(erro);
                }
            }.bind(this));
            return invalid;
        };

        Record.prototype.invalidateKey = function invalidateKey(key, value, schema) {
            var data = {};
            data[key] = value;
            var invalid = this.invalidate(schema, data);
            return invalid.isInvalid() ? invalid.getErrorByKey(key) : null;
        };

        Record.prototype.invalidateSchema = function invalidateSchema(schema) {
            return this.invalidate(schema, this.toJS());
        };

        Record.prototype.toFirebaseJS = function toFirebaseJS() {
            var data;
            data = FirebaseUtils.toFirebaseJS(this);
            // look for any Immutable List or Immutable Record
            Object.keys(data[this.getKeyValue()]).forEach(function (key) {
                // if the conversion above has returned an object and the initial key is a instanceof Immutable.List...
                if (Types.isObject(data[this.getKeyValue()][key]) && this.get(key) instanceof Immutable.Record) {
                    if (this.get(key).get('list') instanceof Immutable.List) {
                        // for list types
                        data[this.getKeyValue()][key] = FirebaseUtils.toFirebaseJS(this.get(key).get('list'), 'list');
                    } else {
                        // for record types
                        data[this.getKeyValue()][key] = FirebaseUtils.toFirebaseJS(this.get(key));
                    }
                }
            }.bind(this));
            return data;
        };

        assign(Record.prototype, extend);

        // transform data
        if (data) {
            var newData = {};
            data.forEach(function (value, key) {
                if (Types.isImmutableList(value)) {
                    if (!this._defaultValues[key]) throw new Error(key + ' must be set as an Immutable.Record of OnyxData Listt at ' + this._name);
                    if (!Types.isFunction(this._defaultValues[key].updateAll)) throw new Error(key + ' has an invalid value set as default, it should be an Immutable.Record of OnyxData List at ' + this._name);
                    value = this._defaultValues[key].updateAll(value);
                }
                newData[key] = value;
            }.bind(this));

            if (newData._id) {
                newData[this._key] = newData._id;
                delete newData._id;
            }
            data = newData;
        }

        return new Record(data);
    };

    return RecordFactory;
}

module.exports = {
    List: function List(extend) {
        // returns a constructor, it's the OnyxList (which encapsulates Immutable.List)
        return OnyxListFactory(extend);
    },
    Record: function Record(extend) {
        // returns a constructor, it's the Immutable.Record itself
        return OnyxRecordFactory(extend);
    }
};
