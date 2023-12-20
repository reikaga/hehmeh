let orders = JSON.parse(localStorage.getItem('orders')) || [
    { id: 1, cardNumber: '8479', orderNumber: '01', amount: 1200, customerName: 'Арк', status: 'В обработке', comment: 'лечу биполярку' },
    { id: 2, cardNumber: '8791', orderNumber: '02',  amount: 150, customerName: 'Кор', status: 'В обработке', comment: 'доедалус положите' },
    { id: 3, cardNumber: '5597', orderNumber: '03',  amount: 250, customerName: 'Опорник Б плента', status: 'В обработке', comment: 'где все' },
];
let deletedOrders = JSON.parse(localStorage.getItem('deletedOrders')) || [];


let originalOrders = orders.slice();

function goHome() {
    window.location.href = "index.html";
}
