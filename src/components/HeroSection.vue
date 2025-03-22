<template>
  <div class="hero-container">
    <!-- Contenido principal del hero -->
    <div class="hero-content text-center text-white">
      <h1 class="display-3 fw-bold mb-4">¡Bienvenido a Parq!</h1>
      <p class="lead mb-5">
        Gestiona tus parqueaderos de forma rápida, fácil y eficiente.
      </p>
      <router-link to="/entry" class="btn btn-gradient btn-lg px-5">
        Entrar
      </router-link>
    </div>

    <!-- Elementos decorativos animados -->
    <div class="bubbles">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeroSection",
};
</script>

<style>
/* Fondo degradado animado */
.hero-container {
  display: flex;
  flex-direction: column;
  width: 100%; 
  min-height: 92vh;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #0072ff, #00c6ff, #0072ff);
  background-size: 300% 300%;
  animation: gradientBackground 6s ease infinite;
  overflow: hidden;
}

/* Animación del fondo */
@keyframes gradientBackground {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Contenido del hero */
.hero-content {
  z-index: 10;
}

.hero-content h1 {
  font-size: 3.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #fff;
}

.hero-content p {
  font-size: 1.25rem;
  color: #fff;
}

/* Botón con degradado */
.btn-gradient {
  background: linear-gradient(to right, #00c6ff, #0072ff);
  color: #fff;
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-gradient:hover {
  transform: scale(1.025);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Burbujas animadas */
.bubbles span {
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: bubbleAnimation 20s infinite ease-in-out;
}

.bubbles span:nth-child(1) {
  top: 10%;
  left: 20%;
  animation-duration: 15s;
  animation-delay: 0s;
}

.bubbles span:nth-child(2) {
  top: 30%;
  left: 70%;
  animation-duration: 18s;
  animation-delay: 2s;
}

.bubbles span:nth-child(3) {
  top: 50%;
  left: 40%;
  animation-duration: 12s;
  animation-delay: 4s;
}

.bubbles span:nth-child(4) {
  top: 70%;
  left: 80%;
  animation-duration: 14s;
  animation-delay: 6s;
}

.bubbles span:nth-child(5) {
  top: 90%;
  left: 10%;
  animation-duration: 16s;
  animation-delay: 8s;
}

.bubbles span:nth-child(6) {
  top: 20%;
  left: 50%;
  animation-duration: 19s;
  animation-delay: 10s;
}

.bubbles span:nth-child(7) {
  top: 80%;
  left: 60%;
  animation-duration: 20s;
  animation-delay: 12s;
}

.bubbles span:nth-child(8) {
  top: 60%;
  left: 30%;
  animation-duration: 17s;
  animation-delay: 14s;
}

/* Animación de las burbujas */
@keyframes bubbleAnimation {
  0% {
    transform: scale(0) translateY(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(-1000px);
    opacity: 0;
  }
}
</style>
