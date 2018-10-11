<template>
    <div class="world-container" ref="screen">
        <div class="world" ref="world"
            :style="worldSizeStyle"
            :class="{ 'grabbed-entity': grabbedEntity !== null }"
            @mousemove="moveEntity"
            @mouseup="dropEntity">

            <div class="background" :style="worldSizeStyle" @click="addEntity"></div>

            <div class="axis-x"></div>
            <div class="axis-y"></div>

            <div class="world-offset">
                <div class="entity"
                    v-for="el in entities"
                    :key="el.entity.id"
                    :style="el.style"
                    @mousedown="grabEntity($event, el.entity)"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            worldScale: 10,
            grabbedEntity: null
        };
    },
    computed: {
        screenToWorldSpace(point) {
            const scale = this.worldScale;
            return function({ x, y }) {
                return {
                    x: Math.round(x / scale),
                    z: Math.round(y / scale)
                };
            };
        },
        worldToScreenSpace() {
            const scale = this.worldScale;
            return function({ x, z }) {
                return {
                    x: x * scale,
                    y: z * scale
                };
            };
        },
        worldSize() {
            return {
                width: "2048",
                height: "2048"
            };
        },
        worldSizeStyle() {
            return {
                width: this.worldSize.width + "px",
                height: this.worldSize.height + "px"
            };
        },
        entities() {
            const world = this.worldSize;
            const entities = this.$store.state.world.entities;
            const screenSpace = this.worldToScreenSpace;

            return entities.map(entity => {
                const position = screenSpace(entity.position);
                const size = screenSpace(entity.tile.size);
                const style = {
                    top: position.y - size.y * 0.5 + "px",
                    left: position.x - size.x * 0.5 + "px",
                    width: size.x + "px",
                    height: size.y + "px"
                };
                return { entity, style };
            });
        }
    },
    methods: {
        /**
         * @param {MouseEvent} ev
         */
        addEntity(ev) {
            const world = this.worldSize;
            const { x, z, y = 0 } = this.screenToWorldSpace({
                x: Math.round(ev.layerX - world.width * 0.5),
                y: Math.round(ev.layerY - world.height * 0.5)
            });

            this.$store.dispatch("addEntity", { x, y, z });
        },

        /**
         * @param {MouseEvent} ev
         * @param {object} entity
         */
        grabEntity(ev, entity) {
            ev.preventDefault();
            ev.stopPropagation();
            this.grabbedEntity = entity;
        },

        /**
         * @param {MouseEvent} ev
         */
        moveEntity(ev) {
            if (this.grabbedEntity !== null) {
                const world = this.worldSize;
                const { id } = this.grabbedEntity;
                const { x, z } = this.screenToWorldSpace({
                    x: Math.round(ev.layerX - world.width * 0.5),
                    y: Math.round(ev.layerY - world.height * 0.5)
                });

                this.$store.commit("MOVE_ENTITY", { id, x, z });
            }
        },

        /**
         * @param {MouseEvent} ev
         */
        dropEntity(ev) {
            if (this.grabbedEntity) {
                ev.preventDefault();
                ev.stopPropagation();
                this.grabbedEntity = null;
            }
        },

        centerWorld() {
            const { screen, world } = this.$refs;
            screen.scrollLeft = world.scrollWidth - screen.clientWidth;
            screen.scrollLeft = screen.scrollLeft * 0.5;
            screen.scrollTop = world.scrollHeight - screen.clientHeight;
            screen.scrollTop = screen.scrollTop * 0.5;
        }
    },
    mounted() {
        this.$nextTick(this.centerWorld);
    }
};
</script>

<style scoped lang="scss">
.world-container {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: black;

    .world {
        position: relative;

        * {
            position: absolute;
        }

        .axis-x,
        .axis-y {
            pointer-events: none;
        }

        .axis-x {
            top: 50%;
            width: 100%;
            border-top: 1px solid red;
        }

        .axis-y {
            left: 50%;
            height: 100%;
            border-left: 1px solid limegreen;
        }

        .world-offset {
            top: 50%;
            left: 50%;
        }

        .entity {
            border: 1px solid white;
        }

        &.grabbed-entity {
            * {
                pointer-events: none;
            }
        }
    }
}
</style>