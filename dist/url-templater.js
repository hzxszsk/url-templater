(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.UrlTemplater = factory());
}(this, (function () { 'use strict';

var Util = {
    /**
     * 判断是否为字符串
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isString: function isString(arg) {
        return typeof arg === 'string';
    },

    /**
     * 判断是否为数字
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isNumber: function isNumber(arg) {
        return typeof arg === 'number';
    },

    /**
     * 判断是否为数组
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isArray: function isArray(arg) {
        return Array.isArray(arg);
    },

    /**
     * 判断是否为对象
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isObject: function isObject(arg) {
        return Object.prototype.toString.call(arg) === '[object Object]';
    },

    /**
     * 判断是否为函数
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isFunction: function isFunction(arg) {
        return typeof arg === 'function';
    },

    /**
     * 判断是否为null
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isNull: function isNull(arg) {
        return arg === null;
    }
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/**
 * a simple tool lib look like node's url module
 * 
 * @class Url
 */

var Url = function () {
    function Url() {
        classCallCheck(this, Url);
    }

    createClass(Url, null, [{
        key: 'parse',


        /**
         * transform a url string to a url object
         * 
         * @static
         * @param {String} url 
         * @return {Url}
         * @memberof Url
         */
        value: function parse(url) {
            if (Util.isString(url)) {
                var urlObj = {
                    protocol: null,
                    host: null,
                    path: null,
                    query: null,
                    hash: null
                };
                var protocolRegExp = /^(\w+):\/\//;
                // parse url's protocol part
                var protocol = url.match(protocolRegExp);
                if (protocol) {
                    urlObj.protocol = protocol[1];
                    // remove protocol part
                    url = url.slice(protocol[0].length);
                }
                // parse url's host part
                if (url.split('/')[0].length > 0) {
                    var host = url.split('/')[0];
                    urlObj.host = host;
                    // remove host part
                    url = url.slice(host.length);
                }
                // parse url's hash part (this parse order can make parse path easier)
                var hashIndex = url.indexOf('#');
                if (hashIndex !== -1) {
                    urlObj.hash = url.slice(hashIndex);
                    // remove hash part
                    url = url.slice(0, hashIndex);
                }
                // parse url's path part
                var queryIndex = url.indexOf('?');
                if (queryIndex !== -1) {
                    urlObj.path = url.slice(0, queryIndex);
                    urlObj.query = url.slice(queryIndex + 1);
                } else {
                    urlObj.path = url;
                }
                return urlObj;
            } else {
                throw new Error('parameter url must be a string');
            }
        }

        /**
         * transform a url object to a url string
         * 
         * @static
         * @param {Object} urlObj 
         * @return {String}
         * @memberof Url
         */

    }, {
        key: 'format',
        value: function format(urlObj) {
            if (Util.isObject(urlObj)) {
                var urlPartArray = [];
                urlPartArray.push(urlObj.protocol ? urlObj.protocol + '://' : '');
                urlPartArray.push(urlObj.host ? urlObj.host : '');
                urlPartArray.push(urlObj.port ? ':' + urlObj.port : '');
                urlPartArray.push(urlObj.path ? urlObj.path : '');
                urlPartArray.push(urlObj.query ? '?' + urlObj.query : '');
                urlPartArray.push(urlObj.hash ? urlObj.hash : '');
                return urlPartArray.join('');
            } else {
                throw new Error('parameter url_obj must be a object');
            }
        }
    }]);
    return Url;
}();

var UrlTemplater = function () {

    /**
     * create a url-template object
     * 
     * @param {String} url      url Template
     * @param {Object} options  constructor's option object, has attrs like UrlTemplater.DEFAULT_OPTIONS
     * @memberof UrlTemplate
     */
    function UrlTemplater(url, options) {
        classCallCheck(this, UrlTemplater);

        if (Util.isString(url)) {
            this.options = Object.assign({}, UrlTemplater.DEFAULT_OPTIONS, options);
            // set default UrlParser
            this.UrlParser = this.options.UrlParser || Url;
            this.template = url;
            this.templateObj = this.UrlParser.parse(url);
        } else {
            throw new Error('parameter url must be a string!');
        }
    }

    /**
     * resolve url parameters and query parameters, and return a url result string
     * 
     * @param {Object} {
     *         params = {}  url parameters
     *         query = {}   query parameters
     *     } 
     * @returns {String}
     * @memberof UrlTemplate
     */


    createClass(UrlTemplater, [{
        key: 'resolve',
        value: function resolve(_ref) {
            var _ref$params = _ref.params,
                params = _ref$params === undefined ? {} : _ref$params,
                _ref$query = _ref.query,
                query = _ref$query === undefined ? {} : _ref$query;

            return this.getParamsPart(params) + this.getQueryPart(query);
        }

        /**
         * resolve query parameters
         * 
         * @param {Object} queryObj 
         * @returns {String}
         * @memberof UrlTemplate
         */

    }, {
        key: 'getQueryPart',
        value: function getQueryPart(queryObj) {

            /**
             * add a new elem into an array
             * 
             * @param {Array} array 
             * @param {*} elem 
             */
            var addArrayElem = function addArrayElem(array, elem) {
                if (!Util.isArray(array)) {
                    throw new Error('parameter array must be an Array Object');
                }
                if (Util.isArray(elem)) {
                    array = array.concat(elem);
                } else {
                    array.push(elem);
                }
                return array;
            };

            /**
             * transform all key-value entity to an array, and the array's value is string look like key=value
             * 
             * @param {String} key 
             * @param {String|Number|Array|Object|Function} value 
             * @returns {String|Array}
             */
            var transformToEntity = function transformToEntity(key, value) {
                if (Util.isArray(value)) {

                    // value is an array, combine keys with []
                    var entityList = [];
                    for (var i = 0; i < value.length; i++) {
                        entityList = addArrayElem(entityList, transformToEntity('' + key + transformRule.arrCombineStart + i + transformRule.arrCombineEnd, value[i]));
                    }
                    return entityList;
                } else if (Util.isObject(value)) {

                    // value is a object, combine keys with '.'
                    var _entityList = [];
                    for (var nextKey in value) {
                        _entityList = addArrayElem(_entityList, transformToEntity('' + key + transformRule.objCombine + nextKey, value[nextKey]));
                    }
                    return _entityList;
                } else if (Util.isFunction(value)) {

                    // value is a function, use value's return result as key's value
                    return transformToEntity(key, value());
                } else {

                    // value is other type, use value's toString function's return result as key's value
                    value = encodeURI(value.toString());
                    return key + '=' + value;
                }
            };

            var transformRule = {
                objCombine: this.options.objCombine,
                arrCombineStart: this.options.arrCombineStart,
                arrCombineEnd: this.options.arrCombineEnd
            },
                queryStart = this.template.endsWith('?') ? '' : '?',
                queryList = [],
                andSymbol = '&';

            for (var key in queryObj) {
                var value = queryObj[key];
                var transformResult = transformToEntity(key, value);
                queryList = addArrayElem(queryList, transformResult);
            }

            var queryResult = queryList.join(andSymbol);
            return queryResult.length > 0 ? queryStart + queryResult : queryResult;
        }

        /**
         * resolve url parameters
         * 
         * @param {Object} paramsObj 
         * @returns {String}
         * @memberof UrlTemplate
         */

    }, {
        key: 'getParamsPart',
        value: function getParamsPart(paramsObj) {

            var paramsRule = this.options.paramsRule;
            var urlObj = Object.assign({}, this.templateObj);

            // replace url parameters in path string, the no-value parameter will be replace with empty string
            urlObj.path = urlObj.path.replace(paramsRule, function (substring, key) {
                if (Util.isFunction(paramsObj[key])) {
                    return paramsObj[key]() || '';
                }
                return paramsObj[key] || '';
            });

            return this.UrlParser.format(urlObj);
        }
    }]);
    return UrlTemplater;
}();

UrlTemplater.DEFAULT_OPTIONS = {
    objCombine: '.',
    arrCombineStart: '[',
    arrCombineEnd: ']',
    paramsRule: /:(\w+)/g,
    UrlParser: null
};

UrlTemplater.version = '1.0.0';

var index = {
    UrlTemplater: UrlTemplater,
    Url: Url
};

return index;

})));
