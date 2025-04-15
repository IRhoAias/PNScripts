// Crear el HUD mínimo
const hud = document.createElement('div');
hud.style.position = 'fixed';
hud.style.top = '10px';
hud.style.right = '10px';
hud.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
hud.style.padding = '10px';
hud.style.borderRadius = '5px';
hud.style.color = 'white';
hud.style.zIndex = '9999';
hud.innerHTML = `
    <button id="startButton" style="margin: 5px;">Start</button>
    <button id="stopButton" style="margin: 5px;">Stop</button>
`;

// Agregar el HUD al body
document.body.appendChild(hud);

let interval;

// Función para iniciar el auto-click
function startClicking() {
    interval = setInterval(() => {
        // Buscar el botón por texto interno
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            // Verificar que el botón tenga texto "Attempt" y no esté deshabilitado
            if (btn.innerText.includes('Attempt') && !btn.disabled) {
                btn.click();
                console.log('Clicked Attempt');
            }
			if (btn.innerText.includes('Accept') && !btn.disabled) {
                btn.click();
                console.log('Clicked Accept');
            }
        });
    }, 500); // Ajusta el intervalo (1000 ms = 1 segundo)
}

// Función para detener el auto-click
function stopClicking() {
    clearInterval(interval);
    console.log('Auto-click stopped');
}

// Event Listeners para los botones
document.getElementById('startButton').addEventListener('click', startClicking);
document.getElementById('stopButton').addEventListener('click', stopClicking);
