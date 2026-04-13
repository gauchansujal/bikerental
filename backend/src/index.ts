import app from './app';
import { connectDB } from './database/mongodb';
import { PORT } from './config';
// ✅ Connect DB in BOTH local and production
connectDB().catch(console.error);

async function startServer() {
    try {
        await connectDB();
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// ✅ Only listen on port locally
if (process.env.NODE_ENV !== 'production') {
    const { PORT } = require('./config');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

// ✅ Add this - Vercel uses this
export default app;