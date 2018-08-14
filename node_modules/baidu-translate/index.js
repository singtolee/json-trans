const request = require('request');
const crypto = require('crypto');
const querystring = require('querystring');

function baiduTranslate(appid,secret,to="en",from="auto") {

    function signature(query) {
        let string = appid + query + "salt" + secret;
        const md5 = crypto.createHash('md5');
        md5.update(string);
        return md5.digest('hex');
    }

    function translate(q) {
        return new Promise((resolve, reject) => {
            var postData = {
                q,
                from: from,
                to: to
            };
            let form = postData || {};
            let sign = signature(form.q);
            form.appid = appid;
            form.salt = "salt";
            form.sign = sign;
            request.post({
                url: "http://api.fanyi.baidu.com/api/trans/vip/translate",
                form: querystring.stringify(form)
            }, function(err, httpResponse, body) {
                if (err) {
                    return console.error(err);
                };
                body = JSON.parse(body);
                // resolve(body.trans_result[0].dst);
                resolve(body);
            });
        })
    }
    return translate
}

module.exports = baiduTranslate;
