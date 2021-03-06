import { PageHeader, Statistic,  Row } from 'antd'
import React from 'react'

function PropertyHeader(props){
  const currentVal = props.current_valuation
  const valueAtInvestment = props.orderData ?  props.orderData.value_at_time : 0
  return (
    <div>
      <PageHeader
        onBack={() => window.history.back()}
        title={props.title}
        extra={
          <Row>
            {props.orderData ? <><Statistic 
              title="Change" 
              value={`${(((currentVal / valueAtInvestment) * 100) - 100).toFixed(2)}%`} 
              valueStyle={{ color: currentVal === valueAtInvestment ? 'blue' : currentVal > valueAtInvestment ? 'green' : 'red' }} 
              style={{ margin: '0 20px' } }/> 
            <Statistic title="Your Ownership" value={`${(props.orderData.ownership * 100).toLocaleString(undefined, {
              maximumFractionDigits: 2
            })}%`} style={{
              margin: '0 20px'
            }} /></> : ''
            }
            <Statistic title="Current Value" prefix="£" value={props.current_valuation.toLocaleString(undefined, {
              maximumFractionDigits: 2
            })} style={{
              margin: '0 20px'
            }} />
            <Statistic title="Rental Value" prefix="£" value={`${props.rental_value.toLocaleString(undefined, {
              maximumFractionDigits: 2
            })}pcm`} style={{
              margin: '0 20px'
            }} />
          </Row>
        }
      >
      </PageHeader>
    </div>
  )
}

export default PropertyHeader