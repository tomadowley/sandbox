import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import './App.css';
import LoanAgreement from './components/LoanAgreement';

/**
 * Main App Component 
 * Handles routing and global state management for the loan agreement application
 */
function App() {
  // State for managing error alerts across the application
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Toggles the visibility of the error alert modal
   * @param {string} message - Optional error message to display
   */
  const toggleErrorAlert = (message = '') => {
    setShowErrorAlert(!showErrorAlert);
    setErrorMessage(message);
  };

  /**
   * Global error handler for contract interactions
   * @param {Error} error - The error object from a failed transaction
   */
  const handleContractError = (error) => {
    // Extract the relevant error message for user feedback
    const userMessage = error.message.includes('User denied transaction') 
      ? 'Transaction was rejected. Please try again.'
      : `Error: ${error.message}`;
    
    // Display the error in the modal
    toggleErrorAlert(userMessage);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Loan Agreement System</h1>
      </header>
      
      <main className="App-content">
        {/* Main loan agreement component with error handling props */}
        <LoanAgreement 
          onError={handleContractError}
          convertToFloat={(value) => parseFloat(value) || 0} 
        />
      </main>

      {/* Error Alert Modal */}
      <Modal isOpen={showErrorAlert} toggle={() => toggleErrorAlert()}>
        <ModalHeader toggle={() => toggleErrorAlert()}>Transaction Error</ModalHeader>
        <ModalBody>
          {errorMessage}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => toggleErrorAlert()}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
