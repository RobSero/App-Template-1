import React from 'react'
import { Slider, InputNumber, Row, Col } from 'antd'
import Button from '@material-ui/core/Button'
import ConfirmationModal from './Modal'
import { Alert } from 'antd'
import ReviseOrderModal from './ReviseOrderModal'

function InvestmentCalculator(props){
  const propValue = props.current_valuation
  const propRent = props.rental_value
  const investment = props.investment
  const existingOrder = props.existingOrderData



  if (!props){
    return null
  }

  return (
    <div style={{ backgroundColor: 'white', textAlign: 'center' }}>
      <p style={{ backgroundColor: 'blue', width: '100%', height: '25px', color: 'white' }}>InvestmenT CALCULATOR</p>
      {existingOrder ? <Alert message={`You have an investment of £${existingOrder.investment} in this property, but you can still edit your existing investment`} type="info" style={{ margin: '5px 15px' }} /> : '' }

      <p>Use the calculator to find which investment strategy is right for you</p>
      {/* CALCULATOR ADAPTS BASED ON IF THERE IS AN EXISTING ORDER */}
      {!existingOrder ?   
        <div style={{ padding: '15px' }}>
          <Row style={{ margin: '20px 0 15px 15px' }}>
            <Col span={19}>
              <Slider
                min={10000}
                max={propValue}
                onChange={(e)=>{
               
                  props.handleChange({ target: { name: 'investment', value: e } })
                }}
                value={typeof investment === 'number' ? investment : 0}
              />
            </Col>
            <Col span={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
              <InputNumber
                min={10000}
                max={250000}
            
                value={typeof investment === 'number' ? investment : 0}
              />
            </Col>
          </Row>
          <div>
            <Row style={{ margin: '15px' }}>
              <p>Current Value: £{propValue}</p>
              <p style={{ marginLeft: '25px', fontWeight: 700 }}>Your Ownership: {(( investment / propValue ) * 100).toFixed(2)}%</p>
            </Row>
            <Row style={{ margin: '15px' }}>
              <p>Current Rental: £{propRent}</p>
              <p style={{ marginLeft: '25px', fontWeight: 700 }}>Your Monthly Rental: £{(( investment / propValue ) * propRent).toFixed(2)}pcm</p>
            </Row>
            <p>Please note there will be a 1% fee to your investment upon opening this order and withdrawal of investment </p>
            <ConfirmationModal handleNewOrderSubmit = {props.handleNewOrderSubmit} clearData={props.clearData} investment={investment}/>
          </div>
        </div> :   


        <div style={{ padding: '15px' }}>
          <Row style={{ margin: '20px 0 15px 15px' }}>
            <Col span={19}>
              <Slider
                min={10000}
                max={propValue}
                onChange={(e)=>{
                  props.handleChangeRevisedOrder({ target: { name: 'changedOrder', value: existingOrder.investment - e } })
                  props.handleChange({ target: { name: 'investment', value: e } })
                }}
                value={typeof investment === 'number' ? investment : 0}
                
              />
            </Col>
            <Col span={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
              <InputNumber
                min={10000}
                max={250000}
                value={typeof investment === 'number' ? investment : 0}
                onChange={(e)=>{
                  props.handleChangeRevisedOrder({ target: { name: 'changedOrder', value: existingOrder.investment - e } })
                  props.handleChange({ target: { name: 'investment', value: e } })
                }}
                
              />
            </Col>
          </Row>
          <div>
            <Row style={{ margin: '15px' }}>
              <p>You currently own {(existingOrder.ownership * 100).toFixed(2)}% of this property</p>
            </Row>
            <Row style={{ margin: '15px' }}>
              {investment - existingOrder.investment !== 0 ? 
                <p>{investment - existingOrder.investment > 0 ? <span style={{ color: 'green' }}>You are increasing your investment by</span> : <span style={{ color: 'red' }}>You are decreasing your investment by</span>}  £{Math.abs(investment - existingOrder.investment)}</p> : ''
              }
              {investment - existingOrder.investment === 0 ? <p>No Change to your investment</p> : '' }
            </Row>
            {investment - existingOrder.investment !== 0 ? <><Row style={{ margin: '15px' }}>
              <p>Current Value: £{propValue}</p>
              <p style={{ marginLeft: '25px', fontWeight: 700 }}>Your NEW Ownership: {(( investment / propValue ) * 100).toFixed(2)}%</p>
            </Row>
            <Row style={{ margin: '15px' }}>
              <p>Current Rental: £{propRent}</p>
              <p style={{ marginLeft: '25px', fontWeight: 700 }}>Your NEW Monthly Rental: £{(( investment / propValue ) * propRent).toFixed(2)}pcm</p>
            </Row></> : '' }
            
            <p>Please note there will be a 1% fee to your investment upon opening this order and withdrawal of investment </p>
            <ReviseOrderModal 
              handleNewOrderSubmit = {props.handleNewOrderSubmit} 
              clearData={props.clearData} 
              investment={investment}
              handleRevisedOrderSubmit={props.handleRevisedOrderSubmit}  
              handleWithdrawAll={props.handleWithdrawAll}
            />
          </div>
        </div> 
      }
    
      
    </div>
  )
}

export default InvestmentCalculator