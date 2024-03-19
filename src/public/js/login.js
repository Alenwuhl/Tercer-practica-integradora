const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.replace('/products');
        } else {
            // Aquí es donde mostramos el Toastify para errores
            Toastify({
                text: "Correo electrónico y/o contraseña incorrectos",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "#e74c3c",
            }).showToast();

            // También puedes mostrar más detalles del error si tu API los proporciona
            result.json().then(error => {
                console.error('Error:', error);
            });
        }
    }).catch(error => {
        console.error('Network Error:', error);
    });
});

