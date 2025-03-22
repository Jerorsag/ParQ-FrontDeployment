<template>
  <div class="container-fluid mt-4">
    <div class="row justify-content-center">
      <!-- Componente AdAside - Comentado para ocultarlo -->
      <!-- <div class="col-12 col-lg-3 mb-4">
        <AdAside />
      </div> -->

      <!-- Componente ParkingConfiguration - Ahora más ancho y centrado -->
      <div class="col-12 col-lg-8">
        <ParkingConfiguration />
      </div>
    </div>
  </div>
</template>

<script>
import ParkingConfiguration from '../components/ParkingConfiguration.vue';
// import AdAside from '../components/AdAside.vue'; 

export default {
  components: {
    ParkingConfiguration,
    // AdAside 
  }
};
</script>

<style scoped>
/* Estilos opcionales para ajustes específicos */
/* Añade un margen adicional si es necesario */
</style>
