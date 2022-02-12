// ===========    CALENDARIO   =================

meses=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
lasemana=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]
const dt = firebase.firestore();

const banner = document.getElementById('BAN');
const cuerpo = document.getElementById('cuerpo')
const collection = document.getElementById('title').innerHTML;
const noti = document.getElementById('noti');


window.onload = function() {
    
    // OBTENER LA FECHA ACTUAL

    hoy=new Date(); //objeto fecha actual
    diasemhoy=hoy.getDay(); //dia semana actual
    diahoy=hoy.getDate(); //dia mes actual
    meshoy=hoy.getMonth(); //mes actual
    annohoy=hoy.getFullYear(); //año actual

    console.log('COLLECTION: '+collection)

    //  BUSCAR PRIMER DÍA POR NOMBRE DEL MES 

    primeromes=new Date(annohoy,meshoy,"1") //buscar primer día del mes
    prsem=primeromes.getDay() //buscar día de la semana del día 1
    if (prsem==-1) {prsem=6;}

    mescal = meshoy; 
    
    cargarAnony();
    

    
}

function cargarAnony() {
    firebase.auth().signInAnonymously()
      .then(() => {
        // Signed in..
        
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  
  
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        var uid = user.uid;
        Calendar(mescal);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }


function Calendar(mescal){


    // Cargar Noticias 
    const notiRef = dt.collection(collection).doc('noticias');
    
    notiRef.get().then((doc) => {
        if (!doc.exists) return;
        const datos = doc.data();
        noti.innerHTML = datos.actividad;
        
    }).catch(error => { 
        console.log('Error al cargar noticias: ', error);
    });
    
    //  BUSCAR PRIMER DÍA POR NOMBRE DEL MES 
    document.getElementById('titleAno').innerHTML = `<h2 id="titleAno">${annohoy}</h2>`;
    var meses = 'mes|'+mescal+'|'+annohoy;
    mesa=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    document.getElementById('fech').innerHTML = mesa[mescal]+'|'+annohoy;
   

    mesactual=hoy.getMonth(); //mes actual
    primeromes=new Date(annohoy,mescal,"1") //buscar primer día del mes
    prsem=primeromes.getDay() //buscar día de la semana del día 1
    if (prsem==-1) {prsem=6;}
    

    //buscar fecha para primera celda:
    diaprmes=primeromes.getDate() 
    prcelda=diaprmes-prsem; //restar días que sobran de la semana
    empezar=primeromes.setDate(prcelda) //empezar= tiempo UNIX 1ª celda
    diames=new Date() //convertir en fecha
    diames.setTime(empezar); //diames=fecha primera celda.
    
    // Obtener todas las imágenes de DESTACADOS
    
    

    var desyou = document.getElementById('fech').innerHTML;
    const destacadosRef = dt.collection(collection).doc('destacados|'+desyou);
    var cantidad = 0;
    document.getElementById('cantStar').innerHTML = "0";
    document.getElementById('destac').innerHTML = '';

    destacadosRef.get().then((doc) => {
        if (!doc.exists) return;
        const datos = doc.data();
        cantidad = datos.cantidad;
        console.log('Cantidad: '+cantidad);
        document.getElementById('cantStar').innerHTML = cantidad;

        // mostrar destacados si hay
        if (cantidad != 0){
            document.getElementById('destacados').style.display = 'inline-block';
            document.getElementById('noDestac').style.display = 'none';
        }

        for (let i = 1; i <= cantidad; i++) {
            var random=Math.floor(Math.random() * (4-1)+1);
            document.getElementById('destac').innerHTML += `
            <div class="star" id="${'star'+i}" >
            <a href="${'img/destacado'+random+'.jpg'}" target="_blank"id="${'surl'+i}" >
                <img src="${'img/destacado'+random+'.jpg'}" alt="" id="${'simg'+i}">
            </a>
            </div>`;

            

        }
        
        
        
    });
    InsertStar();
    


    // OBTENER EN ENLACE DEL VIDEO
    document.getElementById('video').style.display = 'none';
    document.getElementById('youtube').src = '';
    var you = document.getElementById('fech').innerHTML;
    const videoRef = dt.collection(collection).doc('video|'+you);
    videoRef.get().then((doc) => {
        if (!doc.exists) return;
        const datos = doc.data();
        document.getElementById('youtube').src = datos.video;
        document.getElementById('video').style.display = 'block';
    


        
    }).catch(error => { 
        console.log('Error al cargar el video: ', error);
        
    });



    for (i=0;i<7;i++) {
        celda0=document.getElementsByTagName("th")[i];
        celda0.innerHTML=lasemana[i]
    }
    


    


    //Recorrer las celdas para escribir el día:
    for (i=1;i<7;i++) { //localizar fila
        fila=document.getElementById("fila"+i);
        for (j=0;j<7;j++) {
            midia=diames.getDate() 
            mimes=diames.getMonth()
            mianno=diames.getFullYear()
            celda=fila.querySelectorAll('.t')[j];
            mesas=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
            mesname = mesas[mescal];
            const ide = midia+' de '+mesname+' de '+mianno;
            if (mimes==mescal) {
                celda.id = ide;
            }
            else{
                celda.id == '';

            }
            
            

            
            celda.innerHTML=midia;
            //Recuperar estado inicial al cambiar de mes:
            celda.style.backgroundColor="#ffffff";
            celda.style.color="#464646";
            //domingos en verde
            if (j==0) { 
               celda.style.color="#82c8c9";
               
            }
           
            //dias restantes del mes en gris
            if (mimes!=mescal) { 
               celda.style.color="#ffffff";
            }
            //destacar la fecha actual
            if (mimes==meshoy && midia==diahoy && mianno==annohoy && mescal==mesactual ) { 
               celda.style.backgroundColor="#9cd7d8";
               celda.style.color="#ffffff";
               celda.innerHTML=`<cite title='Fecha Actual' id="${ide}">${midia}</cite>`;
            }
            
            //pasar al siguiente día
            midia=midia+1;
            diames.setDate(midia);
            Verificar(ide,celda);
        }
        
    }
    
    

    // MOSTRAR BANNER DEL MES CORRESPONDIENTE AL DÍA ACTUAL

    switch (meshoy ) {
        case 0:
            banner.src = 'img/ENERO.jpg';
            break;
        case 1:
        banner.src = 'img/FEBRERO.jpg';
        break;
        case 2:
        banner.src = 'img/MARZO.jpg';
        break;
        case 3:
        banner.src = 'img/ABRIL.jpg';
        break;
        case 4:
        banner.src = 'img/MAYO.jpg';
        break;
        case 5:
        banner.src = 'img/JUNIO.jpg';
        break;
        case 6:
            banner.src = 'img/JULIO.jpg';
            break;
        case 7:
            banner.src = 'img/AGOSTO.jpg';
            break;
        case 8:
        banner.src = 'img/SEPTIEMBRE.jpg';
        break;
        case 9:
            banner.src = 'img/OCTUBRE.jpg';
            break;
        case 10:
            banner.src = 'img/NOVIEMBRE.jpg';
            break;
        case 11:
            banner.src = 'img/DICIEMBRE.jpg';
            break;
    
        default:
            banner.src = 'img/ENERO.jpg';
            break;
    }

}
function InsertStar(){
    var cantidad = document.getElementById('cantStar').innerHTML;
    // ocultar destacados si NO hay
    if (cantidad == "0"){
        document.getElementById('destacados').style.display = 'none';
        document.getElementById('noDestac').style.display = 'block';
    }

    if( cantidad <= 4){

        document.getElementById('fl').style.display = 'none';
        document.getElementById('fr').style.display = 'none';
    }
    if( cantidad > 4){

        document.getElementById('fl').style.display = 'block';
        document.getElementById('fr').style.display = 'block';
    }
    // contar la cantidada de archivos para agregar.
    for (let i = 1; i <= cantidad; i++) {
        const fech = document.getElementById('fech').innerHTML;
        console.log(fech);      
        

        // DESCARGAR PDF
        storage.ref('Calendario Maristas/'+fech+'/star'+i).getDownloadURL().then(function(destacados) {
            console.log(destacados)
            var random=Math.floor(Math.random() * (4-1)+1);
            //INSERTAR ARCHIVOS EN EL HTML
            document.getElementById('simg'+i).src = destacados;
            document.getElementById('surl'+i).href = destacados;
              
            if ( document.getElementById('simg'+i).src == ''){
                
                document.getElementById('simg'+i).src = 'img/destacado'+random+'.jpg';
            }
            // CONTAR DESTACADOS  
            CounterStar();

        }).catch(function(error,i) {
            const fech2 = document.getElementById('fech').innerHTML;
            storage.ref('Calendario Maristas/'+fech2+'/star'+i).getDownloadURL().then(function(destacados) {                
                //INSERTAR ARCHIVOS EN EL HTML
                
                document.getElementById('simg'+i).src = destacados;
                document.getElementById('surl'+i).href = destacados;
                i++;
            });
        });
        
        
    }

}

function CounterStar(){
    
    var star = 0;
    var testElements = document.getElementsByClassName('star');
    var testDivs = Array.prototype.filter.call(testElements, function(testElement){
        for (let e = 0; e < testElements.length; e++) {
            star++;
        

            if (screen.width > 900){
                if (star > 4){
                    testElement.style.display="none";
                }
            }
            else{
                if (star > 1){
                    testElement.style.display="none";
                }
            }
            
            return testElement.nodeName === 'DIV';
        }
    });

}

// Verificar si hay actividades en cada fecha del mes
function Verificar(ide,celda){
    if (mimes == meshoy){
        const libroRef = firebase
        .firestore()
        .collection(collection)
        .doc(ide);

        libroRef.get().then((doc) => {
            if (!doc.exists) return;
            const datos = doc.data();
            

            if ( datos.actividad != '' ){
                
                celda.innerHTML += `<div class="circle" id="${ide}"></div>`;
                
                celda.style.color="#1d87ae";   
                

                celda.addEventListener("click", e => {
                    e.preventDefault();
                    
                    const id = e.target.getAttribute("id");
                    document.getElementById('pre').style.display='block';
                    document.getElementById('diaA').innerHTML= 'Actividades del Día '+ id;
                    cargarActividades(id);

                });
            }     
            
        });
    }
    
    
                
} 
    
    
    








// CAMBIAR DE MES
function Restar(){
    if (meshoy != 0){
        meshoy = meshoy -1;
    }
    else {
        annohoy= annohoy-1;
        meshoy = 11;
    }
    

    

    switch (meshoy ) {
        case 0:
            banner.src = 'img/ENERO.jpg';
            mescal = 0;
            Calendar(mescal);
            break;
        case 1:
            banner.src = 'img/FEBRERO.jpg';
            mescal = 1;
            Calendar(mescal);
            break;
        case 2:
            banner.src = 'img/MARZO.jpg';
            mescal = 2;
            Calendar(mescal);
            break;
        case 3:
            banner.src = 'img/ABRIL.jpg';
            mescal = 3;
            Calendar(mescal);
            break;
        case 4:
            banner.src = 'img/MAYO.jpg';
            mescal = 4;
            Calendar(mescal);
            break;
        case 5:
            banner.src = 'img/JUNIO.jpg';
            mescal = 5;
            Calendar(mescal);
            break;
        case 6:
            banner.src = 'img/JULIO.jpg';
            mescal = 6;
            Calendar(mescal);
            break;
        case 7:
            banner.src = 'img/AGOSTO.jpg'; 
            mescal = 7;
            Calendar(mescal);
            break;
        case 8:
            banner.src = 'img/SEPTIEMBRE.jpg';
            mescal = 8;
            Calendar(mescal);
            break;
        case 9:
            banner.src = 'img/OCTUBRE.jpg';
            mescal = 9;
            Calendar(mescal);
            break;
        case 10:
            banner.src = 'img/NOVIEMBRE.jpg';
            mescal = 10;
            Calendar(mescal);
            break;
        case 11:
            banner.src = 'img/DICIEMBRE.jpg';
            mescal = 11;
            Calendar(mescal);
            break;
    
        default:
            banner.src = 'img/ENERO.jpg';
            mescal = 0;
            Calendar(mescal);
            break;
    }
}



function Sumar(){
    if (meshoy != 11){
        meshoy = meshoy +1;
    }
    else {
        annohoy= annohoy+1;
        meshoy = 0;
    }
    
    

    switch (meshoy ) {
        case 0:
            banner.src = 'img/ENERO.jpg';
            mescal = 0;
            Calendar(mescal);
            break;
        case 1:
            banner.src = 'img/FEBRERO.jpg';
            mescal = 1;
            Calendar(mescal);
            break;
        case 2:
            banner.src = 'img/MARZO.jpg';
            mescal = 2;
            Calendar(mescal);
            break;
        case 3:
            banner.src = 'img/ABRIL.jpg';
            mescal = 3;
            Calendar(mescal);
            break;
        case 4:
            banner.src = 'img/MAYO.jpg';
            mescal = 4;
            Calendar(mescal);
            break;
        case 5:
            banner.src = 'img/JUNIO.jpg';
            mescal = 5;
            Calendar(mescal);
            break;
        case 6:
            banner.src = 'img/JULIO.jpg';
            mescal = 6;
            Calendar(mescal);
            break;
        case 7:
            banner.src = 'img/AGOSTO.jpg';
            mescal = 7;
            Calendar(mescal);
            break;
        case 8:
            banner.src = 'img/SEPTIEMBRE.jpg';
            mescal = 8;
            Calendar(mescal);
            break;
        case 9:
            banner.src = 'img/OCTUBRE.jpg';
            mescal = 9;
            Calendar(mescal);
            break;
        case 10:
            banner.src = 'img/NOVIEMBRE.jpg';
            mescal = 10;
            Calendar(mescal);
            break;
        case 11:
            banner.src = 'img/DICIEMBRE.jpg';
            mescal = 11;
            Calendar(mescal);
            break;
    
        default:
            banner.src = 'img/ENERO.jpg';
            mescal = 0;
            Calendar(mescal);
            break;
    }
}


// Caragar las actividades del día


const fech = document.querySelectorAll(".t").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      console.log('mimes: '+mimes)
      console.log('mescal: '+mescal)
      if (mimes == mescal){
        const id = e.target.getAttribute("id");
        document.getElementById('pre').style.display='block';
        document.getElementById('diaA').innerHTML= 'Actividades del Día '+ id;
        cargarActividades(id);
      }
      else{
        document.getElementById('diaA').innerHTML= '';
      }
      

      
    });

});

