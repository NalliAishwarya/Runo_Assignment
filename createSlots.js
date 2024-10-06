
//updated

const mongoose = require('mongoose');
const Slot = require('./models/Slot'); // Adjust the path as needed

const uri = 'mongodb+srv://aishwaryanalli2010:aishu81@cluster1.zqj3h.mongodb.net/'; // Replace with your MongoDB URI

async function createSlots() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected successfully...');

        const startDate = new Date('2024-10-01T09:00:00'); // Replace with your start date
        const endDate = new Date('2024-10-07T17:00:00'); // Replace with your end date
        const slots = [];

        for (let date = startDate; date <= endDate; date.setMinutes(date.getMinutes() + 30)) {
            slots.push({ slotTime: new Date(date), availableDoses: 10 });
        }

        await Slot.insertMany(slots);
        console.log('Slots created successfully!');
    } catch (error) {
        console.error('Error creating slots:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createSlots();
