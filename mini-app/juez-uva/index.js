var STORAGE_KEY = 'json-problemas-UVa-1.0'

var listadoUVaStorage = {
  obtener: function () {
    var listado = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    /* listado.forEach(function (elemento, index) {
      elemento.id = index
    }) */
    listadoUVaStorage.uid = listado.length
    return listado
  },
  sguardar: function (listado) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listado))
  }
}

var cabeceraTabla = [
  { text: 'ID', value: 'problema', sortable: false },
  { text: 'Nombre', value: 'nombre', sortable: false },
  { text: 'Veredicto', value: 'veredicto', sortable: false },
  { text: 'Runtime', value: 'runtime', sortable: false },
  { text: 'Fecha', sortable: false },
  { text: 'Lenguaje', value: 'lang', sortable: false },
  { text: 'Submission Rank', value: 'rank', sortable: false }
]


var app = new Vue({
  el: "#app",
  data: {
    capitulos: [],
    listado: [],
    url_base_envio: "https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=16&page=show_problem&problem=",
    ver_listado: true,
    ruta: [],
    cacheCapitulos: [],
    usuario: "",
    reglasNombre: [
      v => !!v || 'EL nombre es requerido'
    ],
    datosUsuario: [],
    cabecera: cabeceraTabla,
    lenguajes: [
      "null",
      "C",
      "Java",
      "C++",
      "Pascal",
      "C++11",
      "Python 3",
      "Go"
    ],
    veredictos: {
      10: "Error de envio",
      15: "No se puede juzgar",
      20: "En cola",
      30: "Compile error",
      35: "Función restringida",
      40: "Runtime error",
      45: "Output limit",
      50: "Time limit",
      60: "Memory limit",
      70: "Wrong answer",
      80: "Presentation error",
      90: "Accepted"
    }
  },
  methods: {
    cargarCP3: function () {
      if (this.cacheCapitulos.length != 0) {
        this.capitulos = this.cacheCapitulos
        return
      }
      this.ruta = []
      this.ver_listado = true
      fetch("https://uhunt.onlinejudge.org/api/cpbook/3")
      .then(response => response.json()
      .then(function(json) {
        app.capitulos = json
        listadoTMP = []
        json.forEach(element => {
          listadoTMP.push(element.title)
        });
        app.listado = listadoTMP
      }))
    },
    clickLista: function(val) {
      this.ruta.push(val)
      if (this.ruta.length == 1) {
        listadoTMP = []
        this.capitulos[val].arr.forEach(element => {
          listadoTMP.push(element.title)
        });
        this.listado = listadoTMP
      }
      if (this.ruta.length == 2) {
        listadoTMP = []
        etiqueta = ""
        this.ver_listado = false
        this.capitulos[this.ruta[0]].arr[val].arr.forEach(element => {
          element.title = element[0]
          element.shift()
          listadoTMP.push(element)
        });
        this.listado = listadoTMP
      }
    },
    cargarDatosNumProblema: function (num) {
      fetch("https://uhunt.onlinejudge.org/api/p/num/" + Math.abs(num))
      .then(response => response.json()
      .then(function(json) {
        document.getElementById(`${num}`).innerText = `${json.num}: ${json.title}`
        document.getElementById(`${num}`).href = `${app.url_base_envio}${json.pid}`
      }))
      return `Cargando problema ${num}...`
    },
    mostrarDatosUsuario: function () {
      fetch("https://uhunt.onlinejudge.org/api/uname2uid/" + this.usuario)
      .then(response => response.text()
      .then(function(texto) {
        fetch("https://uhunt.onlinejudge.org/api/subs-user/" + texto)
        .then(response => response.json())
        .then(function (json) {
          envios = json.subs
          envios.sort((a,b) => b[4]-a[4])
          json.subs = envios
          app.datosUsuario = json
        })
      }))
    },
    cargarDatosEnvio: function (num) {
      fetch("https://uhunt.onlinejudge.org/api/p/id/" + Math.abs(num))
      .then(response => response.json()
      .then(function(json) {
        document.getElementById(`nombre-${Math.abs(num)}`).innerText = json.title
      }))
      return `---`
    },
    id: function (num) {
      return `nombre-${num}`
    },
    fecha: function (timestamp) {
      return moment.unix(timestamp).locale("es").format("DD/MMMM/YYYY HH:mm")
    }
  }
})