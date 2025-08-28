const runes = [
    { name: "Light Magic Missile", altName: "Adori", cost: 0, mana: 30, quantity: 10 },
    { name: "Heavy Magic Missile", altName: "Adori gran", cost: 20, mana: 70, quantity: 5 },
    { name: "Icicle", altName: "Adori gran frigo", cost: 30, mana: 80, quantity: 5 },
    { name: "Sudden Death", altName: "Adori vita vis", cost: 50, mana: 220, quantity: 1 },
    { name: "Intense Healing", altName: "Adura gran", cost: 50, mana: 60, quantity: 1 },
    { name: "Ultimate Healing", altName: "Adura vita", cost: 30, mana: 100, quantity: 1 },
    { name: "Fireball", altName: "Adori flam", cost: 30, mana: 60, quantity: 6 },
    { name: "Great Fireball", altName: "Adori gran flam", cost: 30, mana: 120, quantity: 2 },
    { name: "Avalanche", altName: "Adori mas frigo", cost: 30, mana: 140, quantity: 2 },
    { name: "Magic Wall", altName: "Adevo grav tera", cost: 40, mana: 250, quantity: 3 },
    { name: "Destroy Field", altName: "Adito grav", cost: 50, mana: 60, quantity: 3 },
    { name: "Desintegrate", altName: "Adito tera", cost: 20, mana: 100, quantity: 3 },
    { name: "Poison Field", altName: "Adevo grav pox", cost: 20, mana: 50, quantity: 3 },
    { name: "Fire Field", altName: "Adevo grav flam", cost: 30, mana: 60, quantity: 3 },
    { name: "Energy Field", altName: "Adevo grav vis", cost: 30, mana: 80, quantity: 3 },
    { name: "Envenom", altName: "Adevo res pox", cost: 20, mana: 100, quantity: 2 },
    { name: "Soulfire", altName: "Adevo res flam", cost: 30, mana: 150, quantity: 3 },
    { name: "Paralyze", altName: "Adana ani", cost: 30, mana: 600, quantity: 1 },
    { name: "Explosion", altName: "Adevo mas hur", cost: 20, mana: 180, quantity: 3 },
    { name: "Poison Wall", altName: "Adevo mas grav pox", cost: 20, mana: 160, quantity: 4 },
    { name: "Fire Wall", altName: "Adevo mas grav flam", cost: 30, mana: 200, quantity: 4 },
    { name: "Energy Wall", altName: "Adevo mas grav vis", cost: 30, mana: 250, quantity: 4 },
    { name: "Poison Bomb", altName: "Adevo mas pox", cost: 20, mana: 130, quantity: 2 },
    { name: "Fire Bomb", altName: "Adevo mas flam", cost: 30, mana: 150, quantity: 2 },
    { name: "Energy Bomb", altName: "Adevo mas vis", cost: 50, mana: 220, quantity: 2 },
    { name: "Chameleon", altName: "Adevo ina", cost: 20, mana: 150, quantity: 3 },
    { name: "Convince Creature", altName: "Adeta sio", cost: 20, mana: 100, quantity: 1 },
    { name: "Animate Dead", altName: "Adana mort", cost: 20, mana: 300, quantity: 2 }
];

function calculateManaRegen() {
    let totalManaPerHour = 0;
    
    // Base regeneration
    if (document.getElementById('no-promotion').checked) {
        totalManaPerHour += (2 / 4) * 3600; // 2 mana every 4 seconds
    } else {
        totalManaPerHour += (2 / 3) * 3600; // 2 mana every 3 seconds
    }
    
    // Equipment bonuses
    if (document.getElementById('exordion-ring').checked) {
        totalManaPerHour += (1 / 4) * 3600; // 1 mana every 4 seconds
    }
    
    if (document.getElementById('exordion-boots').checked) {
        totalManaPerHour += (1 / 3) * 3600; // 1 mana every 3 seconds
    }
    
    if (document.getElementById('beholder-spellbook').checked) {
        totalManaPerHour += (1 / 6) * 3600; // 1 mana every 6 seconds
    }
    
    // Zero soul penalty
    if (document.getElementById('zero-soul').checked) {
        totalManaPerHour *= 0.5;
    }
    
    return Math.floor(totalManaPerHour);
}

function createRuneCard(rune, index) {
    const costPerRune = rune.cost / rune.quantity;
    
    return `
        <div class="rune-card" id="rune-${index}">
            <div class="rune-name">
                ${rune.name}
                ${rune.altName ? `<span class="alt-name">(${rune.altName})</span>` : ''}
            </div>
            <div class="rune-details">
                <div class="detail-item">
                    <strong>Custo:</strong> ${rune.cost}gp
                </div>
                <div class="detail-item">
                    <strong>Mana:</strong> ${rune.mana}
                </div>
                <div class="detail-item">
                    <strong>Quantidade:</strong> ${rune.quantity}
                </div>
                <div class="detail-item">
                    <strong>Custo/Runa:</strong> ${costPerRune.toFixed(2)}gp
                </div>
            </div>
            <input type="number" class="price-input" placeholder="Preço de venda por runa" 
                   id="price-${index}" min="0" step="0.01">
            <div class="results">
                <div class="result-item">
                    <div class="result-label">Runas/Hora</div>
                    <div class="result-value neutral" id="quantity-${index}">0</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Lucro/Runa</div>
                    <div class="result-value neutral" id="profit-per-rune-${index}">0gp</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Lucro/Hora</div>
                    <div class="result-value neutral" id="profit-per-hour-${index}">0gp</div>
                </div>
            </div>
        </div>
    `;
}

