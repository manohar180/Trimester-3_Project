import { API_CONFIG } from '../config/api';

export const weatherService = {
  async getCurrentWeather() {
    try {
      // Check if API key is available
      if (!API_CONFIG.WEATHER.API_KEY) {
        console.error('Weather API key is missing');
        throw new Error('Weather API key is not configured');
      }

      console.log('API Key:', API_CONFIG.WEATHER.API_KEY);
      console.log('Base URL:', API_CONFIG.WEATHER.BASE_URL);

      // First try to get user's location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      console.log('User location:', { latitude, longitude });

      const url = `${API_CONFIG.WEATHER.BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_CONFIG.WEATHER.API_KEY}`;
      console.log('Fetching weather from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Weather API error:', errorData);
        throw new Error(`Weather API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Weather data received:', data);
      return data;
    } catch (error) {
      console.error('Error in getCurrentWeather:', error);
      
      // If geolocation fails or API key is invalid, fall back to a default location
      try {
        console.log('Falling back to default location (New York)...');
        const fallbackUrl = `${API_CONFIG.WEATHER.BASE_URL}/weather?q=New York&units=metric&appid=${API_CONFIG.WEATHER.API_KEY}`;
        console.log('Fetching fallback weather from:', fallbackUrl);

        const response = await fetch(fallbackUrl);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Fallback weather API error:', errorData);
          throw new Error(`Weather API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('Fallback weather data received:', data);
        return data;
      } catch (fallbackError) {
        console.error('Error in fallback weather fetch:', fallbackError);
        return null;
      }
    }
  },

  getExerciseSuggestion(temperature) {
    if (!temperature) {
      return {
        suggestion: 'Weather data unavailable',
        exercises: ['Indoor Workouts', 'Gym Training', 'Yoga', 'Pilates']
      };
    }
    
    if (temperature < 10) {
      return {
        suggestion: 'Indoor workouts are best in this cold weather',
        exercises: ['Yoga', 'Weightlifting', 'HIIT', 'Pilates']
      };
    } else if (temperature < 20) {
      return {
        suggestion: 'Perfect weather for outdoor activities',
        exercises: ['Running', 'Cycling', 'Hiking', 'Outdoor Sports']
      };
    } else if (temperature < 30) {
      return {
        suggestion: 'Great weather for intense workouts',
        exercises: ['Swimming', 'Running', 'Tennis', 'Basketball']
      };
    } else {
      return {
        suggestion: 'Stay cool with these exercises',
        exercises: ['Swimming', 'Indoor Cycling', 'Yoga', 'Water Sports']
      };
    }
  }
}; 