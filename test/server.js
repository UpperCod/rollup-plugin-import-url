import http from "http";

export const server = (callback, port) =>
    new Promise((resolve) => {
        const net = http.createServer(callback);
        net.listen(port, () => resolve(net));
    });
