<template>
  <div class="container-fluid mt-4">
    <div class="row justify-content-center">
      <!-- Componente AdAside - Comentado para ocultarlo -->
      <!-- <div class="col-12 col-lg-3 mb-4">
        <AdAside />
      </div> -->

      <!-- Contenido principal: ParkingGrid e Invoice - Ahora más ancho y centrado -->
      <div class="col-12 col-lg-8">
        <h1 class="title-home mb-4">Estado del Parqueadero</h1>
        <ParkingGrid @showInvoice="displayInvoice" />
        <Invoice v-if="invoiceData" :invoiceData="invoiceData" class="mt-4" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import ParkingGrid from '../components/ParkingGrid.vue';
import Invoice from '../components/VehicleInvoice.vue';
// import AdAside from '@/components/AdAside.vue'; 

export default {
  components: {
    ParkingGrid,
    Invoice,
    // AdAside 
  },
  setup() {
    const invoiceData = ref(null);

    const displayInvoice = (data) => {
      invoiceData.value = data;
    };

    return { invoiceData, displayInvoice };
  }
};
</script>

<style scoped>
.title-home {
  font-weight: 700;
  font-size: 35px;
  text-align: center;
  color: #212529;
}
</style>
