const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://andybazelais380_db_user:<password>@cluster0.wotbgvp.mongodb.net/andy-vcf?retryWrites=true&w=majority';
const TARGET = 500;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── MONGOOSE MODEL ─────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI).then(() => console.log('✅ MongoDB connected')).catch(e => console.error('❌ MongoDB error:', e));

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// ── ROUTES ─────────────────────────────────────────────────────────────────

// GET count
app.get('/api/count', async (req, res) => {
  try {
    const count = await Contact.countDocuments();
    res.json({ count });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST register
app.post('/api/register', async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone required.' });

    const clean = phone.replace(/\D/g, '');
    if (clean.length < 8) return res.status(400).json({ error: 'Invalid phone number.' });

    const exists = await Contact.findOne({ phone });
    if (exists) return res.status(409).json({ error: 'This number is already registered.' });

    await Contact.create({ name, phone });
    const count = await Contact.countDocuments();
    res.json({ success: true, count });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'Number already registered.' });
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST download (verify + generate VCF)
app.post('/api/download', async (req, res) => {
  try {
    const { phone, name } = req.body;
    const count = await Contact.countDocuments();

    // Must have 500 contacts
    if (count < TARGET) {
      return res.status(403).json({ error: `Download locked. ${TARGET - count} contacts remaining.` });
    }

    // Verify requester is registered
    let query = [];
    if (phone) query.push({ phone: { $regex: phone.replace(/\D/g,''), $options: 'i' } });
    if (name) query.push({ name: { $regex: name, $options: 'i' } });
    if (!query.length) return res.status(400).json({ error: 'Provide phone or name.' });

    const user = await Contact.findOne({ $or: query });
    if (!user) return res.status(403).json({ error: 'Not found. Register first.' });

    // Generate VCF
    const contacts = await Contact.find({}, 'name phone');
    let vcf = contacts.map(c => {
      return `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${c.name}\r\nTEL;TYPE=CELL:${c.phone}\r\nEND:VCARD`;
    }).join('\r\n');

    res.setHeader('Content-Type', 'text/vcard');
    res.setHeader('Content-Disposition', 'attachment; filename="andy-swiftt-llc-contacts.vcf"');
    res.send(vcf);
  } catch (e) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Catch-all → index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
