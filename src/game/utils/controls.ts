export function setupControls(onDirectionChange: (direction: string | null) => void): () => void {
  // Map to keep track of pressed keys
  const keysPressed: { [key: string]: boolean } = {};
  
  // Define key mappings
  const keyMap: { [key: string]: string } = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'w': 'up',
    's': 'down',
    'a': 'left',
    'd': 'right',
  };
  
  // Handle key down events
  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    
    // If key is a movement key
    if (keyMap[key] || keyMap[event.key]) {
      // Prevent default action (like scrolling)
      event.preventDefault();
      
      // Mark key as pressed
      keysPressed[key] = true;
      keysPressed[event.key] = true;
      
      // Determine direction based on currently pressed keys
      updateDirection();
    }
  };
  
  // Handle key up events
  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    
    // If key is a movement key
    if (keyMap[key] || keyMap[event.key]) {
      // Mark key as released
      keysPressed[key] = false;
      keysPressed[event.key] = false;
      
      // Update direction
      updateDirection();
    }
  };
  
  // Update direction based on currently pressed keys
  const updateDirection = () => {
    // Check keys in priority order (latest pressed takes precedence)
    const pressedDirections = Object.entries(keyMap)
      .filter(([key]) => keysPressed[key])
      .map(([, direction]) => direction);
    
    // If no keys are pressed, stop movement
    if (pressedDirections.length === 0) {
      onDirectionChange(null);
      return;
    }
    
    // Take the last pressed direction
    onDirectionChange(pressedDirections[pressedDirections.length - 1]);
  };
  
  // Add event listeners
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  
  // Return function to remove event listeners (cleanup)
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}