// seleção de elementos
const select = (element) => document.querySelector(element);
const selectAll = (element) => document.querySelectorAll(element);

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
    // previne a tag <a> recarregar a página e adiciona a interação do modal
    e.preventDefault();
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    select('.pizzaBig img').src = pizzaJson[key].img;
    select('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    select('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;

    select('.pizzaWindowArea').style.opacity = 0; // ao clicar a opacidade do modal é 0 (invisível)
    select('.pizzaWindowArea').style.display = 'flex'; // mostra o modal, tirando do display: none
    setTimeout(() => {
      select('.pizzaWindowArea').style.opacity = 1; // torna a opacidade em 1 (visível) após 200 ms
    }, 200);
  });

  select('.pizza-area').append(pizzaItem); // adiciona o item da pizza na página
});