function calculateRunes() {
    const totalManaPerHour = calculateManaRegen();
    document.getElementById('total-mana-regen').textContent = totalManaPerHour;
    
    let runeResults = [];
    
    runes.forEach((rune, index) => {
        const priceInput = document.getElementById(`price-${index}`);
        const sellPrice = parseFloat(priceInput.value) || 0;
        
        // Calculate how many times we can cast the spell per hour
        const castsPerHour = Math.floor(totalManaPerHour / rune.mana);
        const runesPerHour = castsPerHour * rune.quantity;
        
        // Calculate profits
        const costPerRune = rune.cost / rune.quantity;
        const profitPerRune = sellPrice - costPerRune;
        const profitPerHour = runesPerHour * profitPerRune;
        
        // Store results for ranking
        if (sellPrice > 0) {
            runeResults.push({
                index: index,
                name: rune.name,
                profitPerHour: profitPerHour
            });
        }
        
        // Update display
        document.getElementById(`quantity-${index}`).textContent = runesPerHour;
        
        const profitPerRuneElement = document.getElementById(`profit-per-rune-${index}`);
        profitPerRuneElement.textContent = profitPerRune.toFixed(2) + 'gp';
        profitPerRuneElement.className = `result-value ${profitPerRune > 0 ? 'positive' : profitPerRune < 0 ? 'negative' : 'neutral'}`;
        
        const profitPerHourElement = document.getElementById(`profit-per-hour-${index}`);
        profitPerHourElement.textContent = Math.floor(profitPerHour) + 'gp';
        profitPerHourElement.className = `result-value ${profitPerHour > 0 ? 'positive' : profitPerHour < 0 ? 'negative' : 'neutral'}`;
    });
    
    // Sort by profit per hour (descending)
    runeResults.sort((a, b) => b.profitPerHour - a.profitPerHour);
    
    // Update ranking display
    updateRanking(runeResults);
    
    // Highlight best profit rune
    const bestRuneIndex = runeResults.length > 0 ? runeResults[0].index : -1;
    runes.forEach((_, index) => {
        const runeCard = document.getElementById(`rune-${index}`);
        if (index === bestRuneIndex && runeResults[0]?.profitPerHour > 0) {
            runeCard.classList.add('best-profit');
        } else {
            runeCard.classList.remove('best-profit');
        }
    });
}

function updateRanking(runeResults) {
    // First place
    if (runeResults.length > 0 && runeResults[0].profitPerHour > 0) {
        document.getElementById('best-rune-name').textContent = runeResults[0].name;
        document.getElementById('best-rune-profit').textContent = Math.floor(runeResults[0].profitPerHour) + ' gp/hora';
    } else {
        document.getElementById('best-rune-name').textContent = 'Selecione preços para ver resultados';
        document.getElementById('best-rune-profit').textContent = '-';
    }
    
    // Second place
    if (runeResults.length > 1 && runeResults[1].profitPerHour > 0) {
        document.getElementById('second-rune-name').textContent = runeResults[1].name;
        document.getElementById('second-rune-profit').textContent = Math.floor(runeResults[1].profitPerHour) + ' gp/h';
    } else {
        document.getElementById('second-rune-name').textContent = '-';
        document.getElementById('second-rune-profit').textContent = '-';
    }
    
    // Third place
    if (runeResults.length > 2 && runeResults[2].profitPerHour > 0) {
        document.getElementById('third-rune-name').textContent = runeResults[2].name;
        document.getElementById('third-rune-profit').textContent = Math.floor(runeResults[2].profitPerHour) + ' gp/h';
    } else {
        document.getElementById('third-rune-name').textContent = '-';
        document.getElementById('third-rune-profit').textContent = '-';
    }
}

function initializeCalculator() {
    // Generate rune cards
    const container = document.getElementById('runes-container');
    container.innerHTML = runes.map((rune, index) => createRuneCard(rune, index)).join('');
    
    // Add event listeners
    document.querySelectorAll('input[name="promotion"]').forEach(radio => {
        radio.addEventListener('change', calculateRunes);
    });
    
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', calculateRunes);
    });
    
    runes.forEach((_, index) => {
        document.getElementById(`price-${index}`).addEventListener('input', calculateRunes);
    });
    
    // Initial calculation
    calculateRunes();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeCalculator);
