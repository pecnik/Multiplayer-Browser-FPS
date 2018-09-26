import express from "express";
import SocketIO from "socket.io";
import { Game } from "../game/game";
import debounce from "lodash/debounce";
import { initGame, kill } from "../game/actions";

// HTTP Server
//================================================================
const PORT = 8080;
const app = express();
const srv = app.listen(PORT);
app.use("/", express.static(__dirname + "/../../dist"));

{
    // Game
    //================================================================
    const io = SocketIO.listen(srv);
    const game = new Game();
    game.subscriptions.push(action => {
        if (action.type === "SERVER_ACTION") {
            dispatch(action.data);
        }
    });

    const dispatch = action => {
        game.dispatch(action);
        io.sockets.emit("dispatch", action);
    };

    const newGame = debounce(() => {
        console.log("Starting new game ...");
        const playerIds = Object.keys(io.sockets.connected);
        dispatch(initGame(playerIds));
    }, 1000);

    io.sockets.on("connection", socket => {
        console.log("Connection", socket.id);
        newGame();

        socket.on("dispatch", action => {
            dispatch(action);
        });

        socket.on("disconnect", () => {
            dispatch(kill(socket.id));
            console.log("Disconnect", socket.id);
        });
    });

    setInterval(() => {
        game.update();
        game.state.scene.updateMatrixWorld(true);
    }, 1000 / 60);

    console.log("Server running at http://localhost:" + PORT);
}
