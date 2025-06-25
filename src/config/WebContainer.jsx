import { WebContainer } from "@webcontainer/api";

let webContainerInstance = null;

export const getWebContainer = async () => {

    if(webContainerInstance === null) {
        webContainerInstance = await WebContainer.boot() //used to initialize web container and is very heavy
    }

    return webContainerInstance

}