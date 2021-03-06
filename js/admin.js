// ===========    CALENDARIO   =================

meses=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
lasemana=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]
const dt = firebase.firestore();

const banner = document.getElementById('BAN');
const cuerpo = document.getElementById('cuerpo')
const collection = document.getElementById('title').innerHTML;
var tenoti =document.getElementById('tenoti');
var desnoti =document.getElementById('desnoti');


window.onload = function() {

    LoadWindow();
}

function LoadWindow(){
    // CONTAR DESTACADOS  
    
    var star = 0;
    var testElements = document.getElementsByClassName('star');
    var testDivs = Array.prototype.filter.call(testElements, function(testElement){
        for (let e = 0; e < testElements.length; e++) {
            star++;
            testElement.id += 'star'+star;
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

    // Cargar Noticias 
    const notiRef = dt.collection(collection).doc('noticias');
    const noti = document.getElementById('notie');

    notiRef.get().then((doc) => {
        if (!doc.exists) return;
        const datos = doc.data();
        noti.innerHTML = datos.actividad;
        tenoti.value = document.getElementById('tnoti').innerHTML;
        desnoti.value = document.getElementById('dnoti').innerHTML;
        
        
    }).catch(error => { 
        console.log('Error al cargar noticias: ', error);
    });
    
    
    

    
    

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


    

    Calendar(mescal);

    
}


function Calendar(mescal){
    
    
    //  BUSCAR PRIMER DÍA POR NOMBRE DEL MES 
    document.getElementById('titleAno').innerHTML = `<h2 id="titleAno">${annohoy}</h2>`;
    var meses = 'mes|'+mescal+'|'+annohoy;
    mesa=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    document.getElementById('fech').innerHTML = mesa[mescal]+'|'+annohoy;
    console.log(meses);

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

        for (let i = 1; i <= cantidad; i++) {
            var random=Math.floor(Math.random() * (4-1)+1);
            document.getElementById('destac').innerHTML += `
            <div id="startid" onclick="GetIdStar();" style="display: inline-block">
                <div class="star" id="${'star'+i}" >
            
                    <img src="${'img/destacado'+random+'.jpg'}" alt="" id="${'simg'+i}"class="${'star'+i}" >
                </div>
            </div>`;

        }
        InsertStar();
        
    }).catch(error => { 
        console.log('Error al cargar Destacados: ', error);
    });

    // OBTENER EN ENLACE DEL VIDEO
    document.getElementById('youtube').src = '';
    var you = document.getElementById('fech').innerHTML
    const videoRef = dt.collection(collection).doc('video|'+you);
    videoRef.get().then((doc) => {
        if (!doc.exists) return;
        const datos = doc.data();
        document.getElementById('youtube').src = datos.video;

        
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
            celda.id = ide;
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
// Caragar las actividades del día

const fech = document.querySelectorAll(".t").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      
        const id = e.target.getAttribute("id");
        document.getElementById('pre').style.display='block';
        document.getElementById('diaA').innerHTML= 'Actividades del Día '+ id;
        cargarActividades(id);
        document.getElementById('idi').innerHTML= id;

      
    });

});

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
                siguiente.style.display="inline-block";
                anterior.style.display="inline-block";
                document.getElementById('actividad2').style.display="none";
                document.getElementById('actividad3').style.display="none";
                document.getElementById('max').innerHTML = 3;
                
            }
            if (contador == 4){ 
                siguiente.style.display="inline-block";
                anterior.style.display="inline-block";
                document.getElementById('actividad2').style.display="none";
                document.getElementById('actividad3').style.display="none";
                document.getElementById('actividad4').style.display="none";
                document.getElementById('max').innerHTML = 4;
                
            }
            if (contador == 5){ 
                siguiente.style.display="inline-block";
                anterior.style.display="inline-block";
                document.getElementById('actividad2').style.display="none";
                document.getElementById('actividad3').style.display="none";
                document.getElementById('actividad4').style.display="none";
                document.getElementById('actividad5').style.display="none";
                document.getElementById('max').innerHTML = 5;
                
            }
            
            if (contador == 1){
                siguiente.style.display="none";
                anterior.style.display="none";
                document.getElementById('max').innerHTML = 1;
            }
                
            // Insertar cada elemento de la actividad en el editable

            document.getElementById('titl'+contador).value =document.getElementById('at'+contador).innerHTML;
            document.getElementById('des'+contador).value = document.getElementById('ad'+contador).innerHTML;
            document.getElementById('url'+contador).value= document.getElementById('ae'+contador).href;
            document.getElementById('link'+contador).value = document.getElementById('al'+contador).innerHTML;
            
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

