// Crear una interfaz gráfica simple
let counter = 0;
let uiContainer = document.createElement('div');
uiContainer.style.position = 'fixed';
uiContainer.style.top = '10px';
uiContainer.style.right = '10px';
uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
uiContainer.style.color = 'white';
uiContainer.style.padding = '10px';
uiContainer.style.borderRadius = '5px';
uiContainer.style.zIndex = '9999';
uiContainer.innerHTML = `Repeticiones: <span id="counter">0</span>`;
document.body.appendChild(uiContainer);

// Función para hacer clic directamente en coordenadas de pantalla
function clickEnCoordenadas(x, y) {
    const eventOptions = {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        screenX: x,
        screenY: y,
        button: 0 // 0 para clic izquierdo
    };

    // Crear y despachar los eventos de mouse
    ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(eventType => {
        const event = new MouseEvent(eventType, eventOptions);
        document.dispatchEvent(event);
    });
}

// Función principal del loop
async function startLoop() {
    while (true) {
        // Esperar 1 segundo
        await new Promise(r => setTimeout(r, 1000));
        // Hacer clic en las coordenadas especificadas
        clickEnCoordenadas(1105, 645);
        counter++;
        document.getElementById('counter').innerText = counter;

        // Esperar 1 segundo
        await new Promise(r => setTimeout(r, 1000));

        // Hacer clic en el botón "Accept"
        let acceptButton = Array.from(document.querySelectorAll('button'))
            .find(button => button.innerText.includes('Accept'));
        if (acceptButton) {
            acceptButton.click();
        } else {
            console.log('No se encontró el botón Accept');
        }

        // Entrar en loop de espera para "Close"
        while (true) {
            let closeButton = Array.from(document.querySelectorAll('button'))
                .find(button => button.innerText.includes('Close'));
            if (closeButton) {
                closeButton.click();
                break;
            }
            // Esperar 2 segundos antes de volver a verificar
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

// Iniciar el loop
startLoop();
