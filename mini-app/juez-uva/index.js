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

var app = new Vue({
  el: "#app",
  data: {
    capitulos: [],
    listado: [],
    url_base_envio: "https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=16&page=show_problem&problem=",
    ver_listado: true,
    ruta: [],
    cacheCapitulos: [],
    fecha: moment().locale("es").format('LL')
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
    }
  }
})