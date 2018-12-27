(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var test_BestMatch_1 = require("./test_BestMatch");
function AjaxPOSTAsync(url, object) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("Content-Type", "text/html;charset=UTF-8");
        xhr.onload = function (e) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                resolve(xhr.response);
            }
        };
        xhr.onerror = function () { return reject(xhr.statusText); };
        if (object) {
            xhr.send(JSON.stringify(object));
        }
        else {
            xhr.send();
        }
    });
}
AjaxPOSTAsync("https://www.thomann.de/gb/search.html?gf=electric_guitars&bf=harley_benton&pg=1&ls=100&oa=pra", null).then(function (data) {
    var htmlObject = document.createElement("div");
    htmlObject.innerHTML = data.toString();
    var asd1 = document.querySelector(".rs-pagination");
    var asd2 = asd1 ? asd1.querySelector(".page.active") : null;
    var page = asd2 ? Number(asd2.textContent) : null;
    console.log(page);
    var tt = htmlObject.querySelector("div.rs-search-dir.rs-search-list");
    var body = document.querySelector("body");
    if (tt && body) {
        body.innerHTML = "";
        body.appendChild(tt);
    }
    test_BestMatch_1.BestMatch();
}).catch(function (error) {
    console.error(error);
});
test_BestMatch_1.BestMatch();
console.log("qwe");

},{"./test_BestMatch":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BestMatch = function (elMain) {
    if (elMain === void 0) { elMain = window.document; }
    var tmpCount = [];
    var tmpEL = [];
    elMain.querySelectorAll(".rs-search-dir.rs-search-list .rs-rating-stars > span.count").forEach(function (el) {
        var count = Number(el.textContent);
        if (count > 0) {
            tmpCount.push(count);
            tmpEL.push(el);
        }
        else {
            var elTmp = el.closest("div.extensible-article.list-view.compare.parent");
            if (elTmp) {
                elTmp.remove();
            }
        }
        tmpCount.sort(function (a, b) {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });
        tmpEL.sort(function (a, b) {
            if ((a && a.textContent) && (b && b.textContent)) {
                if (a.textContent < b.textContent) {
                    return -1;
                }
                if (a.textContent > b.textContent) {
                    return 1;
                }
                return 0;
            }
            else {
                throw "error 01";
            }
        });
    });
    var getAverage = function (arr) { return arr.reduce(function (accumulator, currentValue) { return accumulator + currentValue; }, 0) / arr.length; };
    var getAverageResult = Math.round(getAverage(tmpCount));
    console.log(getAverageResult);
    tmpEL.forEach(function (el) {
        if (Number(el.textContent) < getAverageResult) {
            var elTmp = el.closest("div.extensible-article.list-view.compare.parent");
            if (elTmp)
                elTmp.remove();
        }
    });
    console.log(tmpCount);
    console.log(tmpEL);
    console.log(tmpEL.length);
    console.log("tmpEL.length");
};

},{}]},{},[1]);
