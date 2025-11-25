document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); 
  console.log(document.getElementById("loginForm"));
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log(username);
  console.log(password);
  const credentiales = {
    username: username,
    password: password
  };
  fetch('https://fakestoreapi.com/auth/login', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentiales)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data); 

      //Guardar los datos en localStorage
      localStorage.setItem("token",data.token);
      console.log(data.token);
      localStorage.setItem("username", username);
      console.log(username);

      //callback
      setTimeout(()=>{
        //window.location.href="tienda.html"; 
        window.location.href="https://delsolccy.github.io/TiendaOnline/";
      }, 3000);
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("mensaje").textContent = "Nombre de usuario o contreña no válido";
    });
});