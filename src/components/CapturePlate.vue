<template>
    <div class="container">
      <h1 class="title">Capturar Placa</h1>
        <!-- Botón para activar el servicio -->
        <button class="btn-capture" @click="capturarPlaca" :disabled="cargando">
          {{ cargando ? "Procesando..." : "Capturar Placa" }}
        </button>
        <!-- Mensaje de procesamiento -->
        <p v-if="cargando" class="mensaje">Procesando...</p>
        <!-- Mostrar la placa capturada o el mensaje de error -->
        <p v-else class="placa" :class="{ error: error }">{{ textoPlaca }}</p>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    name: "CapturarPlaca",
    setup() {
      const textoPlaca = ref("Esperando captura...");
      const cargando = ref(false);
      const error = ref(false);
  
      const capturarPlaca = async () => {
        cargando.value = true;
        textoPlaca.value = "Procesando...";
        error.value = false;
  
        try {
          const response = await fetch("http://localhost:5000/capturar_placa");
  
          if (!response.ok) throw new Error("Error al capturar la placa");
  
          const data = await response.json();
  
          if (data.placa) {
            textoPlaca.value = data.placa.toUpperCase();
          } else {
            textoPlaca.value = "No se detectó la placa";
            error.value = true;
          }
        } catch (err) {
          console.error("Error:", err);
          textoPlaca.value = "Error al capturar la placa";
          error.value = true;
        } finally {
          cargando.value = false;
        }
      };
  
      return { textoPlaca, cargando, error, capturarPlaca };
    },
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%; 
    min-height: 80vh;
    gap: 30px;
  }
  
  .title {
    font-size: 2rem;
    font-weight: 700;
  }
  
  .btn-capture {
    background-color: #332FF6;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
  }
  
  .btn-capture:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
  
  .btn-capture:hover:not(:disabled) {
    background-color: #007bff;
  }
  
  .mensaje {
    font-size: 2rem;
    color: #39348f;
  }
  
  .placa {
    font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 3px;
  color: #333;
  background: linear-gradient(90deg, #ffdd00, #ffa600);
  padding: 10px 20px;
  border: 2px solid #000;
  border-radius: 5px;
  text-transform: uppercase;
    
  }
  
  .placa.error {
    color: #dc3545;
  }
  </style>
  