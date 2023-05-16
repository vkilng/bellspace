const togglePasswordVisibility = () => {
    const passwordInputElement = document.querySelector('input[placeholder="Password"]');
    if (document.querySelector('label.swap input[type="checkbox"]').checked) {
        passwordInputElement.setAttribute('type', 'text');
    } else {
        passwordInputElement.setAttribute('type', 'password');
    }
}

const validateEmail = () => {
    if (document.querySelector('input[type="email"]').validity.valid) {
        document.querySelector('label[for="email-signup-modal"]').classList.remove('btn-disabled');
    } else {
        document.querySelector('label[for="email-signup-modal"]').classList.add('btn-disabled');
    }
};