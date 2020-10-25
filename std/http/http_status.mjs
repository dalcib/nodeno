export var Status;
(function(Status2) {
  Status2[Status2["Continue"] = 100] = "Continue";
  Status2[Status2["SwitchingProtocols"] = 101] = "SwitchingProtocols";
  Status2[Status2["Processing"] = 102] = "Processing";
  Status2[Status2["EarlyHints"] = 103] = "EarlyHints";
  Status2[Status2["OK"] = 200] = "OK";
  Status2[Status2["Created"] = 201] = "Created";
  Status2[Status2["Accepted"] = 202] = "Accepted";
  Status2[Status2["NonAuthoritativeInfo"] = 203] = "NonAuthoritativeInfo";
  Status2[Status2["NoContent"] = 204] = "NoContent";
  Status2[Status2["ResetContent"] = 205] = "ResetContent";
  Status2[Status2["PartialContent"] = 206] = "PartialContent";
  Status2[Status2["MultiStatus"] = 207] = "MultiStatus";
  Status2[Status2["AlreadyReported"] = 208] = "AlreadyReported";
  Status2[Status2["IMUsed"] = 226] = "IMUsed";
  Status2[Status2["MultipleChoices"] = 300] = "MultipleChoices";
  Status2[Status2["MovedPermanently"] = 301] = "MovedPermanently";
  Status2[Status2["Found"] = 302] = "Found";
  Status2[Status2["SeeOther"] = 303] = "SeeOther";
  Status2[Status2["NotModified"] = 304] = "NotModified";
  Status2[Status2["UseProxy"] = 305] = "UseProxy";
  Status2[Status2["TemporaryRedirect"] = 307] = "TemporaryRedirect";
  Status2[Status2["PermanentRedirect"] = 308] = "PermanentRedirect";
  Status2[Status2["BadRequest"] = 400] = "BadRequest";
  Status2[Status2["Unauthorized"] = 401] = "Unauthorized";
  Status2[Status2["PaymentRequired"] = 402] = "PaymentRequired";
  Status2[Status2["Forbidden"] = 403] = "Forbidden";
  Status2[Status2["NotFound"] = 404] = "NotFound";
  Status2[Status2["MethodNotAllowed"] = 405] = "MethodNotAllowed";
  Status2[Status2["NotAcceptable"] = 406] = "NotAcceptable";
  Status2[Status2["ProxyAuthRequired"] = 407] = "ProxyAuthRequired";
  Status2[Status2["RequestTimeout"] = 408] = "RequestTimeout";
  Status2[Status2["Conflict"] = 409] = "Conflict";
  Status2[Status2["Gone"] = 410] = "Gone";
  Status2[Status2["LengthRequired"] = 411] = "LengthRequired";
  Status2[Status2["PreconditionFailed"] = 412] = "PreconditionFailed";
  Status2[Status2["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
  Status2[Status2["RequestURITooLong"] = 414] = "RequestURITooLong";
  Status2[Status2["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
  Status2[Status2["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
  Status2[Status2["ExpectationFailed"] = 417] = "ExpectationFailed";
  Status2[Status2["Teapot"] = 418] = "Teapot";
  Status2[Status2["MisdirectedRequest"] = 421] = "MisdirectedRequest";
  Status2[Status2["UnprocessableEntity"] = 422] = "UnprocessableEntity";
  Status2[Status2["Locked"] = 423] = "Locked";
  Status2[Status2["FailedDependency"] = 424] = "FailedDependency";
  Status2[Status2["TooEarly"] = 425] = "TooEarly";
  Status2[Status2["UpgradeRequired"] = 426] = "UpgradeRequired";
  Status2[Status2["PreconditionRequired"] = 428] = "PreconditionRequired";
  Status2[Status2["TooManyRequests"] = 429] = "TooManyRequests";
  Status2[Status2["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
  Status2[Status2["UnavailableForLegalReasons"] = 451] = "UnavailableForLegalReasons";
  Status2[Status2["InternalServerError"] = 500] = "InternalServerError";
  Status2[Status2["NotImplemented"] = 501] = "NotImplemented";
  Status2[Status2["BadGateway"] = 502] = "BadGateway";
  Status2[Status2["ServiceUnavailable"] = 503] = "ServiceUnavailable";
  Status2[Status2["GatewayTimeout"] = 504] = "GatewayTimeout";
  Status2[Status2["HTTPVersionNotSupported"] = 505] = "HTTPVersionNotSupported";
  Status2[Status2["VariantAlsoNegotiates"] = 506] = "VariantAlsoNegotiates";
  Status2[Status2["InsufficientStorage"] = 507] = "InsufficientStorage";
  Status2[Status2["LoopDetected"] = 508] = "LoopDetected";
  Status2[Status2["NotExtended"] = 510] = "NotExtended";
  Status2[Status2["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
})(Status || (Status = {}));
export const STATUS_TEXT = new Map([
  [100, "Continue"],
  [101, "Switching Protocols"],
  [102, "Processing"],
  [103, "Early Hints"],
  [200, "OK"],
  [201, "Created"],
  [202, "Accepted"],
  [203, "Non-Authoritative Information"],
  [204, "No Content"],
  [205, "Reset Content"],
  [206, "Partial Content"],
  [207, "Multi-Status"],
  [208, "Already Reported"],
  [226, "IM Used"],
  [300, "Multiple Choices"],
  [301, "Moved Permanently"],
  [302, "Found"],
  [303, "See Other"],
  [304, "Not Modified"],
  [305, "Use Proxy"],
  [307, "Temporary Redirect"],
  [308, "Permanent Redirect"],
  [400, "Bad Request"],
  [401, "Unauthorized"],
  [402, "Payment Required"],
  [403, "Forbidden"],
  [404, "Not Found"],
  [405, "Method Not Allowed"],
  [406, "Not Acceptable"],
  [407, "Proxy Authentication Required"],
  [408, "Request Timeout"],
  [409, "Conflict"],
  [410, "Gone"],
  [411, "Length Required"],
  [412, "Precondition Failed"],
  [413, "Request Entity Too Large"],
  [414, "Request URI Too Long"],
  [415, "Unsupported Media Type"],
  [416, "Requested Range Not Satisfiable"],
  [417, "Expectation Failed"],
  [418, "I'm a teapot"],
  [421, "Misdirected Request"],
  [422, "Unprocessable Entity"],
  [423, "Locked"],
  [424, "Failed Dependency"],
  [425, "Too Early"],
  [426, "Upgrade Required"],
  [428, "Precondition Required"],
  [429, "Too Many Requests"],
  [431, "Request Header Fields Too Large"],
  [451, "Unavailable For Legal Reasons"],
  [500, "Internal Server Error"],
  [501, "Not Implemented"],
  [502, "Bad Gateway"],
  [503, "Service Unavailable"],
  [504, "Gateway Timeout"],
  [505, "HTTP Version Not Supported"],
  [506, "Variant Also Negotiates"],
  [507, "Insufficient Storage"],
  [508, "Loop Detected"],
  [510, "Not Extended"],
  [511, "Network Authentication Required"]
]);
