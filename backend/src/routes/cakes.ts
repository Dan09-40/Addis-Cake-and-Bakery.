import { Router } from 'express';
import { Cake } from '../models/Cake';

const router = Router();

// Get all cakes
router.get('/', async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.json(cakes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cakes', error });
  }
});

// Get single cake
router.get('/:id', async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) {
      return res.status(404).json({ message: 'Cake not found' });
    }
    res.json(cake);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cake', error });
  }
});

// Create new cake (admin only)
router.post('/', async (req, res) => {
  try {
    const cake = new Cake(req.body);
    const savedCake = await cake.save();
    res.status(201).json(savedCake);
  } catch (error) {
    res.status(400).json({ message: 'Error creating cake', error });
  }
});

// Update cake (admin only)
router.put('/:id', async (req, res) => {
  try {
    const updatedCake = await Cake.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!updatedCake) {
      return res.status(404).json({ message: 'Cake not found' });
    }
    res.json(updatedCake);
  } catch (error) {
    res.status(400).json({ message: 'Error updating cake', error });
  }
});

// Delete cake (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const deletedCake = await Cake.findByIdAndDelete(req.params.id);
    if (!deletedCake) {
      return res.status(404).json({ message: 'Cake not found' });
    }
    res.json({ message: 'Cake deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cake', error });
  }
});

export default router;
