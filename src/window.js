const desktop = document.getElementById("desktop");

let drag = null;
let topZ = 10;   


function focusWindow(win) {
  topZ += 1;
  win.style.zIndex = String(topZ);
}


function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}


desktop.addEventListener("pointerdown", (e) => {
  const titlebar = e.target.closest(".titlebar");
  if (!titlebar) return;

  const win = titlebar.closest(".window");
  if (!win) return;


  if (e.target.closest(".controls")) return;

  focusWindow(win);

  const rect = win.getBoundingClientRect();
  const deskRect = desktop.getBoundingClientRect();


  const startLeft = rect.left - deskRect.left;
  const startTop  = rect.top  - deskRect.top;

  drag = {
    win,
    pointerId: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    startLeft,
    startTop,
    deskRect
  };


  titlebar.setPointerCapture(e.pointerId);
});


desktop.addEventListener("pointermove", (e) => {
  if (!drag || e.pointerId !== drag.pointerId) return;

  const { win, startX, startY, startLeft, startTop } = drag;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;


  const desk = desktop.getBoundingClientRect();
  const winRect = win.getBoundingClientRect();

  const newLeft = startLeft + dx;
  const newTop  = startTop + dy;

  const maxLeft = desk.width - winRect.width;
  const maxTop  = desk.height - winRect.height;

  win.style.left = clamp(newLeft, 0, maxLeft) + "px";
  win.style.top  = clamp(newTop, 0, maxTop) + "px";
});


desktop.addEventListener("pointerup", (e) => {
  if (!drag || e.pointerId !== drag.pointerId) return;
  drag = null;
});

desktop.addEventListener("pointercancel", (e) => {
  if (!drag || e.pointerId !== drag.pointerId) return;
  drag = null;
});

desktop.addEventListener("mousedown", (e) => {
  const win = e.target.closest(".window");
  if (win) focusWindow(win);
});

function openWindow(id) {
  const windowElement = document.getElementById(id);
  if (windowElement) {
    windowElement.classList.remove("hidden");
    focusWindow(windowElement);
  }
}

function hideWindow(button) {
  const windowElement = button.closest(".window");
  if (windowElement) {
    windowElement.classList.add("hidden");
  }
}
let resizing = null

document.addEventListener("pointerdown", (e) => {
  const handle = e.target.closest(".resize-handle")
  if (!handle) return

  const win = handle.closest(".window")
  if (!win) return

  const deskRect = desktop.getBoundingClientRect()

  resizing = {
    win,
    pointerId: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    startWidth: win.offsetWidth,
    startHeight: win.offsetHeight,
    deskRect
  }

  handle.setPointerCapture(e.pointerId)
})

document.addEventListener("pointermove", (e) => {
  if (!resizing || e.pointerId !== resizing.pointerId) return

  const dx = e.clientX - resizing.startX
  const dy = e.clientY - resizing.startY

  let newWidth = resizing.startWidth + dx
  let newHeight = resizing.startHeight + dy

  const minWidth = 250
  const minHeight = 150

  const maxWidth = resizing.deskRect.width - resizing.win.offsetLeft
  const maxHeight = resizing.deskRect.height - resizing.win.offsetTop

  newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
  newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight))

  resizing.win.style.width = newWidth + "px"
  resizing.win.style.height = newHeight + "px"
  console.log("dx:", dx, "dy:", dy, "newHeight:", newHeight)
})

document.addEventListener("pointerup", (e) => {
  if (!resizing || e.pointerId !== resizing.pointerId) return
  resizing = null
})