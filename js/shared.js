
function getYesterdayDate() {
    var x = new Date();
    x.setDate((new Date().getDate() - 1))
    return x.toISOString().split('T')[0];
}

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}
function getTodayDateTime() {
    return new Date().toLocaleString();
}

function login(page) {
    window.location.href = page + '.html';
}
