let deferredInstallPrompt = null;
const installButton = document.querySelector(".install-icon");

const saveBeforeInstallPromptEvent = evt => {
  deferredInstallPrompt = evt;
  installButton.removeAttribute("hidden");
};

const installPWA = evt => {
  deferredInstallPrompt.prompt();
  evt.srcElement.parentElement.setAttribute("hidden", true);
  deferredInstallPrompt.userChoice.then(choice => {
    if (choice.outcome === "accepted") {
      console.log("User accepted the install prompt", choice);
    } else {
      console.log("User dismissed the install prompt", choice);
    }
    deferredInstallPrompt = null;
  });
};

const logAppInstalled = evt => {
  console.log("App installed", evt);
};

installButton.addEventListener("click", installPWA);

window.addEventListener("beforeinstallprompt", saveBeforeInstallPromptEvent);
window.addEventListener("appinstalled", logAppInstalled);
