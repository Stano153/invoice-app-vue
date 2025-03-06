<script setup>
import { ref } from 'vue';

const show = ref(false);
const isRotation = ref(false);

const openFilter = () => {
    show.value = !show.value;
    isRotation.value = !isRotation.value
}

const emit = defineEmits(['filter']);

const filter = (e) => {
    emit('filter', { value: parseInt(e.target.value), checked: e.target.checked });
};

</script>

<template>
    <div class="filter">
                <button @click="openFilter">Filter <span class="hide">by Status</span> <span><img :class="['filter__arrow',{'filter__arrow--rotation': isRotation}]" src="../../assets/icon-arrow-down.svg" alt="icon arrow down"></span></button>
                <transition name="down">
                    <div class="filter-popup" v-if="show">
                            <label class="status__item" for="paid__status">
                                <input type="checkbox" id="paid__status" value="0" @change="filter">Accepted
                            </label>
                            <label class="status__item" for="not-paid__status">
                                <input type="checkbox" id="not-paid__status" value="1" @change="filter">Declined
                            </label>
                            <label class="status__item" for="pending__status">
                                <input type="checkbox" id="pending__status" value="2" @change="filter">Pending
                            </label>
                            <label class="status__item" for="draft__status">
                                <input type="checkbox" id="draft__status" value="3" @change="filter">Draft
                            </label>
                        </div>
                </transition>
                </div>
</template>

<style scoped>
.filter button {
    background-color: transparent;
    font-weight: 700;
    border: none;
    color: var(--font-color-primary);

}

.filter__arrow {
    margin-left: 5px;
    transition: transform .3s ease 0s;
}

.filter__arrow--rotation {
    transform: rotate(180deg);
}

.filter-popup {
    background-color: var(--background-box-color);
    padding: 15px;
    margin-top: 30px;
    border-radius: 10px;
    box-shadow: 0 7px 29px 0 rgba(73, 73, 94, .2);
    position: absolute;
    min-width: 160px;
    z-index: 2;
}

input[type="checkbox"] {
  appearance: none;
  background-color: var(--border-color-primary);

  color: currentColor;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid var(--border-color-primary);
  border-radius: 0.15em;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
}


input[type="checkbox"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--border-color-secondary);
  background-color: CanvasText;
}

input[type="checkbox"]:checked::before {
  transform: scale(1);
}

.status__item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    margin-bottom: 10px;
    font-size: 15px;
}

.status__item:last-child {
    margin-bottom: 0;
}

.down-enter-from {
 opacity: 0;
 transform: translateY(-10px);
}

.down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.down-leave-from,
.down-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.down-enter-active {
  transition: all 0.3s ease-out;
}

.down-leave-active {
  transition: all 0.3s ease-in;

}

@media screen and (max-width: 900px) {
.hide {
    display: none;
}
}

</style>