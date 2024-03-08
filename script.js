$(".divEditar").hide();
$(".divExcluir").hide();

//bloquear scroll
function scrollBlock(event) {
  event.preventDefault();
}

function desactiveScroll() {
  document.addEventListener('wheel', scrollBlock, { passive: false });
}

function activeScroll() {
  document.removeEventListener('wheel', scrollBlock);
}

function setTop(){
  $(window).scrollTop(0);
}

// botoes
$(".butExclu").click(function(){
  $(".divExcluir").show();
})

$(".btnNao").click(function(){
  $(".divExcluir").hide();
  activeScroll()
})

$("#butEdit").click(function(){
  $(".divEditar").show();
})
$("#btnCancelar").click(function(){
  $(".divEditar").hide();
})

let id_selected = null
let item_selected = null
let items = null
// codigo do chat

// Função para carregar itens na tabela
function loadItems() {
  $.get('http://localhost:3000/api/items')
      .done(function (res) {
          // $('.grupoDados').empty();
          if (res.length > 0) {
            $('#vazio').css("display", "none");
          }

           items = res;

          $.each(res, function (index, item) {
              $('#grupos').append(`
              <div class="grupoDados" id="${item._id}">
                  <div class="conteudo">
                      <div class="conteudo">
                          <p>Nome:${item.nome}</p>
                      </div>
      
                      <div class="conteudo">
                          <p>Quantidade em Estoque:${item.estoque}</p>
                      </div>
      
                      <div class="conteudo">
                          <p>Preço:R$${item.preco}</p>
                      </div>
      
                      <div class="conteudoDescricao">
                          <p>Descrição:${item.descricao}</p>
                      </div>
      
                      <div class="iconesOpcoes">
                          <span class="butEdit" data-item-id="${item._id}"><i class="fi fi-tr-pen-square formato2"></i></span>
                          <span class="butExclu" data-item-id="${item._id}"><i class="fi fi-rs-trash formato"></i></span>
                      </div>
                  </div>
              </div>
              `);
            });
            $('.butExclu').on('click', function() {
              id_selected = $(this).data('item-id');
              // deletarItem(itemId)
              setTop()
              desactiveScroll()
              $(".divExcluir").show();
            });
            $('.butEdit').on('click', function() {
              id_selected = $(this).data('item-id');
              let index = items.findIndex(i => i._id == id_selected)
              abrirEdicao(items[index])
            });
      })
      .fail(function (error) {
          console.error('Erro ao carregar itens:', error);
          // Adicione aqui a lógica para lidar com o erro, como exibir uma mensagem de erro na interface do usuário.
      });
}

  // Carregar itens iniciais
  loadItems();

// Adicionar item

$('.btnAdicionar').click(function(){
    $(".divEditar").show();
    // var nome = $("#nome").val();
    // var estoque = $("#estoque").val();
    // var preco = $("#preco").val();
    // var descricao = $("#textArea").val();

    // $.post('/api/items', { nome,estoque,preco,descricao }, function () {
    //     loadItems();
    // });    

       // Limpar o formulário após adicionar
      //  $('#nome').val('');
      //  $('#descricao').val('');
     });

      // Editar item
    $(document).on('click', '.editBtn', function () { 
        const itemId = $(this).data('id');
});

function abrirEdicao(item) {
  setTop()
  desactiveScroll()
  $(".divEditar").show();

  $("#nome").val(item.nome),
  $("#estoque").val(item.estoque),
  $("#preco").val(item.preco),
  $("#textArea").val(item.textArea)

  document.querySelector("#btnSalvar").onclick = editarItem
}

function editarItem() {
  const body = {
    nome: $("#nome").val() || '',
    estoque: $("#estoque").val(),
    preco: $("#preco").val(),
    descricao: $("#textArea").val()
  };
  $.ajax({
    url: `http://localhost:3000/api/items/${id_selected}`,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(body),
    success: function() {
      window.location.reload()
      $(`.grupoDados#${id_selected}`).remove();
      console.log('item atualizado: ' + id_selected)
    }
  });
  activeScroll()
}

function adicionarItem() {
  const body = {
    nome: $("#nome").val(),
    estoque: $("#estoque").val(),
    preco: $("#preco").val(),
    descricao: $("#textArea").val()
  };
  console.log(body)
  $.post('http://localhost:3000/api/items', body)
  .done((item) => {
    $('#grupos').append(`
    <div class="grupoDados" id="${item._id}">
        <div class="conteudo">
            <div class="conteudo">
                <p>Nome:${item.nome}</p>
            </div>

            <div class="conteudo">
                <p>Quantidade em Estoque:${item.estoque}</p>
            </div>

            <div class="conteudo">
                <p>Preço:${item.preco}</p>
            </div>

            <div class="conteudoDescricao">
                <p>Descrição:${item.descricao}</p>
            </div>

            <div class="iconesOpcoes">
                <span class="butEdit" data-item-id="${item._id}"><i class="fi fi-tr-pen-square formato2"></i></span>
                <span class="butExclu" data-item-id="${item._id}"><i class="fi fi-rs-trash formato"></i></span>
            </div>
        </div>
    </div>
    `);
    $('.butExclu').on('click', function() {
      id_selected = $(this).data('item-id');
      // deletarItem(itemId)
      setTop()
      desactiveScroll()
      $(".divExcluir").show();
    });
    $('.butEdit').on('click', function() {
      id_selected = $(this).data('item-id');
      let index = items.findIndex(i => i._id == id_selected)
      abrirEdicao(items[index])
    });

    items.push(body)
  })

  $('#vazio').css("display", "none");
  $(".divEditar").hide();

  $("#nome").val(''),
  $("#estoque").val(''),
  $("#preco").val(''),
  $("#textArea").val('')
}

function deletarItem() {
  $.ajax({
    url: `http://localhost:3000/api/items/${id_selected}`,
    type: 'DELETE',
    success: function() {
      $(`.grupoDados#${id_selected}`).remove();
      console.log('item deletado: ' + id_selected)
    }
  });
  activeScroll()
}