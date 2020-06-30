import React, { useState } from 'react';
import './Currency-Conversor.css';
import { Jumbotron, Button, Form, Col, Spinner, Alert, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import ListCurrency from './List-Currency';
import axios from 'axios';

function CurrencyConversor() {

  const FIXER_URL = 'http://data.fixer.io/api/latest?access_key=e059111ece5ae6ade8786803e2b5e4eb';

  const [valor, setValor] = useState('1');
  const [cFrom, setcFrom] = useState('BRL');
  const [cTo, setcTo] = useState('USD');
  const [result, setresult] = useState('');
  const [showSpinner, setSpinner] = useState(false);
  const [showError, setshowError] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const [validatedForm, setvalidatedForm] = useState(false);

  function handleValor(event){
    setValor(event.target.value.replace(/\D/g,''));
  }

  function handlecFrom(event){
    setcFrom(event.target.value);
  }

  function handlecTo(event){
    setcTo(event.target.value);
  }

  function converter(event){
    event.preventDefault();
    setvalidatedForm(true);
    if (event.currentTarget.checkValidity() === true){
      setSpinner(true);
      axios.get(FIXER_URL)
        .then(res => {
            const cotacao = obterCotacao(res.data);
            if (cotacao) {
              setresult(`${valor} ${cFrom} = ${cotacao} ${cTo}`);
              setshowModal(true);
              setSpinner(false);
              setshowError(false);
            }
            else {
               handleError();
            }
        }).catch(err => handleError());
    }
  }

  function obterCotacao(dadosCotacao){
    if (!dadosCotacao || dadosCotacao.success !== true){
      return false;
    }
    const moedaDe = dadosCotacao.rates[cFrom];
    const moedaPara = dadosCotacao.rates[cTo];
    const cotacao = ( 1 / moedaDe * moedaPara ) * valor;
    return cotacao.toFixed(2);
  }

  function handleFecharModal(){
    setValor(1);
    setcFrom('BRL');
    setcTo('USD');
    setresult('');
    setSpinner(false);
    setshowModal(false);
    setvalidatedForm(false);
    setshowError(false);
  }

  function handleError(){
    setSpinner(false);
    setshowModal(false);
    setshowError(true);
    setvalidatedForm(false);
  }

  function handleExibirModal(){
    setshowModal(true);
  }

  return (
    <div>
      <h1>Conversor de Moedas</h1>
      <Alert variant="danger" show={showError}>
        Erro obtendo dados de convesão. Tente novamente.
      </Alert>
      <Jumbotron>
        <Form onSubmit={converter} noValidate validated={validatedForm}>
          <Form.Row>
            <Col sm="3">
              <Form.Control
                placeholder="0"
                value={valor}
                onChange={handleValor}
                required />
            </Col>
            <Col sm="3">
              <Form.Control as="select"
                value={cFrom}
                onChange={handlecFrom}>
                <ListCurrency />
              </Form.Control>
            </Col>
            <Col sm="1" className="text-center" style={{paddingTop:'5px'}}>
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </Col>
            <Col sm="3">
              <Form.Control as ="select"
                value={cTo}
                onChange={handlecTo}>
                <ListCurrency />
              </Form.Control>
            </Col>
            <Col sm="2">
              <Button variant="success" type ="submit" data-testid="btn-converter">
                <spam className={showSpinner ? null : 'hidden'}>
                  <Spinner animation="border" size="sm" />
                </spam>
                <spam className={showSpinner ? 'hidden' : null}>
                  Converter
                </spam>
              </Button>
            </Col>
          </Form.Row>
        </Form>
        <Modal show={showModal} onHide={handleFecharModal} data-testid="modal-result">
          <Modal.Header closeButton>
            <Modal.Title>Conversão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {result}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleFecharModal}>
              Nova conversão
            </Button>
          </Modal.Footer>
        </Modal>
      </Jumbotron>
    </div>
  );
}

export default CurrencyConversor;
