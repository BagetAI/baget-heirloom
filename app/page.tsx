'use client';

import { useState, useEffect } from 'react';

const DATABASE_IDS = {
    menus: 'ea7eb24e-8b77-4c6a-bf92-cfef5181ecc2',
    kitchens: 'e47bd0a4-dc59-4f47-a2bd-d6503f8c757f',
    waitlist: '9d51df10-4228-4f2e-90a6-f417a1918dc4'
};

const BASE_URL = 'https://app.baget.ai/api/public/databases';

export default function Home() {
    const [menus, setMenus] = useState<any[]>([]);
    const [kitchens, setKitchens] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [waitlistStatus, setWaitlistStatus] = useState({ message: '', color: '' });

    useEffect(() => {
        async function fetchData() {
            try {
                const [menuRes, kitchenRes] = await Promise.all([
                    fetch(`${BASE_URL}/${DATABASE_IDS.menus}/rows`),
                    fetch(`${BASE_URL}/${DATABASE_IDS.kitchens}/rows`)
                ]);
                const menuData = await menuRes.json();
                const kitchenData = await kitchenRes.json();
                setMenus(menuData || []);
                setKitchens(kitchenData || []);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleWaitlist = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get('email'),
            zip_code: formData.get('zip_code'),
            interest_type: formData.get('interest_type')
        };

        try {
            const response = await fetch(`${BASE_URL}/${DATABASE_IDS.waitlist}/rows`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data })
            });

            if (response.ok) {
                setWaitlistStatus({ message: 'Welcome to Heirloom. We will notify you when the next drop is live.', color: '#7C8B6F' });
                (e.target as HTMLFormElement).reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            setWaitlistStatus({ message: 'Connection error. Please try again.', color: '#B35C44' });
        }
    };

    return (
        <main>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="kicker">EXPANDING TO AUSTIN & RIVERSIDE</div>
                    <h1>Taste home, <br />wherever you are.</h1>
                    <p>Authentic homemade meals from your neighbors for $11. Permitted kitchens, zero-waste packaging, real nourishment. Supporting the Austin Flagship 10 cohort.</p>
                    <div className="cta-group">
                        <a href="#marketplace" className="btn-primary">Shop Local Meals</a>
                        <a href="/onboard" className="btn-secondary">Start Your Kitchen</a>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="images/minimalist-overhead-shot-of-a-warm-home.png" alt="A warm bowl of homemade stew on a wooden table" />
                </div>
            </section>

            {/* Marketplace Section */}
            <section id="marketplace" className="marketplace">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">FRESH FROM THE NEIGHBORHOOD</div>
                        <h2>Today's Menu</h2>
                    </div>
                    
                    <div id="menu-grid" className="item-grid">
                        {loading ? (
                            <div className="loading">Discovering local flavors...</div>
                        ) : menus.length > 0 ? (
                            menus.map((item, i) => (
                                <div className="card" key={i}>
                                    <div className="card-top">
                                        <span className={`card-tag ${item.dish_name.toLowerCase().includes('lasagna') && !item.dish_name.toLowerCase().includes('beef') ? 'austin-compliant' : ''}`}>
                                            Authentic Homemade
                                        </span>
                                        <h3>{item.dish_name}</h3>
                                        <p className="card-meta">Hand-crafted by a neighbor using heritage recipes. Sustainable packaging included.</p>
                                    </div>
                                    <div className="card-bottom">
                                        <div className="price-container">
                                            <span className="price-label">Per Portion</span>
                                            <div className="price">${parseFloat(item.price).toFixed(2)}</div>
                                        </div>
                                        <a href="#waitlist" className="btn-primary btn-reserve">Reserve</a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="loading">Discovering new neighborhood drops. Check back at 11:00 AM.</div>
                        )}
                    </div>

                    <div className="section-header mt-8">
                        <div className="section-label">CERTIFIED HOME KITCHENS</div>
                        <h2>Meet Your Cooks</h2>
                    </div>

                    <div id="kitchen-grid" className="item-grid">
                        {loading ? (
                            <div className="loading">Browsing kitchens...</div>
                        ) : kitchens.length > 0 ? (
                            kitchens.map((k, i) => (
                                <div className="card" key={i}>
                                    <div className="card-top">
                                        <span className="card-tag">{k.cuisine_type} Specialist</span>
                                        <h3>{k.name}</h3>
                                        <p className="card-meta">Location: {k.location}. Operating with active MEHKO safety certification.</p>
                                    </div>
                                    <div className="card-bottom">
                                        <div className={`status-badge ${k.verification_status.toLowerCase().includes('permitted') || k.verification_status.toLowerCase().includes('active') ? 'status-verified' : ''}`}>
                                            Verified {k.verification_status}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="loading">Recruiting neighborhood cooks...</div>
                        )}
                    </div>
                </div>
            </section>

            {/* Value Prop Section */}
            <section id="how-it-works" className="how-it-works">
                <div className="container">
                    <div className="section-label">THE HEIRLOOM STANDARD</div>
                    <div className="v-grid">
                        <div className="v-item">
                            <div className="v-icon">01</div>
                            <h3>Permit-as-a-Service</h3>
                            <p>We handle the bureaucracy. Every cook is verified and compliant with local MEHKO or Cottage Food laws.</p>
                        </div>
                        <div className="v-item">
                            <div className="v-icon">02</div>
                            <h3>$11 Flat Pricing</h3>
                            <p>Affordable, daily nourishment. We maintain low overhead to ensure neighbors get the best price and cooks keep more.</p>
                        </div>
                        <div className="v-item">
                            <div className="v-icon">03</div>
                            <h3>Heritage Recipes</h3>
                            <p>No industrial kitchens. Only real recipes passed down through generations, made in small batches.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="highlight-image">
                <img src="images/overhead-shot-of-a-vibrant-artisanal-veg.png" alt="Artisanal Plant-Based Vegetable Paella" />
            </section>

            {/* Waitlist Form */}
            <section id="waitlist" className="waitlist">
                <div className="waitlist-card">
                    <h2>Join the Community</h2>
                    <p>We're launching the Austin Flagship 10. Sign up to get notified when the first vegetarian heritage drop is live in your zip code.</p>
                    
                    <form onSubmit={handleWaitlist}>
                        <div className="form-group">
                            <input type="email" name="email" placeholder="Email Address" required />
                        </div>
                        <div className="form-row">
                            <div className="form-group flex-1">
                                <input type="text" name="zip_code" placeholder="Zip Code" required />
                            </div>
                            <div className="form-group flex-2">
                                <select name="interest_type" required defaultValue="">
                                    <option value="" disabled>Tell us your interest</option>
                                    <option value="eater">I want to order meals (Diner)</option>
                                    <option value="cook">I want to cook (Austin/Riverside)</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary full-width">Secure Early Access</button>
                    </form>
                    {waitlistStatus.message && (
                        <div className="feedback" style={{ color: waitlistStatus.color }}>
                            {waitlistStatus.message}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
