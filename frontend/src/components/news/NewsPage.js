import React from 'react'
import { notification } from 'antd'
import { SmileOutlined } from '@ant-design/icons'
import NewsHeader from './NewsHeader'
import NewsLoading from './NewsLoading'

class NewsPage extends React.Component {
  state={

  }

  componentDidMount(){
    this.openNotification()
  }

  openNotification = () => {
    notification.open({
      message: 'This part of the site is under construction!',
      description:
        'Check back in soon for all your property and investing news.',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />
    })
  };

  render(){
    return (
      <div style={{ overflowY: 'scroll',overflowX: 'hidden', height: '90vh', position: 'relative', width: '100%' }}>
        <div style = {{ backgroundColor: 'white', margin: '15px 30px' }} className='shadow'>
          <NewsHeader  />
        </div>
        <div style = {{ backgroundColor: 'white', margin: '15px 30px' }} className='shadow'>
          <NewsLoading />
        </div>
        <div style = {{ backgroundColor: 'white', margin: '15px 30px' }} className='shadow'>
          <NewsLoading />
        </div>
      </div>
      
     
      
      
    )
  }
}

export default NewsPage