(function(modules){
  const installedModules = {};
  function require(id){
    if (installedModules[id]) {
      return installedModules[id].exports;
  }
    const [fn, mapping] = modules[id]
    const module = installedModules[id] = {exports: {}}
    function localRequire(filePath) {
      const id = mapping[filePath]
      return require(id)
    }
    fn(localRequire, module, module.exports)

    return module.exports
  }
  require(0)
})({
  
    0 :[function (require,module,exports){
      "use strict";

var _foo = require("./foo.js");

(0, _foo.foo)();
console.log('main.js');
     },{"./foo.js":1}],
  
    1 :[function (require,module,exports){
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _user = require("./user.json");

var _user2 = _interopRequireDefault(_user);

var _bar = require("../bar.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function foo() {
  console.log(_user2.default);
  console.log(_bar.count);
  console.log('foo');
}
     },{"./user.json":2,"../bar.js":3}],
  
    2 :[function (require,module,exports){
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "{\n  \"name\": \"张三\",\n  \"age\":18\n}";
     },{}],
  
    3 :[function (require,module,exports){
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var count = exports.count = 1;
     },{}],
  
})