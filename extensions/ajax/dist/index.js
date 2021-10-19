'use strict';

class Ajax {
  constructor(installGlobally = false) {
    this.extensionName = 'ajax';
    this.version = 0.01;

    if (installGlobally) {
      this.extendHelperPrototype = this.extendHelper;
    } else {
      this.extendHelperInstance = this.extendHelper;
    }
  }

  extendHelper(helper) {
    helper["AJAX"] = function ({
      url = '',
      requestMethod = 'POST',
      withCredentials = false,
      dataToSend = null,
      async = true,
      enableJson = {
        onResponse: false,
        onSend: false,
        onError: false
      },
      requestContent = 'text',
      timeoutError = 10000
    }, actions = {
      onSuccess: callback => {},
      onError: callback => {},
      onOtherStatus: callback => {}
    }) {
      const xhr = new XMLHttpRequest();
      let errorThrown = false;
      let fd = null;
      let dataOutgoing = null;
      let timeout = null;

      if (timeoutError) {
        timeout = setTimeout(() => {
          ajaxHelperObj.xhrStatusCode = 408;
          ajaxHelperObj.errorType = 'TIMEOUT';
          ajaxHelperObj.errorDetails += `Response time exceeded ${timeoutError}ms` + '\n';
          actions.onError(ajaxHelperObj);
          errorThrown = true;
        }, timeoutError);
      }

      const ajaxHelperObj = {
        xhrStatusCode: null,
        xhrResponseText: null,
        errorType: null,
        errorDetails: '',
        response: null
      };

      const handleJson = (value, parse) => {
        try {
          return parse ? JSON.parse(value) : JSON.stringify(value);
        } catch (e) {
          ajaxHelperObj.errorType = 'JSON';
          ajaxHelperObj.errorDetails += `${e}\n`;
        }

        actions.onError(ajaxHelperObj);
        errorThrown = true;
        return null;
      };

      const handleResponse = enableJsonOption => {
        ajaxHelperObj.response = enableJsonOption ? handleJson(ajaxHelperObj.xhrResponseText, true) : ajaxHelperObj.xhrResponseText;
      };

      xhr.open(requestMethod, url, async);

      if (requestMethod === 'POST') {
        requestContent = enableJson.onSend ? 'json' : requestContent;

        switch (requestContent) {
          case 'json':
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            dataOutgoing = handleJson(dataToSend, false);
            break;

          case 'form':
            fd = new FormData();

            for (const name in dataToSend) {
              fd.append(name, dataToSend[name]);
            }

            xhr.setRequestHeader('Content-Type', 'multipart/form-data');
            break;

          case 'form-dom-el':
            fd = new FormData(dataToSend);
            xhr.setRequestHeader('Content-Type', 'multipart/form-data');
            break;

          case 'form-urlencoded':
            enableJson.onSend = false;
            const formData = [];

            for (const property in dataToSend) {
              const encodedKey = encodeURIComponent(property);
              const encodedValue = encodeURIComponent(dataToSend[property]);
              formData.push(`${encodedKey}=${encodedValue}`);
            }

            dataOutgoing = formData.join('&');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
            break;

          default:
            xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
            dataOutgoing = dataToSend;
            break;
        }
      }

      xhr.withCredentials = withCredentials;

      xhr.onload = () => {
        ajaxHelperObj.xhrResponseText = xhr.responseText;
        ajaxHelperObj.xhrStatusCode = xhr.status;
        clearTimeout(timeout);

        if (xhr.status >= 200 && xhr.status < 300) {
          handleResponse(enableJson.onResponse);
          actions.onSuccess(ajaxHelperObj);
        } else if (xhr.status >= 400 && xhr.status < 600) {
          handleResponse(enableJson.onError);
          if (!errorThrown) actions.onError(ajaxHelperObj);
        } else {
          actions.onOtherStatus(ajaxHelperObj);
        }
      };

      if (!fd) {
        xhr.send(dataOutgoing);
      } else {
        xhr.send(fd);
      }
    };

    helper["getJSONObject"] = function (url = '', actions, parameters = {
      url: "",
      dataToSend: null,
      withCredentials: false,
      requestMethod: 'GET',
      enableJson: {
        onResponse: true,
        onSend: false,
        onError: true
      }
    }) {
      parameters.url = url;
      this.AJAX(parameters, actions);
    };

    helper["postJSONObject"] = function (url = "", data = {}, actions, parameters = {
      url: "",
      dataToSend: {},
      withCredentials: false,
      requestMethod: 'POST',
      enableJson: {
        onResponse: true,
        onSend: true,
        onError: true
      },
      requestContent: 'json'
    }) {
      parameters.url = url;
      parameters.dataToSend = data;
      this.AJAX(parameters, actions);
    };
  }

}

const ajax = new Ajax();

module.exports = ajax;
