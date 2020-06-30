import React from 'react';
import ReactDOM from 'react-dom';
import ListCurrency from './List-Currency';

describe('Teste do componente de Listagem de moedas', () => {

  it('Renderiza componente', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ListCurrency />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

});
