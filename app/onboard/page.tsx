'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardPage() {
    const [status, setStatus] = useState({ message: '', color: '', loading: false });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus({ message: 'Submitting application...', color: '#111111', loading: true });
        
        const formData = new FormData(e.currentTarget);
        const payload = {
            name: formData.get('name'),
            location: formData.get('location'),
            cuisine_type: formData.get('cuisine_type'),
            bio: formData.get('bio')
        };

        try {
            const response = await fetch('/api/onboard/kitchen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                setStatus({ 
                    message: 'Registration successful. Our team will contact you within 24 hours to begin your Permit-as-a-Service onboarding.', 
                    color: '#7C8B6F', 
                    loading: false 
                });
                (e.target as HTMLFormElement).reset();
                setTimeout(() => router.push('/'), 5000);
            } else {
                setStatus({ message: result.error || 'Submission failed. Please check your entries.', color: '#B35C44', loading: false });
            }
        } catch (err) {
            setStatus({ message: 'Network error. Please try again later.', color: '#B35C44', loading: false });
        }
    };

    return (
        <main className="waitlist" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <div className="container">
                <div className="waitlist-card">
                    <div className="section-label">COOK REGISTRATION</div>
                    <h2>Start Your Home Kitchen</h2>
                    <p>Join the Austin Flagship 10 or Riverside cohorts. We handle the MEHKO permits, professional photography, and zero-waste packaging.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="text" name="name" placeholder="Kitchen or Chef Name" required />
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group flex-1">
                                <select name="location" required defaultValue="">
                                    <option value="" disabled>Service Area</option>
                                    <option value="Austin, TX">Austin, TX</option>
                                    <option value="Riverside, CA">Riverside, CA</option>
                                    <option value="Other">Other (Expanding soon)</option>
                                </select>
                            </div>
                            <div className="form-group flex-1">
                                <input type="text" name="cuisine_type" placeholder="Primary Cuisine (e.g. Italian, Thai)" required />
                            </div>
                        </div>

                        <div className="form-group">
                            <textarea name="bio" rows={4} placeholder="Tell us about your culinary background or the dishes you love to cook..." required></textarea>
                        </div>

                        <div className="form-group" style={{ textAlign: 'left', fontSize: '0.8rem', color: '#888' }}>
                            <p>Note for Austin Cooks: Per Texas Cottage Food Law (2025), all home-kitchen sales must be meat-free. We will help you adapt your heritage recipes to plant-based alternatives.</p>
                        </div>

                        <button type="submit" className="btn-primary full-width" disabled={status.loading}>
                            {status.loading ? 'Processing...' : 'Submit Application'}
                        </button>
                    </form>

                    {status.message && (
                        <div className="feedback" style={{ color: status.color, marginTop: '2rem' }}>
                            {status.message}
                        </div>
                    )}
                    
                    <div style={{ marginTop: '2rem' }}>
                        <a href="/" style={{ fontSize: '0.75rem', textDecoration: 'underline' }}>Back to Marketplace</a>
                    </div>
                </div>
            </div>
        </main>
    );
}
