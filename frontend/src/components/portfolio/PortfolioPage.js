import React from 'react'
import { List, Space } from 'antd'
import { CarOutlined, ReloadOutlined, PoundCircleOutlined , FileOutlined } from '@ant-design/icons'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { getOrders, watchToggle, getWatchlist } from '../../lib/api'
import SearchSection from '../common/SearchSection'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinners'
import { loadingTimer } from '../../lib/settings'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import { isAuthenticated } from '../../lib/auth'

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
)

//  Gathers and displays all user's current orders and displays value changes 
class PortfolioPage extends React.Component {
  state={
    orderData: null,
    filterData: {
      region: null,
      price: null,
      outdoorSpace: null,
      finish: null,
      type: null
    },
    watching: null,
    filteredOrders: null
  }
  
  // Gather users watchlist and current orders
  async componentDidMount(){
    setTimeout(async()=> {
      try {
        const res = await getOrders()
        const watchRes = await getWatchlist()
        // map the watched properties prior to setting state as only the id of each property is required.
        const watchingArray = watchRes.data.map(watchedProperty => { 
          return watchedProperty.id
        })
        // formatting dates of when the orders were made prior to setting state
        const portfolioFormatted = res.data.map(order => {
          const date = new Date(order.created_at)
          order.created_at = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
          return order
        })
        this.setState({
          orderData: portfolioFormatted,
          filteredOrders: portfolioFormatted,
          watching: watchingArray
        })
      } catch (err){
        console.log(err)
      }
    }, loadingTimer ) // small timeout set so page does not transition too quickly and feel unnatural
  }

  // Set state of filtered data when user selects - a delay of 1s prior to list updating
handleChange = ({ target }) => {
  this.setState({
    filterData: {
      ...this.state.filterData,
      [target.name]: target.value
    }
  })
  setTimeout(()=>{
    this.filteredOrders()
  },1000)
}

// Handles revising the list of properties shown based on the filtered criteria
filteredOrders = () => {
  const { orderData  } = this.state
  const { region, price, outdoorSpace, finish, type } = this.state.filterData
  let max,min
  switch (price) {
    case 1: max = 100000; min = 0; break
    case 2: max = 250000; min = 100000; break
    case 3: max = 500000; min = 250000; break
    case 4: max = 1500000; min = 500000; break
    default: max = 1500000; min = 0
  }
  
  const filteredOrderList = orderData.filter(order => {
    return (order.property_detail.region === region || region  === null) &&
    (order.property_detail.outdoor_space === outdoorSpace || outdoorSpace === null) &&
    (order.property_detail.finish === finish || finish === null) &&
    (order.property_detail.prop_type === type || type === null) &&
    order.property_detail.current_valuation < max && order.property_detail.current_valuation > min 
  })
  this.setState({ filteredOrders: filteredOrderList })
}

// handles watch/unwatch when user clicks on heart icon. Re-retrieves watchlist from database after
handleWatch = async(propertyId) => {
  await watchToggle(propertyId)
  const watchRes = await getWatchlist()
  // map the watched properties prior to setting state as only the id of each property is required.
  const watchingArray = watchRes.data.map(watchedProperty => {
    return watchedProperty.id
  })
  this.setState({
    watching: watchingArray
  })
}

notAuthRedirectHome = () => {
  this.props.history.push('/')
  window.location.reload(true)
}

render(){
  // Check if Auth
  if (!isAuthenticated()){
    this.notAuthRedirectHome()
  }
  // Temporary loading screen
  if (!this.state.filteredOrders) {
    return <LoadingSpinner />
  }
    
  return (
    <>
      <div className='centered'>
        <h1 className='page-title'>Your Portfolio</h1>
      </div>
      {/* Search and Filter Section */}
      <div className='centered shadow' style = {{ backgroundColor: 'white', margin: '15px 30px', padding: '10px' }}>
        <SearchSection handleChange={this.handleChange} {...this.state.filterData} />
      </div>

      {/* Property List - filtered by the state filteredOrders */}
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: page => {
            console.log(page)
          },
          pageSize: 5
        }}
        dataSource={this.state.filteredOrders}
        style = {{ margin: '15px' }}
        renderItem={order => (
          <List.Item
            className='shadow'
            style = {{  backgroundColor: 'white', margin: '15px', border: order.value_change !== 0 ? `${order.value_change > 0 ? 'thin solid green' : 'thin solid red' }`  : '' }}
            // PROPERTY MAP KEY
            key={order.id}
            // PRICE, WATCH, RENT
            actions={[
              <IconText icon={PoundCircleOutlined} text={`£${order.property_detail.current_valuation.toLocaleString(undefined, {
                maximumFractionDigits: 2
              })}`} key="list-vertical-star-o" />,
              <IconText icon={ReloadOutlined} text={`£${order.property_detail.rental_value}pcm`} key="list-vertical-like-o" />,
              <IconText icon={FileOutlined} text={order.property_detail.bedrooms} key="list-vertical-message" />,
              <IconText icon={CarOutlined} text={order.property_detail.parking} key="list-vertical-message" />
            ]}
            // MAIN PHOTO HERE
            extra={
              <Link to={`property/${order.property_detail.id}`}>
                <img
                  width={272}
                  alt="logo"
                  src={order.property_detail.image_main}
                />
              </Link>
            }
          >
            <List.Item.Meta
              // HEART BUTTON - WATCHLIST TOGGLE
              avatar={this.state.watching.includes(order.property_detail.id) ? <FavoriteIcon className='watch-buttons' onClick = {() =>{
                this.handleWatch(order.property_detail.id)
              }} /> : <FavoriteBorderIcon className='watch-buttons' onClick = {() =>{
                this.handleWatch(order.property_detail.id)
              }} />}
              // PROPERTY TITLE
              title={<><Link to={`property/${order.property_detail.id}`}><span>{order.property_detail.title}</span></Link><span style={{  color: order.value_change !== 0 ? `${order.value_change > 0 ? ' green' : ' red' }`  : 'blue' }}>:  {order.value_change.toFixed(2)}% </span>
                {order.value_change !== 0 ? order.value_change > 0 ? <ArrowUpwardIcon style={{ fontSize: 'small', fill: 'green' }} /> : <ArrowDownwardIcon style={{ fontSize: 'small', fill: 'red'  }} /> : ''}</>}
              // PROPERTY DESCRIPTION
              description={order.property_detail.address}
            />
            {/* INFORMATION ABOUT THE USER'S INVESTMENT COMPARED TO THE MARKET VALUES */}
            <p>You invested in this property on <span style={{ fontWeight: '800' }}>{order.created_at}</span> at a valuation of :<span style={{ fontWeight: '800' }}> £{order.value_at_time.toLocaleString(undefined, {
              maximumFractionDigits: 2
            })}</span></p>
            {order.value_change !== 0 ? 
              <p>Your rental income from this property has {order.value_change > 0 ? <span style={{ color: 'green',fontWeight: '800'  }}>increased </span> : <span style={{ color: 'red',fontWeight: '800'  }}>decreased </span>  } to<span style={{ fontWeight: '800' }}> £{(order.ownership * order.property_detail.rental_value).toLocaleString(undefined, {
                maximumFractionDigits: 2
              })}pcm </span> </p> : <p>Your rental income from this property remains at <span style={{ fontWeight: '800' }}>£{(order.ownership * order.property_detail.rental_value).toLocaleString(undefined, {
                maximumFractionDigits: 2
              })}pcm </span> </p> 
            }
            
          </List.Item>
        )}
      />
    </>
      
  )
}
}

export default PortfolioPage






