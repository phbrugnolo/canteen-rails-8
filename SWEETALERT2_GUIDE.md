# SweetAlert2 Integration Guide

Esta aplicação foi atualizada para usar SweetAlert2 em vez de modais customizados do Bootstrap. Isso oferece uma interface mais moderna e consistente.

## Configuração

O SweetAlert2 está configurado nos seguintes arquivos:
- `app/javascript/src/sweetalert.js` - Configuração base e funções básicas
- `app/javascript/src/rails-sweetalert-helpers.js` - Helpers específicos para Rails
- `app/javascript/src/dependencies.js` - Importações necessárias

## Funções Disponíveis

### Funções Básicas

```javascript
// Diálogo de confirmação genérico
showConfirmDialog({
  title: 'Título',
  text: 'Texto descritivo',
  icon: 'warning', // 'success', 'error', 'warning', 'info', 'question'
  confirmButtonText: 'Confirmar',
  cancelButtonText: 'Cancelar'
}).then((result) => {
  if (result.isConfirmed) {
    // Ação confirmada
  }
});

// Alertas simples
showSuccessAlert('Sucesso!', 'Operação realizada com sucesso');
showErrorAlert('Erro!', 'Algo deu errado');
showInfoAlert('Informação', 'Informação importante');
```

### Funções com Integração Rails

```javascript
// Confirmação de ativação
showRailsActivationDialog('produto', '/main/products/1/activate');

// Confirmação de desativação
showRailsDeactivationDialog('cliente', '/main/customers/1/deactivate');

// Confirmação de exclusão
showRailsDeleteDialog('item', '/main/items/1');

// Confirmação genérica com Rails
showRailsConfirmDialog({
  url: '/path/to/action',
  method: 'PATCH', // 'POST', 'PATCH', 'DELETE', etc.
  data: { custom: 'data' }, // dados adicionais para o formulário
  title: 'Confirmar ação',
  text: 'Deseja continuar?',
  confirmButtonText: 'Sim'
});
```

### Exemplo de Uso em ERB

```erb
<!-- Botão que chama função SweetAlert2 -->
<button type="button" class="btn btn-danger" onclick="confirmDelete()">
  Excluir
</button>

<script>
  function confirmDelete() {
    showRailsDeleteDialog('item', '<%= item_path(@item) %>');
  }
</script>
```

### Mensagens Pós-Ação

Para mostrar mensagens após submissão de formulários (útil em controladores):

```javascript
// Em caso de sucesso
showPostActionSuccess('Item excluído com sucesso', '/items');

// Em caso de erro
showPostActionError('Não foi possível excluir o item');
```

## Migração de Modais Existentes

### Antes (Modal Bootstrap)
```erb
<!-- Modal HTML -->
<div id="confirmModal" class="modal">
  <!-- conteúdo do modal -->
</div>

<!-- Botão -->
<button onclick="showModal('confirmModal')">Ação</button>

<script>
  function showModal(id) {
    document.getElementById(id).style.display = 'block';
  }
</script>
```

### Depois (SweetAlert2)
```erb
<!-- Apenas o botão -->
<button onclick="confirmAction()">Ação</button>

<script>
  function confirmAction() {
    showRailsConfirmDialog({
      url: '<%= action_path %>',
      method: 'PATCH',
      title: 'Confirmar',
      text: 'Deseja realizar esta ação?'
    });
  }
</script>
```

## Personalização

Para personalizar o estilo, edite `app/javascript/src/sweetalert.js`:

```javascript
const AppSwal = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary me-2',
    cancelButton: 'btn btn-secondary'
  },
  buttonsStyling: false,
  // outras opções...
});
```

## Benefícios

1. **Interface mais moderna**: SweetAlert2 oferece animações suaves e design responsivo
2. **Menos código**: Não é necessário criar HTML para cada modal
3. **Consistência**: Todas as confirmações têm o mesmo visual
4. **Acessibilidade**: SweetAlert2 tem melhor suporte a acessibilidade
5. **Responsivo**: Funciona bem em dispositivos móveis
