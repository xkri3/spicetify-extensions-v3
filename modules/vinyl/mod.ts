import type { Module } from "/hooks/module.ts";
import { createEventBus } from "/modules/stdlib/mod.ts";

// SET UP
const style = document.documentElement.style;
let isOut = false;

const createVinylElement = () => {
    const vinyl = document.createElement("div");
    vinyl.className = "vinyl";
    const print = document.createElement("div");
    print.className = "print";
    vinyl.appendChild(print);
    return { vinyl };
};
let { vinyl } = createVinylElement();

const targetNode = document.querySelector(".deomraqfhIAoSB3SgXpu")!.firstChild!.firstChild!;
const observer = new MutationObserver(mutationList => {
    mutationList.forEach(mutation => {
        if (mutation.type === "childList" && !document.querySelector(".vinyl")) {
            ({ vinyl } = createVinylElement());
            document.querySelector(".BFR9Zt3zpL8BATBMiwQB")!.appendChild(vinyl);
            vinyl.classList.add("vinyl-out");
        }
    });
});
observer.observe(targetNode, { attributes: false, childList: true, subtree: false });

const songChanged = (state: any) => {
    isOut = state?.item;
    if (isOut) {
        const imageUrl = state.item.metadata.image_large_url;
        style.setProperty("--current-song-cover", `url("${imageUrl}")`);
        vinyl.classList.remove("vinyl-out");
        vinyl.style.left = "0%";
        console.log(vinyl.offsetLeft);
        vinyl.classList.add("vinyl-out");
    } else {
        vinyl.classList.remove("vinyl-out");
        // Try to suspend vinyl to not use resources
    }
};
const statusChanged = (state: any) => {
    if (isOut) state.isPaused ? style.setProperty("--isPlaying", 'paused') : style.setProperty("--isPlaying", 'running');
};

export default function (mod: Module) {
    document.querySelector(".BFR9Zt3zpL8BATBMiwQB")!.appendChild(vinyl);
    const eventBus = createEventBus(mod);
    eventBus.Player.song_changed.subscribe(songChanged);
    eventBus.Player.status_changed.subscribe(statusChanged);

    return () => {
        observer.disconnect();
        vinyl?.remove();
    };
}