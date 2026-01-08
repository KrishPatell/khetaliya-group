/**
 * Formspree Integration Handler
 * Configures all forms on the website to submit to Formspree
 */

(function() {
  'use strict';

  // Check if config is loaded
  if (typeof FORMSPREE_CONFIG === 'undefined') {
    console.error('Formspree Config not found. Please ensure forms-pre-config.js is loaded before this script.');
    return;
  }

  /**
   * Initialize form handlers for all forms on the page
   */
  function initFormspreeIntegration() {
    // Find all forms on the page
    const forms = document.querySelectorAll('form');
    
    forms.forEach(function(form) {
      // Skip if form already has Formspree handler
      if (form.dataset.formspreeInitialized === 'true') {
        return;
      }

      // Mark as initialized
      form.dataset.formspreeInitialized = 'true';

      // Set form action and method for Formspree
      if (!form.action || form.action === '' || form.action === '#') {
        form.action = FORMSPREE_CONFIG.endpoint;
        form.method = 'POST';
      }

      // Ensure form has proper encoding
      if (!form.enctype) {
        form.enctype = 'application/x-www-form-urlencoded';
      }

      // Add submit event listener for better UX (loading states, etc.)
      form.addEventListener('submit', function(e) {
        handleFormSubmit(form);
      });
    });
  }

  /**
   * Handle form submission - add loading states and success/error handling
   * @param {HTMLFormElement} form - The form element to submit
   */
  function handleFormSubmit(form) {
    // Show loading state
    const submitButton = form.querySelector('input[type="submit"], button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.value || submitButton.textContent : '';
    const originalButtonDisabled = submitButton ? submitButton.disabled : false;
    
    if (submitButton) {
      submitButton.disabled = true;
      if (submitButton.dataset.wait) {
        submitButton.value = submitButton.dataset.wait;
      } else {
        submitButton.value = 'Please wait...';
      }
    }

    // Formspree will handle the submission naturally
    // We'll add a listener for when the page redirects back (Formspree's default behavior)
    // or we can intercept and handle it with fetch for better UX
    
    // Option: Use fetch for better control (prevents page reload)
    const formData = new FormData(form);
    
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(err => {
          throw err;
        });
      }
    })
    .then(data => {
      // Show success message
      showFormMessage(form, 'success', 'Thank you! Your submission has been received!');
      
      // Reset form
      form.reset();
      
      // Reset button
      if (submitButton) {
        submitButton.disabled = originalButtonDisabled;
        submitButton.value = originalButtonText;
      }
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      
      // Show error message
      showFormMessage(form, 'error', 'Oops! Something went wrong while submitting the form. Please try again.');
      
      // Reset button
      if (submitButton) {
        submitButton.disabled = originalButtonDisabled;
        submitButton.value = originalButtonText;
      }
    });
  }

  /**
   * Show form success/error message
   * @param {HTMLFormElement} form - The form element
   * @param {string} type - 'success' or 'error'
   * @param {string} message - Message to display
   */
  function showFormMessage(form, type, message) {
    // Try to find Webflow form message containers
    const successDiv = form.parentElement.querySelector('.w-form-done');
    const errorDiv = form.parentElement.querySelector('.w-form-fail');
    
    if (type === 'success' && successDiv) {
      successDiv.style.display = 'block';
      if (successDiv.querySelector('div')) {
        successDiv.querySelector('div').textContent = message;
      }
      if (errorDiv) {
        errorDiv.style.display = 'none';
      }
      form.style.display = 'none';
    } else if (type === 'error' && errorDiv) {
      errorDiv.style.display = 'block';
      if (errorDiv.querySelector('div')) {
        errorDiv.querySelector('div').textContent = message;
      }
      if (successDiv) {
        successDiv.style.display = 'none';
      }
    } else {
      // Fallback: create a simple alert or message
      alert(message);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormspreeIntegration);
  } else {
    initFormspreeIntegration();
  }

  // Re-initialize for dynamically added forms
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'FORM' || node.querySelector('form')) {
            initFormspreeIntegration();
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
