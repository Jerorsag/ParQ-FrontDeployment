<template>
  <div>
    <aside class="asideAd bg-light border-end" v-if="mostrarAside">
      <header class="d-flex justify-content-between align-items-center border-bottom p-2 mb-3">
        <span class="title-header-aside">Anuncios</span>
        <button class="btn btn-sm btn-outline-danger" @click="cerrarAside">X</button>
      </header>

      <div class="ad p-3 text-center" @click="irAEnlace" :data-url="anuncioActual.link">
        <div v-if="cargando">
          <p>Cargando anuncios...</p>
        </div>
        <div v-else-if="error">
          <p>{{ error }}</p>
        </div>
        <div v-else-if="!anuncios || anuncios.length === 0">
          <p>No hay publicidad disponible en este momento.</p>
        </div>
        <div v-else>
          <h2 class="brand-ad h6 text-dark fw-bold">
            🚘 {{ anuncioActual.marca }} {{ anuncioActual.modelo }} - {{ anuncioActual.año }}
          </h2>
          <div class="container-img-ad mb-3">
            <img :src="anuncioActual.thumbnail" alt="Anuncio" class="img-ad img-fluid rounded"/>
          </div>
          <div class="info-ad text-start">
            <p class="price-product-ad fw-bold text-success text-center">
              {{ anuncioActual.precio }}
            </p>
            <p class="descripcion-ad text-secondary">
              <strong>📏 Kilometraje:</strong> {{ anuncioActual.kilometraje }} <br>
              <strong>📍 Ubicación:</strong> {{ anuncioActual.ubicacion }} <br>
              <strong>🔍 Estado:</strong> {{ anuncioActual.estado }} <br>
              <strong>🤝 Vendedor:</strong> {{ anuncioActual.vendedor }}
            </p>
            <p class="important-info-ad text-center">
              🔥 ¡Compra ya en Mercado Libre Colombia!
            </p>
          </div>
        </div>
      </div>
    </aside>

    <button 
      v-if="!mostrarAside" 
      class="btn open-aside btn-outline-primary" 
      @click="abrirAside">
      Anuncios
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      anuncios: null,
      indiceActual: 0,
      mostrarAside: true,
      cargando: true,
      error: null,
      intervalo: null,
      // Datos de ejemplo para usar cuando la API falle
      anunciosRespaldo: [
        {
          id: "1",
          title: "Toyota Corolla 2022",
          price: 85000000,
          thumbnail: "https://http2.mlstatic.com/D_NQ_NP_987558-MCO51734996171_092022-O.webp",
          permalink: "https://articulo.mercadolibre.com.co/MCO-1130212926-toyota-corolla-cross-22-_JM",
          address: { city_name: "Bogotá" },
          seller: { nickname: "ToyotaColombia" },
          attributes: [
            { id: "BRAND", value_name: "Toyota" },
            { id: "MODEL", value_name: "Corolla" },
            { id: "VEHICLE_YEAR", value_name: "2022" },
            { id: "KILOMETERS", value_name: "25,000" },
            { id: "ITEM_CONDITION", value_name: "Usado - Excelente" }
          ]
        },
        {
          id: "2",
          title: "Mazda CX-5 2021",
          price: 92000000,
          thumbnail: "https://http2.mlstatic.com/D_NQ_NP_821053-MCO51315324382_082022-O.webp",
          permalink: "https://articulo.mercadolibre.com.co/MCO-1122483812-mazda-cx-5-touring-21-_JM",
          address: { city_name: "Medellín" },
          seller: { nickname: "MazdaColombia" },
          attributes: [
            { id: "BRAND", value_name: "Mazda" },
            { id: "MODEL", value_name: "CX-5" },
            { id: "VEHICLE_YEAR", value_name: "2021" },
            { id: "KILOMETERS", value_name: "30,000" },
            { id: "ITEM_CONDITION", value_name: "Usado - Bueno" }
          ]
        }
      ]
    };
  },
  computed: {
    anuncioActual() {
      // Valor por defecto para cuando no hay anuncios
      const defaultAnuncio = {
        marca: "No disponible",
        modelo: "No disponible",
        año: "No disponible",
        kilometraje: "No disponible",
        estado: "No disponible",
        precio: "No disponible",
        thumbnail: "",
        ubicacion: "No disponible",
        vendedor: "No disponible",
        link: "#"
      };
      
      // Verificar si hay anuncios disponibles
      if (!this.anuncios || !Array.isArray(this.anuncios) || this.anuncios.length === 0) {
        return defaultAnuncio;
      }
      
      // Verificar que el índice es válido
      if (this.indiceActual < 0 || this.indiceActual >= this.anuncios.length) {
        this.indiceActual = 0; // Restablecer índice si está fuera de rango
      }
      
      // Obtener el anuncio actual
      const anuncio = this.anuncios[this.indiceActual];
      if (!anuncio) return defaultAnuncio;
      
      // Procesar atributos de manera segura
      let atributos = {};
      if (anuncio.attributes && Array.isArray(anuncio.attributes)) {
        try {
          atributos = anuncio.attributes.reduce((acc, attr) => {
            if (attr && attr.id && attr.value_name !== undefined) {
              acc[attr.id] = attr.value_name;
            }
            return acc;
          }, {});
        } catch (error) {
          console.error("Error al procesar atributos:", error);
        }
      }
      
      // Construir y retornar el objeto de anuncio formateado
      return {
        marca: atributos.BRAND || "No disponible",
        modelo: atributos.MODEL || "No disponible",
        año: atributos.VEHICLE_YEAR || "No disponible",
        kilometraje: atributos.KILOMETERS || "No disponible",
        estado: atributos.ITEM_CONDITION || "No disponible",
        precio: anuncio.price
          ? new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
            }).format(anuncio.price)
          : "Precio no disponible",
        thumbnail: anuncio.thumbnail || "",
        ubicacion: anuncio.address?.city_name || "No disponible",
        vendedor: anuncio.seller?.nickname || "Anónimo",
        link: anuncio.permalink || "#"
      };
    }
  },
  mounted() {
    this.obtenerPublicidad();
    
    // Guardar referencia al intervalo para poder limpiarlo después
    this.intervalo = setInterval(() => {
      this.actualizarAnuncio();
    }, 6000);
  },
  beforeUnmount() {
    // Limpiar el intervalo cuando el componente se destruye
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  },
  methods: {
    async obtenerPublicidad() {
      this.cargando = true;
      this.error = null;
      
      try {
        const url = "https://api.mercadolibre.com/sites/MCO/search?q=autos";
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
          throw new Error(`Error: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        if (data && data.results && Array.isArray(data.results) && data.results.length > 0) {
          this.anuncios = data.results;
        } else {
          console.warn("No se encontraron resultados en la API, usando datos de respaldo");
          this.anuncios = [...this.anunciosRespaldo];
        }
      } catch (error) {
        console.error("Error al obtener la publicidad:", error);
        this.error = "No se pudieron cargar los anuncios de la API. Mostrando anuncios de respaldo.";
        this.anuncios = [...this.anunciosRespaldo]; // Usar copia para evitar mutaciones
      } finally {
        this.cargando = false;
      }
    },
    actualizarAnuncio() {
      try {
        // Verificar que anuncios existe y tiene elementos
        if (this.anuncios && Array.isArray(this.anuncios) && this.anuncios.length > 0) {
          this.indiceActual = (this.indiceActual + 1) % this.anuncios.length;
        }
      } catch (error) {
        console.error("Error al actualizar anuncio:", error);
      }
    },
    irAEnlace() {
      try {
        // Usar directamente el enlace del anuncio actual en lugar de buscarlo en el DOM
        const url = this.anuncioActual?.link;
        if (url && url !== "#") {
          window.open(url, "_blank");
        }
      } catch (error) {
        console.error("Error al abrir enlace:", error);
      }
    },
    cerrarAside() {
      this.mostrarAside = false;
    },
    abrirAside() {
      this.mostrarAside = true;
    }
  }
};
</script>

<style>
/* General */
.asideAd {
    width: 20%;
    min-height: 100vh;
    position: fixed;
    top: 85px;
    left: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    transition: all 0.4s ease-in-out;
    background: linear-gradient(145deg, #ffffff, #e4e7ec);
    z-index: 1000;
  }

  .title-header-aside {
    color: #332ff6;
    font-weight: 700;
  }

  /* Ocultar el aside desplazándolo hacia la izquierda */
.asideAd.hidden {
  transform: translateX(-100%); /* Mueve el aside fuera de la vista */
  opacity: 0; /* Hace que desaparezca */
}
  
.ad {
    cursor: pointer;
    transition: opacity 1s ease-in-out;
    position: relative;
  }

.container-img-ad {
    margin: 20px 0;
}

.ad img {
    width: 85%;
    border-radius: 5px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease-in-out;
    object-fit: cover; /* Para evitar deformaciones */
}

.ad img:hover {
    transform: scale(1.01);
}

.ad .brand-ad {
    font-size: 1.1rem;
    margin: 0;
    color: #2c3e50;
}

.ad .info-ad {
    padding: 10px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    text-align: left;
}

.ad .important-info-ad {
    font-size: 0.9rem;
    font-weight: 900;
    margin-top: 1rem;
}

.open-aside {
    position: fixed;
    top: 105px;
    left: 0;
    transform: translateY(-50%);
    background-color: #f8f9fa;
    color: #332ff6;
    font-size: 24px;
    font-weight: 700;
    border: 1px solid #ced4da;
    border-radius: 0 5px 5px 0;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 0.9rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 0; /* Asegura que esté sobre el aside */
    transition:  all .3s ease;
}

/* Mostrar el botón cuando el aside está oculto */
.asideAd.hidden ~ .open-aside {
    display: block;
    opacity: 0.8; /* Ligera transparencia */
}

.close-ad {
  align-self: center;
  justify-self: center;
}

/* Transición al cambiar anuncios */
.ad-fade {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
}

.ad-visible {
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
}

/* Ocultar aside en pantallas pequeñas */
@media (max-width: 992px) {
    .asideAd {
        display: none;
    }
} 
</style>