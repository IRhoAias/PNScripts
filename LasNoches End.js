let uiContainer = document.createElement('div');
uiContainer.style.position = 'fixed';
uiContainer.style.top = '50%';
uiContainer.style.right = '10px';
uiContainer.style.transform = 'translateY(-50%)';
uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
uiContainer.style.color = 'white';
uiContainer.style.padding = '10px';
uiContainer.style.borderRadius = '5px';
uiContainer.style.zIndex = '9999';
uiContainer.style.display = 'flex';
uiContainer.style.flexDirection = 'column';
uiContainer.style.alignItems = 'center';

const floorContainer = document.createElement('div');
floorContainer.innerHTML = `Floor: <span id="floor">-</span>`;

const xpContainer = document.createElement('div');
xpContainer.innerHTML = `XP: <span id="xp">-</span>`;

const buttonContainer = document.createElement('div');
buttonContainer.style.marginTop = '10px';
buttonContainer.style.display = 'flex';
buttonContainer.style.flexDirection = 'column';

const startButton = document.createElement('button');
startButton.innerText = 'Start';
startButton.style.backgroundColor = 'green';
startButton.style.color = 'white';
startButton.style.padding = '10px';
startButton.style.border = 'none';
startButton.style.borderRadius = '5px';
startButton.style.cursor = 'pointer';
buttonContainer.appendChild(startButton);

const stopButton = document.createElement('button');
stopButton.innerText = 'Stop';
stopButton.style.backgroundColor = 'red';
stopButton.style.color = 'white';
stopButton.style.padding = '10px';
stopButton.style.border = 'none';
stopButton.style.borderRadius = '5px';
stopButton.style.cursor = 'pointer';
stopButton.style.marginTop = '10px';
buttonContainer.appendChild(stopButton);

const statusMessage = document.createElement('div');
statusMessage.style.marginTop = '10px';
statusMessage.style.color = 'white';
statusMessage.style.fontSize = '14px';

uiContainer.appendChild(floorContainer);
uiContainer.appendChild(xpContainer);
uiContainer.appendChild(buttonContainer);
uiContainer.appendChild(statusMessage);
document.body.appendChild(uiContainer);

let running = false;

function getFloorNumber() {
    let floorElement = Array.from(document.querySelectorAll("pre"))
        .find(pre => pre.innerText.includes("Current Floor"));
    return floorElement ? floorElement.innerText.replace("Current Floor ", "").trim() : "-";
}

function getStoredXP() {
    let xpElement = Array.from(document.querySelectorAll("div[style*='top: 51px; left: 95px;'] pre"))
        .find(pre => !isNaN(parseInt(pre.innerText.trim())));
    return xpElement ? xpElement.innerText.trim() : "-";
}

async function startLoop() {
    running = true;
    statusMessage.innerText = 'Script is running...';

    while (running) {
        try {
            document.getElementById('floor').innerText = getFloorNumber();
            document.getElementById('xp').innerText = getStoredXP();

            let continueButton = Array.from(document.querySelectorAll('button'))
                .find(button => button.innerText.includes('Continue') && button.offsetParent !== null);

            if (continueButton) {
                continueButton.click();
            }

            while (true) {
                let closeButton = Array.from(document.querySelectorAll('button'))
                    .find(button => button.innerText.includes('Close'));
                if (closeButton) {
                    closeButton.click();
                    break;
                }
                await new Promise(r => setTimeout(r, 2000));
            }

            await new Promise(r => setTimeout(r, 1000));

        } catch (error) {
            console.error('Script error:', error);
            await new Promise(r => setTimeout(r, 5000));
        }
    }
}

async function stopLoop() {
    running = false;
    console.log('Stopped');
    statusMessage.innerText = 'The script has been stopped.';
}

startButton.addEventListener('click', () => {
    running = true;
    startLoop();
});

stopButton.addEventListener('click', stopLoop);
