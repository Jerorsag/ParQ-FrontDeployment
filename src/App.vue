<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div class="container-fluid">
        <img src="./assets/parq.png" alt="Logo parq" class="logo-app">
        <!-- Título dinámico del parqueadero -->
        <router-link to="/hero" class="navbar-brand d-none d-lg-block">
          <h1 id="principal-title">{{ nombreParqueadero }}</h1>
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <!-- Opciones principales -->
            <li class="nav-item">
              <router-link to="/entry" class="nav-link">Registrar Entrada</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/" class="nav-link">Estado del Parqueadero</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/exit" class="nav-link">Registrar Salida</router-link>
            </li>
            <!-- Dropdown para opciones secundarias -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                Más Opciones
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li>
                  <router-link to="/configuration" class="dropdown-item">Configuración</router-link>
                </li>
                <li>
                  <router-link to="/maps" class="dropdown-item">Parqueaderos Cercanos</router-link>
                </li>
                <li>
                  <router-link to="/capture" class="dropdown-item">Capturar Placa</router-link>
                </li>
                <li>
                  <router-link to="/statistics" class="dropdown-item">Estadisticas</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Spinner -->
    <loading v-model:active="loading" :is-full-page="true" />

    <!-- Vista dinámica del router -->
    <router-view />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Loading from "vue-loading-overlay"; // Importa el componente
import "vue-loading-overlay/dist/css/index.css"; // Importa los estilos

export default {
  name: "App",
  components: {
    Loading, // Registra el componente
  },
  setup() {
    const nombreParqueadero = ref("Cargando...");
    const loading = ref(true); // Estado para mostrar/ocultar el spinner

    const obtenerNombreParqueadero = async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/api/configuracion/nombre-parqueadero`
        );
        if (!response.ok) {
          throw new Error("Error al obtener el nombre del parqueadero.");
        }
        const data = await response.json();
        nombreParqueadero.value =
          data.nombreParqueadero || "Nombre no disponible";
      } catch (error) {
        console.error("Error al cargar el nombre del parqueadero:", error);
        nombreParqueadero.value = "Error al cargar";
      } finally {
        // Oculta el spinner cuando termina la carga
        loading.value = false;
      }
    };

    // Ejecuta la función al montar el componente
    onMounted(obtenerNombreParqueadero);

    return {
      nombreParqueadero,
      loading,
    };
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  scroll-behavior: smooth;
  text-decoration: none;
  list-style: none;
  font-family: "Poppins", serif;
  -webkit-font-smoothing: antialiased;
  /* Para navegadores basados en WebKit */
  -moz-osx-font-smoothing: grayscale;
  /* Para Firefox en macOS */
}

.navbar {
  background-color: #f8f9fa;
  /* Color claro */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  /* Sombra suave */
  padding: 10px;
}

.navbar-brand h1 {
  font-size: 1.5rem;
  /* Ajusta el tamaño del título */
  margin: 0;
  font-weight: bold;
  color: #181818;
}

.nav-link {
  color: #555;
  transition: all 0.3s;
  font-weight: 500;
  -webkit-font-smoothing: antialiased; /* Mejora la nitidez del texto */
  backface-visibility: hidden; /* Reduce artefactos de renderizado */
}

.logo-app {
  width: 5%;
  border-radius: 20px;
  margin: 0 10px;
  cursor: pointer;
  background-color: transparent;
  transition: all 0.3s ease;
}

.logo-app:hover {
  transform: scale(1.025);
}

.nav-link:hover {
  /* Color azul de Bootstrap para hover y activo */
  transform: scale(1.025);
  color: #332ff6;
}

.nav-link.router-link-exact-active {
  font-weight: bold;
}

.dropdown-menu {
  background-color: #fff; /* Fondo blanco para el dropdown */
  border-radius: 0.25rem; /* Bordes suaves */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); /* Sombra para el dropdown */
  max-height: 200px; /* Altura máxima del menú desplegable */
  overflow-y: auto; /* Habilita el desplazamiento vertical */
}

.dropdown-item {
  color: #555; /* Color de los elementos */
}

.dropdown-item:hover {
  background-color: #f8f9fa; /* Fondo claro en hover */
  color: #332ff6; /* Color azul en hover */
}

/* Ocultar el título en pantallas pequeñas */
.navbar-brand.d-none.d-lg-block {
  display: none;
}

@media (min-width: 992px) {
  .navbar-brand.d-none.d-lg-block {
    display: block;
  }
}

/* Estilos para placa en el SweetAlert */
.placa-salida {
  display: inline-block;
  padding: 10px 10px;
  margin: 0 5px;
  font-weight: bold;
  font-size: 1.4rem;
  color: #030303e8; /* Texto en blanco para contraste */
  background: linear-gradient(45deg, #ffdd00, #ffa600); /* Degradado amarillo */
  border: 3px solid #000000; 
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* Sombra para profundidad */
  text-align: center;
  letter-spacing: 2px; /* Espaciado entre letras */
  text-transform: uppercase; /* Letras mayúsculas */
  animation: pulse 1.5s infinite; /* Animación para resaltar */
}

/* Animación de pulso */
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
}
</style>
