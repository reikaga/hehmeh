let orders = JSON.parse(localStorage.getItem('orders')) || [
    { id: 1, cardNumber: '8479', orderNumber: '01', amount: 3000, customerName: 'Арк', status: 'В обработке', comment: 'лечу биполярку' },
    { id: 2, cardNumber: '8791', orderNumber: '02', amount: 2300, customerName: 'Кор', status: 'В обработке', comment: 'доедалус положите' },
    { id: 3, cardNumber: '5597', orderNumber: '03', amount: 20, customerName: 'Опорник Б плента', status: 'В обработке', comment: 'где все' },
];
let deletedOrders = JSON.parse(localStorage.getItem('deletedOrders')) || [];
let originalOrders = orders.slice();

function goHome() {
  window.location.href = "index.html";
}

function renderOrders() {
  const ordersTableBody = document.getElementById('orders-table-body');
  ordersTableBody.innerHTML = '';
  orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${order.cardNumber}</td>
          <td>${order.orderNumber}</td>
          <td>${order.amount}</td>
          <td>${order.customerName}</td>
          <td>${order.status}</td>
          <td>${order.comment}</td>
     
          <td>
              <button onclick="renameOrder(${order.id})">Переименовать</button>
              <button onclick="deleteOrder(${order.id})">Удалить</button>
              <button onclick="closeOrder(${order.id})">Закрыть</button>
              <button onclick="editOrder(${order.id})">Изменить</button>
          </td>
    
      `;
      ordersTableBody.appendChild(row);
  });
}

function renderFilteredOrders() {
  const ordersTableBody = document.getElementById('orders-table-body');
  ordersTableBody.innerHTML = '';
  filteredOrders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${order.cardNumber}</td>
          <td>${order.orderNumber}</td>
          <td>${order.amount}</td>
          <td>${order.customerName}</td>
          <td>${order.status}</td>
          <td>${order.comment}</td>
          <td>
              <button onclick="renameOrder(${order.id})">Переименовать</button>
              <button onclick="deleteOrder(${order.id})">Удалить</button>
              <button onclick="closeOrder(${order.id})">Закрыть</button>
              <button onclick="editOrder(${order.id})">Изменить</button>
          </td>
      `;
      ordersTableBody.appendChild(row);
  });
}

function addNewOrder() {
  const cardNumber = prompt('Введите номер карты:');
  const orderNumber = prompt('Введите номер заказа:');
  const amount = parseFloat(prompt('Введите сумму:'));
  const customerName = prompt('Введите имя клиента:');
  const status = 'В обработке';
  const comment = prompt('Введите комментарий:');
  if (!orderNumber || !cardNumber || isNaN(amount) || !customerName || !comment) {
      alert('Пожалуйста, заполните все поля корректно.');
      return;
  }
  const newOrderId = orders.length > 0 ? Math.max(...orders.map(order => order.id)) + 1 : 1;
  const newOrder = {
      id: newOrderId,
      cardNumber: cardNumber,
      orderNumber: orderNumber,
      amount: amount,
      customerName: customerName,
      status: status,
      comment: comment,
  };
  orders.push(newOrder);
  saveOrders(); 
  renderOrders();
}

let filteredOrders = [];

function searchOrders() {
 const searchInput = document.getElementById('searchInput').value;
  filteredOrders = orders.filter(order => {
      return (
          order.orderNumber.includes(searchInput) 
         
      );
  }); 
  originalOrders = orders.slice();
  renderFilteredOrders();
}
//function searchOrders() {
  //const searchInput = prompt('Введите критерий поиска:');

 //if (!searchInput) {
     // alert('Пожалуйста, введите критерий поиска.');
     // return;
  //}

 // filteredOrders = orders.filter(order => {
    //  return (
         // order.cardNumber.includes(searchInput) ||
        //  order.orderNumber.includes(searchInput) ||
        //  order.customerName.includes(searchInput) ||
        //  order.comment.includes(searchInput)
    //  );
 // });

 //if (filteredOrders.length === 0) {
    //  alert('Нет результатов для введенного критерия поиска.');
    //  return;
 // }

 // renderFilteredOrders();

 // const backButton = document.createElement('button');
 // backButton.textContent = 'Назад к заказам';
 // backButton.onclick = function () {
     // filteredOrders = [];
     // renderOrders();
     // document.getElementById('button-container').removeChild(backButton);
 // };
 // const backButtonContainer = document.getElementById('button-container');
   // backButtonContainer.innerHTML = '';
   // backButtonContainer.appendChild(backButton);
//}

function renameOrder(orderId) {
  const orderIndex = orders.findIndex(order => order.id === orderId);

  if (orderIndex !== -1) {
      const orderToUpdate = orders[orderIndex];
      const updatedCustomerName = prompt(`Текущее имя клиента: ${orderToUpdate.customerName}\nВведите новое имя клиента:`) || orderToUpdate.customerName;
      const updatedOrder = {
          ...orderToUpdate,
          customerName: updatedCustomerName,
      };

      orders[orderIndex] = updatedOrder;

      const filteredOrderIndex = filteredOrders.findIndex(order => order.id === orderId);
      if (filteredOrderIndex !== -1) {
          filteredOrders[filteredOrderIndex] = updatedOrder;
      }

      renderOrders();
      saveOrders();
      
  } else {
      alert('Не удалось найти заказ с указанным ID.');
  }
}

