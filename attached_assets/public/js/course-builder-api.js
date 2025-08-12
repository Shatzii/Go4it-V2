/**
 * Course Builder API Integration
 * 
 * This module handles all API requests for the course builder, including
 * saving/loading courses and AI-powered course adaptations via the
 * hosted AI academic engine.
 */

const CourseBuilderAPI = (function() {
  // Base URL for API requests
  const API_BASE_URL = '/api/course-builder';
  
  /**
   * Make an API request
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method
   * @param {Object} data - Request data
   * @returns {Promise} - Promise with response data
   */
  async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  
  return {
    /**
     * Check if AI engine is available
     * @returns {Promise<boolean>} - Whether AI engine is available
     */
    checkAIStatus: async function() {
      try {
        const response = await apiRequest('/ai-status');
        return response.available;
      } catch (error) {
        console.error('Failed to check AI status:', error);
        return false;
      }
    },
    
    /**
     * Get all courses
     * @returns {Promise<Array>} - Array of courses
     */
    getCourses: async function() {
      try {
        const response = await apiRequest('/courses');
        return response.courses;
      } catch (error) {
        console.error('Failed to get courses:', error);
        throw error;
      }
    },
    
    /**
     * Get a specific course
     * @param {string} courseId - Course ID
     * @returns {Promise<Object>} - Course data
     */
    getCourse: async function(courseId) {
      try {
        const response = await apiRequest(`/courses/${courseId}`);
        return response.course;
      } catch (error) {
        console.error(`Failed to get course ${courseId}:`, error);
        throw error;
      }
    },
    
    /**
     * Save a course
     * @param {Object} courseData - Course data
     * @returns {Promise<Object>} - Saved course
     */
    saveCourse: async function(courseData) {
      try {
        const method = courseData.id ? 'PUT' : 'POST';
        const endpoint = courseData.id ? `/courses/${courseData.id}` : '/courses';
        
        const response = await apiRequest(endpoint, method, courseData);
        return response.course;
      } catch (error) {
        console.error('Failed to save course:', error);
        throw error;
      }
    },
    
    /**
     * Delete a course
     * @param {string} courseId - Course ID
     * @returns {Promise<boolean>} - Whether deletion was successful
     */
    deleteCourse: async function(courseId) {
      try {
        const response = await apiRequest(`/courses/${courseId}`, 'DELETE');
        return response.success;
      } catch (error) {
        console.error(`Failed to delete course ${courseId}:`, error);
        throw error;
      }
    },
    
    /**
     * Generate a quiz from content
     * @param {string} content - Educational content
     * @param {Object} options - Quiz generation options
     * @returns {Promise<Object>} - Generated quiz
     */
    generateQuiz: async function(content, options = {}) {
      try {
        const response = await apiRequest('/generate-quiz', 'POST', { content, options });
        return response.quiz;
      } catch (error) {
        console.error('Failed to generate quiz:', error);
        throw error;
      }
    },
    
    /**
     * Transform course content for neurodivergent learners
     * @param {Object} course - Course data
     * @param {Object} options - Transformation options
     * @returns {Promise<Object>} - Transformed course
     */
    transformCourse: async function(course, options = {}) {
      try {
        const response = await apiRequest('/transform-course', 'POST', { course, options });
        return response.course;
      } catch (error) {
        console.error('Failed to transform course:', error);
        throw error;
      }
    },
    
    /**
     * Simplify text content
     * @param {string} text - Text to simplify
     * @param {string} gradeLevel - Target grade level
     * @returns {Promise<string>} - Simplified text
     */
    simplifyText: async function(text, gradeLevel = 'elementary') {
      try {
        const response = await apiRequest('/simplify-text', 'POST', { text, gradeLevel });
        return response.simplified;
      } catch (error) {
        console.error('Failed to simplify text:', error);
        throw error;
      }
    },
    
    /**
     * Adapt content for dyslexia
     * @param {string} content - Content to adapt
     * @param {Object} options - Adaptation options
     * @returns {Promise<Object>} - Adapted content
     */
    adaptForDyslexia: async function(content, options = {}) {
      try {
        const response = await apiRequest('/adapt-for-dyslexia', 'POST', { content, options });
        return response;
      } catch (error) {
        console.error('Failed to adapt for dyslexia:', error);
        throw error;
      }
    },
    
    /**
     * Adapt content for ADHD
     * @param {string} content - Content to adapt
     * @param {Object} options - Adaptation options
     * @returns {Promise<Object>} - Adapted content
     */
    adaptForADHD: async function(content, options = {}) {
      try {
        const response = await apiRequest('/adapt-for-adhd', 'POST', { content, options });
        return response;
      } catch (error) {
        console.error('Failed to adapt for ADHD:', error);
        throw error;
      }
    },
    
    /**
     * Adapt content for autism
     * @param {string} content - Content to adapt
     * @param {Object} options - Adaptation options
     * @returns {Promise<Object>} - Adapted content
     */
    adaptForAutism: async function(content, options = {}) {
      try {
        const response = await apiRequest('/adapt-for-autism', 'POST', { content, options });
        return response;
      } catch (error) {
        console.error('Failed to adapt for autism:', error);
        throw error;
      }
    }
  };
})();

// Make available globally
window.CourseBuilderAPI = CourseBuilderAPI;