const actividades = document.getElementById('actividades');

function cargarActividades(id){


    const libroRef = firebase
    .firestore()
    .collection(collection)
    .doc(id);

    libroRef.get().then((doc) => {
        if (!doc.exists) return;
        const datos = doc.data();
        actividades.innerHTML = datos.actividad;


        // CONTADOR LA CANTIDAD DE ACTIVIDADES
        var contador = 0;
        var siguiente = document.getElementById('vermas');
        var anterior = document.getElementById('vermenos');
        var testElements = document.getElementsByClassName('actividad');
        var testDivs = Array.prototype.filter.call(testElements, function(testElement){
        for (let e = 0; e < testElements.length; e++) {
            contador= contador+1;
            
            console.log("contador: "+contador);
            testElement.id = 'actividad'+contador;

            if (contador == 2){
                siguiente.style.display="inline-block";
                anterior.style.display="inline-block";
                siguiente.style.opacity=1;
                document.getElementById('actividad2').style.display="none";
                document.getElementById('max').innerHTML = 2;
            }
            if (contador == 3){ 
                document.getElementById('actividad2').style.display="none";
                document.getElementById('actividad3').style.display="none";
                document.getElementById('max').innerHTML = 3;
                siguiente.style.display="inline-block";
                anterior.style.display="inline-block";
                
            }
            if (contador == 4){ 
                document.getElementById('actividad2').style.display="none";
                document.getElementById('actividad3').style.display="none";
                document.getElementById('actividad4').style.display="none";
                document.getElementById('max').innerHTML = 4;
                siguiente.style.display="inline-block";
                anterior.style.display="inline-block";
                
            }
            if (contador == 5){ 
                document.getElementById('actividad2').style.display="none";
                document.getElementById('actividad3').style.display="none";
                document.getElementById('actividad4').style.display="none";
                document.getElementById('actividad5').style.display="none";
                document.getElementById('max').innerHTML = 5;
                siguiente.style.display="inline-block";
                anterior.style.display="inline-block";
                
            }
            
            if (contador == 1){
                siguiente.style.display="none";
                anterior.style.display="none";
                document.getElementById('max').innerHTML = 1;
            }
                
            
            
            return testElement.nodeName === 'DIV';
            
            
        }
        
        
        
        
        
        });
   
    });
}

