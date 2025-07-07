<style scoped>
    button {
        padding: 7px 10px;
        border: 0;
        border-radius: 100px;
        background-color: #0e89db;
        color: #ffffff;
        font-weight: Bold;
        transition: all 0.5s;
        -webkit-transition: all 0.5s;
        font-size: 14px;
        cursor: pointer;
    }

    button:hover {
        background-color: #6fc5ff;
        box-shadow: 0 0 20px #6fc5ff50;
        transform: scale(1.1);
    }

    button:active {
        background-color: #3d94cf;
        transition: all 0.25s;
        -webkit-transition: all 0.25s;
        box-shadow: none;
        transform: scale(0.98);
    }
</style>

<template>
    <button>
        <slot></slot>
    </button>
</template>
