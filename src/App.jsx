import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import './App.css';

const themes = {
  violet: {
    primary: '#4338ca',
    secondary: '#6366f1',
    background: '#1e1b4b',
    surface: '#312e81',
    hover: '#4f46e5'
  },
  green: {
    primary: '#059669',
    secondary: '#10b981',
    background: '#064e3b',
    surface: '#065f46',
    hover: '#047857'
  },
  coral: {
    primary: '#e11d48',
    secondary: '#f43f5e',
    background: '#881337',
    surface: '#9f1239',
    hover: '#be123c'
  }
};

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  transition: all 0.3s ease;
`;

const AppContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: ${props => props.theme.background};
  padding: 2rem;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  position: relative;
`;

const ThemeButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.secondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 100;

  &:hover {
    color: ${props => props.theme.hover};
  }
`;

const ThemeMenu = styled(motion.div)`
  position: absolute;
  top: 3.5rem;
  right: 1rem;
  background-color: ${props => props.theme.surface};
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  z-index: 100;
`;

const ThemeOption = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: ${props => themes[props.themeKey].primary};
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => themes[props.themeKey].hover};
  }
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
  border: 2px solid ${props => props.theme.primary};
  border-radius: 0.5rem;
  background-color: ${props => props.theme.surface};
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: ${props => props.theme.secondary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.secondary};
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.primary};
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.hover};
  }

  &:disabled {
    background-color: ${props => props.theme.secondary};
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

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.surface};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.primary};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.hover};
  }
`;

const ChoiceItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: ${props => props.theme.surface};
  border-radius: 0.5rem;
  color: white;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.secondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.5rem;

  &:hover {
    color: ${props => props.theme.hover};
  }
`;

const Result = styled(motion.div)`
  text-align: center;
  margin-top: 2rem;
  padding: 2rem;
  background-color: ${props => props.theme.surface};
  border-radius: 0.5rem;
  color: white;

  h3 {
    color: ${props => props.theme.secondary};
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
  const [currentTheme, setCurrentTheme] = useState('violet');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

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

  const toggleThemeMenu = () => {
    setIsThemeMenuOpen(!isThemeMenuOpen);
  };

  return (
    <Container theme={themes[currentTheme]}>
      <AppContainer theme={themes[currentTheme]}>
        <ThemeButton
          theme={themes[currentTheme]}
          onClick={toggleThemeMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ⚙️
        </ThemeButton>

        <AnimatePresence>
          {isThemeMenuOpen && (
            <ThemeMenu
              theme={themes[currentTheme]}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {Object.keys(themes).map(themeKey => (
                <ThemeOption
                  key={themeKey}
                  themeKey={themeKey}
                  onClick={() => {
                    setCurrentTheme(themeKey);
                    setIsThemeMenuOpen(false);
                  }}
                >
                  {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
                </ThemeOption>
              ))}
            </ThemeMenu>
          )}
        </AnimatePresence>

        <Title
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Choice Maker
        </Title>

        <InputContainer>
          <Input
            theme={themes[currentTheme]}
            value={currentChoice}
            onChange={(e) => setCurrentChoice(e.target.value)}
            placeholder="Enter a choice..."
            onKeyPress={handleKeyPress}
          />
          <Button
            theme={themes[currentTheme]}
            whileTap={{ scale: 0.95 }}
            onClick={addChoice}
          >
            Add
          </Button>
        </InputContainer>

        <ChoicesList theme={themes[currentTheme]}>
          <AnimatePresence>
            {choices.map((choice, index) => (
              <ChoiceItem
                key={index}
                theme={themes[currentTheme]}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <span>{choice}</span>
                <RemoveButton
                  theme={themes[currentTheme]}
                  onClick={() => removeChoice(index)}
                >
                  ×
                </RemoveButton>
              </ChoiceItem>
            ))}
          </AnimatePresence>
        </ChoicesList>

        <Button
          theme={themes[currentTheme]}
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
              theme={themes[currentTheme]}
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
