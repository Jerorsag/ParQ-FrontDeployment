<template>
    <div class="container mt-4">
      <h1 class="text-center mb-4">Configuración del Parqueadero</h1>
  
      <!-- Configuración del nombre del parqueadero -->
      <div class="row mb-4 align-items-center">
        <label for="parking-name" class="form-label col-12 col-md-4 text-md-end">Nombre del Parqueadero:</label>
        <div class="col-12 col-md-6">
          <div class="input-group">
            <input
              id="parking-name"
              v-model="parkingName"
              type="text"
              class="form-control"
              placeholder="Nombre del parqueadero"
            />
            <button @click="updateParkingName" class="btn btn-success">Guardar</button>
          </div>
        </div>
      </div>
  
      <!-- Gestión de tipos y tarifas -->
      <h2 class="text-center my-4">Tipos y Tarifas de Vehículos</h2>
      <div class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead class="table-primary text-center">
            <tr>
              <th>Tipo de Vehículo</th>
              <th>Tarifa por Hora</th>
              <th>Tarifa por Minuto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tipo, index) in vehicleTypes" :key="index">
              <td>
                <input
                  v-model="tipo.tipoVehiculo"
                  type="text"
                  class="form-control"
                  placeholder="Tipo de Vehículo"
                />
              </td>
              <td>
                <input
                  v-model.number="tipo.precioPorHora"
                  type="number"
                  class="form-control"
                  placeholder="Tarifa por Hora"
                />
              </td>
              <td>
                <input
                  v-model.number="tipo.precioPorMinuto"
                  type="number"
                  class="form-control"
                  placeholder="Tarifa por Minuto"
                />
              </td>
              <td class="text-center">
                <button @click="deleteVehicleType(index)" class="btn btn-danger btn-sm me-2">
                  Eliminar
                </button>
                <button @click="saveVehicleType(index)" class="btn btn-primary btn-sm">
                  Guardar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Agregar nuevo tipo de vehículo -->
      <div class="d-flex justify-content-start">
        <button @click="addVehicleType" class="btn btn-outline-primary">Agregar Nuevo Tipo</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import Swal from "sweetalert2";
  
  export default {
    setup() {
      const parkingName = ref(""); // Nombre del parqueadero
      const vehicleTypes = ref([]); // Lista de tipos y tarifas de vehículos
  
      const loadConfig = async () => {
        try {
          const parkingResponse = await fetch(
            `${process.env.VUE_APP_API_BASE_URL}/api/configuracion/nombre-parqueadero`
          );
          const parkingData = await parkingResponse.json();
          parkingName.value = parkingData.nombreParqueadero;
  
          const vehicleResponse = await fetch(
            `${process.env.VUE_APP_API_BASE_URL}/api/configuracion/tarifas`
          );
          const vehicleData = await vehicleResponse.json();
          vehicleTypes.value = vehicleData;
        } catch (error) {
          console.error("Error al cargar la configuración:", error);
        }
      };
  
      const updateParkingName = async () => {
      try {
        await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/api/configuracion/nombre-parqueadero`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombreParqueadero: parkingName.value }),
        });

        // Mostrar el modal con SweetAlert2
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Nombre del parqueadero actualizado exitosamente.",
          iconColor: "#70e000",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#3742FA",
          color: "#161a1d",
        });
      } catch (error) {
        console.error("Error al guardar el nombre del parqueadero.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el nombre del parqueadero.",
        });
      }
    };
  
      const saveVehicleType = async (index) => {
        try {
          const tipo = vehicleTypes.value[index];
          await fetch(
            `${process.env.VUE_APP_API_BASE_URL}/api/configuracion/tarifas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tipo),
          });
          // Mostrar el modal con SweetAlert2
          Swal.fire({
            icon: "success",
            title: "¡Actualizado!",
            text: "Tipo de vehiculo actualizado",
            iconColor: "#70e000",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#3742FA",
            color: "#161a1d",
        });
      } catch (error) {
        console.error("Error al guardar el tipo de vehiculo.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo guardar el tipo de vehiculo.",
        });
      }
      };
  
      const deleteVehicleType = async (index) => {
        try {
          const tipo = vehicleTypes.value[index];
          await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/configuracion/tarifas/${tipo.id}`, { method: "DELETE" });
          vehicleTypes.value.splice(index, 1);
          // Mostrar el modal con SweetAlert2
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: "Tipo de vehiculo eliminado",
            iconColor: "#70e000",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#3742FA",
            color: "#161a1d",
        });
        } catch (error) {
          console.error("Error al eliminar el tipo de vehiculo.");
          Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el tipo de vehiculo.",
          });
        }
      };
  
      const addVehicleType = () => {
        vehicleTypes.value.push({
          tipoVehiculo: "",
          tarifaHora: 0,
          tarifaMinuto: 0,
        });
      };
  
      loadConfig();
  
      return {
        parkingName,
        vehicleTypes,
        updateParkingName,
        saveVehicleType,
        deleteVehicleType,
        addVehicleType,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Personaliza los márgenes y paddings si es necesario */

  .btn-primary {
    color: #332ff6;
    color: #fff;
  }
  </style>
  