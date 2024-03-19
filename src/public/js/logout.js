const logoutButton = document.querySelector("#logoutButton");

if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        console.log("click en logout");
        e.preventDefault();

        try {
            window.location.href = "/logout";
        } catch (error) {
            console.error("Error:", error);
        }
    });
} else {
    console.log("Botón de logout no encontrado");
}

