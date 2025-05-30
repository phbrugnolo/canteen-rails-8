/**
 * Exemplo de como criar filtros para uma nova página
 * Este arquivo serve como template/exemplo para futuras implementações
 */
import { FilterManager } from '../shared/filter_manager.js';

export class ExampleFilters {
  constructor() {
    this.init();
  }

  init() {
    // Só inicializa se estivermos na página correta
    const container = document.querySelector('#example-page');
    if (!container) return;

    // Configuração básica
    this.filterManager = new FilterManager({
      container: '#example-page',           // Container principal
      items: '.example-item',               // Seletor dos itens a filtrar
      noResultsMessage: 'Nenhum exemplo encontrado',
      debounceDelay: 300,                   // Delay para inputs de texto

      filters: [
        // Filtro simples por texto
        {
          input: '#search_name',
          selector: '.item-title',          // Busca no elemento .item-title
          matchType: 'includes'
        },

        // Filtro por atributo
        {
          input: '#search_category',
          attribute: 'data-category',       // Busca no atributo data-category
          matchType: 'equals'
        },

        // Filtro com função personalizada
        {
          input: '#search_price',
          getText: (item) => {
            const priceEl = item.querySelector('.price');
            if (!priceEl) return '';

            // Remove símbolos de moeda e converte para número
            const price = priceEl.textContent.replace(/[^\d,]/g, '').replace(',', '.');
            return parseFloat(price) || 0;
          },
          matchType: 'custom'               // Precisaria implementar lógica custom
        },

        // Filtro de data
        {
          input: '#search_date',
          getText: (item) => {
            const dateEl = item.querySelector('.item-date');
            if (!dateEl) return '';

            const dateText = dateEl.textContent;
            // Converte DD/MM/YYYY para YYYY-MM-DD se necessário
            if (dateText.includes('/')) {
              const [day, month, year] = dateText.split('/');
              return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
            return dateText;
          },
          matchType: 'date'
        },

        // Filtro por múltiplos campos (busca em nome OU descrição)
        {
          input: '#search_global',
          getText: (item) => {
            const title = item.querySelector('.item-title')?.textContent || '';
            const desc = item.querySelector('.item-description')?.textContent || '';
            return `${title} ${desc}`.toLowerCase();
          },
          matchType: 'includes'
        }
      ]
    });

    // Callback personalizado após filtrar
    this.filterManager.onFilter = (visibleCount) => {
      this.updateResultsCounter(visibleCount);
    };
  }

  updateResultsCounter(count) {
    const counter = document.querySelector('#results-counter');
    if (counter) {
      counter.textContent = `${count} resultado(s) encontrado(s)`;
    }
  }
}

// ================================
// EXEMPLO DE HTML CORRESPONDENTE:
// ================================
/*
<div id="example-page">
  <div class="filters">
    <input type="text" id="search_name" placeholder="Buscar por nome">
    <select id="search_category">
      <option value="">Todas as categorias</option>
      <option value="categoria1">Categoria 1</option>
    </select>
    <input type="text" id="search_price" placeholder="Preço máximo">
    <input type="date" id="search_date">
    <input type="text" id="search_global" placeholder="Busca geral">
  </div>

  <div id="results-counter"></div>

  <div class="items-container">
    <div class="example-item" data-category="categoria1">
      <h3 class="item-title">Nome do Item</h3>
      <p class="item-description">Descrição do item</p>
      <span class="price">R$ 29,90</span>
      <span class="item-date">25/05/2025</span>
    </div>
    <!-- mais itens... -->
  </div>
</div>
*/
