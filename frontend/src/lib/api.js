import axios from 'axios'
import { getToken, getUserId } from './auth'


const baseUrl = '/api'

export const withHeaders = () => {
  return {
    headers: { Authorization: `Bearer ${getToken()}` }
  }
}

export const getProfile = async() => {
  return await axios.get(`${baseUrl}/auth/user/`, withHeaders())
}

export const getProperties = async() => {
  return await axios.get(`${baseUrl}/property/`, withHeaders())
}