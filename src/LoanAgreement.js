import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ethers } from 'ethers';
import { useContract } from './hooks/useContract';
import { tokenGasConversion } from './utils/token-data';

/**
 * LoanFunctions Component
 * Handles the rendering of different function sets based on user role
 * @param {Object} props - Component props
 * @param {Array} props.borrowerFunctions - Functions available to the borrower
 * @param {Array} props.lenderFunctions - Functions available to the lender
 * @param {Array} props.defaultFunctions - Functions available to all users
 * @param {string} props.userRole - Current user's role (borrower, lender, or other)
 */
const LoanFunctions = ({ borrowerFunctions, lenderFunctions, defaultFunctions, userRole }) => {
  // Determine which functions to display based on user role
  const displayFunctions = () => {
    if (userRole === 'borrower') {
      return (
        <div className="function-group borrower-functions">
          <h4>Borrower Functions</h4>
          {borrowerFunctions}
        </div>
      );
    } else if (userRole === 'lender') {
      return (
        <div className="function-group lender-functions">
          <h4>Lender Functions</h4>
          {lenderFunctions}
        </div>
      );
    } else {
      return (
        <div className="function-group default-functions">
          <h4>Available Functions</h4>
          {defaultFunctions}
        </div>
      );
    }
  };

  return (
    <div className="loan-functions">
      {displayFunctions()}
    </div>
  );
};

/**
 * LoanAgreement Component
 * Main component for managing loan agreements
 * Handles contract interactions, state management, and rendering UI for loan operations
 */
