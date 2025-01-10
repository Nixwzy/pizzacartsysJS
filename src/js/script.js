// variáveis de escopo

let cart = []; // lista do cart
let modalQt = 1; // qtd selecionadas no modal
let modalKey = 0; // key do item no modal

// seleção de elementos

const select = (element) => document.querySelector(element);
const selectAll = (element) => document.querySelectorAll(element);

// listagem

pizzaJson.map((item, index) => {
  // percorre o array e cria a estrutura de cada pizza
  let pizzaItem = select('.models .pizza-item').cloneNode(true); // clona o modelo

  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price
    .toFixed(2)
    .replace('.', ',')}`;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
  pizzaItem.querySelector('a').addEventListener('click', (e) => {
    // adiciona o item correspondente ao JSON no modal
    e.preventDefault(); // previne a tag <a> recarregar a página
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    modalQt = 1; // reinicia a quantidade de pizzas para 1 sempre que abrir um novo modal
    modalKey = key;

    select('.pizzaBig img').src = pizzaJson[key].img; // imagem correspondente ao item
    select('.pizzaInfo h1').innerHTML = pizzaJson[key].name; // nome correspondente
    select('.pizzaInfo--desc').innerHTML = pizzaJson[key].description; // descrição correspondente
    select('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price
      .toFixed(2)
      .replace('.', ',')}`;
    select('.pizzaInfo--size.selected').classList.remove('selected'); // remove o selected anterior
    selectAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
      // identifica o index do tamanho das pizzas
      if (sizeIndex == 2) {
        size.classList.add('selected'); // define o selected para o index 2 (grande)
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    select('.pizzaInfo--qt').innerHTML = modalQt;

    select('.pizzaWindowArea').style.opacity = 0; // ao abrir o modal, a opacidade é 0 (invisível)
    select('.pizzaWindowArea').style.display = 'flex'; // mostra o modal, tirando do display: none
    setTimeout(() => {
      select('.pizzaWindowArea').style.opacity = 1; // torna a opacidade em 1 (visível) após 200 ms
    }, 200);
  });

  select('.pizza-area').append(pizzaItem); // adiciona a pizza clonada à área de pizzas na página
});

// eventos do modal

function closeModal() {
  select('.pizzaWindowArea').style.opacity = 0;
  setTimeout(() => {
    select('.pizzaWindowArea').style.display = 'none';
  }, 500);
}

selectAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(
  (item) => {
    item.addEventListener('click', closeModal);
  }
);
select('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if (modalQt > 1) {
    modalQt--;
    select('.pizzaInfo--qt').innerHTML = modalQt;
  }
});

select('.pizzaInfo--qtmais').addEventListener('click', () => {
  modalQt++;
  select('.pizzaInfo--qt').innerHTML = modalQt;
});

selectAll('.pizzaInfo--size').forEach((size) => {
  size.addEventListener('click', (e) => {
    select('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  });
});

//  evento de clique para adicionar ao carrinho

select('.pizzaInfo--addButton').addEventListener('click', () => {
  // obtém o tamanho selecionado da pizza
  let size = parseInt(
    select('.pizzaInfo--size.selected').getAttribute('data-key')
  );

  // cria um identificador único para o item no carrinho, combinando o ID da pizza e o tamanho
  let identifier = pizzaJson[modalKey].id + '-' + size;

  // verifica se o item já existe no carrinho
  let key = cart.findIndex((item) => item.identifier == identifier);

  if (key > -1) {
    // se o item já estiver no carrinho, incrementa a quantidade
    cart[key].qt += modalQt;
  } else {
    // se o item não estiver no carrinho, adiciona um novo item
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }
  closeModal();
  updateCart();
  //   console.log(cart); // dep
});

select('.menu-opener').addEventListener('click', () => {
  if (cart.length > 0) {
    select('aside').style.left = '0';
  }
});
select('.menu-closer').addEventListener('click', () => {
  select('aside').style.left = '100vw';
});

function updateCart() {
  select('.menu-opener span').innerHTML = cart.length;
  if (cart.length > 0) {
    // se o carrinho não estiver vazio
    select('aside').classList.add('show'); // mostra a barra lateral do carrinho
    select('.cart').innerHTML = ''; // limpa o conteúdo atual do carrinho

    // variáveis de preço
    let subtotal = 0;
    let discount = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt; // identifica o subtotal

      let cartItem = select('.models .cart--item').cloneNode(true);

      // switch pra substituir o index para tamanho p, m e g
      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'G';
          break;
      }

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

      // evento para diminuir a quantidade

      cartItem
        .querySelector('.cart--item-qtmenos')
        .addEventListener('click', () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1); // remove o item do carrinho se a quantidade for 1
          }
          updateCart();
        });

      // evento para aumentar a quantidade
      cartItem
        .querySelector('.cart--item-qtmais')
        .addEventListener('click', () => {
          cart[i].qt++;
          updateCart();
        });

      select('.cart').append(cartItem); // adiciona o item ao carrinho na página
    }

    discount = subtotal * 0.1; // aplica o desconto de 10%
    total = subtotal - discount;

    select('.subtotal span:last-child').innerHTML = `R$ ${subtotal
      .toFixed(2)
      .replace('.', ',')}`;
    select('.desconto span:last-child').innerHTML = `R$ ${discount
      .toFixed(2)
      .replace('.', ',')}`;
    select('.total span:last-child').innerHTML = `R$ ${total
      .toFixed(2)
      .replace('.', ',')}`;
  } else {
    select('aside').classList.remove('show'); // esconde a barra lateral se o carrinho estiver vazio
    select('aside').style.left = '100vw';
  }
}

// TODO - Price Rework: Different sizes, different prices.