'use strict';

var jsvanillahelperCore = require('jsvanillahelper-core');

class HelperScope {
  constructor(globalBindAlias) {
    this.extensionName = 'helperScope';
    this.version = 1.31;
    this.scopes = new Map();
    this["_"] = this.getSelector;
    this["$cope"] = this.selectScope;
    this.globalBindAlias = globalBindAlias;
    this.flags = {
      extAdded: false
    };
  }

  onAddExtension() {
    if (!this.flags["extAdded"]) {
      this.scopes["default"] = {
        alias: "default",
        helperInstance: this.helper,
        binds: {},
        isBinded: true
      };
      this.scopeTarget = this.scopes["default"];
      this.handleHelperScopeGlobalBind();
      this.flags["extAdded"] = true;
    }
  }

  handleHelperScopeGlobalBind() {
    if (this.globalBindAlias) {
      window[this.globalBindAlias] = this;
    }
  }

  handleExtensionParameters() {
    Object.keys(this.scopes).forEach(scopeAlias => this.handleScope(this.scopes[scopeAlias]));
  }

  declare(newScope, globalBindAlias) {
    this.globalBindAlias = globalBindAlias;
    const hsInstance = this.handleGlobalHelperScopeInstance(globalBindAlias);
    const newBindsObj = newScope.binds.reduce((bindsObj, current) => {
      bindsObj[current] = current;
      return bindsObj;
    }, {});
    hsInstance.scopes[newScope.alias] = {
      alias: newScope.alias,
      helperInstance: newScope.helperInstance,
      binds: newBindsObj,
      isBinded: false
    };
    hsInstance.handleExtensionParameters();
    return hsInstance;
  }

  handleGlobalHelperScopeInstance(globalBindAlias) {
    if (globalBindAlias && window[globalBindAlias] instanceof HelperScope) {
      console.log(`Found & using a global HelperScope ${window[globalBindAlias].version} instance`);
      return window[globalBindAlias];
    }

    return this;
  }

  getHelperInstance(scopeAlias) {
    return this.scopes[scopeAlias].helperInstance;
  }

  getSelector(selectorMethod) {
    return this.scopeTarget.binds[selectorMethod];
  }

  selectScope(scopeAlias) {
    this.scopeTarget = this.scopes[scopeAlias];
    return this;
  }

  handleScope(scope) {
    if (scope.isBinded) return;

    if (!scope.helperInstance) {
      scope.helperInstance = new jsvanillahelperCore.JSVanillaHelper();
    }

    if (scope.alias === "global" || scope.alias === "window") {
      this.handleGlobalScopeBinds(scope);
    } else {
      this.handleScopeBinds(scope);
    }
  }

  handleGlobalScopeBinds(scope) {
    const existingInstance = window["V"] || window["V$"] || window["V$I"] || window["V$C"];

    if (existingInstance) {
      const version = existingInstance().version || existingInstance().versionNumber;
      console.error("GlobalScope: Two instances of JSVanillaHelper cannot exist in a global scope");
      console.error(`Found JSVanillaHelper (Core) ${version}`);
      return;
    }

    Object.keys(scope.binds).forEach(bindKey => {
      const hS = this.getHelperSelector(scope.binds[bindKey], scope.helperInstance);
      window[bindKey] = hS;
      scope.binds[bindKey] = hS;
    });
    scope.isBinded = true;
  }

  handleScopeBinds(scope) {
    Object.keys(scope.binds).forEach(bindKey => {
      scope.binds[bindKey] = this.getHelperSelector(scope.binds[bindKey], scope.helperInstance);
    });
    scope.isBinded = true;
  }

  getHelperSelector(selectorMethod, helperInstance) {
    const _this = this;

    return (() => {
      switch (selectorMethod) {
        case "V":
          return function (t = null) {
            return this.setTarget(t);
          };

        case "V$":
          return function (query) {
            return this.setTarget(document.querySelectorAll(query));
          };

        case "V$C":
          return function (className) {
            return this.setTarget(document.getElementsByClassName(className));
          };

        case "V$I":
          return function (id = null) {
            return this.setTarget(document.getElementById(id));
          };

        case "_V":
          return function (t = null) {
            return new jsvanillahelperCore.JSVanillaHelper(t);
          };

        case "_V$":
          return function (query = null) {
            return new jsvanillahelperCore.JSVanillaHelper(document.querySelectorAll(query));
          };

        default:
          console.error(`Selector method: "${selectorMethod}" is not recognized & supported in HelperScope ${_this.version}`);
          break;
      }
    })().bind(helperInstance);
  }

}

const helperScope = new HelperScope();

module.exports = helperScope;