var num = 1;


// =======    SIGUINETE  ===========
const vermas = document.querySelector('#vermas');
vermas.addEventListener('submit', (e) => {
    e.preventDefault();
    var max = document.getElementById('max').innerHTML;
    if(num <max){
        num = num +1;
        VerActividad(num);
    }

});

// =======    ANTERIOR  ===========
const vermenos = document.querySelector('#vermenos');
vermenos.addEventListener('submit', (e) => {
    e.preventDefault();
    var max = document.getElementById('max').innerHTML;
    if(num >1){
        num = num -1;
        VerActividad(num);
    }
    

});


function VerActividad(){
    var siguiente = document.getElementById('vermas');
    var anterior = document.getElementById('vermenos');
    switch (num) {
        case 1:
            document.getElementById('actividad1').style.display="inline-block";
            document.getElementById('actividad2').style.display="none";
            document.getElementById('actividad3').style.display="none";
            document.getElementById('actividad4').style.display="none";
            document.getElementById('actividad5').style.display="none";
            siguiente.style.opacity=1;
            break;
        case 2:
            document.getElementById('actividad1').style.display="none";
            document.getElementById('actividad2').style.display="inline-block";
            document.getElementById('actividad3').style.display="none";
            document.getElementById('actividad4').style.display="none";
            document.getElementById('actividad5').style.display="none";
            anterior.style.opacity=1;
            siguiente.style.opacity=1;
            break;
        case 3:
            document.getElementById('actividad1').style.display="none";
            document.getElementById('actividad2').style.display="none";
            document.getElementById('actividad3').style.display="inline-block";
            document.getElementById('actividad4').style.display="none";
            document.getElementById('actividad5').style.display="none";
            siguiente.style.opacity=1;
            anterior.style.opacity=1;
            break;
        case 4:
            document.getElementById('actividad1').style.display="none";
            document.getElementById('actividad2').style.display="none";
            document.getElementById('actividad3').style.display="none";
            document.getElementById('actividad4').style.display="inline-block";
            document.getElementById('actividad5').style.display="none";
            siguiente.style.opacity=1;
            anterior.style.opacity=1;
            break;
        case 5:
            document.getElementById('actividad1').style.display="none";
            document.getElementById('actividad2').style.display="none";
            document.getElementById('actividad3').style.display="none";
            document.getElementById('actividad4').style.display="none";
            document.getElementById('actividad5').style.display="inline-block";
            siguiente.style.opacity=1;
            anterior.style.opacity=1;
            break;
    
        default:
            break;
    }
}


