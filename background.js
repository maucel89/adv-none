//https://sunnyzhou-1024.github.io/chrome-extension-docs/extensions/declarativeNetRequest.html
//https://stackoverflow.com/questions/63789613/declarativenetrequest-update-rules
//https://pgl.yoyo.org/adservers/serverlist.php?hostformat=nohtml
//https://raw.githubusercontent.com/adblockplus/adblockpluscore/master/test/data/patterns.ini

try {
  console.log("ACTIVATE ADV NONE EXTENSION");

  fetch(
    "https://pgl.yoyo.org/as/serverlist.php?hostformat=adblockplus;showintro=0;mimetype=plaintext"
  )
    .then((r) => r.text())
    .then((text) => {
      const blockUrls = text.split("\n").filter(
        (s) =>
          s !== "" &&
          !s.startsWith("!") &&
          !s.startsWith("[") &&
          // NEW RELIC
          s !== "||js-agent.newrelic.com^" &&
          s !== "||nr-data.net^"
      );

      //var blockUrls = ["||googlesyndication.com^"];
      //console.log(blockUrls);

      blockUrls.forEach((domain, index) => {
        let id = index + 1;
        //console.log(domain);

        chrome.declarativeNetRequest.updateDynamicRules({
          addRules: [
            {
              id: id,
              priority: 1,
              action: { type: "block" },
              condition: {
                urlFilter: domain,
                resourceTypes: [
                  "main_frame",
                  "object",
                  "xmlhttprequest",
                  "sub_frame",
                  "script",
                ],
              },
            },
          ],
          removeRuleIds: [id],
        });
      });
    });

  /*  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(function (o) {
    console.log("rule matched:", o);
    chrome.declarativeNetRequest.getDynamicRules(
        callback?: function,
      )
  });*/
} catch (e) {
  console.error(e);
}
