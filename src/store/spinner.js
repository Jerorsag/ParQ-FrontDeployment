import './spinner.css'

export function mostrarSpinner() {
    const containerForm = document.querySelector('.container-form');
    const existeSpinner = document.querySelector('.spinner');

    if(!existeSpinner) {
        const spinner = document.createElement('DIV');
        spinner.classList.add('spinner');
        spinner.innerHTML = `
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        `;
        containerForm.appendChild(spinner);

        if (containerForm.lastChild) {
            setTimeout(() => {
                containerForm.removeChild(containerForm.lastChild);
            }, 1000);
        }
    }
}