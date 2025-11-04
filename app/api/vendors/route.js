import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const payload = {
        firstName: form.get('firstName') || '',
        lastName: form.get('lastName') || '',
        company: form.get('company') || '',
        email: form.get('email') || '',
        phone: form.get('phone') || '',
        minBudget: form.get('minBudget') || '',
        maxBudget: form.get('maxBudget') || '',
        notes: form.get('notes') || '',
        resources: safeJson(form.get('resources')),
        rates: safeJson(form.get('rates')),
      };

      const cv = form.get('cv');
      if (cv && typeof cv === 'object' && cv.arrayBuffer) {
        // Read file metadata only; do not persist in this demo
        payload.cv = {
          name: cv.name,
          size: cv.size,
          type: cv.type,
        };
        // const buf = Buffer.from(await cv.arrayBuffer()); // not persisted
      }

      // In a real app, persist to a database or send an email here
      console.log('[VendorSubmission]', JSON.stringify(payload));

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: 'Unsupported content type' }, { status: 400 });
  } catch (err) {
    console.error('POST /api/vendors error', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}

function safeJson(val) {
  try {
    return JSON.parse(val || 'null');
  } catch (_) {
    return null;
  }
}
