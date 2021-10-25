// ========== CARGAR NOTICIAS ============
const col = document.getElementById('title').innerHTML;
const noti = document.getElementsByClassName('noti');

window.onload = function() {

    const notiRef = firebase
    .firestore()
    .collection(col)
    .doc("noticias");

    notiRef.get().then((doc) => {
        if (!doc.exists) return;
        const datos = doc.data();
        noti.innerHTML = datos.actividad;
    });
}

