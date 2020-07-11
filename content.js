

const getElementByXpath = function(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function waitForElement(xpath, time, callback) {
	if(getElementByXpath(xpath)!=null) {
		callback()
		return;
	} else {
		setTimeout(function() {
			waitForElement(xpath, time, callback);
		}, time);
	}
}

const updateLogHeader = function() {
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
    updateLogHeader()
	console.log('display log called');
    let rows = document.getElementsByClassName("awsui-table-row");
    let region = document.location.search.replace("?region=", "")
    for (row of rows) {
        if (!row.getElementsByTagName('a')[0]) {
            continue;
        }
		const elementCount =  row.childElementCount;
		if (elementCount != 6 && elementCount != 7) {
			continue;
		}

		
        let name = row.getElementsByTagName('a')[0].text;
		const logUrl =  `https://console.aws.amazon.com/cloudwatch/home?region=${region}#logStream:group=/aws/lambda/${name};streamFilter=typeLogStreamPrefix`;

		if (elementCount == 6) {
			let logLink = document.createElement("a");
			logLink.href = logUrl
			logLink.text = "log"
			newTd = document.createElement("td")
			newTd.appendChild(logLink)

			row.appendChild(newTd)
		} else {
			row.children[6].children[0].href = logUrl;
		}

    }
}



const startLogDisplay = function() {
	const tableBody = getElementByXpath('//div[@class="awsui-table-container"]/table/tbody');
	const config = { childList: true, subtree: true };

	const callback = function(mutationList, observer) {
		displayLog();
	}
	const observer = new MutationObserver(callback);
	observer.observe(tableBody, config);
}

const copyToClipboard = str => {
	  const el = document.createElement('textarea');
	  el.value = str;
	  document.body.appendChild(el);
	  el.select();
	  document.execCommand('copy');
	  document.body.removeChild(el);
};

const copyEnv = function() {
	const envTableBody = getElementByXpath('//div[@id="envVarsSection"]/div[@class="container-content"]//table/tbody');
	
	let copyText = '';
	for (const tr of envTableBody.children) {
		const envName=tr.children[0].children[0].innerText;
		const envValue=tr.children[1].children[0].innerText;
		copyText += `export ${envName}="${envValue}"\n`;
	}
	copyToClipboard(copyText);
	alert('copied to clipboard');
}

const displayEnvCopy = function() {
	console.log('start env copy');
	buttonParent = getElementByXpath('//div[@id="envVarsSection"]/div/div/div[@class="awsui-util-action-stripe-group"]');
	const newBtn = buttonParent.children[0].cloneNode(true);
	newBtn.children[0].children[0].innerText = "Copy";
	newBtn.children[0].removeAttribute('type');
	newBtn.children[0].addEventListener("click", copyEnv)
	buttonParent.appendChild(newBtn);
}

const startEnvVarCopyDisplay = function() {
	waitForElement('//div[@id="envVarsSection"]', 1000, displayEnvCopy);
}

const start = function() {
	const listFunctions = document.getElementById('lambda-listFunctions');
	const lambdaDesignPage = document.getElementById('lambda-functionDesigner');
	
	if (listFunctions) {
		startLogDisplay();
	}
	
	if (lambdaDesignPage) {
		console.log('In lambda design page');
		startEnvVarCopyDisplay();
	}
}
start();
