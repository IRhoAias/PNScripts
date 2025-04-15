// === Global Configuration & Helper Functions ===

window.targetLevels = ["1"]; // Define target levels
window.targetTypes = [""]; // Define target types, "Any" to ignore type
window.loopCount = 100; // Number of times the synthesis should loop
window.speedMultiplier = 1; // Adjusts script speed (higher number = faster execution)
window.postCreateDelay = 2500; // Delay after clicking "Create" (in ms)

window.currentTargetIndex = 0;
let isRunning = false; // Estado del script

window.getCurrentTargetLevel = function () {
  return window.targetLevels[window.currentTargetIndex];
};

window.getCurrentTargetType = function () {
  return window.targetTypes[window.currentTargetIndex] || "Edge"; // Default to "Edge"
};

// Adjusts delay based on speed multiplier
const delay = (ms) => new Promise((res) => setTimeout(res, ms / window.speedMultiplier));

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- Synthesis Container Helpers ---
function getSynthesisContainer() {
  return Array.from(document.querySelectorAll("div")).find((div) => {
    const style = div.getAttribute("style");
    return (
      style &&
      style.includes("top: 5px") &&
      style.includes("left: 5px") &&
      style.includes("width: 310px") &&
      style.includes("height: 100px")
    );
  });
}

// Return only the synthesis items (panels with width: 50px; height: 50px).
function getSynthesisItems() {
  const container = getSynthesisContainer();
  if (!container) return [];
  return Array.from(container.querySelectorAll(".j-panel")).filter((panel) => {
    const style = panel.getAttribute("style");
    return style && style.includes("width: 50px") && style.includes("height: 50px");
  });
}

// --- Action Functions ---
async function addCorrectItem(targetLevel, targetType) {
  const synthesisContainer = getSynthesisContainer();

  let inventoryButtons = () => Array.from(document.querySelectorAll("div.label.bold.xs.right")).filter((el) => {
    if (synthesisContainer && synthesisContainer.contains(el)) return false;
    const num = el.textContent.replace(/[^\d]/g, "").trim();
    const typeLabel = el.parentElement.querySelector(".label.bold.xs.left");
    const type = typeLabel ? typeLabel.textContent.trim() : "";

    return num === targetLevel && (targetType === "Any" || type === targetType);
  });

  let items = inventoryButtons();
  if (items.length === 0) return false;

  shuffle(items);
  let selected = items[0];

  while (true) {
    // Ensure the item is still in the inventory (it may have moved)
    items = inventoryButtons();
    if (!items.includes(selected)) {
      if (items.length === 0) return false;
      selected = items[0]; // Select a new valid item
    }

    const rect = selected.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    await delay(20);

    selected.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        button: 2,
        clientX: x,
        clientY: y,
      })
    );

    await delay(100);

    const contextMenu = document.getElementById("context-menu");
    if (contextMenu) {
      const synthOption = Array.from(contextMenu.querySelectorAll(".context-menu__item")).find(
        (el) => el.textContent.trim() === "Synthesize"
      );
      if (synthOption) {
        synthOption.click();
        await delay(50); // Delay after clicking "Synthesize"
        break; // Stop once an item is successfully added
      }
    }

    await delay(50);
  }

  await delay(200);
  return true;
}

// --- Main Execution (Loops Based on loopCount) ---
async function runSynthesisLoop() {
  for (let i = 0; i < window.loopCount; i++) {
    if (!isRunning) break; // Verificación para detener el script

    const targetLevel = window.getCurrentTargetLevel();
    const targetType = window.getCurrentTargetType();

    let synthesisItems = getSynthesisItems();
    let correctCount = synthesisItems.filter((item) => {
      const label = item.querySelector(".label.bold.xs.right");
      const typeLabel = item.querySelector(".label.bold.xs.left");

      const lvl = label ? label.textContent.replace(/[^\d]/g, "").trim() : "";
      const type = typeLabel ? typeLabel.textContent.trim() : "";

      return lvl === targetLevel && (targetType === "Any" || type === targetType);
    }).length;

    while (correctCount < 3) {
      if (!isRunning) break; // Verificación para detener el script

      const added = await addCorrectItem(targetLevel, targetType);
      if (!added) break;
      await delay(200);
      synthesisItems = getSynthesisItems();
      correctCount = synthesisItems.filter((item) => {
        const label = item.querySelector(".label.bold.xs.right");
        const typeLabel = item.querySelector(".label.bold.xs.left");

        const lvl = label ? label.textContent.replace(/[^\d]/g, "").trim() : "";
        const type = typeLabel ? typeLabel.textContent.trim() : "";

        return lvl === targetLevel && (targetType === "Any" || type === targetType);
      }).length;
    }

    await delay(100);

    const createBtn = Array.from(document.querySelectorAll("button.text-shadow.theme__button--original")).find(
      (btn) => btn.textContent.trim() === "Create"
    );

    if (createBtn && !createBtn.disabled) {
      createBtn.click();
      await delay(window.postCreateDelay); // Uses the new variable for create delay
    }
  }
}

