<template>
  <div class="home">
    <div class="container-form">
      <form class="form" @submit.prevent="registerVehicle">
        <h1 class="form-title">Registrar Entrada de Vehículo</h1>

        <!-- Campo para la placa -->
        <label for="placa" class="info-inputField">Placa</label>
        <input
          v-model="placa"
          type="text"
          id="placa"
          class="inputField"
          placeholder="Ej: ABC123"
          required
        />

        <!-- Campo para el tipo de vehículo -->
        <label for="tipoVehiculo" class="info-inputField">Tipo de Vehículo</label>
        <select
          v-model="tipoVehiculo"
          id="tipoVehiculo"
          class="inputField"
          required
        >
          <option value="" disabled selected>Selecciona el tipo de Vehículo</option>
          <option v-for="tipo in tiposVehiculo" :key="tipo" :value="tipo">
            {{ tipo }}
          </option>
        </select>

        <!-- Mensaje de estado -->
        <div class="feedback-container" v-if="message">
          <p class=" text-center my-0">{{ message }}</p>
        </div>

        <!-- Botón para registrar -->
        <button type="submit" class="form-btn">Registrar</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mostrarSpinner } from "@/store/spinner";
import { ref, onMounted } from "vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

export default {
  components: {
    Loading,
  },
  setup() {
    const placa = ref("");
    const tipoVehiculo = ref("");
    const tiposVehiculo = ref([]);
    const message = ref("");
    const cargando = ref(false);

    const obtenerTiposVehiculos = async () => {
      cargando.value = true;
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/api/configuracion/tarifas`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los tipos de vehículos.");
        }
        const data = await response.json();
        tiposVehiculo.value = data.map((tarifa) => tarifa.tipoVehiculo);
      } catch (error) {
        console.error("Error al cargar los tipos de vehículos:", error);
      } finally {
      }
    };

    const registerVehicle = async () => {
      mostrarSpinner(); // Muestra Spinner Div
      message.value = "";
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/api/vehiculos/entrada`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              placa: placa.value,
              tipoVehiculo: tipoVehiculo.value,
            }),
          }
        );
        const data = await response.json();
        setTimeout(() => {
          message.value = data.mensaje;
        }, 1000);
      } catch (error) {
        console.error("Error al registrar el vehículo:", error);
        message.value = "Error al registrar el vehículo.";
      } finally {
      }
    };

    onMounted(obtenerTiposVehiculos);

    return {
      placa,
      tipoVehiculo,
      tiposVehiculo,
      registerVehicle,
      message,
      cargando,
    };
  },
};
</script>

<style scoped>
/* Fondo con degradado animado */
.home {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%; 
    min-height: 80vh;
    align-items: center;
    justify-content: center;
}
.container-form {
    display: flex;
    flex-direction: column;
    justify-self: center; /* Centrar en el eje X */
    align-self: center; /* Centrar en el eje Y */
    border: 2px solid #6c757d;
    width: 500px;
    background: #fff;
    border-radius: 10px;
    padding: 10px;
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 20px 20px;
    margin-bottom: 10px;
    padding: 20px;
  }
  
  .form-title {
    font-size: 30px;
    font-weight: 700;
    text-align: center;
    color: #212529;
  }
  
  .info-inputField {
    color: #212529;
    font-weight: 500;
    font-weight: 600;
    font-size: 18px;
  }
  .inputField {
    padding: 15px 20px;
    width: 100%;
    border: 1px solid #6c757d;
    border-radius: 10px;
    font-size: 18px;
    color: #000;
    transition: all 0.3s ease; /* Animación suave */
  }
  .inputField::placeholder {
    color: #6c757d;
    font-style: oblique;
  }
  
  .form-btn {
    width: 100%;
    background-color: #332FF6;
    color: #fff;
    border: none;
    outline: none;
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
    cursor: pointer;
    font-size: 15px;
    font-weight: 700;
    margin: 10px auto;
    padding: 15px;
    transition: all 0.3s ease;
  }
  .form-btn:hover {
    background-color: rgba(51, 47, 246, 0.9);
    transform: scale(1.01);
  }
</style>
