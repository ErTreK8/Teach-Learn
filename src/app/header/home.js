var x = document.getElementById("myLinks");

function hamburgesa() {
    if (x.style.display === "flex") {
      x.style.display = "none";
    } else {
      x.style.display = "flex";
    }

    var y = document.getElementById("hambuergerDisplay");
    if (x.style.display === "flex") {
      y.textContent = "▲";
    } else {
      y.textContent = "▼";
    }
  }


  document.getElementById("check").addEventListener("change", function() {
    var modoTexto = document.getElementById("modo");
    var r = this; // El checkbox
    
    // Cambiar el texto y el modo dependiendo del estado del checkbox
    if (r.checked) {
      modoTexto.textContent = "MODO PROFESOR"; // Cambiar a Modo Profesor
      barra.style.backgroundColor = "#5A597A";
      hambuergerDisplay.style.color = "#5A597A";
      nav.style.backgroundColor = "#5A597A";
      modoTexto.style.color = "#5A597A";
      logo.src = "./assets/logoprofe.png";
      
      FotoUser.src = "./assets/account_profe.png";
    } else {
      modoTexto.textContent = "MODO ALUMNO"; // Cambiar a Modo Alumno
      barra.style.backgroundColor = "#518094";
      modoTexto.style.color = "#518094";
      nav.style.backgroundColor = "#518094";
      hambuergerDisplay.style.color = "#518094";
      logo.src = "./assets/logoMini.png";
      FotoUser.src = "./assets/account_circle.png";
    }
  });