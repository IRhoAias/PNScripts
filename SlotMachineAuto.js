let counter = 0;
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
uiContainer.style.alignItems = 'center'; // Centrado de los elementos

const counterContainer = document.createElement('div');
counterContainer.style.display = 'flex';
counterContainer.style.alignItems = 'center';
counterContainer.innerHTML = `Loop: <span id="counter">0</span>`;

const buttonContainer = document.createElement('div');
buttonContainer.style.marginTop = '10px';
buttonContainer.style.display = 'flex';
buttonContainer.style.flexDirection = 'column'; // Botones en columna

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
stopButton.style.marginTop = '10px'; // Espacio entre los botones
buttonContainer.appendChild(stopButton);

const statusMessage = document.createElement('div');
statusMessage.style.marginTop = '10px';
statusMessage.style.color = 'white';
statusMessage.style.fontSize = '14px';

uiContainer.appendChild(counterContainer);
uiContainer.appendChild(buttonContainer);
uiContainer.appendChild(statusMessage);
document.body.appendChild(uiContainer);

let running = false;

function clickEnCoordenadas(x, y) {
    const eventOptions = {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        screenX: x,
        screenY: y,
        button: 0
    };

    ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(eventType => {
        const event = new MouseEvent(eventType, eventOptions);
        document.dispatchEvent(event);
    });
}

async function startLoop() {
    running = true;
    document.getElementById('counter').innerText = 'Started';
    statusMessage.innerText = 'Script is running...';

    while (running) {
        try {
            const slotMachineFrame = document.querySelector("img[src='https://storage.googleapis.com/pockie-ninja/public/ui/SlotMachine/icon.png']");
            if (!slotMachineFrame || slotMachineFrame.offsetParent === null) {
                const iconImage = document.querySelector("img[src='https://storage.googleapis.com/pockie-ninja/public/ui/SlotMachine/icon.png']");
                if (iconImage) {
                    const rect = iconImage.getBoundingClientRect();
                    clickEnCoordenadas(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }
            }

            let challengeButton = Array.from(document.querySelectorAll('button'))
                .find(button => button.innerText.includes('Challenge') && button.offsetParent !== null);

            while (!challengeButton) {
                console.log('Waiting for the "Challenge" button to be available...');
                await new Promise(r => setTimeout(r, 250));
                challengeButton = Array.from(document.querySelectorAll('button'))
                    .find(button => button.innerText.includes('Challenge') && button.offsetParent !== null);
            }

            await new Promise(r => setTimeout(r, 4000));
			
            challengeButton.click();

            counter++;
            document.getElementById('counter').innerText = counter;

            await new Promise(r => setTimeout(r, 1000));

            while (true) {
                let closeButton = Array.from(document.querySelectorAll('button'))
                    .find(button => button.innerText.includes('Close'));
                if (closeButton) {
                    closeButton.click();
                    break;
                }
                await new Promise(r => setTimeout(r, 2000));
            }
        } catch (error) {
            console.error('Script error:', error);
            await new Promise(r => setTimeout(r, 5000));
        }
    }
}

async function stopLoop() {
    let closeButton = Array.from(document.querySelectorAll('button'))
        .find(button => button.innerText.includes('Close'));
    
    if (closeButton) {
        await new Promise(r => setTimeout(r, 2000));
    }

    running = false;
    console.log('Stopped');
    document.getElementById('counter').innerText = 'Script Stopped';
    statusMessage.innerText = 'The Script has been stopped.';
}

startButton.addEventListener('click', () => {
    running = true;
    startLoop();
});

stopButton.addEventListener('click', stopLoop);
