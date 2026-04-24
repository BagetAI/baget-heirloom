const DATABASE_IDS = {
    menus: 'ea7eb24e-8b77-4c6a-bf92-cfef5181ecc2',
    kitchens: 'e47bd0a4-dc59-4f47-a2bd-d6503f8c757f',
    waitlist: '9d51df10-4228-4f2e-90a6-f417a1918dc4'
};

const BASE_URL = 'https://baget.ai/api/public/databases';

// Fetch and display Marketplace items
async function loadMarketplace() {
    const menuGrid = document.getElementById('menu-grid');
    const kitchenGrid = document.getElementById('kitchen-grid');

    try {
        // Fetch Menus
        const menuResponse = await fetch(`${BASE_URL}/${DATABASE_IDS.menus}/rows`);
        const menus = await menuResponse.json();
        
        if (menus && menus.length > 0) {
            menuGrid.innerHTML = menus.map(item => `
                <div class="card">
                    <div class="card-top">
                        <span class="card-tag">Family Style</span>
                        <h3>${item.dish_name}</h3>
                        <p class="card-meta">Prepared fresh today. Limited portions available.</p>
                    </div>
                    <div class="card-bottom">
                        <div class="price">$${item.price.toFixed(2)}</div>
                        <a href="#waitlist" class="btn-primary" style="padding: 0.8rem 1.5rem; font-size: 0.65rem;">Order</a>
                    </div>
                </div>
            `).join('');
        } else {
            menuGrid.innerHTML = '<div class="loading">No active menus today. Check back tomorrow.</div>';
        }

        // Fetch Kitchens
        const kitchenResponse = await fetch(`${BASE_URL}/${DATABASE_IDS.kitchens}/rows`);
        const kitchens = await kitchenResponse.json();

        if (kitchens && kitchens.length > 0) {
            kitchenGrid.innerHTML = kitchens.map(k => `
                <div class="card">
                    <div class="card-top">
                        <span class="card-tag">${k.cuisine_type} Cuisine</span>
                        <h3>${k.name}</h3>
                        <p class="card-meta">${k.location}</p>
                    </div>
                    <div class="card-bottom">
                        <div class="status-badge ${k.verification_status.toLowerCase().includes('permitted') ? 'status-verified' : ''}">
                            ${k.verification_status}
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            kitchenGrid.innerHTML = '<div class="loading">Recruiting neighborhood cooks...</div>';
        }

    } catch (error) {
        console.error('Error loading marketplace:', error);
        menuGrid.innerHTML = '<div class="loading">Service temporarily unavailable.</div>';
        kitchenGrid.innerHTML = '<div class="loading">Service temporarily unavailable.</div>';
    }
}

// Handle Waitlist Form
async function handleWaitlist(e) {
    e.preventDefault();
    const form = e.target;
    const feedback = document.getElementById('formFeedback');
    const button = form.querySelector('button');
    
    const formData = new FormData(form);
    const data = {
        email: formData.get('email'),
        zip_code: formData.get('zip_code'),
        interest_type: formData.get('interest_type')
    };

    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Securing spot...';

    try {
        const response = await fetch(`${BASE_URL}/${DATABASE_IDS.waitlist}/rows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data })
        });

        if (response.ok) {
            feedback.textContent = 'Welcome to Heirloom. We will notify you when the next drop is live.';
            feedback.style.color = '#7C8B6F';
            form.reset();
        } else {
            throw new Error('Submission failed');
        }
    } catch (err) {
        feedback.textContent = 'Connection error. Please try again.';
        feedback.style.color = '#B35C44';
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadMarketplace();
    const form = document.getElementById('waitlistForm');
    if (form) form.addEventListener('submit', handleWaitlist);
});
