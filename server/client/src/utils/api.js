// travel_software/src/utils/api.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is not set');
}

const fetchWithErrorHandling = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error(`Error with request to ${url}:`, error);
    throw new Error(error.message || 'An error occurred during the request');
  }
};

export const login = async (credentials) => {
  if (!credentials?.username || !credentials?.password) {
    throw new Error('Username and password are required');
  }

  const url = `${API_URL}/users/login`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include',
  };

  try {
    const response = await fetchWithErrorHandling(url, options);
    if (response.token) {
      localStorage.setItem('token', response.token);
      return { 
        success: true, 
        data: response 
      };
    } else {
      throw new Error('No token received from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

export const fetchTravelEntries = async (agencyFilter, startDate, endDate) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  let url = `${API_URL}/travels`;
  const queryParams = [];

  if (agencyFilter) {
    queryParams.push(`agency=${encodeURIComponent(agencyFilter)}`);
  }

  if (startDate && endDate) {
    queryParams.push(`startDate=${startDate.toISOString()}`);
    queryParams.push(`endDate=${endDate.toISOString()}`);
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }

  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  try {
    const data = await fetchWithErrorHandling(url, options);
    return data;
  } catch (error) {
    console.error('Error fetching travel entries:', error);
    throw error;
  }
};

export const addTravelEntry = async (entryData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const url = `${API_URL}/travels`;
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entryData),
    credentials: 'include',
  };

  try {
    const data = await fetchWithErrorHandling(url, options);
    return data;
  } catch (error) {
    console.error('Error adding travel entry:', error);
    throw error;
  }
};

export const fetchCurrentInvoice = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const url = `${API_URL}/invoice/current`; // Endpoint to fetch the current invoice number
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  try {
    const response = await fetchWithErrorHandling(url, options);
    return response.invoiceNumber;
  } catch (error) {
    console.error('Error fetching current invoice:', error);
    throw error;
  }
};


export const updateTravelEntry = async (id, entryData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const url = `${API_URL}/travels/${id}`;
  const options = {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entryData),
    credentials: 'include',
  };

  try {
    const data = await fetchWithErrorHandling(url, options);
    return data;
  } catch (error) {
    console.error('Error updating travel entry:', error);
    throw error;
  }
};

export const deleteTravelEntry = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const url = `${API_URL}/travels/${id}`;
  const options = {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  try {
    const data = await fetchWithErrorHandling(url, options);
    return data;
  } catch (error) {
    console.error('Error deleting travel entry:', error);
    throw error;
  }
};