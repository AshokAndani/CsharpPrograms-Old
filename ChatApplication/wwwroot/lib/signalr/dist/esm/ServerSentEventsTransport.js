// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
import * as tslib_1 from "tslib";
import { LogLevel } from "./ILogger";
import { TransferFormat } from "./ITransport";
import { Arg, getDataDetail, sendMessage } from "./Utils";
var ServerSentEventsTransport = /** @class */ (function () {
    function ServerSentEventsTransport(httpClient, accessTokenFactory, logger, logMessageContent) {
        this.httpClient = httpClient;
        this.accessTokenFactory = accessTokenFactory || (function () { return null; });
        this.logger = logger;
        this.logMessageContent = logMessageContent;
    }
    ServerSentEventsTransport.prototype.connect = function (url, transferFormat) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var token;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Arg.isRequired(url, "url");
                        Arg.isRequired(transferFormat, "transferFormat");
                        Arg.isIn(transferFormat, TransferFormat, "transferFormat");
                        if (typeof (EventSource) === "undefined") {
                            throw new Error("'EventSource' is not supported in your environment.");
                        }
                        this.logger.log(LogLevel.Trace, "(SSE transport) Connecting");
                        return [4 /*yield*/, this.accessTokenFactory()];
                    case 1:
                        token = _a.sent();
                        if (token) {
                            url += (url.indexOf("?") < 0 ? "?" : "&") + ("access_token=" + encodeURIComponent(token));
                        }
                        this.url = url;
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var opened = false;
                                if (transferFormat !== TransferFormat.Text) {
                                    reject(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
                                }
                                var eventSource = new EventSource(url, { withCredentials: true });
                                try {
                                    eventSource.onmessage = function (e) {
                                        if (_this.onreceive) {
                                            try {
                                                _this.logger.log(LogLevel.Trace, "(SSE transport) data received. " + getDataDetail(e.data, _this.logMessageContent) + ".");
                                                _this.onreceive(e.data);
                                            }
                                            catch (error) {
                                                if (_this.onclose) {
                                                    _this.onclose(error);
                                                }
                                                return;
                                            }
                                        }
                                    };
                                    eventSource.onerror = function (e) {
                                        var error = new Error(e.message || "Error occurred");
                                        if (opened) {
                                            _this.close(error);
                                        }
                                        else {
                                            reject(error);
                                        }
                                    };
                                    eventSource.onopen = function () {
                                        _this.logger.log(LogLevel.Information, "SSE connected to " + _this.url);
                                        _this.eventSource = eventSource;
                                        opened = true;
                                        resolve();
                                    };
                                }
                                catch (e) {
                                    return Promise.reject(e);
                                }
                            })];
                }
            });
        });
    };
    ServerSentEventsTransport.prototype.send = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (!this.eventSource) {
                    return [2 /*return*/, Promise.reject(new Error("Cannot send until the transport is connected"))];
                }
                return [2 /*return*/, sendMessage(this.logger, "SSE", this.httpClient, this.url, this.accessTokenFactory, data, this.logMessageContent)];
            });
        });
    };
    ServerSentEventsTransport.prototype.stop = function () {
        this.close();
        return Promise.resolve();
    };
    ServerSentEventsTransport.prototype.close = function (e) {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
            if (this.onclose) {
                this.onclose(e);
            }
        }
    };
    return ServerSentEventsTransport;
}());
export { ServerSentEventsTransport };
//# sourceMappingURL=ServerSentEventsTransport.js.map