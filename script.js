const display = document.getElementById('display');
		let current = '0';
		let stored = null;
		let operation = null;
		let replaceCurrent = false;

		function show(value) {
			current = String(value);
			updateDisplay();
		}

		function updateDisplay() {
			display.value = stored !== null && operation
				? (replaceCurrent ? `${stored} ${operation}` : `${stored} ${operation} ${current}`)
				: current;
		}

		function calculate() {
			if (stored === null || !operation) return;
			const a = Number(stored);
			const b = Number(current);
			let result;
			if (operation === '+') result = a + b;
			if (operation === '−') result = a - b;
			if (operation === '×') result = a * b;
			if (operation === '÷') result = b === 0 ? NaN : a / b;
			stored = null;
			operation = null;
			replaceCurrent = true;
			show(Number.isFinite(result) ? Number(result.toPrecision(12)) : 'Error');
		}

		document.querySelector('.keys').addEventListener('click', (event) => {
			const button = event.target.closest('button');
			if (!button) return;
			if (button.dataset.digit !== undefined) {
				const digit = button.dataset.digit;
				const next = replaceCurrent || current === '0' || current === 'Error' ? digit : current + digit;
				replaceCurrent = false;
				show(next);
			} else if (button.dataset.operator) {
				if (stored !== null && !replaceCurrent) calculate();
				stored = current;
				operation = button.dataset.operator;
				replaceCurrent = true;
				updateDisplay();
			} else {
				switch (button.dataset.action) {
					case 'clear': stored = null; operation = null; replaceCurrent = false; show('0'); break;
					case 'decimal':
						if (replaceCurrent || current === 'Error') {
							replaceCurrent = false;
							show('0.');
						}
						else if (!current.includes('.')) show(current + '.');
						replaceCurrent = false;
						break;
					case 'sign': if (current !== '0' && current !== 'Error') show(current.startsWith('-') ? current.slice(1) : '-' + current); break;
					case 'percent': if (current !== 'Error') show(Number(current) / 100); break;
					case 'equals': calculate(); break;
				}
			}
		});