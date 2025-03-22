<template>
    <div>
      <!-- Mostrar mensaje mientras se cargan los datos -->
      <div v-if="cargando">Cargando parqueaderos...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <l-map
          style="height: 600px; width: 100%;"
          :zoom="zoom"
          :center="centro"
        >
          <!-- Capa de OpenStreetMap -->
          <l-tile-layer
            :url="urlTiles"
            :attribution="atribucion"
          />
  
          <!-- Marcadores para cada parqueadero -->
          <l-marker
            v-for="(parqueadero, index) in parqueaderos"
            :key="index"
            :lat-lng="[parqueadero.latitud, parqueadero.longitud]"
          >
            <l-popup>
              <strong>{{ parqueadero.nombre }}</strong>
            </l-popup>
          </l-marker>
        </l-map>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from "vue";
  import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
  import "leaflet/dist/leaflet.css";
  import axios from "axios";
  
  // Corregir iconos de Leaflet
  import { Icon } from "leaflet";
  delete Icon.Default.prototype._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });
  
  export default defineComponent({
    name: "MapaParqueaderos",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
    },
    setup() {
      const parqueaderos = ref([]); // Lista de parqueaderos
      const cargando = ref(true); // Estado de carga
      const error = ref(null); // Mensaje de error
      const centro = ref([4.5305, -75.6817]); // Coordenadas de la Universidad
      const zoom = ref(14); // Nivel de zoom inicial
      const urlTiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"; // URL de OpenStreetMap
      const atribucion = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
  
      // Obtener parqueaderos desde la API
      const obtenerParqueaderos = async () => {
        try {
          cargando.value = true;
          const respuesta = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/parqueaderos`, {
            params: {
              latitud: centro.value[0],
              longitud: centro.value[1],
              radioKm: 5,
            },
          });
          parqueaderos.value = respuesta.data;
        } catch (err) {
          console.error(err);
          error.value = "Error al cargar los datos de los parqueaderos.";
        } finally {
          cargando.value = false;
        }
      };
  
      // Llamar a la función al cargar el componente
      onMounted(() => {
        obtenerParqueaderos();
      });
  
      return {
        parqueaderos,
        cargando,
        error,
        centro,
        zoom,
        urlTiles,
        atribucion,
      };
    },
  });
  </script>
  
  <style>
  /* Estilo necesario para Leaflet */
  .leaflet-container {
    height: 600px;
    width: 100%;
  }
  </style>
  