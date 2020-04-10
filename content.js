

const getElementByXpath = function(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

const updateHeader = function() {
    let headerRow = getElementByXpath('//div[@class="awsui-table-container"]/table/thead/tr')
    if (headerRow && headerRow.childElementCount == 6) {
        let logHeader = document.createElement("span");
        logHeader.textContent = "Log"
        let th = document.createElement("th")
        th.appendChild(logHeader)
        headerRow.appendChild(th)
    }
}
const displayLog = function() {
    updateHeader()
    let rows = document.getElementsByClassName("awsui-table-row");
    let region = document.location.search.replace("?region=", "")
    for (row of rows) {
        if (!row.getElementsByTagName('a')[0] || row.childElementCount != 6) {
            continue
        }
        let name = row.getElementsByTagName('a')[0].text;
        let logLink = document.createElement("a");
        
        logLink.href = `https://console.aws.amazon.com/cloudwatch/home?region=${region}#logStream:group=/aws/lambda/${name};streamFilter=typeLogStreamPrefix`;
        logLink.text = "log"
        newTd = document.createElement("td")
        newTd.appendChild(logLink)

        row.appendChild(newTd)
    }
}



const start = function() {
    setInterval(() => {
        displayLog()
    }, 1000)
     
}
start();