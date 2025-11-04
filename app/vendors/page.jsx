"use client";
import { useState } from 'react';

function emptyResource() {
  return { role: '', quantity: 1 };
}

function emptyRate() {
  return { role: '', rate: '' };
}

export default function VendorsPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [resources, setResources] = useState([emptyResource()]);
  const [rates, setRates] = useState([emptyRate()]);

  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  const [cvFile, setCvFile] = useState(null);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resourceTotal = resources.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);

  const handleAddResource = () => setResources([...resources, emptyResource()]);
  const handleRemoveResource = (idx) => setResources(resources.filter((_, i) => i !== idx));
  const handleChangeResource = (idx, field, value) => {
    setResources(resources.map((r, i) => i === idx ? { ...r, [field]: field === 'quantity' ? Number(value) : value } : r));
  };

  const handleAddRate = () => setRates([...rates, emptyRate()]);
  const handleRemoveRate = (idx) => setRates(rates.filter((_, i) => i !== idx));
  const handleChangeRate = (idx, field, value) => {
    setRates(rates.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const validate = () => {
    if (!firstName.trim()) return 'First name is required.';
    if (!email.trim()) return 'Email is required.';
    if (minBudget && isNaN(Number(minBudget))) return 'Minimum budget must be a number.';
    if (maxBudget && isNaN(Number(maxBudget))) return 'Maximum budget must be a number.';
    if (minBudget && maxBudget && Number(minBudget) > Number(maxBudget)) return 'Minimum budget cannot exceed maximum budget.';
    for (const r of resources) {
      if (!r.role.trim()) return 'Each resource must have a role.';
      if (!Number.isFinite(Number(r.quantity)) || Number(r.quantity) <= 0) return 'Resource quantity must be a positive number.';
    }
    for (const r of rates) {
      if (!r.role.trim() && !r.rate) continue; // allow empty trailing row
      if (!r.role.trim()) return 'Each rate card entry must include a role or be removed.';
      if (r.rate && isNaN(Number(r.rate))) return 'Rate must be numeric (e.g., 45 or 60.5).';
    }
    return '';
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setResources([emptyResource()]);
    setRates([emptyRate()]);
    setMinBudget('');
    setMaxBudget('');
    setCvFile(null);
    setNotes('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const v = validate();
    if (v) { setError(v); return; }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('firstName', firstName);
      form.append('lastName', lastName);
      form.append('company', company);
      form.append('email', email);
      form.append('phone', phone);
      form.append('minBudget', String(minBudget));
      form.append('maxBudget', String(maxBudget));
      form.append('notes', notes);
      form.append('resources', JSON.stringify(resources.filter(r => r.role.trim())));
      form.append('rates', JSON.stringify(rates.filter(r => r.role.trim() || r.rate)));
      if (cvFile) form.append('cv', cvFile);

      const res = await fetch('/api/vendors', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Submission failed');

      setSuccess('Submission received. Thank you!');
      resetForm();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0 }}>Vendor Submission</h1>
          <span className="badge">
            <span style={{ width: 8, height: 8, borderRadius: 999, background: '#10b981' }} />
            Open for submissions
          </span>
        </div>
        <p className="helper">Provide at least your first name, email, resource list, and budget range if known. CV is optional. Include rate card entries if available.</p>

        <div className="card" style={{ marginTop: '1rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div>
                <label htmlFor="firstName">First name *</label>
                <input id="firstName" name="firstName" placeholder="Jane" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" name="lastName" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>

            <div className="row" style={{ marginTop: '1rem' }}>
              <div>
                <label htmlFor="company">Company</label>
                <input id="company" name="company" placeholder="Your company name" value={company} onChange={e => setCompany(e.target.value)} />
              </div>
              <div>
                <label htmlFor="email">Email *</label>
                <input id="email" name="email" type="email" placeholder="jane@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="row" style={{ marginTop: '1rem' }}>
              <div>
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" placeholder="Optional" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="row" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label htmlFor="minBudget">Minimum budget</label>
                  <input id="minBudget" name="minBudget" type="number" min="0" step="0.01" placeholder="e.g., 5000" value={minBudget} onChange={e => setMinBudget(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="maxBudget">Maximum budget</label>
                  <input id="maxBudget" name="maxBudget" type="number" min="0" step="0.01" placeholder="e.g., 20000" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="divider" />

            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Resource list</h2>
                <small className="mono">Total requested: {resourceTotal}</small>
              </div>
              <p className="helper">Add each role and the number of resources required.</p>
              {resources.map((res, idx) => (
                <div key={idx} className="row" style={{ marginTop: '0.75rem', alignItems: 'end' }}>
                  <div>
                    <label>Role</label>
                    <input placeholder="e.g., React Developer" value={res.role} onChange={e => handleChangeResource(idx, 'role', e.target.value)} />
                  </div>
                  <div>
                    <label>Quantity</label>
                    <input type="number" min="1" step="1" value={res.quantity} onChange={e => handleChangeResource(idx, 'quantity', e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button type="button" onClick={handleAddResource} style={{ background: '#111827', color: 'white', padding: '.6rem .8rem', borderRadius: 8, border: 'none' }}>Add</button>
                    {resources.length > 1 && (
                      <button type="button" onClick={() => handleRemoveResource(idx)} style={{ background: '#f1f5f9', color: '#0f172a', padding: '.6rem .8rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>Remove</button>
                    )}
                  </div>
                </div>
              ))}
            </section>

            <div className="divider" />

            <section>
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Rate card</h2>
              <p className="helper">Optional. Provide role-based rates (per hour/day) if available.</p>
              {rates.map((rt, idx) => (
                <div key={idx} className="row" style={{ marginTop: '0.75rem', alignItems: 'end' }}>
                  <div>
                    <label>Role</label>
                    <input placeholder="e.g., React Developer" value={rt.role} onChange={e => handleChangeRate(idx, 'role', e.target.value)} />
                  </div>
                  <div>
                    <label>Rate</label>
                    <input placeholder="e.g., 65 (per hour)" value={rt.rate} onChange={e => handleChangeRate(idx, 'rate', e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button type="button" onClick={handleAddRate} style={{ background: '#111827', color: 'white', padding: '.6rem .8rem', borderRadius: 8, border: 'none' }}>Add</button>
                    {rates.length > 1 && (
                      <button type="button" onClick={() => handleRemoveRate(idx)} style={{ background: '#f1f5f9', color: '#0f172a', padding: '.6rem .8rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>Remove</button>
                    )}
                  </div>
                </div>
              ))}
            </section>

            <div className="divider" />

            <section>
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>CV Upload</h2>
              <p className="helper">Optional. PDF, DOC, or DOCX. Max 10MB.</p>
              <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={e => setCvFile(e.target.files?.[0] || null)} />
            </section>

            <div className="divider" />

            <section>
              <label htmlFor="notes">Notes</label>
              <textarea id="notes" rows={4} placeholder="Anything else we should know?" value={notes} onChange={e => setNotes(e.target.value)} />
            </section>

            {error && <p className="error" style={{ marginTop: '1rem' }}>{error}</p>}
            {success && <p className="success" style={{ marginTop: '1rem' }}>{success}</p>}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" disabled={submitting} style={{ background: '#111827', color: 'white', padding: '.75rem 1rem', borderRadius: 8, border: 'none' }}>{submitting ? 'Submitting?' : 'Submit'}</button>
              <button type="button" onClick={resetForm} disabled={submitting} style={{ background: '#f1f5f9', color: '#0f172a', padding: '.75rem 1rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>Reset</button>
            </div>
          </form>
        </div>

        <p className="helper" style={{ marginTop: '1rem' }}>We respect your privacy. Uploaded files are not persisted in this demo.</p>
      </div>
    </main>
  );
}
