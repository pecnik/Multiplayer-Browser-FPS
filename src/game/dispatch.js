import * as THREE from "three";
import { Action } from "./actions.js";
import { State } from "./state.js";
import { Player } from "./player.js";

/**
 * @param {State} state
 * @param {Action} action
 */
export function dispatch(state, action) {
    switch (action.type) {
        case "INIT_GAME": {
            const { playerIds } = action.data;

            const state = new State();

            // Add players
            playerIds.forEach(playerId => {
                const player = new Player(playerId);
                player.mesh.position.y = 0.5;
                player.head.add(state.camera);
                state.players.set(player.id, player);
                state.scene.add(player.mesh);
            });

            return state;
        }
        case "SET_SCREEN_SIZE": {
            const { width, height } = action.data;
            state.camera.aspect = width / height;
            state.camera.updateProjectionMatrix();
            return state;
        }
        case "SET_PLAYER_INPUT": {
            const { playerId, input, value } = action.data;
            const player = state.players.get(playerId);
            if (player !== undefined) {
                if (player.input[input] !== undefined) {
                    player.input[input] = value;
                }
            }
            return state;
        }
        case "SET_PLAYER_AIM": {
            const { playerId, ver, hor } = action.data;
            const player = state.players.get(playerId);
            if (player !== undefined) {
                player.mesh.rotation.y = ver;
                player.head.rotation.x = hor;
            }
            return state;
        }
    }
    return state;
}