function InsertStar(){
    var cantidad = document.getElementById('cantStar').innerHTML;

    if( cantidad == 0 || cantidad == ''){
        document.getElementById('destac').innerHTML = '<h4>No hay destacados</h4>';
        document.getElementById('fl').style.display = 'none';
        document.getElementById('fr').style.display = 'none';
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

function VerActividad(num){
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
            anterior.style.opacity=0;
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
            break;
        case 4:
            document.getElementById('actividad1').style.display="none";
            document.getElementById('actividad2').style.display="none";
            document.getElementById('actividad3').style.display="none";
            document.getElementById('actividad4').style.display="inline-block";
            document.getElementById('actividad5').style.display="none";
       
            break;
        case 5:
            document.getElementById('actividad1').style.display="none";
            document.getElementById('actividad2').style.display="none";
            document.getElementById('actividad3').style.display="none";
            document.getElementById('actividad4').style.display="none";
            document.getElementById('actividad5').style.display="inline-block";
            siguiente.style.opacity=0;
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











// ==================================================================================
// ===  I N G R E A S A R    A L    E D I T O R     D E     C O N T E N I D O   =====
// ==================================================================================



/*/
if(user.uid == "mMarwICTBvUQYjVMKsWrpK501wX2" || user.uid =="DXDJGATh6mWvGuR6viveMyVbnD32" || user.uid =="mUshwMpjRGNgHNLeSRYtSgqa0Iv1"){

    document.getElementById('gestor').style.display="none";


    // ====  C R E A R    U S U A R I O  ====
    const create = document.querySelector('#create');

    create.addEventListener('submit', (e) => {
      e.preventDefault();
      const password2= document.querySelector('.password2').value;
      const email2= document.querySelector('.email2').value;

      auth
        .createUserWithEmailAndPassword(email2,password2)
        .then(userCredential => {
          console.log("Usuario Creado");
          document.getElementById('crearUser').style.display="none";
        })
    });

}
/*/

// ==== A U T E N T I C A C I O N ====
const login = document.querySelector('#login');
login.addEventListener('submit', (e) => {
    e.preventDefault();
    const password= document.querySelector('#password').value;
    const email= document.querySelector('#email').value;
  
  
    auth
      .signInWithEmailAndPassword(email,password)
      .then(userCredential => {
        console.log("Login");
        document.getElementById('gestor').style.display="none";
        LoadWindow();
  
        
      }).catch(error => {
        alert("Usuario o contraseña incorrectos");
      });
});

// ==== M A N T E N E R    L A     S E C I Ó N ====
auth.onAuthStateChanged(user => {
    // si el usuario es distinto a anonimus
        
    if(user != null && user.id != '(anonimo)' ){
        document.getElementById('gestor').style.display="none";
    }
    else{
        document.getElementById('gestor').style.display="block";
        console.log("No esta logeado");
    }


});
// ==== C E R R A R   S E C I Ó N ====

function loginOut() {
    auth.signOut().then(() => {
      console.log("Seción Cerrada");
      window.location.reload();
    })
  }



// ====  C R E A R    U S U A R I O  ====

function loginIn(){
    document.getElementById('loginin').style.display="block";
}

const create2 = document.querySelector('#crearUser');

create2.addEventListener('click', (e) => {
    e.preventDefault();
    
    const password2= document.querySelector('.password2').value;
    const email2= document.querySelector('.email2').value;

    auth
    .createUserWithEmailAndPassword(email2,password2)
    .then(userCredential => {
        alert("Usuario Creado");
        document.getElementById('loginin').style.display="none";
    })
    .catch(error => {
        alert(" ERROR al crear usuario");
    });
});


// =======  BORRAR   ==========
  
function Borrar(){
document.getElementById('borrar').style.display="block";

}

function CancelarBorrar(){
    document.getElementById('borrar').style.display="none";
}
function Cerrar2(){
    document.getElementById('pre2').style.display="none";
}

function AceptarBorrar(){
    const idi=document.getElementById('idi').innerHTML;

    const borrarRef = firebase
    .firestore()
    .collection(collection)
    .doc(idi)
    .delete()
    .then(() => alert("Actividad borrada Correctamente")) // Documento borrado
    .catch((error) => alert("Error al Eliminar la Actividad", error));

    document.getElementById('borrar').style.display="none";
}

// =======  EDITAR ACTIVIDAD  =================

function Editar(){
    const idi=document.getElementById('idi').innerHTML;
    document.getElementById('pre2').style.display="block";
    document.getElementById('pre').style.display="none";
    document.getElementById('diaE').innerHTML = 'Editar Actividades del día '+idi;
}

function Cerrar2(){
    document.getElementById('pre2').style.display="none";
    document.getElementById('pre').style.display="block";
}

var agregar = 1;
const agregarEditar2 = document.getElementById('agregarEditar2');

agregarEditar2.addEventListener('click', e=> {
    e.preventDefault();
    if(agregar <5){
        agregar = agregar +1;
    }
    if (agregar == 1){
        document.getElementById('act2').style.display="none";
        document.getElementById('act1').style.display="block";
        document.getElementById('act3').style.display="none";
        document.getElementById('act4').style.display="none";
        document.getElementById('act5').style.display="none";
    }
    if (agregar == 2){
        document.getElementById('act1').style.display="none";
        document.getElementById('act2').style.display="block";
        document.getElementById('act3').style.display="none";
        document.getElementById('act4').style.display="none";
        document.getElementById('act5').style.display="none";
    }
    if (agregar == 3){
        document.getElementById('act1').style.display="none";
        document.getElementById('act3').style.display="block";
        document.getElementById('act2').style.display="none";
        document.getElementById('act4').style.display="none";
        document.getElementById('act5').style.display="none";
    }
    if (agregar == 4){
        document.getElementById('act1').style.display="none";
        document.getElementById('act4').style.display="block";
        document.getElementById('act2').style.display="none";
        document.getElementById('act3').style.display="none";
        document.getElementById('act5').style.display="none";
    }
    if (agregar == 5){
        document.getElementById('act1').style.display="none";
        document.getElementById('act5').style.display="block";
        document.getElementById('act2').style.display="none";
        document.getElementById('act3').style.display="none";
        document.getElementById('act4').style.display="none";
    }
    
});
const quitarEditar2 = document.getElementById('quitarEditar2');

quitarEditar2.addEventListener('click', e=> {
    e.preventDefault();

    if(agregar >1){
        agregar = agregar -1;
    }
    if (agregar == 1){
        document.getElementById('act2').style.display="none";
        document.getElementById('act1').style.display="block";
        document.getElementById('act3').style.display="none";
        document.getElementById('act4').style.display="none";
        document.getElementById('act5').style.display="none";
    }
    if (agregar == 2){
        document.getElementById('act1').style.display="none";
        document.getElementById('act2').style.display="block";
        document.getElementById('act3').style.display="none";
        document.getElementById('act4').style.display="none";
        document.getElementById('act5').style.display="none";
    }
    if (agregar == 3){
        document.getElementById('act1').style.display="none";
        document.getElementById('act3').style.display="block";
        document.getElementById('act2').style.display="none";
        document.getElementById('act4').style.display="none";
        document.getElementById('act5').style.display="none";
    }
    if (agregar == 4){
        document.getElementById('act1').style.display="none";
        document.getElementById('act4').style.display="block";
        document.getElementById('act2').style.display="none";
        document.getElementById('act3').style.display="none";
        document.getElementById('act5').style.display="none";
    }
    if (agregar == 5){
        document.getElementById('act1').style.display="none";
        document.getElementById('act5').style.display="block";
        document.getElementById('act2').style.display="none";
        document.getElementById('act3').style.display="none";
        document.getElementById('act4').style.display="none";
    }
    
});

function Guardar(){

    const idi=document.getElementById('idi').innerHTML;
    // tomar los id correspondientes
    const titl1 =document.getElementById('titl1').value;
    const des1 =document.getElementById('des1').value;
    const url1 =document.getElementById('url1').value;
    const link1 =document.getElementById('link1').value;

    const titl2 =document.getElementById('titl2').value;
    const des2 =document.getElementById('des2').value;
    const url2 =document.getElementById('url2').value;
    const link2 =document.getElementById('link2').value;
    
    const titl3 =document.getElementById('titl3').value;
    const des3 =document.getElementById('des3').value;
    const url3 =document.getElementById('url3').value;
    const link3 =document.getElementById('link3').value;

    const titl4 =document.getElementById('titl4').value;
    const des4 =document.getElementById('des4').value;
    const url4 =document.getElementById('url4').value;
    const link4 =document.getElementById('link4').value;

    const titl5 =document.getElementById('titl5').value;
    const des5 =document.getElementById('des5').value;
    const url5 =document.getElementById('url5').value;
    const link5 =document.getElementById('link5').value;
    
    
    var actualizar = '';

    
    // Insertar el html a guardar (ej: traspasar el input a h2)
    const act1 = 
    `<div class="actividad" ><h5 id="at1">${titl1}</h5>                            
     <p id="ad1"> ${des1}</p>                             
     <a href="${url1}" target="_blank" rel="" id="ae1"><h4 id="al1">${link1}</h4></a> </div> `
    ;

    const act2 = 
    `<div class="actividad" ><h5 id="at2">${titl2}</h5>                            
     <p id="ad2"> ${des2}</p>                             
     <a href="${url2}" target="_blank" rel="" id="ae2"><h4 id="al2">${link2}</h4></a> </div> `
    ;

    const act3 =
    `<div class="actividad" ><h5 id="at3">${titl3}</h5>                            
     <p id="ad3"> ${des3}</p>                             
     <a href="${url3}" target="_blank" rel="" id="ae3"><h4 id="al3">${link3}</h4></a> </div> `
    4

    const act4 =
    `<div class="actividad" ><h5 id="at4">${titl4}</h5>                            
     <p id="ad4"> ${des4}</p>                             
     <a href="${url4}" target="_blank" rel="" id="ae4"><h4 id="al4">${link4}</h4></a> </div> `
    ;

    const act5 =
    `<div class="actividad" ><h5 id="at5">${titl5}</h5>                            
     <p id="ad5"> ${des5}</p>                             
     <a href="${url5}" target="_blank" rel="" id="ae5"><h4 id="al5">${link5}</h4></a> </div> `
    ;

    if (agregar == 1){
        actualizar = act1;
    }
    if (agregar == 2){
        actualizar = act1 + act2;
    }
    if (agregar == 3){
        actualizar = act1+act2+act3;
    }
    if (agregar == 4){
        actualizar = act1+act2+act3+act4;
    }
    if (agregar == 5){
        actualizar = act1+act2+act3+act4+act5;
    }

    // ACTUALIZAR COLECCION

    const editarRef = firebase.firestore().collection(collection).doc(idi);

    editarRef
    .update({
        actividad: actualizar,
    })
    .then(() => {
        alert("Actividad Actualizada Correctamente"); // Documento actualizado
    })
    .catch((error) => {
        alert("Error al Actulizar la Actividad", error);
    });
    
}


// EDITAR 

function Crear2(){
    const idi=document.getElementById('idi').innerHTML;
    document.getElementById('pre3').style.display="block";
    document.getElementById('pre').style.display="none";
    document.getElementById('diaC').innerHTML = 'Crear Actividades en el día '+idi;
}

function Cerrar3(){
    document.getElementById('pre3').style.display="none";
    document.getElementById('pre').style.display="block";
}

var eagregar = 1;
const agregarEditar = document.getElementById('agregarEditar');

agregarEditar.addEventListener('click', e=> {
    e.preventDefault();
    if(eagregar <5){
        eagregar = eagregar +1;
    }
    
    if (eagregar == 1){
        document.getElementById('eact2').style.display="none";
        document.getElementById('eact1').style.display="block";
        document.getElementById('eact3').style.display="none";
        document.getElementById('eact4').style.display="none";
        document.getElementById('eact5').style.display="none";
    }
    if (eagregar == 2){
        document.getElementById('eact1').style.display="none";
        document.getElementById('eact2').style.display="block";
        document.getElementById('eact3').style.display="none";
        document.getElementById('eact4').style.display="none";
        document.getElementById('eact5').style.display="none";
        
    }
    if (eagregar == 3){
        document.getElementById('eact1').style.display="none";
        document.getElementById('eact3').style.display="block";
        document.getElementById('eact2').style.display="none";
        document.getElementById('eact4').style.display="none";
        document.getElementById('eact5').style.display="none";
    }
    if (eagregar == 4){
        document.getElementById('eact1').style.display="none";
        document.getElementById('eact4').style.display="block";
        document.getElementById('eact2').style.display="none";
        document.getElementById('eact3').style.display="none";
        document.getElementById('eact5').style.display="none";
    }
    if (eagregar == 5){
        document.getElementById('eact1').style.display="none";
        document.getElementById('eact5').style.display="block";
        document.getElementById('eact2').style.display="none";
        document.getElementById('eact4').style.display="none";
        document.getElementById('eact3').style.display="none";
    }
    
});

const quitarEditar = document.getElementById('quitarEditar');

quitarEditar.addEventListener('click', e=> {
    e.preventDefault();
    if(eagregar >1){
        eagregar = eagregar -1;
    }
    if (eagregar == 1){
        document.getElementById('eact2').style.display="none";
        document.getElementById('eact1').style.display="block";
        document.getElementById('eact3').style.display="none";
        document.getElementById('eact4').style.display="none";
        document.getElementById('eact5').style.display="none";
    }
    if (eagregar == 2){
        document.getElementById('eact1').style.display="none";
        document.getElementById('eact2').style.display="block";
        document.getElementById('eact3').style.display="none";
        document.getElementById('eact4').style.display="none";
        document.getElementById('eact5').style.display="none";
        
    }
    if (eagregar == 3){
        document.getElementById('eact1').style.display="none";
        document.getElementById('eact3').style.display="block";
        document.getElementById('eact2').style.display="none";
        document.getElementById('eact4').style.display="none";
        document.getElementById('eact5').style.display="none";
    }
    if (eagregar == 4){
        document.getElementById('eact1').style.display="none";
        document.getElementById('eact4').style.display="block";
        document.getElementById('eact2').style.display="none";
        document.getElementById('eact3').style.display="none";
        document.getElementById('eact5').style.display="none";
    }
    if (eagregar == 5){
        document.getElementById('eact1').style.display="none";
        document.getElementById('eact5').style.display="block";
        document.getElementById('eact2').style.display="none";
        document.getElementById('eact4').style.display="none";
        document.getElementById('eact3').style.display="none";
    }
    
});

function Crear(){

    const idi=document.getElementById('idi').innerHTML;
    // tomar los id correspondientes
    const etitl1 =document.getElementById('etitl1').value;
    const edes1 =document.getElementById('edes1').value;
    const eurl1 =document.getElementById('eurl1').value;
    const elink1 =document.getElementById('elink1').value;

    const etitl2 =document.getElementById('etitl2').value;
    const edes2 =document.getElementById('edes2').value;
    const eurl2 =document.getElementById('eurl2').value;
    const elink2 =document.getElementById('elink2').value;
    
    const etitl3 =document.getElementById('etitl3').value;
    const edes3 =document.getElementById('edes3').value;
    const eurl3 =document.getElementById('eurl3').value;
    const elink3 =document.getElementById('elink3').value;

    const etitl4 =document.getElementById('etitl4').value;
    const edes4 =document.getElementById('edes4').value;
    const eurl4 =document.getElementById('eurl4').value;
    const elink4 =document.getElementById('elink4').value;

    const etitl5 =document.getElementById('etitl5').value;
    const edes5=document.getElementById('edes5').value;
    const eurl5 =document.getElementById('eurl5').value;
    const elink5 =document.getElementById('elink5').value;
    
    
    var crear = '';

    
    // Insertar el html a guardar (ej: traspasar el input a h2)

    const eact1 =
    `<div class="actividad" ><h5 id="at1">${etitl1}</h5>                            
     <p id="ad1"> ${edes1}</p>                             
     <a href="${eurl1}" target="_blank" id="ae1" rel=""><h4 id="al1">${elink1}</h4></a> </div> `
    ;

    const eact2 =
    `<div class="actividad" ><h5 id="at2">${etitl2}</h5>                            
     <p id="ad2"> ${edes2}</p>                             
     <a href="${eurl2}" target="_blank" rel="" id="ae2"><h4 id="al2">${elink2}</h4></a> </div> `
    ;

    const eact3 =
    `<div class="actividad" ><h5 id="at3">${etitl3}</h5>                            
     <p id="ad3"> ${edes3}</p>                             
     <a href="${eurl3}" target="_blank" id="ae3" rel=""><h4 id="al3">${elink3}</h4></a> </div> `
    ;

    const eact4 =
    `<div class="actividad" ><h5 id="at4">${etitl4}</h5>                            
     <p id="ad4"> ${edes4}</p>                             
     <a href="${eurl4}" target="_blank" id="ae4" rel=""><h4 id="al4">${elink4}</h4></a> </div> `
    ;

    const eact5 =
    `<div class="actividad" ><h5 id="at5">${etitl5}</h5>                            
     <p id="ad5"> ${edes5}</p>                             
     <a href="${eurl5}" target="_blank" id="ae5" rel=""><h4 id="al5">${elink5}</h4></a> </div> `
    ;






    if (eagregar == 1){
        crear = eact1;
    }
    if (eagregar== 2){
        crear = eact1 + eact2;
    }
    if (eagregar == 3){
        crear = eact1+eact2+eact3;
    }
    if (eagregar == 4){
        crear = eact1+eact2+eact3+eact4;
    }
    if (eagregar == 5){
        crear = eact1+eact2+eact3+eact4+eact5;
    }
    console.log(crear)
    console.log(idi)
    crearcol(idi,crear);
    
}
// CREAR COLECCION
const crearcol = (idi,crear)=>
dt.collection(collection).doc(idi).set({
    actividad : crear,
}).then(() => alert("Actividad Creada Correctamente")) // Documento creado
.catch((error) => alert("Error al Crear la Actividad", error));




// GUARDAR NOTICIAS
function AgregarNoti(){

    const noticias = 
    `<h3 id="tnoti">${tenoti.value}</h3>                            
     <p id="dnoti"> ${desnoti.value}</p>`
    ;
    const editarRef = firebase.firestore().collection(collection).doc("noticias");

    editarRef
    .update({
        actividad: noticias,
    })
    .then(() => {
        alert("Noticia Actualizada Correctamente"); // Documento actualizado
    })
    .catch((error) => {
        alert("Error al Actulizar la Noticia", error);
    });
}

// GUARDAR DESTACADOS

function CerrarStar(){
    document.getElementById('crearStar').style.display="none";
    document.getElementById('reemStar').style.display="none";
    document.getElementById('borrarStar').style.display="none";
    document.getElementById('editarStar').style.display="none";
}

// Crear Destacado
function CrearStar(){
    document.getElementById('crearStar').style.display="block";
}


const subirA = document.getElementById('crearA');

subirA.addEventListener('click', e=> {
    e.preventDefault();
    const file = ($('#myFileA'))[0].files[0];
    const name = document.getElementById('fech').innerHTML;
    var canti = document.getElementById('cantStar').innerHTML;
    canti = Number(canti)+1;

    var storageRefA = storage.ref('Calendario Maristas/'+name+'/star'+canti);
    var upload = storageRefA.put(file);
    console.log(storageRefA);

    // SUBIR ARCHIVO A LA CARPETA CORRESPONDIENTE

    upload.on('state_changed',function(snapshot){
        var porcentaje = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        
        document.getElementById('uploaderA').value = porcentaje;
    },
    function error(err) {
        console.log(error);
    }, 
    function completado(){
        var desyou2 = document.getElementById('fech').innerHTML;
        dt.collection(collection).doc("destacados|"+desyou2).set({
            cantidad: canti,
        })
        
        
        if (document.getElementById('uploaderA').value = 100) {
        document.getElementById('uploaderA').value = 0;
        }
        console.log('Archivo Subido Correctamente');
        alert('Archivo Subido Correctamente');
        
    });
});


function GetIdStar(){
    document.querySelectorAll("#startid").forEach(el => {
        el.addEventListener("click", e => {
          e.preventDefault();
          const id = e.target.getAttribute("class");
          console.log(id);
          document.getElementById('editarStar').style.display="block";
          document.getElementById('nombreStar').innerHTML = id;
        });
    });
    
}



// REEMPLAZAR DESTACADOS

const reemplazarStar = document.getElementById('ReemplazarStar');

reemplazarStar.addEventListener('click', e=> {
    e.preventDefault();
    document.getElementById('reemStar').style.display="block";
    document.getElementById('editarStar').style.display="none";
});



const subirB = document.getElementById('crearB');

subirB.addEventListener('click', e=> {
    e.preventDefault();
    const file = ($('#myFileB'))[0].files[0];
    const name = document.getElementById('fech').innerHTML;
    const archive = document.getElementById('nombreStar').innerHTML;

    var storageRefB = storage.ref('Calendario Maristas/'+name+'/'+archive);
    var upload = storageRefB.put(file);
    console.log(storageRefB);

    // SUBIR ARCHIVO A LA CARPETA CORRESPONDIENTE

    upload.on('state_changed',function(snapshot){
        var porcentaje = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        
        document.getElementById('uploaderB').value = porcentaje;
    },
    function error(err) {
        console.log(error);
    }, 
    function completado(){
        if (document.getElementById('uploaderB').value = 100) {
        document.getElementById('uploaderB').value = 0;
        }
        console.log('Archivo Subido Correctamente');
        alert('Archivo Subido Correctamente');
        
    });
});


// BORRAR DESTACADOS

const borrarStar = document.getElementById('BorrarStar');

borrarStar.addEventListener('click', e=> {
    e.preventDefault();
    document.getElementById('borrarStar').style.display="block";
    document.getElementById('editarStar').style.display="none";
});


const subirC = document.getElementById('crearC');

subirC.addEventListener('click', e=> {
    e.preventDefault();
    // Create a reference to the file to delete
    const name2 = document.getElementById('fech').innerHTML;
    const archive = document.getElementById('nombreStar').innerHTML;
    var storageRef = firebase.storage().ref();
    var desertRef = storageRef.child('Calendario Maristas/'+name2+'/'+archive);

    // Delete the file
    desertRef.delete().then(function() {
    // File deleted successfully
    }).then(() => {
        alert('Archivo Borrado Correctamente');

    }).catch(function(error) {
    // Uh-oh, an error occurred!
    });
});

// GUARDAR VIDEO
const subirV = document.getElementById('crearV');

subirV.addEventListener('click', e=> {
    e.preventDefault();

    var you2 = document.getElementById('fech').innerHTML
    var yourl = document.getElementById('yourl').value;
    var video = 'https://www.youtube.com/embed/'+yourl;
    const youRef = firebase.firestore().collection(collection).doc("video|"+you2);
    crearyou(you2, video);

    
});

const crearyou = (you2,video)=>
    dt.collection(collection).doc("video|"+you2).set({
        video: video,
    }).then(() => alert("Video Guardado Correctamente")) // Documento creado
    .catch((error) => alert("Error al Guardar el Video", error));




// TUTORIAL
function CerrarTuto(){
    document.getElementById('tuto').style.display="none";
}
function VerTuto(){
    document.getElementById('tuto').style.display="block";
}

function CerrarLoginIn(){
    document.getElementById('loginin').style.display="none";
}





// CARGAR VISITAS
const visitas = document.getElementById('visit');
const loadVisit = dt.collection(collection).doc('visitas');
    
loadVisit.get().then((doc) => {
    if (!doc.exists) return;
    const datos = doc.data(); 
    visitas.innerHTML = datos.visitas;
    
}).catch(error => { 
    console.log('Error al cargar visitas: ', error);
});