function deleteOrder(orderId) {
  const confirmed = confirm('Вы уверены, что хотите удалить этот заказ?');
  if (confirmed) {
      const orderIndex = orders.findIndex(order => order.id === orderId);

      if (orderIndex !== -1) {
          const deletedOrder = orders.splice(orderIndex, 1)[0];
          deletedOrders.push(deletedOrder);
          saveOrders(); 
          saveDeletedOrders(); 
          renderOrders();
      } else {
          alert('Заказ не найден.');
      }
  }
}

function closeOrder(orderId) {
  const orderIndex = orders.findIndex(order => order.id === orderId);

  if (orderIndex !== -1) {
      orders[orderIndex].status = 'Готов';
      renderOrders();
      saveOrders();
  } else {
      alert('Не удалось найти заказ с указанным ID.');
  }
}

function editOrder(orderId) {
  const orderIndex = orders.findIndex(order => order.id === orderId);

  if (orderIndex !== -1) {
      const orderToUpdate = orders[orderIndex];

      const updatedCardNumber = prompt(`Текущий номер карты: ${orderToUpdate.cardNumber}\nВведите новый номер карты:`) || orderToUpdate.cardNumber;
      const updatedOrderNumber = prompt(`Текущий номер заказа: ${orderToUpdate.orderNumber}\nВведите новый номер заказа:`) || orderToUpdate.orderNumber;
      const updatedAmount = parseFloat(prompt(`Текущая сумма: ${orderToUpdate.amount}\nВведите новую сумму:`)) || orderToUpdate.amount;
      const updatedCustomerName = prompt(`Текущее имя клиента: ${orderToUpdate.customerName}\nВведите новое имя клиента:`) || orderToUpdate.customerName;
      const updatedComment = prompt(`Текущий комментарий: ${orderToUpdate.comment}\nВведите новый комментарий:`) || orderToUpdate.comment;

      const updatedOrder = {
          ...orderToUpdate,
          cardNumber: updatedCardNumber,
          orderNumber: updatedOrderNumber,
          amount: updatedAmount,
          customerName: updatedCustomerName,
          comment: updatedComment,
      };

      orders[orderIndex] = updatedOrder;

      const filteredOrderIndex = filteredOrders.findIndex(order => order.id === orderId);
      if (filteredOrderIndex !== -1) {
          filteredOrders[filteredOrderIndex] = updatedOrder;
      }

      renderOrders();
      saveOrders();
      
  } else {
      alert('Не удалось найти заказ с указанным ID.');
  }
}

function renderDeletedOrders() {
  const deletedOrdersTableBody = document.getElementById('deleted-orders-table-body');
  deletedOrdersTableBody.innerHTML = '';

  deletedOrders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${order.cardNumber}</td>
          <td>${order.orderNumber}</td>
          <td>${order.amount}</td>
          <td>${order.customerName}</td>
          <td>${order.status}</td>
          <td>${order.comment}</td>
          <td>
              <button onclick="restoreOrder(${order.id})">Восстановить</button>
              
          </td>
      `;
      deletedOrdersTableBody.appendChild(row);
  });
}

function toggleDeletedOrdersVisibility() {
  const deletedOrdersContainer = document.getElementById('deleted-orders-container');
  if (deletedOrdersContainer.style.display === 'none') {
      renderDeletedOrders();
      deletedOrdersContainer.style.display = 'block';
  } else {
      deletedOrdersContainer.style.display = 'none';
  }
}

function clearDeletedOrdersHistory() {
  if (deletedOrders.length > 0) {
      const confirmed = confirm('Вы уверены, что хотите очистить историю удаленных заказов?');
      if (confirmed) {
          deletedOrders = [];
          saveDeletedOrders(); 
          renderDeletedOrders();
      }
  } else {
      alert('История удаленных заказов уже пуста.');
  }
}

function restoreOrder(orderId) {
  const confirmed = confirm('Вы уверены, что хотите восстановить этот заказ?');
  if (confirmed) {
      const orderIndex = deletedOrders.findIndex(order => order.id === orderId);

      if (orderIndex !== -1) {
          const restoredOrder = deletedOrders.splice(orderIndex, 1)[0];
          orders.push(restoredOrder);

          saveOrders();
          saveDeletedOrders();

          renderOrders();
          renderDeletedOrders();
      } else {
          alert('Не удалось найти удалённый заказ с указанным ID.');
      }
  }
}

function saveOrders() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

function saveDeletedOrders() {
  localStorage.setItem('deletedOrders', JSON.stringify(deletedOrders));
}

renderOrders();
