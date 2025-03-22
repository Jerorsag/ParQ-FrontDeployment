<template>
    <div class="invoice" v-if="invoiceData">
      <h3>Factura de Salida</h3>
      <p><strong>Placa:</strong> {{ invoiceData.placa }}</p>
      <p><strong>Tipo de Vehículo:</strong> {{ invoiceData.tipoVehiculo }}</p>
      <p><strong>Hora de Ingreso:</strong> {{ invoiceData.horaIngreso }}</p>
      <p><strong>Hora de Salida:</strong> {{ invoiceData.horaSalida }}</p>
      <p><strong>Costo Total:</strong> {{ invoiceData.costoTotal }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      invoiceData: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .invoice {
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    background-color: #f4f4f4;
    margin-top: 20px;
  }
  </style>
  