const LoanAgreement = () => {
  // State variables
  const [loanAmount, setLoanAmount] = useState('');
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [currentBalance, setCurrentBalance] = useState('0');
  const [userRole, setUserRole] = useState('default'); // 'borrower', 'lender', or 'default'
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Contract hook
  const { contract, account, loading } = useContract();

  // Effect to load initial data
  useEffect(() => {
    if (contract && account) {
      loadContractData();
      determineUserRole();
    }
  }, [contract, account]);

  /**
   * Loads data from the smart contract
   */
  const loadContractData = async () => {
    try {
      const balance = await contract.getCurrentBalance();
      setCurrentBalance(ethers.utils.formatEther(balance));
      
      // Load other contract data as needed
      const loanDetails = await contract.getLoanDetails();
      setLoanAmount(ethers.utils.formatEther(loanDetails.amount));
      setRepaymentAmount(ethers.utils.formatEther(loanDetails.repaymentAmount));
      setInterestRate(loanDetails.interestRate.toString());
      setLoanTerm(loanDetails.term.toString());
    } catch (error) {
      console.error('Error loading contract data:', error);
      showErrorModal(`Failed to load contract data: ${error.message}`);
    }
  };

  /**
   * Determines the user's role based on contract data
   */
  const determineUserRole = async () => {
    try {
      const borrower = await contract.borrower();
      const lender = await contract.lender();
      
      if (account.toLowerCase() === borrower.toLowerCase()) {
        setUserRole('borrower');
      } else if (account.toLowerCase() === lender.toLowerCase()) {
        setUserRole('lender');
      } else {
        setUserRole('default');
      }
    } catch (error) {
      console.error('Error determining user role:', error);
      setUserRole('default');
    }
  };

  /**
   * Toggles the error modal and sets the error message
   * @param {string} message - Error message to display
   */
  const showErrorModal = (message) => {
    setErrorMessage(message);
    setErrorModalOpen(true);
  };

  /**
   * Closes the error modal
   */
  const closeErrorModal = () => {
    setErrorModalOpen(false);
  };

  /**
   * Creates a new loan agreement
   */
  const createLoan = async () => {
    try {
      // Convert string inputs to appropriate formats for the contract
      const amountInWei = ethers.utils.parseEther(loanAmount);
      const repaymentInWei = ethers.utils.parseEther(repaymentAmount);
      const interestRateValue = parseInt(interestRate);
      const loanTermValue = parseInt(loanTerm);
      
      // Calculate gas fees using the tokenGasConversion utility
      const gasFees = tokenGasConversion({
        amount: amountInWei,
        type: 'uint256' // Ensure proper type is specified
      });
      
      // Execute contract transaction
      const tx = await contract.createLoan(
        amountInWei,
        repaymentInWei,
        interestRateValue,
        loanTermValue,
        { value: gasFees }
      );
      
      await tx.wait();
      loadContractData(); // Refresh data after successful transaction
    } catch (error) {
      console.error('Error creating loan:', error);
      showErrorModal(`Transaction failed: ${error.message}`);
    }
  };

  /**
   * Handles loan repayment
   */
  const repayLoan = async () => {
    try {
      // Convert string input to float before processing
      const amountInWei = ethers.utils.parseEther(parseFloat(repaymentAmount).toString());
      
      const tx = await contract.makeRepayment({ value: amountInWei });
      await tx.wait();
      loadContractData(); // Refresh data after successful transaction
    } catch (error) {
      console.error('Error repaying loan:', error);
      showErrorModal(`Transaction failed: ${error.message}`);
    }
  };

  /**
   * Cancels the loan agreement
   */
  const cancelLoan = async () => {
    try {
      const tx = await contract.cancelLoan();
      await tx.wait();
      loadContractData(); // Refresh data after successful transaction
    } catch (error) {
      console.error('Error canceling loan:', error);
      showErrorModal(`Transaction failed: ${error.message}`);
    }
  };

  /**
   * Renders functions available to borrowers
   */
  const renderBorrowerFunctions = () => (
    <>
      <FormGroup>
        <Label for="repaymentAmount">Repayment Amount (ETH)</Label>
        <Input 
          type="number" 
          name="repaymentAmount" 
          id="repaymentAmount" 
          value={repaymentAmount} 
          onChange={(e) => setRepaymentAmount(e.target.value)} 
        />
      </FormGroup>
      <Button color="primary" onClick={repayLoan}>Make Repayment</Button>
      <Button color="danger" className="ml-2" onClick={cancelLoan}>Cancel Loan</Button>
    </>
  );

  /**
   * Renders functions available to lenders
   */
  const renderLenderFunctions = () => (
    <>
      <Button color="success" onClick={() => loadContractData()}>Check Balance</Button>
      <Button color="warning" className="ml-2" onClick={cancelLoan}>Cancel Agreement</Button>
    </>
  );

  /**
   * Renders default functions available to all users
   */
  const renderDefaultFunctions = () => (
    <>
      <FormGroup>
        <Label for="loanAmount">Loan Amount (ETH)</Label>
        <Input 
          type="number" 
          name="loanAmount" 
          id="loanAmount" 
          value={loanAmount} 
          onChange={(e) => setLoanAmount(e.target.value)} 
        />
      </FormGroup>
      <FormGroup>
        <Label for="repaymentAmount">Repayment Amount (ETH)</Label>
        <Input 
          type="number" 
          name="repaymentAmount" 
          id="repaymentAmount" 
          value={repaymentAmount} 
          onChange={(e) => setRepaymentAmount(e.target.value)} 
        />
      </FormGroup>
      <FormGroup>
        <Label for="interestRate">Interest Rate (%)</Label>
        <Input 
          type="number" 
          name="interestRate" 
          id="interestRate" 
          value={interestRate} 
          onChange={(e) => setInterestRate(e.target.value)} 
        />
      </FormGroup>
      <FormGroup>
        <Label for="loanTerm">Loan Term (days)</Label>
        <Input 
          type="number" 
          name="loanTerm" 
          id="loanTerm" 
          value={loanTerm} 
          onChange={(e) => setLoanTerm(e.target.value)} 
        />
      </FormGroup>
      <Button color="primary" onClick={createLoan}>Create Loan</Button>
    </>
  );

  if (loading) {
    return <div>Loading contract data...</div>;
  }

  return (
    <div className="loan-agreement">
      <h2>Loan Agreement</h2>
      
      <div className="loan-details">
        <h3>Current Loan Details</h3>
        <p>Current Balance: {currentBalance} ETH</p>
        <p>Loan Amount: {loanAmount} ETH</p>
        <p>Repayment Amount: {repaymentAmount} ETH</p>
        <p>Interest Rate: {interestRate}%</p>
        <p>Loan Term: {loanTerm} days</p>
        <p>Your Role: {userRole}</p>
      </div>
      
      <Form className="loan-form">
        <LoanFunctions 
          borrowerFunctions={renderBorrowerFunctions()}
          lenderFunctions={renderLenderFunctions()}
          defaultFunctions={renderDefaultFunctions()}
          userRole={userRole}
        />
      </Form>
      
      {/* Error Modal */}
      <Modal isOpen={errorModalOpen} toggle={closeErrorModal}>
        <ModalHeader toggle={closeErrorModal}>Transaction Error</ModalHeader>
        <ModalBody>
          {errorMessage}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeErrorModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default LoanAgreement;
