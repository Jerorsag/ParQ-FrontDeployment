<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <!-- Componente AdAside -->
      <div class="col-12 col-lg-3 mb-4">
        <AdAside />
      </div>

      <!-- Componente ParkingConfiguration -->
      <div class="col-12 col-lg-9">
        <ParkingConfiguration />
      </div>
    </div>
  </div>
</template>

<script>
import ParkingConfiguration from '../components/ParkingConfiguration.vue';
import AdAside from '../components/AdAside.vue';

export default {
  components: {
    ParkingConfiguration,
    AdAside
  }
};
</script>

<style scoped>
/* Estilos opcionales para ajustes específicos */
/* Añade un margen adicional si es necesario */
</style>