// === GUI
const guiHTML = `
<div id="floatingGui" style="
  position: fixed;
  top: 200px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: white;
  z-index: 9999;
  font-family: Arial, sans-serif;
  cursor: move;
  width: 220px;
">
  <div id="dragBar" style="cursor: default; background: #333; padding: 5px; border-radius: 5px;">
  <strong>Config</strong>
  </div>
  
  <label for="levelSelect" style="font-size: 12px; margin: 4px 0;">Level:</label>
  <select id="levelSelect" style="padding: 4px; width: 100%; font-size: 12px;">
    ${Array.from({ length: 7 }, (_, i) => `<option value="${i + 1}">Level ${i + 1}</option>`).join('')}
  </select>

  <label for="optionSelect" style="font-size: 12px; margin: 4px 0;">Type:</label>
  <select id="optionSelect" style="padding: 4px; width: 100%; font-size: 12px;">
    <option value="Any">Random</option>
    <option value="Ruin">Defense Break</option>
    <option value="Deft">Dodge</option>
    <option value="Savage">Critical</option>
    <option value="Life">Max HP</option>
    <option value="Sharp">Min Attk</option>
    <option value="Edge">Max Attk</option>
    <option value="Speedy">Speed%</option>
  </select>

  <label for="loopCountSelect" style="font-size: 12px; margin: 4px 0;">Loops:</label>
  <input type="number" id="loopCountSelect" value="250" style="padding: 4px; width: 100%; font-size: 12px;" />

  <div style="display: flex; justify-content: space-between; margin-top: 8px; gap: 25px;">
    <button id="startBtn" style="font-size: 12px; padding: 4px 8px; background-color: green; color: white; border: none; cursor: pointer;">Start</button>
    <button id="stopBtn" style="font-size: 12px; padding: 4px 8px; background-color: red; color: white; border: none; cursor: pointer;">Stop</button>
  </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', guiHTML);
// Esperar a que la GUI cargue completamente
setTimeout(() => {
  // Buscar la imagen en el DOM
  const targetImage = document.querySelector('img[src="https://pockie-ninja.sfo3.digitaloceanspaces.com/public/features/bottom-menu/11-1.png"]');

  // Si la imagen está en el DOM, simular un clic en ella
  if (targetImage) {
    targetImage.click();

    // Esperar un poco antes de hacer clic en los botones
    setTimeout(() => {
      // Buscar el botón de "Blood Limit"
      const bloodLimitBtn = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent.trim() === "Blood Limit");

      // Si el botón de "Blood Limit" se encuentra, hacer clic en él
      if (bloodLimitBtn) {
        bloodLimitBtn.click();

        // Esperar 250ms antes de hacer clic en el botón "Synthesize"
        setTimeout(() => {
          // Buscar el botón de "Synthesize"
          const synthesizeBtn = Array.from(document.querySelectorAll('button'))
            .find(btn => btn.textContent.trim() === "Synthesize");

          // Si el botón de "Synthesize" se encuentra, hacer clic en él
          if (synthesizeBtn) {
            synthesizeBtn.click();
          } else {
            console.log("Botón 'Synthesize' no encontrado");
          }
        }, 500); // Esperar 250ms antes de hacer clic en "Synthesize"
      } else {
        console.log("Botón 'Blood Limit' no encontrado");
      }
    }, 500); // Ajusta el tiempo de espera según sea necesario (1 segundo en este caso)
  } else {
    console.log("Imagen no encontrada");
  }
}, 500); // Ajusta el tiempo de espera según sea necesario (500ms)

const levelSelect = document.getElementById("levelSelect");
const optionSelect = document.getElementById("optionSelect");
document.getElementById("startBtn").addEventListener("click", () => {
  window.targetTypes = [optionSelect.value];
  window.targetLevels = [levelSelect.value];

  const loopCountValue = document.getElementById("loopCountSelect").value;
  window.loopCount = parseInt(loopCountValue, 10);
  
  isRunning = true;
  runSynthesisLoop();
});
document.getElementById("stopBtn").addEventListener("click", () => isRunning = false);