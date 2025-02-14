import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import './App.css';

const Container = styled.div`
  min-height: 100vh;
  background-color: #1e1b4b;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const AppContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #1e1b4b;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: bold;
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  cursor: default;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #4338ca;
  border-radius: 0.5rem;
  background-color: #312e81;
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: #6366f1;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #4338ca;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4f46e5;
  }

  &:disabled {
    background-color: #6366f1;
    cursor: not-allowed;
  }
`;

const ChoicesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 1rem;
`;

const ChoiceItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #312e81;
  border-radius: 0.5rem;
  color: white;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #6366f1;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.5rem;

  &:hover {
    color: #4338ca;
  }
`;

const Result = styled(motion.div)`
  text-align: center;
  margin-top: 2rem;
  padding: 2rem;
  background-color: #312e81;
  border-radius: 0.5rem;
  color: white;

  h3 {
    color: #6366f1;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

function App() {
  const [choices, setChoices] = useState([]);
  const [currentChoice, setCurrentChoice] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isDeciding, setIsDeciding] = useState(false);

  const addChoice = () => {
    if (currentChoice.trim()) {
      setChoices(prev => [...prev, currentChoice.trim()]);
      setCurrentChoice('');
    }
  };

  const removeChoice = (index) => {
    setChoices(prev => prev.filter((_, i) => i !== index));
  };

  const makeDecision = () => {
    if (choices.length < 2) {
      alert('Please add at least 2 choices');
      return;
    }

    setIsDeciding(true);
    setSelectedChoice(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * choices.length);
      setSelectedChoice(choices[randomIndex]);
      setIsDeciding(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addChoice();
    }
  };

  return (
    <Container>
      <AppContainer>
        <Title
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Decidere
        </Title>

        <InputContainer>
          <Input
            value={currentChoice}
            onChange={(e) => setCurrentChoice(e.target.value)}
            placeholder="Enter a choice..."
            onKeyPress={handleKeyPress}
          />
          <Button
            whileTap={{ scale: 0.95 }}
            onClick={addChoice}
          >
            Add
          </Button>
        </InputContainer>

        <ChoicesList>
          <AnimatePresence>
            {choices.map((choice, index) => (
              <ChoiceItem
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <span>{choice}</span>
                <RemoveButton onClick={() => removeChoice(index)}>×</RemoveButton>
              </ChoiceItem>
            ))}
          </AnimatePresence>
        </ChoicesList>

        <Button
          whileTap={{ scale: 0.95 }}
          onClick={makeDecision}
          disabled={isDeciding}
          style={{ width: '100%' }}
        >
          {isDeciding ? 'Deciding...' : 'Make Decision'}
        </Button>

        <AnimatePresence>
          {selectedChoice && (
            <Result
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <h3>Your decision:</h3>
              <p>{selectedChoice}</p>
            </Result>
          )}
        </AnimatePresence>
      </AppContainer>
    </Container>
  );
}

export default App;
