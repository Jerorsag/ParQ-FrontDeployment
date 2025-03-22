<template>
  <div class="home">
    <div class="container-form">
      <form class="form" @submit.prevent="exitVehicle">
        <h1 class="form-title">Registrar Salida de Vehículo</h1>

        <!-- Campo para seleccionar la placa -->
        <label for="placa" class="info-inputField">Placa</label>
        <select
          v-model="placa"
          id="placa"
          class="inputField"
          required
        >
          <option value="" disabled selected>Selecciona una placa</option>
          <option v-for="vehiculo in vehiculos" :key="vehiculo.id" :value="vehiculo.placa">
            {{ vehiculo.placa }}
          </option>
        </select>

        <!-- Checkbox para cobrar por minuto -->
        <div class="form-check">
          <input
            type="checkbox"
            v-model="cobrarPorMinuto"
            class="form-check-input"
            id="cobrarPorMinuto"
          />
          <label class="info-inputField" for="cobrarPorMinuto">
            Cobrar por minuto
          </label>
        </div>

        <!-- Botón para registrar salida -->
        <button type="submit" class="form-btn">Registrar Salida</button>

        <!-- Mostrar respuesta después de la salida -->
        <div v-if="responseData" class="mt-4">
          <p><strong>Placa:</strong> {{ responseData.placa }}</p>
          <p><strong>Costo Total:</strong> {{ responseData.costoTotal }}</p>
          <p><strong>Mensaje:</strong> {{ responseData.mensaje }}</p>
        </div>

        <!-- Mensaje de error -->
        <p v-if="message" class="mt-3 text-center text-danger">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { mostrarSpinner } from '@/store/spinner';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const vehiculos = ref([]); // Lista de vehículos en el parqueadero
    const placa = ref('');
    const cobrarPorMinuto = ref(false);
    const responseData = ref(null);
    const message = ref('');

    // Función para obtener las placas disponibles
    const fetchVehiculos = async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/api/vehiculos`
        );
        if (!response.ok) throw new Error('Error al obtener las placas');
        const data = await response.json();
        vehiculos.value = data.filter((vehiculo) => vehiculo.horaSalida === null); // Solo placas disponibles
      } catch (error) {
        console.error('Error al obtener vehículos:', error);
        message.value = 'Error al cargar las placas disponibles.';
      }
    };

    // Función para registrar la salida del vehículo
    const exitVehicle = async () => {
      mostrarSpinner();
      responseData.value = ''; // Reiniciar la respuesta
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/api/vehiculos/salida/${placa.value}?cobrarPorMinuto=${cobrarPorMinuto.value}`,
          { method: 'PUT' }
        );
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        setTimeout(() => {
          responseData.value = data;
        }, 1000)
        message.value = '';
        await fetchVehiculos(); // Actualizar la lista de placas después de la salida
      } catch (error) {
        console.error('Error al registrar la salida:', error);
        responseData.value = null;
        message.value = 'Error al registrar la salida. Intenta de nuevo.';
      }
    };

    // Obtener los vehículos al montar el componente
    onMounted(fetchVehiculos);

    return { vehiculos, placa, cobrarPorMinuto, exitVehicle, responseData, message };
  },
};
</script>

<style scoped>
/* Mantén los estilos existentes */
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
  justify-self: center;
  align-self: center;
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

.inputField {
  padding: 15px 20px;
  width: 100%;
  border: 1px solid #6c757d;
  border-radius: 10px;
  font-size: 18px;
  color: #000;
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  margin: 0 auto;
  padding: 15px;
  transition: all 0.3s ease;
}

.form-btn:hover {
  background-color: rgba(51, 47, 246, 0.9);
  transform: scale(1.01);
}
</style>
