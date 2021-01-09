export function invalidInfo(message) {
    let errorBox = document.getElementById('errorBox');
    errorBox.textContent = message;
    errorBox.style.display = 'block';

    setTimeout(() => errorBox.style.display = 'none', 2000);
};

export function invalidInfoLonger(message) {
    let errorBox = document.getElementById('errorBox');
    errorBox.textContent = message;
    errorBox.style.display = 'block';

    setTimeout(() => errorBox.style.display = 'none', 5000);
};


export function validInfo(message) {
    let infoBox = document.getElementById('infoBox');
    infoBox.textContent = message;
    infoBox.style.display = 'block';

    setTimeout(() => infoBox.style.display = 'none', 2000);
};