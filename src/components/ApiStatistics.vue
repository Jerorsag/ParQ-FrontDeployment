<template>
  <div class="container">
    <div class="statistics-container">
      <loading v-model:active="cargando" :is-full-page="true" color="#332ff6" />

      <h1 class="title">Estadísticas del Parqueadero</h1>

      <!-- Resumen de estadísticas -->
      <div class="summary">
        <div class="summary-item">
          <h3>Total Vehículos</h3>
          <p>{{ totalVehiculos }}</p>
        </div>
        <div class="summary-item">
          <h3>Ingresos Hoy</h3>
          <p>{{ ingresosHoy }}</p>
        </div>
        <div class="summary-item">
          <h3>Vehículo Más Frecuente</h3>
          <p>{{ vehiculoFrecuente }}</p>
        </div>
      </div>

      <!-- Gráficos -->
      <div id="charts">
        <div class="chart">
          <h2 class="chart-title">Ingresos y Salidas por Hora</h2>
          <div id="hourly-stats"></div>
        </div>
        <div class="chart">
          <h2 class="chart-title">Tipos de Vehículos</h2>
          <div id="vehicle-types"></div>
        </div>
        <div class="chart">
          <h2 class="chart-title">Días Más Concurridos</h2>
          <div id="day-stats"></div>
        </div>
      </div>

      <!-- Últimos Vehículos Registrados -->
      <div class="recent-activity container mt-4">
  <h2 class="text-center mb-4">Últimos Vehículos Registrados</h2>
  <div class="table-responsive">
    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th scope="col">Placa</th>
          <th scope="col">Hora de Entrada</th>
          <th scope="col">Hora de Salida</th>
          <th scope="col">Tipo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vehiculo in ultimosVehiculos" :key="vehiculo.placa">
          <td>
            <span class="placa-style">{{ vehiculo.placa }}</span>
          </td>
          <td>{{ vehiculo.horaIngreso }}</td>
          <td>{{ vehiculo.horaSalida || 'En el parqueadero' }}</td>
          <td>{{ vehiculo.tipoVehiculo }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import * as d3 from "d3";
import { format } from "date-fns";

export default {
  components: {
    Loading,
  },
  setup() {
    const cargando = ref(false);
    const totalVehiculos = ref(0);
    const ingresosHoy = ref(0);
    const vehiculoFrecuente = ref("");
    const ultimosVehiculos = ref([]);

    const fetchStats = async () => {
      cargando.value = true;

      try {
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/api/estadisticas`
        );
        const data = await response.json();

        // Calcular métricas generales
        totalVehiculos.value = Object.values(data.vehicleTypes).reduce(
          (sum, count) => sum + count,
          0
        );
        ingresosHoy.value = Object.values(data.hourlyStats).reduce(
          (sum, count) => sum + count,
          0
        );
        vehiculoFrecuente.value = Object.entries(data.vehicleTypes).reduce(
          (max, [type, count]) => (count > max.count ? { type, count } : max),
          { type: "", count: 0 }
        ).type;

        // Obtener y formatear los últimos vehículos registrados
        const vehiculosResponse = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/api/ultimos-vehiculos?limite=5`
        );
        const vehiculosData = await vehiculosResponse.json();
        ultimosVehiculos.value = vehiculosData.map((vehiculo) => ({
          ...vehiculo,
          horaIngreso: format(new Date(vehiculo.horaIngreso), "dd-MM-yyyy HH:mm:ss"),
          horaSalida: vehiculo.horaSalida
            ? format(new Date(vehiculo.horaSalida), "dd-MM-yyyy HH:mm:ss")
            : null,
        }));

        // Transformar datos para D3
        const hourlyStats = {
          hours: Object.keys(data.hourlyStats),
          counts: Object.values(data.hourlyStats),
        };

        const vehicleTypes = Object.entries(data.vehicleTypes).map(
          ([type, count]) => ({ type, count })
        );

        const daysData = Object.entries(data.daysData).map(
          ([dia, ingresos]) => ({ dia, ingresos })
        );

        // Renderizar gráficos
        renderHourlyStats(hourlyStats);
        renderVehicleTypes(vehicleTypes);
        renderDayStats(daysData);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      } finally {
        cargando.value = false;
      }
    };

    const renderHourlyStats = (hourlyStats) => {
      const svg = d3
        .select("#hourly-stats")
        .append("svg")
        .attr("width", 600)
        .attr("height", 350);

      const x = d3
        .scaleBand()
        .domain(hourlyStats.hours)
        .range([0, 500])
        .padding(0.2);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(hourlyStats.counts)])
        .range([300, 0]);

      const g = svg.append("g").attr("transform", "translate(50, 20)");

      g.selectAll(".bar")
        .data(hourlyStats.counts)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => x(hourlyStats.hours[i]))
        .attr("y", (d) => y(d))
        .attr("width", x.bandwidth())
        .attr("height", (d) => 300 - y(d))
        .attr("fill", "#332ff6");

      g.append("g")
        .attr("transform", "translate(0, 300)")
        .call(d3.axisBottom(x));

      g.append("g").call(d3.axisLeft(y));
    };

    const renderVehicleTypes = (vehicleTypes) => {
      const svg = d3
        .select("#vehicle-types")
        .append("svg")
        .attr("width", 400)
        .attr("height", 400);

      const radius = Math.min(400, 400) / 2;

      const g = svg
        .append("g")
        .attr("transform", `translate(${radius}, ${radius})`);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const pie = d3.pie().value((d) => d.count);

      const arc = d3
        .arc()
        .outerRadius(radius - 10)
        .innerRadius(50);

      const arcs = g
        .selectAll(".arc")
        .data(pie(vehicleTypes))
        .enter()
        .append("g")
        .attr("class", "arc");

      arcs
        .append("path")
        .attr("d", arc)
        .attr("fill", (d) => color(d.data.type));

      arcs
        .append("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .text((d) => d.data.type)
        .style("fill", "#fff");
    };

    const renderDayStats = (daysData) => {
      const svg = d3
        .select("#day-stats")
        .append("svg")
        .attr("width", 600)
        .attr("height", 350);

      const x = d3
        .scaleBand()
        .domain(daysData.map((d) => d.dia))
        .range([0, 500])
        .padding(0.2);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(daysData, (d) => d.ingresos)])
        .range([300, 0]);

      const g = svg.append("g").attr("transform", "translate(50, 20)");

      g.selectAll(".bar")
        .data(daysData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.dia))
        .attr("y", (d) => y(d.ingresos))
        .attr("width", x.bandwidth())
        .attr("height", (d) => 300 - y(d.ingresos))
        .attr("fill", "#332ff6");

      g.append("g")
        .attr("transform", "translate(0, 300)")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      g.append("g").call(d3.axisLeft(y));
    };

    onMounted(fetchStats);

    return {
      cargando,
      totalVehiculos,
      ingresosHoy,
      vehiculoFrecuente,
      ultimosVehiculos,
    };
  },
};
</script>

<style scoped>
.statistics-container {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #332ff6;
  font-size: 2rem;
}

.summary {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  padding: 10px;
  background: #eef1f7;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.summary-item {
  text-align: center;
}

.summary-item h3 {
  color: #332ff6;
}

.summary-item p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.chart {
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
}

.chart-title {
  text-align: center;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
}

.recent-activity {
  margin: 30px auto;
  width: 90%;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background: #f5f5f5;
  color: #333;
}

.placa-style {
    display: inline-block;
    background-color: #ffbd00; /* Fondo similar al de placas reales */
    border: 2px solid #000; /* Borde negro */
    border-radius: 6px; /* Bordes redondeados */
    padding: 5px 15px; /* Espaciado interno */
    font-weight: bold; /* Letras en negrita */
    font-family: 'Arial', sans-serif; /* Fuente simple */
    color: #000; /* Texto negro */
    text-align: center;
    width: auto;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Sombra ligera */
  }
</style>
