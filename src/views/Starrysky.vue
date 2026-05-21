<template>
    <div id="bg">
        <div ref="bodyRef" class="body">
            <div class="stars" ref="starsRef">
                <div class="star" v-for="(_, index) in starsCount" :key="index"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onBeforeUnmount, onMounted, ref } from 'vue';

    const starsRef = ref(null);
    const bodyRef = ref(null);
    const starsCount = 200;
    const distance = 700;
    let createMeteorInterval = null;

    const initStars = () => {
        if (!starsRef.value) {
            return;
        }

        const starNodes = Array.from(starsRef.value.children);
        starNodes.forEach((item) => {
            const speed = 0.2 + Math.random() * 1;
            const thisDistance = distance + Math.random() * 300;
            item.style.transformOrigin = `0 0 ${thisDistance}px`;
            item.style.transform = `
        translate3d(0,0,-${thisDistance}px)
        rotateY(${Math.random() * 460}deg)
        rotateX(${Math.random() * -50}deg)
        scale(${speed},${speed})`;
        });
    };

    const createMeteor = () => {
        if (!bodyRef.value) {
            return;
        }

        const meteor = document.createElement('div');
        meteor.classList.add('meteor');
        meteor.style.position = 'absolute';
        meteor.style.height = '2px';
        meteor.style.background = 'linear-gradient(to right, #fff, rgba(0, 0, 0, 0))';
        meteor.style.width = Math.random() * 10 + 100 + 'px';
        meteor.style.right = Math.random() * window.innerWidth + 'px';
        meteor.style.top = Math.random() * (window.innerHeight / 3) + 'px';
        bodyRef.value.prepend(meteor);

        const meteorRect = meteor.getBoundingClientRect();
        const fallDistance = window.innerHeight / 2 - meteorRect.top + Math.random() * 50;
        const duration = (fallDistance / (160 + Math.random() * 50)) * 1000;
        meteor.style.animation = `myMeteor ${duration}ms linear forwards`;

        const myMeteor = `@keyframes myMeteor {
    0% {
      transform: translate(0, 0) rotate(-30deg);
    }
    90%{
      opacity: .8;
    }
    100% {
      opacity: 0;
      transform: translate(-${fallDistance}px, ${fallDistance}px) rotate(-30deg);
    }
  }`;

        const style = document.createElement('style');
        style.innerHTML = myMeteor;
        document.head.appendChild(style);

        setTimeout(() => {
            meteor.remove();
            style.remove();
        }, duration);
    };

    onMounted(() => {
        initStars();
        createMeteorInterval = setInterval(
            () => {
                createMeteor();
            },
            5000 + Math.random() * 2000
        );
    });

    onBeforeUnmount(() => {
        if (createMeteorInterval) {
            clearInterval(createMeteorInterval);
        }
    });
</script>

<style scoped>
    #bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -100;
    }

    .body {
        position: absolute;
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        background: radial-gradient(200% 100% at bottom center, #f7f7b6, #e96f92, #1b2947);
        background: radial-gradient(200% 110% at top center, #1b2947 10%, #75517d 40%, #e96f92 65%, #f7f7b6);
        background-attachment: fixed;
        overflow: hidden;
    }

    @keyframes rotate {
        0% {
            transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(0);
        }

        100% {
            transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(-360deg);
        }
    }

    .stars {
        transform: perspective(500px);
        transform-style: preserve-3d;
        position: absolute;
        perspective-origin: 50% 100%;
        left: 55%;
        animation: rotate 100s infinite linear;
        bottom: 0;
    }

    .star {
        width: 2px;
        height: 2px;
        background: #f7f7b6;
        position: absolute;
        left: 0;
        top: 0;
        backface-visibility: hidden;
    }
</style>