function Cerrar(){
    document.getElementById('pre').style.display='none';
    num = 0;
    actividades.innerHTML = '';

}


function VerMenu(){
    document.getElementById('movil').style.display="block";
}
function CerrarMenu(){
    document.getElementById('movil').style.display="none";
}

var sum = 1;

function ISumar(){
    // CONTAR DESTACADOS 
    var star = 0;
    var testElements = document.getElementsByClassName('star');
    var testDivs = Array.prototype.filter.call(testElements, function(testElement){
        for (let e = 0; e < testElements.length; e++) {
            star++;
            return testElement.nodeName === 'DIV';
        }
   
    });
    if (sum < star-3){
        var star = 0;
        var testElements = document.getElementsByClassName('star');
        var test1 = Array.prototype.filter.call(testElements, function(testElement){
            for (let e = 0; e < testElements.length; e++) {
                star++;
                document.getElementById('star'+star).style.display="none"; 
                return testElement.nodeName === 'DIV';
            }
       
        });
        sum = sum + 1;
        Destacados(sum);
    }
    else{
        sum = sum;
    }
    
}


function IRestar(){
    // CONTAR DESTACADOS 
    var star = 0;
    var testElements = document.getElementsByClassName('star');
    var testDivs = Array.prototype.filter.call(testElements, function(testElement){
        for (let e = 0; e < testElements.length; e++) {
            star++;

            return testElement.nodeName === 'DIV';
        }
   
    });
    if (sum > 1){
        var star = 0;
        var testElements = document.getElementsByClassName('star');
        var testDivs2 = Array.prototype.filter.call(testElements, function(testElement){
            for (let e = 0; e < testElements.length; e++) {
                star++;
                document.getElementById('star'+star).style.display="none"; 
                return testElement.nodeName === 'DIV';
            }
       
        });
        sum = sum - 1;
        Destacados(sum);
    }
    else{
        sum = sum;
    }
    
        
    
}


function Destacados(sum){
    var star = 0;
        var testElements = document.getElementsByClassName('star');
        var testDivs2 = Array.prototype.filter.call(testElements, function(testElement){
            for (let e = 0; e < testElements.length; e++) {
                star++;
                document.getElementById('star'+star).style.display="none"; 
                return testElement.nodeName === 'DIV';
            }
       
        });
    for (let el = 1; el < star; el++) {
        if (screen.width > 900) {
            var el1 = el +1;
            var el2 = el +2;
            var el3 = el +3;
            switch (sum) {
                case el:
                    document.getElementById('star'+el).style.display="inline-block";
                    document.getElementById('star'+el1).style.display="inline-block";
                    document.getElementById('star'+el2).style.display="inline-block";
                    document.getElementById('star'+el3).style.display="inline-block";
                    break;
            
                default:
                    break;
            }
        }
        else{
            switch (sum) {
                case el:
                    document.getElementById('star'+el).style.display="inline-block";
                    break;
            
                default:
                    break;
            }
        }
        
        
    
        
    }
}







