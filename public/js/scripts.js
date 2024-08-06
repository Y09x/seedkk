document.getElementById('create-wallet').addEventListener('click', function() {
    window.location.href = '/create-hd-wallet';
    // Add your logic to create a new wallet here
});

document.getElementById('existing-wallet').addEventListener('click', function() {
    window.location.href = '/existing-wallet';
    // Add your logic to access an existing wallet here
});

document.getElementById('hardware-wallet').addEventListener('click', () => {
    // Add your logic to connect to a hardware wallet here
});

document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.getElementById('saved-phrase');
    const continueButton = document.getElementById('continue-button');

    checkbox.addEventListener('change', function() {
        continueButton.disabled = !checkbox.checked;
    });

    continueButton.addEventListener('click', function() {
        if (!continueButton.disabled) {
            window.location.href = '/next-step'; // Adjust the URL as needed
        }
    });
});