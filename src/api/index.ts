import axios from 'axios';
import { APIConfiguration } from '@/configs/api.config';

interface Data{
  title: string;
  completed: boolean;
}

interface QueryParams {
  completed?: boolean; 
  page?: number;      
  limit?: number;     
  sort?: string;      
  order?: 'asc' | 'desc'; 
  nextCursor?: number;     
}


export const customAxios = axios.create({
  baseURL: APIConfiguration.baseURL,
  headers: {
    'API-Key': APIConfiguration.APIKey,
    'Content-Type': 'application/json',
  },
});

export const fetchData = async (endpoint:string, params:QueryParams) => {
  try {
    const response = await customAxios.get(endpoint, {
      params:{
        completed: params.completed,
        page: params.page,
        limit: params.limit,
        sort: params.sort,
        order: params.order,
        nextCursor: params.nextCursor,
      }
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; 
  }
};

export const createData = async (endpoint:string, data:Data) => {
  try {
    const response = await customAxios.post(endpoint, data);
    return response.data; 
  } catch (error) {
    console.error('Error creating data:', error);
    throw error;
  }
};

export const updateData = async (endpoint:string, data:Data) => {
  try {
    const response = await customAxios.put(endpoint, data);
    return response.data; 
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

export const deleteData = async (endpoint:string) => {
  try {
    const response = await customAxios.delete(endpoint);
    return response.data; 
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};