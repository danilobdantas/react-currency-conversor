import React from 'react';
import ReactDOM from 'react-dom';
import CurrencyConversor from './Currency-Conversor';
import {render, fireEvent} from '@testing-library/react';
import axiosMock from 'axios';
import '@testing-library/jest-dom/extend-expect';

describe('Testes do Conversor de Moedas', () => {

  test('renderizar sem erro', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CurrencyConversor />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('Simular conversão de moedas', async () => {
    const { findByTestId, getByTestId } = render(<CurrencyConversor />);
    axiosMock.get.mockResolvedValueOnce({
      data: {success: true, rates: {BRL: 6.077264, USD: 1.12467}}
    });
    fireEvent.click(getByTestId('btn-converter'));
    const modal = await findByTestId('modal-result');
    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(modal).toHaveTextContent('1 BRL = 0.19 USD');
  });

});
