import socket from 'socket.io-client';

let socketInstance;

export const initializeSocket = (token , projectId) => {

    socketInstance = socket(import.meta.env.VITE_API_URL , {
        auth:{
            token: token
        },
        query:{
            projectId
        }
    })

    return socketInstance
}

export const recieveMessage = (eventName , callback) => {

    socketInstance.on(eventName , callback);

    return () => {
        socketInstance.off(eventName , callback) // removes the listener doing this will solve the problem of reloading messages mulltiple times on the screen
    }
}

export const sendMessage = (eventName , data) => {
    socketInstance.emit(eventName , data)
}
