<template>
  <div class="container">

    <p class="info-parqueadero">
      Ocupados:
      <span class="span-ocupados p-1 rounded">{{ occupiedSpacesCount }}</span> -
      Restantes:
      <span class="span-restantes p-1 rounded ">{{ 10 - occupiedSpacesCount }}</span>
    </p>

    <div>
      <div v-if="hasOccupiedSpaces" class="parking-lot">
        <div
          v-for="(space, index) in spaces"
          :key="index"
          class="parking-space"
          @click="handleClick(space)"
        >
          <div v-if="space.occupied" class="vehicle-info">
            <p class="plate">•{{ space.placa }}•</p>
            <p class="type">{{ space.tipoVehiculo }}</p>
            <img
              :src="getVehicleImage(space.tipoVehiculo)"
              alt="Vehículo"
              class="vehicle-image"
            />
          </div>
          <div v-else class="empty-space">
            <p class="text">Espacio Libre</p>
          </div>
        </div>
      </div>
      <div v-else class="no-cars-message">
        <p>No hay autos en el parqueadero.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import Loading from "vue-loading-overlay"; // Importar el componente
import "vue-loading-overlay/dist/css/index.css"; // Importar los estilos
import Swal from "sweetalert2";
import Car from "@/assets/carro.png";
import Hatchback from "@/assets/automovil.png";
import Suv from "@/assets/camioneta.png";
import Motorcycle from "@/assets/moto.png";
import Scooter from "@/assets/scooter.png";
import Taxi from "@/assets/taxi.png";
import Truck from "@/assets/truck.png";

export default {
  components: {
    Loading, // Registrar el componente
  },
  setup() {
    const spaces = ref([]);
    const hasOccupiedSpaces = ref(false);
    const cargando = ref(false); // Control del spinner

    // Función para obtener el estado del parqueadero
    const fetchParkingStatus = async () => {
      cargando.value = true; // Mostrar el spinner
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/api/vehiculos`
        );
        const data = await response.json();
        spaces.value = data.map((vehiculo, index) => ({
          index,
          placa: vehiculo.placa || null,
          tipoVehiculo: vehiculo.tipoVehiculo || "Desconocido",
          horaIngreso: vehiculo.horaIngreso || null,
          occupied: !!vehiculo.placa,
        }));

        hasOccupiedSpaces.value = spaces.value.some((space) => space.occupied);
      } catch (error) {
        console.error("Error al obtener el estado del parqueadero:", error);
      } finally {
        cargando.value = false; // Ocultar el spinner
      }
    };

    // Función para obtener la imagen del vehículo
    const getVehicleImage = (tipoVehiculo) => {
      switch (tipoVehiculo.toLowerCase()) {
        case "automovil":
          return Hatchback;
        case "camioneta":
          return Suv;
        case "moto":
          return Motorcycle;
        case "scooter":
          return Scooter;
        case "taxi":
          return Taxi;
        case "camion":
          return Truck;
        default:
          return Car;
      }
    };

    // Función para manejar clics en los espacios del parqueadero
    const handleClick = async (space) => {
      if (space.occupied) {
        Swal.fire({
          title: "¿Registrar salida?",
          html: `<p>¿Deseas registrar la salida del vehículo?</p>
            <p><span class="placa-salida">${space.placa}</span></p>`,
          icon: "warning",
          iconColor: "#D00000",
          showCancelButton: true,
          confirmButtonText: "Sí, registrar salida",
          confirmButtonColor: "#2b9348",
          cancelButtonText: "Cancelar",
          cancelButtonColor: "#D00000",
          color: "#161a1d",
        }).then(async (result) => {
          if (result.isConfirmed) {
            cargando.value = true; // Mostrar el spinner
            try {
              const response = await fetch(
                `${process.env.VUE_APP_API_BASE_URL}/api/vehiculos/salida/${space.placa}?cobrarPorMinuto=false`,
                {
                  method: "PUT",
                }
              );
              if (!response.ok)
                throw new Error(
                  "Error al procesar la salida del vehículo."
                );

              const data = await response.json();
              const currentDateTime = new Date();
              const formattedDate =
                currentDateTime.toLocaleDateString("es-ES") +
                " " +
                currentDateTime.toLocaleTimeString();

              // Mostrar la factura en el SweetAlert
              Swal.fire({
                title: "Salida registrada",
                html: `
                  <div class="invoice">
                    <h3 class="invoice-title">Factura Venta</h3>
                    <p class="invoice-number">ID: ${data.facturaId || "kk720"}</p>
                    <p class="invoice-date">Fecha: ${formattedDate}</p>

                    <p><strong>Placa:</strong> <span class="placa-salida">${data.placa}</span></p>
                    <p><strong>Tipo de Vehículo:</strong> ${space.tipoVehiculo}</p>
                    <p><strong>Hora de Ingreso:</strong> ${space.horaIngreso}</p>
                    <p><strong>Hora de Salida:</strong> ${currentDateTime.toLocaleTimeString()}</p>
                    <p><strong>Costo Total:</strong> ${data.costoTotal}</p>
                  </div>
                `,
                icon: "success",
                iconColor: "#70e000",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3742FA",
                color: "#161a1d",
              });

              fetchParkingStatus();
            } catch (error) {
              console.error("Error al registrar la salida:", error);
              Swal.fire({
                title: "Error",
                text: "Ocurrió un error al procesar la salida del vehículo.",
                icon: "error",
                confirmButtonText: "Aceptar",
              });
            } finally {
              cargando.value = false; // Ocultar el spinner
            }
          }
        });
      } else {
        Swal.fire({
          title: "Espacio libre",
          text: "Este espacio está libre.",
          icon: "info",
          confirmButtonText: "Aceptar",
        });
      }
    };

    onMounted(() => {
      fetchParkingStatus();
    });

    const occupiedSpacesCount = computed(() => {
      return spaces.value.filter((space) => space.occupied).length;
    });

    return {
      spaces,
      hasOccupiedSpaces,
      handleClick,
      getVehicleImage,
      occupiedSpacesCount,
      cargando, // Control del spinner
    };
  },
};
</script>
<style scoped>
/* Nuevos estilos */
.info-parqueadero {
  margin: 20px;
  text-align: center;
  font-weight: 500;
}

.span-ocupados {
  background-color: #d00000;
  font-weight: 700;
  color: #fff;
}

.span-restantes {
  background-color: #38b000;
  font-weight: 700;
  color: #fff;
}

.parking-lot {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-radius: 5px;
  gap: 20px;
  padding: 20px;
  background-color: transparent;
  transition: all 0.3s ease;
}

.parking-space {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 5px dashed  #000;
  border-left: 5px dashed #000;
  border: 1px 0 1px 0;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.vehicle-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.plate, .type {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 3px;
}

.plate {
  background-color: #ffdd00;
  border: 1px solid #161a1d;
  color: #161a1d;
  font-size: 16px;
}

.type {
  top: 34px;
  color: #fff;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
}

.vehicle-image {
  width: 90%;
  padding: 10px;
  display: flex;
  object-fit: contain;
}

/* Seccion hasta vehiculos grid */

.empty-space {
  color: #28a745;
  font-size: 1.2rem;
  font-style: italic;
  text-align: center;
}

.no-cars-message {
  text-align: center;
  color: #8d99ae;
  font-size: 1.5rem;
}

.invoice {
  font-size: 14px;
  width: 250px;
  margin: 0 auto;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  line-height: 1.5;
  text-align: center;
}

/* Ocultar aside en pantallas pequeñas */
@media (max-width: 992px) {
  .parking-lot {
  grid-template-columns: repeat(2, 1fr);
  }
} 
</style>
